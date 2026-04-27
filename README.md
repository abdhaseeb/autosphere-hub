# autosphere-hub

# Supplier Operations Dashboard System
A production-grade full-stack system for managing supplier operations in an automobile company.

## 🚀 Tech Stack

### Backend
* Node.js + Express
* PostgreSQL + Prisma
* Redis (Caching)
* BullMQ (Background Jobs)

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
* AI insights
* Deployment
