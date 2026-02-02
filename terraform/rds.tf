resource "aws_db_subnet_group" "default" {
  name       = "${var.app_name}-db-subnet-group"
  subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_2.id]

  tags = {
    Name = "${var.app_name}-db-subnet-group"
  }
}

resource "aws_db_instance" "default" {
  identifier        = "${var.app_name}-db"
  allocated_storage = 20
  db_name           = "task_management"
  engine            = "postgres"
  engine_version    = "15"
  instance_class    = "db.t3.micro"
  username          = var.db_username
  password          = var.db_password
  
  db_subnet_group_name   = aws_db_subnet_group.default.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  
  skip_final_snapshot    = true # Set to false for production
  publicly_accessible    = false
  multi_az               = false # Set to true for production high availability
}
