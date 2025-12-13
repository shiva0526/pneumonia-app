Markdown

## 🛠️ Installation & Setup Guide

Follow these steps to set up the project locally on your machine.

### Prerequisites
Ensure you have the following installed:
* **Python 3.9+**
* **Node.js 18+** & **npm**
* **PostgreSQL** (running locally or via Docker)

---

### 1. Clone the Repository
Start by cloning the project to your local machine:

git clone https://github.com/shiva0526/pneumonia-app.git
cd pneumonia-app
2. Backend Setup (FastAPI)
Navigate to the backend directory and set up the Python environment.

Step 2a: Create and Activate Virtual Environment

cd backend
python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

Step 2b: Install Dependencies

pip install -r requirements.txt
Step 2c: Configure Environment Variables Create a .env file in the backend/ directory with your database and security settings:

# backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/pneumonia_db
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
Note: Ensure you have created a PostgreSQL database named pneumonia_db (or updated the DATABASE_URL to match your existing database).

Step 2d: Start the Backend Server

uvicorn app.main:app --reload
The API server will start at http://localhost:8000.

3. Frontend Setup (React + Vite)
Open a new terminal window, navigate to the frontend directory, and start the client.

Step 3a: Install Dependencies

cd frontend
npm install

Step 3b: Start the Development Server

npm run dev

npm run dev
The application will launch in your browser at http://localhost:5173.
