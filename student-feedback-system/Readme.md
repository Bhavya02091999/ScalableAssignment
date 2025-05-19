# Student Feedback System

A microservices-based application for managing student course feedback.

## Architecture

The application is built using the following microservices:

1. **Auth Service** (`:3001`): Handles user authentication and authorization
2. **Course Service** (`:3002`): Manages courses and instructor information
3. **Feedback Service** (`:3003`): Handles student feedback submissions
4. **Admin Service** (`:3004`): Dashboard for viewing feedback and analytics

## Prerequisites

- Node.js 18 or later
- npm or yarn
- Docker and Docker Compose
- Minikube (for Kubernetes deployment)
- Supabase account and project

## Local Development

### 1. Clone the repository

```bash
git clone <repository-url>
cd student-feedback-system
```

### 2. Set up environment variables

For each service (`auth-service`, `course-service`, `feedback-service`, `admin-service`):

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Update the `.env.local` file with your Supabase credentials

### 3. Install dependencies

Run in each service directory:
```bash
npm install
# or
yarn
```

### 4. Start services

In separate terminal windows, start each service:

```bash
# Auth Service
cd auth-service
npm run dev

# Course Service (in a new terminal)
cd course-service
npm run dev

# Feedback Service (in a new terminal)
cd feedback-service
npm run dev

# Admin Service (in a new terminal)
cd admin-service
npm run dev
```

## Docker Compose

To run all services using Docker Compose:

1. Create a `.env` file in the project root with all required environment variables
2. Run:
   ```bash
   docker-compose up --build
   ```

## Kubernetes (Minikube)

### 1. Start Minikube

```bash
# Start Minikube with sufficient resources
minikube start --cpus=4 --memory=8192mb --disk-size=20g

# Enable required addons
minikube addons enable ingress
minikube addons enable metrics-server

# Configure Docker to use Minikube's Docker daemon
eval $(minikube docker-env)
```

### 2. Build Docker Images

Before deploying to Kubernetes, you need to build and load the Docker images into Minikube's Docker daemon:

```bash
# Build all services
./build-and-push.sh

# Or build each service individually
docker build -t auth-service:latest -f auth-service/Dockerfile ./auth-service
docker build -t course-service:latest -f course-service/Dockerfile ./course-service
docker build -t feedback-service:latest -f feedback-service/Dockerfile ./feedback-service
docker build -t admin-service:latest -f admin-service/Dockerfile ./admin-service
```

### 3. Deploy to Kubernetes

```bash
# Navigate to the kubernetes directory
cd kubernetes

# Create Kubernetes resources
kubectl apply -f .

# Or use the deployment script (make it executable first)
chmod +x deploy.sh
./deploy.sh
```

### 4. Access the Application

To access the application, you'll need to get the Minikube IP and configure your hosts file:

```bash
# Get Minikube IP
minikube ip

# Add to your hosts file (Linux/Mac: /etc/hosts, Windows: C:\Windows\System32\drivers\etc\hosts)
# Replace <minikube-ip> with the IP from the previous command
<minikube-ip> auth.local course.local feedback.local admin.local
```

Now you can access the services at:
- Auth Service: http://auth.local
- Course Service: http://course.local
- Feedback Service: http://feedback.local
- Admin Dashboard: http://admin.local

### 5. Verifying the Deployment

Check the status of your deployments:

```bash
# List all resources
kubectl get all

# View pods
kubectl get pods

# View services
kubectl get services

# View ingress
kubectl get ingress

# View logs for a pod
kubectl logs -f <pod-name>
```

### 6. Scaling Services

You can scale the services as needed:

```bash
# Scale auth service to 3 replicas
kubectl scale deployment auth-service --replicas=3

# Scale course service to 2 replicas
kubectl scale deployment course-service --replicas=2
```

### 7. Updating the Application

When you make changes to your application:

1. Rebuild the Docker image(s)
2. Update the deployment:
   ```bash
   kubectl rollout restart deployment/<deployment-name>
   ```

### 8. Cleaning Up

To remove all resources:

```bash
# Delete all resources
kubectl delete -f .

# Or delete the entire namespace
kubectl delete namespace student-feedback
```

```bash
minikube start
```

### 2. Enable ingress

```bash
minikube addons enable ingress
```

### 3. Deploy to Kubernetes

```bash
kubectl apply -f kubernetes/
```

### 4. Access the application

```bash
minikube service list
```

## Supabase Setup

1. Create a new project in Supabase
2. Run the SQL from `supabase_schema.sql` in the SQL editor
3. Configure the following environment variables in each service:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## API Documentation

Each service has its own API documentation available at:

- Auth Service: http://localhost:3001/api-docs
- Course Service: http://localhost:3002/api-docs
- Feedback Service: http://localhost:3003/api-docs
- Admin Service: http://localhost:3004/api-docs

## License

MIT
