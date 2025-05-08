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
      image     = "${var.aws_account_id}.dkr.ecr.af-south-1.amazonaws.com/moralcompass:latest"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      environment = [
        { name = "DB_HOST", value = aws_db_instance.mc_db_instance.endpoint },
        { name = "DB_NAME", value = var.rds_db_name },
        { name = "DB_USER", value = var.rds_db_username },
        { name = "DB_PASSWORD", value = var.rds_db_password }
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
    unhealthy_threshold = 2
    healthy_threshold   = 2
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.mc_app_alb.arn
  port              = "80"
  protocol          = "HTTP"

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

  depends_on = [aws_lb.mc_app_alb]
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