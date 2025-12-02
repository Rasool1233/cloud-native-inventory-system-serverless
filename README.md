# 📦 **Cloud Based Inventory Management System**

A full-stack **cloud-native inventory management system** built using **AWS Serverless Backend** and a modern **frontend dashboard UI**.
This project demonstrates hands-on skills in **Lambda, API Gateway, DynamoDB, Serverless Framework, and Web Development**.

---

## 🚀 **Project Overview**

This system enables users to **add, edit, update, delete, and view** inventory items in real time using a fully serverless backend.

It includes:

* **Frontend:** Inventory Dashboard (HTML/CSS/JS)
* **Backend:** AWS Lambda + API Gateway + DynamoDB
* **Infrastructure:** Serverless Framework (IaC)

The Backend exposes secure REST APIs while the Frontend consumes them to perform CRUD operations.

---
## 🖼️ Application Screenshots (LIVE Demo)

### 📊 Dashboard Overview
![Dashboard](inventory-dashboard/assets/screenshots/dashboard.png)

### 📦 Products List
![Products](inventory-dashboard/assets/screenshots/products.png)

### ➕ Add Product
![Add Product](inventory-dashboard/assets/screenshots/add-product.png)

### 📄 Product Details
![Product Details](inventory-dashboard/assets/screenshots/product-details.png)

### 🔧 Adjust Stock
![Adjust Stock](inventory-dashboard/assets/screenshots/adjust-stock.png)

---

## 🧰 **Tech Stack**

### **Frontend**

* HTML
* CSS
* JavaScript (Fetch API)

### **Backend**

* AWS Lambda (Node.js)
* Amazon API Gateway
* Amazon DynamoDB
* Serverless Framework
* Node.js Runtime

---

## 🏗️ **Architecture**

```
Frontend (Inventory Dashboard)
          |
          |  REST API Calls (GET, POST, PATCH, DELETE)
          v
    API Gateway
          |
          v
      AWS Lambda (api.js)
          |
          v
      DynamoDB Table
```

Additional backend component:

* `stream_processor.js`: Handles DynamoDB Streams (optional processing).

---

## 📁 **Folder Structure**

```
cloud-inventory-system-serverless/
│
├── inventory-dashboard/        # Frontend UI files
│     ├── index.html
│     ├── assets/
│
├── backend/                    # Serverless AWS Backend
│     ├── serverless.yml
│     └── lambda/
│           ├── api.js
│           ├── stream_processor.js
│           └── package.json
│
└── README-backend-integration.md
```

---

## ⚙️ **Backend Setup & Deployment**

### **1️⃣ Install Serverless Framework**

```bash
npm install -g serverless
```

### **2️⃣ Install backend dependencies**

```bash
cd backend/lambda
npm install
```

### **3️⃣ Configure AWS Credentials**

```bash
aws configure
```

### **4️⃣ Deploy Backend**

```bash
cd backend
serverless deploy
```

This will:

* Create DynamoDB table
* Deploy Lambda functions
* Create API Gateway endpoints
* Output REST API URLs

---

## 🎨 **Frontend Setup**

1. Open `inventory-dashboard/index.html` in browser
2. Update API base URL:

```javascript
const apiBaseUrl = "https://YOUR_API_ID.execute-api.ap-south-1.amazonaws.com/dev";
```

3. Refresh the page — now the dashboard will work with your live API.

---

## 📌 **Features**

✔️ Serverless architecture
✔️ Real CRUD operations
✔️ Scalable DynamoDB storage
✔️ Clean, responsive Dashboard
✔️ Instant Lambda function execution
✔️ Easy deployment via Serverless Framework

---

## 🧪 **REST API Endpoints**

| Method | Endpoint      | Description     |
| ------ | ------------- | --------------- |
| GET    | `/items`      | Fetch all items |
| POST   | `/items`      | Add new item    |
| PATCH  | `/items/{id}` | Update an item  |
| DELETE | `/items/{id}` | Delete an item  |

---

## 🎯 **Project Goals**

* Demonstrate Cloud Engineering fundamentals
* Implement real-world serverless architecture
* Build full-stack application (UI + API + Database)
* Showcase portfolio-ready AWS project

---

## 👤 **Author**

**Mohammed Rasool Shaik**
Cloud Engineer | AWS | DevOps | Backend


