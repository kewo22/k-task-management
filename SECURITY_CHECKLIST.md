# Security & Best Practices Checklist

## AWS Infrastructure
- [ ] **Private Subnets**: Ensure ECS Tasks and RDS instances are running in private subnets with no public IP addresses.
- [ ] **Security Groups**:
    - Restrict RDS inbound traffic to *only* the specific Security Group of the ECS Service.
    - Restrict ALB inbound traffic to HTTP (80) and HTTPS (443).
    - Restrict ECS inbound traffic to *only* the Application Load Balancer.
- [ ] **IAM Roles**: Use "Least Privilege" access. The ECS Task Execution Role should only have permissions to:
    - Pull images from ECR.
    - Write logs to CloudWatch.
    - Read specifics secrets from Secrets Manager.
- [ ] **Encryption**:
    - Enable encryption at rest for RDS (Postgres).
    - Use HTTPS (TLS 1.2+) at the Load Balancer level using AWS Certificate Manager (ACM).

## Application Config
- [ ] **Secrets Management**: NEVER commit `.env` files. Use AWS Secrets Manager to inject environment variables at runtime.
- [ ] **CORS**: Configure CORS in NestJS (`main.ts`) to allow requests only from your frontend domain.
- [ ] **Rate Limiting**: Implement `ThrottlerModule` in NestJS to prevent brute-force attacks.
- [ ] **Helmet**: Use `helmet` middleware in NestJS to set secure HTTP headers.

## Database
- [ ] **Backups**: Enable "Automated Backups" in RDS with a retention period of at least 7 days.
- [ ] **Multi-AZ**: Enable Multi-AZ deployment for production RDS to ensure high availability during maintenance or outages.
- [ ] **Monitoring**: Set up CloudWatch Alarms for CPU usage, Free Storage Space, and Database Connections.

## Maintenance
- [ ] **Image Scanning**: Enable "Scan on Push" in ECR to detect vulnerabilities in your Docker images.
- [ ] **Updates**: Regularly update the base Docker image (`node:20-alpine`) to patch OS-level vulnerabilities.
