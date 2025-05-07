resource "aws_ecr_repository" "moralcompass" {
  name = "moralcompass"
}

resource "aws_ecr_lifecycle_policy" "mc_app_lifecycle_policy" {
  repository = aws_ecr_repository.moralcompass.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Delete untagged images"
        selection = {
          tagStatus   = "untagged"
          countType   = "imageCountMoreThan"
          countNumber = 1
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}