# autosphere-hub

# Supplier Operations Dashboard System
A production-grade full-stack system for managing supplier operations and analytics in an automobile company.

## 🚀 Tech Stack

### Backend
* Node.js + Express
* PostgreSQL + Prisma
* Redis (Caching)
* BullMQ (Background Jobs)
* AI: OpenAI API

### Frontend
* React (Vite)
* React Query
* Recharts

---

## 📊 Features
* Supplier order management
* Shipment tracking
* Service request handling
* Advanced dashboard (KPIs, trends)
* Pre-aggregated analytics (optimized queries)
* AI-generated insights

---

## 🧠 System Design Highlights
* Layered backend architecture (controller/service/repository)
* Pre-aggregation for dashboard performance
* Redis caching for fast responses
* Background jobs for analytics computation

---

## 📦 Project Structure
```
backend/
frontend/
```

---

## ⚙️ Setup Instructions
### Backend
```
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```

---
## 📌 Future Improvements
* Real-time updates (WebSockets)
* Deployment

---
## 🧠 BIG PICTURE
User → API → Cache → Aggregated DB → Response
                   ↑
            Background Jobs
                   ↑
              Raw Data Tables

Real-time events → WebSocket → UI refresh
AI layer → Interprets aggregated metrics
