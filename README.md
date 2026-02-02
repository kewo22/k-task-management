# K-Task Management

A robust task management application backend built with NestJS, designed to be scalable and secure. This project mimics the functionality of tools like Linear, featuring users, teams, projects, and tasks.

## 🚀 Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger (OpenAPI)

### DevOps & Infrastructure
- **Cloud Provider**: AWS
- **IaC**: Terraform
- **Containerization**: Docker
- **Orchestration**: AWS ECS (Fargate)
- **CI/CD**: GitHub Actions

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- AWS CLI (configured (for deployment))
- Terraform (for infrastructure updates)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yt-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   *Update `.env` with your local database credentials if needed.*

4. **Start Database (Docker)**
   If you don't have a local Postgres instance, you can use the provided docker-compose:
   ```bash
   docker-compose up -d
   ```

5. **Run the Application**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run start:prod
   ```

6. **Access the API**
   - API URL: `http://localhost:3000`
   - Swagger Documentation: `http://localhost:3000/api` (if configured)

---

## ☁️ Infrastructure (AWS & Terraform)

The infrastructure is managed as code using Terraform located in the `terraform/` directory.

### Resources Provisioned
- **Network**: VPC, Subnets, Internet Gateway, Security Groups.
- **Compute**: ECS Cluster (Fargate), Task Definitions, Auto Scaling.
- **Database**: RDS (PostgreSQL).
- **Load Balancing**: Application Load Balancer (ALB).
- **Registry**: ECR (Elastic Container Registry).

### Deploying Infrastructure

1. Navigate to the terraform directory:
   ```bash
   cd terraform
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Plan the deployment:
   ```bash
   terraform plan
   ```

4. Apply changes:
   ```bash
   terraform apply
   ```

**Inputs (`terraform/variables.tf`)**:
- `aws_region`: AWS Region (default: `us-east-1`)
- `app_name`: Application name (default: `k-task-management`)
- `db_username`: Database master username
- `db_password`: Database master password (sensitive)

---

## 🔄 CI/CD Pipeline

Automated deployment is handled via **GitHub Actions** (`.github/workflows/deploy.yml`).

### Workflow: `Deploy to Amazon ECS`
- **Trigger**: Push to `main` branch.
- **Steps**:
  1. Checkout code.
  2. Configure AWS Credentials (stored in GitHub Secrets).
  3. Login to Amazon ECR.
  4. Build Docker image and push to ECR.
  5. Update ECS Task Definition with new image.
  6. Deploy to ECS Service.

### Required GitHub Secrets
Ensure these secrets are set in your GitHub repository settings:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```
