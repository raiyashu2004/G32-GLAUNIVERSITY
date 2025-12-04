# Inventory Management System (IMS)

A centralized Inventory Management System to track stock in real-time, manage suppliers, log inventory movements, and generate sales/stock reports. Built for hackathon delivery but structured to scale.

---

## Problem Background

Manual inventory tracking (spreadsheets/paper) causes:
- Stockouts (loss of sales)
- Overstocking (blocked capital)
- Shrinkage (loss/theft/damage untracked)
- Human errors in counting and reconciliation

IMS provides a reliable digital ledger for accurate visibility and faster operations.

---

## Screenshots

### 1. Dashboard
<img width="1909" height="839" alt="Screenshot 2025-12-04 130158" src="https://github.com/user-attachments/assets/ee094442-e43d-407a-8103-f7d71b44c36d" />



### 2. Product Management
![WhatsApp Image 2025-12-04 at 13 22 04_f4079bbb](https://github.com/user-attachments/assets/0fce0b24-6700-4f8c-adbc-f2371ccfabc1)

### 3. Stock In / Stock Out Flow
![WhatsApp Image 2025-12-04 at 13 23 43_fc92f304](https://github.com/user-attachments/assets/01529d20-ea39-4b8d-98d0-f553da90794b)



## Features

### Admin (Inventory Manager)
- **Dashboard**
  - Total inventory value
  - Total products
  - Low-stock & critical stock indicators
  - Recent inventory activity
- **Product Management**
  - Create, update, delete products (Name, SKU, Category, Brand, Price)
  - Set low-stock thresholds
  - Track item location
- **Supplier Management**
  - Add/edit suppliers
  - Link suppliers to products
- **Reporting**
  - Top-selling products
  - Dead stock (non-moving items)
  - Category distribution
  - Inventory value trends
- **User Access**
  - Create/manage warehouse staff accounts

### Warehouse Staff
- **Stock In**
  - Log incoming shipments (quantity increases)
- **Stock Out**
  - Record outgoing items for sale/delivery (quantity decreases)
  - Prevent negative stock
- **Audit/Adjustment**
  - Correct stock levels after physical verification
- **Search**
  - Fast lookup by Name / SKU / Category / Brand
  - Availability + location displayed instantly

---

## Core Requirements

### Functional
- Full **CRUD** for products, suppliers, categories
- **Low-stock alerts** on dashboard + alerts page
- **Transaction history** for every movement (IN/OUT/ADJUSTMENT)
- **Categorization** by category and brand
- **Bonus:** barcode/SKU scan input support

### Non-Functional
- **Data consistency** under concurrent updates
- **Instant search** even with thousands of SKUs
- **Clean, data-dense UI** for fast scanning

---

## Tech Stack

- **Frontend:** React, TailwindCSS, Recharts
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Alerts:** Dashboard banners + optional email (Nodemailer)
- **Optional Realtime:** Socket.io for live stock updates

---

## Project Structure

G32-GLAUNIVERSITY/
ims-backend/
src/
config/
controllers/
middleware/
routes/
services/
utils/
prisma/
index.js
.env
package.json

ims-frontend/
src/
api/
components/
pages/
hooks/
routes/
store/
styles/
package.json



---

## Database Design (ER Summary)

**Entities**
- Users (ADMIN / STAFF)
- Products
- Categories
- Suppliers
- Transactions (IN / OUT / ADJUSTMENT)
- Alerts (LOW / CRITICAL)

**Key Rules**
- SKU must be unique
- Every stock change creates a transaction record
- Stock OUT can’t make quantity negative
- Low-stock triggers alerts automatically

---

## API Overview (Backend)

### Auth
- `POST /auth/login`
- `POST /auth/register` *(Admin only)*

### Products
- `GET /products`
- `POST /products` *(Admin)*
- `PATCH /products/:id` *(Admin)*
- `DELETE /products/:id` *(Admin)*

### Suppliers
- `GET /suppliers`
- `POST /suppliers` *(Admin)*
- `PATCH /suppliers/:id` *(Admin)*
- `DELETE /suppliers/:id` *(Admin)*

### Stock
- `POST /stock/in`
- `POST /stock/out`
- `POST /stock/adjust`

### Transactions
- `GET /transactions`

### Alerts
- `GET /alerts`
- `PATCH /alerts/:id/resolve`

### Reports
- `GET /reports/top-selling`
- `GET /reports/dead-stock`
- `GET /reports/category-distribution`
- `GET /reports/stock-value-trend`

---

## Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/<OWNER_USERNAME>/G32-GLAUNIVERSITY.git
cd G32-GLAUNIVERSITY
2. Backend Setup
cd ims-backend
npm install


Create .env:

PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/ims_db"
JWT_SECRET="your_secret_key"


Run Prisma migrations:

npx prisma migrate dev --name init
npx prisma generate


Start server:

npm run dev

3. Frontend Setup
cd ../ims-frontend
npm install
npm run dev

You said:

`## Setup Instructions ### 1. Clone the Repo ```bash git clone https://github.com/<OWNER_USERNAME>/G32-GLAUNIVERSITY.git cd G32-GLAUNIVERSITY` ### 2\. Backend Setup bash Copy code `cd ims-backend npm install` Create `.env`: env Copy code `PORT=5000 DATABASE_URL="postgresql://user:password@localhost:5432/ims_db" JWT_SECRET="your_secret_key"` Run Prisma migrations: bash Copy code `npx prisma migrate dev --name init npx prisma generate` Start server: bash Copy code `npm run dev` ### 3\. Frontend Setup bash Copy code `cd ../ims-frontend npm install npm run dev`

aree this whole thing in markdown file
ChatGPT said:
## Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/<OWNER_USERNAME>/G32-GLAUNIVERSITY.git
cd G32-GLAUNIVERSITY```

### 2. Backend Setup
```cd ims-backend
npm install```


```Create a .env file inside ims-backend:```

```PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/ims_db"
JWT_SECRET="ahfhsfwenfnncwhFNEFNIWFE"```





```Start the backend server:

npm run dev```

### 3. Frontend Setup
```cd ../ims-frontend
npm install
npm run dev```

## Team Members & Roles

| Member | Role | Responsibilities |
|-------|------|------------------|
| Divyansh Patel | Backend Developer (Core APIs) | Express setup, Auth/RBAC, Products CRUD, integration |
| Vibhu Yadav | Backend Developer (Stock & Alerts) | Stock in/out/adjust engine, transaction logs, low-stock alerts |
| Achintya | Database aand Backend (Mongo and Mongoose) | App routing, auth guards, dashboard KPIs + charts |
| Meenakshi | Frontend Developer (Products/Suppliers UI) | Product & supplier pages, search/filters, forms |
| Rakshit | Reports + QA + Integration | Reporting module, export, testing flows, demo preparation |
