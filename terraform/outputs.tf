output "alb_hostname" {
  value = aws_lb.main.dns_name
}

output "db_endpoint" {
  value = aws_db_instance.default.endpoint
}

output "execution_role_arn" {
  value = aws_iam_role.ecs_task_execution_role.arn
}
