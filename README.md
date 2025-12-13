## 🛠️ Installation & Setup Guide

Follow these steps to set up the project locally on your machine.

### Prerequisites
Ensure you have the following installed:
* **Python 3.9+**
* **Node.js 18+** & **npm**
* **PostgreSQL** (running locally or via Docker)

---

### 1. Clone the Repository
git clone https://github.com/shiva0526/pneumonia-app.git
cd pneumonia-app

2. Backend Setup (FastAPI)
   cd backend
   python -m venv venv
  # Windows:
  venv\Scripts\activate
  # Mac/Linux:
  source venv/bin/activate

  
----Install dependencies:  pip install -r requirements.txt

Configure Environment Variables: Create a .env file in the backend/ directory:
# backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/pneumonia_db
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
(Make sure to create a PostgreSQL database named pneumonia_db)


Start the Backend Server: uvicorn app.main:app --reload

3. Frontend Setup (React + Vite)
  cd frontend
  npm install
  npm run dev
