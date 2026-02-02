variable "aws_region" {
  description = "AWS Region to deploy to"
  default     = "us-east-1"
}

variable "app_name" {
  description = "Application name"
  default     = "k-task-management"
}

variable "db_password" {
  description = "Database master password"
  sensitive   = true
}

variable "db_username" {
  description = "Database master username"
  default     = "postgres"
}
