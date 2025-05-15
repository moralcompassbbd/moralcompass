resource "aws_ecs_cluster" "moralcompass" {
  name = "moralcompass-cluster"
}

resource "aws_ecs_task_definition" "moralcompass" {
  family                   = "moralcompass-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "moralcompass"
      image     = "${aws_ecr_repository.moralcompass.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      environment = [
        { name = "DB_HOST", value = split(":", aws_db_instance.mc_db_instance.endpoint)[0] },
        { name = "DB_NAME", value = var.rds_db_name },
        { name = "DB_USER", value = var.rds_db_username },
        { name = "DB_PASSWORD", value = var.rds_db_password },
        { name = "GOOGLE_TOKEN_URL", value = var.google_token_url },
        { name = "CLIENT_ID", value = var.google_client_id },
        { name = "PORT", value = tostring(var.port) },
        { name = "ADMIN_CACHE_TTL_MS", value = tostring(var.admin_cache_ttl_ms) }
      ]
    }
  ])
}

resource "aws_lb" "mc_app_alb" {
  name                             = "mc-ecs-alb"
  internal                         = false
  load_balancer_type               = "application"
  security_groups                  = [aws_security_group.server_sg.id]
  subnets                          = [aws_subnet.subnet_a.id, aws_subnet.subnet_b.id]
  enable_deletion_protection       = false
  enable_cross_zone_load_balancing = true
  drop_invalid_header_fields       = true
}

resource "aws_lb_target_group" "mc_app_alb_target_group" {
  name        = "mc-elb-target-group"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    interval            = 30
    path                = "/health"
    port                = "3000"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 10  
    healthy_threshold   = 2
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.mc_app_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "redirect"
    
    redirect {
      port = "443"
      protocol = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "https_listener" {
load_balancer_arn = aws_lb.mc_app_alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate.mc_cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.mc_app_alb_target_group.arn
  }

}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role_policy.json
}

data "aws_iam_policy_document" "ecs_task_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}
resource "aws_iam_role" "ecs_task_execution_iam_role" {
  name = "ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_service" "moralcompass" {
  name            = "moralcompass-service"
  cluster         = aws_ecs_cluster.moralcompass.id
  task_definition = aws_ecs_task_definition.moralcompass.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  health_check_grace_period_seconds = 60

  network_configuration {
    subnets         = [aws_subnet.subnet_a.id, aws_subnet.subnet_b.id]
    security_groups = [aws_security_group.server_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.mc_app_alb_target_group.arn
    container_name   = "moralcompass"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.http_listener]
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy_ecr" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.ecs_task_execution_role.name
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy_s3" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
  role       = aws_iam_role.ecs_task_execution_role.name
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy_ssm" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
  role       = aws_iam_role.ecs_task_execution_role.name
}

resource "aws_acm_certificate" "mc_cert" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
  
}

resource "aws_acm_certificate_validation" "mc_cert_validation" {
  certificate_arn = aws_acm_certificate.mc_cert.arn
}