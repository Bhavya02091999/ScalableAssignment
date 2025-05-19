#!/bin/bash

# Set your Docker Hub username or registry URL
DOCKER_HUB_USERNAME=your-docker-username

# Build and tag the images
docker build -t ${DOCKER_HUB_USERNAME}/auth-service:latest -f auth-service/Dockerfile ./auth-service
docker build -t ${DOCKER_HUB_USERNAME}/course-service:latest -f course-service/Dockerfile ./course-service
docker build -t ${DOCKER_HUB_USERNAME}/feedback-service:latest -f feedback-service/Dockerfile ./feedback-service
docker build -t ${DOCKER_HUB_USERNAME}/admin-service:latest -f admin-service/Dockerfile ./admin-service

# Log in to Docker Hub (uncomment the next line if you want to push to Docker Hub)
# docker login

# Push the images to Docker Hub (uncomment the following lines if you want to push to Docker Hub)
# docker push ${DOCKER_HUB_USERNAME}/auth-service:latest
# docker push ${DOCKER_HUB_USERNAME}/course-service:latest
# docker push ${DOCKER_HUB_USERNAME}/feedback-service:latest
# docker push ${DOCKER_HUB_USERNAME}/admin-service:latest

echo "Build complete!"
