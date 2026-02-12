# Full Stack Todo Application - Phase 2

A comprehensive full-stack todo application built with Next.js for the frontend and FastAPI for the backend, featuring authentication, task management, and deployment capabilities.

## 🚀 Features

- **Modern Frontend**: Built with Next.js 14+, React, TypeScript, and Tailwind CSS
- **Robust Backend**: FastAPI with Pydantic validation and async support
- **Authentication System**: Secure user authentication and authorization
- **Task Management**: CRUD operations for managing tasks
- **Responsive Design**: Works seamlessly across devices
- **Database Integration**: PostgreSQL database with SQLAlchemy ORM
- **Docker Support**: Containerized deployment with Docker and docker-compose
- **AI-Powered Development**: Claude AI agent configurations for automated development

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom-built reusable components
- **State Management**: React hooks and context API

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Database**: PostgreSQL (with SQLAlchemy ORM)
- **Authentication**: JWT-based authentication
- **Dependencies**: Managed via requirements.txt

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **AI Agents**: Claude AI configurations for development automation

## 📁 Project Structure

```
full_stack_todoapp-phase-2/
├── backend/                 # FastAPI backend application
│   ├── main.py             # Main application entry point
│   ├── routes/             # API route definitions
│   ├── models/             # Database models
│   ├── crud/               # CRUD operations
│   ├── auth/               # Authentication utilities
│   ├── db.py               # Database connection setup
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend application
│   ├── app/                # Next.js 14+ app router pages
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   ├── auth/           # Authentication pages
│   │   └── tasks/          # Task management pages
│   ├── components/         # Reusable React components
│   ├── lib/                # Utility functions and API calls
│   ├── package.json        # Node.js dependencies
│   └── tsconfig.json       # TypeScript configuration
├── specs/                  # Project specifications and documentation
├── .claude/                # Claude AI agent configurations
├── .specify/               # Specification templates
├── docker-compose.yml      # Docker orchestration
├── Dockerfile              # Base Docker configuration
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.9+ (for backend)
- Docker & Docker Compose (optional, for containerized deployment)
- PostgreSQL (or use Docker Compose to spin up a database)

### Local Development Setup

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Set up environment variables (create `.env` file):
```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_app
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

6. Initialize the database:
```bash
python init_db.py
```

7. Run the backend server:
```bash
uvicorn main:app --reload
```

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create `.env.local` file):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be accessible at `http://localhost:3000` and the backend API at `http://localhost:8000`.

### Docker Deployment

For containerized deployment, use Docker Compose:

1. Make sure Docker and Docker Compose are installed
2. Run the following command from the project root:
```bash
docker-compose up --build
```

This will start both the frontend and backend services along with a PostgreSQL database.

## 🔐 Authentication

The application implements JWT-based authentication:

- User registration and login
- Protected routes requiring authentication
- Automatic token refresh
- Secure password hashing

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Store user information with secure password hashing
- **Tasks**: Represent individual todo items with title, description, status, and ownership

## 🤖 AI Agent Configuration

This project includes Claude AI agent configurations in the `.claude/` directory to automate various development tasks:

- **Agent Configurator**: Manages agent configurations
- **API Planner**: Designs API structures
- **Auth Agent**: Handles authentication implementation
- **FastAPI Architect**: Designs backend architecture
- **Neon Database Optimizer**: Optimizes database schemas
- **NextJS Frontend Dev**: Develops frontend components

## 🧪 Testing

Testing strategies for both frontend and backend components are implemented using:

- **Backend**: Pytest for API and unit testing
- **Frontend**: Jest and React Testing Library for component testing

## 🚢 Deployment

The application is designed for easy deployment:

1. **Traditional Hosting**: Deploy backend to a cloud service (AWS, GCP, Azure) and frontend to a static hosting service (Vercel, Netlify)
2. **Containerized**: Use Docker Compose for deployment to container orchestration platforms
3. **Cloud Platforms**: Direct deployment to platforms like Railway, Heroku, or Fly.io

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Naghmana Imran

## 🐛 Issues

If you encounter any issues or have suggestions for improvements, please open an issue in the GitHub repository.