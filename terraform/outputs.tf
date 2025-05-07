output "rds_endpoint" {
  description = "PostgreSQL RDS instance endpoint"
  value       = aws_db_instance.mc_db_instance.endpoint
}

output "website_url" {
  description = "URL to access the deployed website"
  value       = "http://${aws_lb.mc_app_alb.dns_name}"
}
