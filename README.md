# Application Screenshots 
![image](https://github.com/user-attachments/assets/d1c27e16-8129-4faa-ad11-2cab22b56f51)
![image](https://github.com/user-attachments/assets/bb389b21-14f8-4bb3-be24-ac69fdcd8b3a)
![image (1)](https://github.com/user-attachments/assets/8e37e156-ab0d-482e-8d18-e4cfd1ee5db4)

# Task Management System

A **full-stack task management system** built with **.NET (Backend)** and **React + Material-UI (Frontend)**.  
Supports **user authentication, task management, role-based access, and real-time updates** via **SignalR WebSockets**.

---

## 🔥 Features

- JWT-based Authentication & Role Management (User, Admin)
- User Registration & Login
- CRUD Operations for Tasks
- Task Filtering by Status & Assignee
- Real-Time Task Updates via SignalR
- Drag & Drop Task Management (Frontend)
- Toast Notifications & Activity Logs
- Centralized Error Handling with Serilog Logging

---

## ⚙️ Tech Stack

### Backend
- **Framework**: .NET 7 (ASP.NET Core Web API)
- **Database**: PostgreSQL + EF Core
- **Authentication**: JWT + Identity
- **Real-Time Updates**: SignalR WebSocket
- **Logging**: Serilog
- **Error Handling**: Custom Middleware

### Frontend
- **Framework**: React (Vite)
- **UI Library**: Material-UI (MUI)
- **Forms**: React Hook Form + Yup
- **Notifications**: React-Toastify
- **State Management**: React Context API
- **Drag & Drop**: React Beautiful DnD / MUI utilities
- **Real-Time Communication**: SignalR Client

- **Real-Time Updates (WebSocket)**  
  - SignalR Hub at:  
    ```
    https://localhost:7024/liveTaskStatus
    ```  
  - Push notifications when tasks are created/updated/deleted  

- **Logging & Error Handling**  
  - Global Exception Middleware  
  - Structured logging with **Serilog**  

- **Data Model**  
  ```csharp
  User: id, username, email, password, role, createdAt  
  Task: id, title, description, status, priority, assigneeId, creatorId, createdAt, updatedAt  

## Backend (ASP.NET Core)  

- **Available Endpoints**
POST /api/auth/register → Register user
POST /api/auth/login → Login
GET /api/tasks?status=&assignee= → Filter tasks
POST /api/tasks → Create task
PUT /api/tasks/{id} → Update task
DELETE /api/tasks/{id} → Delete task
GET /api/users → Get all users
WSS /liveTaskStatus

## Frontend (React + MUI)

#### 🔐 Authentication
- User registration & login
- JWT stored in `localStorage`

#### 📋 Task Dashboard
- Create, update, delete tasks
- Assign tasks to users
- Drag & Drop tasks between columns (Pending, In Progress, Done)

#### ⚡ Real-Time Updates
- SignalR client integration
- Dashboard updates instantly when tasks change

#### 🎨 UI / UX
- Built with **Material-UI**
- Toast notifications for success/error feedback
- Fully responsive layout

## 🚀 Frontend Setup (React + Vite)

1. Navigate to the frontend project folder:
   ```bash
   cd TaskManagementSystem.UI

### Install dependencies:
npm install

### Start the dev server:
npm run dev

### Frontend will be running at:
👉 http://localhost:5173


## Steps to Run Backend

### Clone the repository:
git clone https://github.com/sushil98/TaskManagementSystem.git


### Navigate to the API project:
cd TaskManagementSystem/TaskManagementSystem.API


### Apply migrations (migration command is already available in DataAccess library):
dotnet ef database update --project ../TaskManagementSystem.DataAccess

### Run the backend:
dotnet run

### Backend will be running at:
👉 https://localhost:7024/swagger/index.html

### Database (PostgreSQL)

Make sure PostgreSQL is running and the connection string in appsettings.json is correctly configured before running migrations.

Host=localhost;Port=5432;Database=TaskManagementSystem;Username=postgres;Password=yourpassword

TaskManagementSystem/
│
├── TaskManagementSystem.API/        # Backend (.NET Web API)
│   ├── Controllers/
│   ├── Services/
│   ├── Middleware/
│   └── Program.cs
│
├── TaskManagementSystem.UI/         # Frontend (React + MUI)
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
