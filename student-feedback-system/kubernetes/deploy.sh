#!/bin/bash

# Create namespace
kubectl create namespace student-feedback

# Create secret for Supabase credentials
kubectl create secret generic supabase-credentials \
  --from-literal=supabase-url=your-supabase-url \
  --from-literal=supabase-anon-key=your-supabase-anon-key \
  --namespace=student-feedback

# Apply all Kubernetes configurations
kubectl apply -f . -n student-feedback

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/auth-service -n student-feedback
kubectl wait --for=condition=available --timeout=300s deployment/course-service -n student-feedback
kubectl wait --for=condition=available --timeout=300s deployment/feedback-service -n student-feedback
kubectl wait --for=condition=available --timeout=300s deployment/admin-service -n student-feedback

echo "Deployment complete!"
