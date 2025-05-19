# Start PostgreSQL (if not already running)
# Make sure PostgreSQL service is running manually

# Start Auth Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd auth-service; npm run dev"

# Start Course Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd course-service; npm run dev"

# Start Feedback Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd feedback-service; npm run dev"

# Start Admin Service (already running)
# Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd admin-service; npm run dev"

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# Open Frontend in Browser
Start-Process "http://localhost:3000"
