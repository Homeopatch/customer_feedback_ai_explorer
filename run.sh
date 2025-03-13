#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker and Docker Compose."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

# Check if .env file exists
if [ ! -f "./backend/.env" ]; then
    echo "Creating .env file from example..."
    cp ./backend/.env.example ./backend/.env
    echo "Please edit ./backend/.env and add your OpenAI API key."
    exit 1
fi

# Build and start the containers
echo "Building and starting containers..."
docker-compose up -d --build

echo "Application is running!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"