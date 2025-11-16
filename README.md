# BrandPulse – Backend  
API Base URL: https://brand-tracker-backend-dh74.onrender.com/api

## Overview  
BrandPulse Backend powers the Real-Time Brand Mention & Reputation Tracker.  
It handles ingestion of mentions, sentiment analysis, topic tagging, spike detection, and AI insights.

This backend is built using Node.js + Express, MongoDB Atlas, and OpenAI for intelligence.

## Features  
- Brand mention ingestion  
- Sentiment scoring (positive / neutral / negative)  
- Topic labeling using OpenAI  
- Spike detection (daily % increase)  
- AI-generated insights endpoint  
- Aggregated analytics summary API  
- Deployed on Render  

## Tech Stack  
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- OpenAI API  
- Render (Deployment)

---

## Run Backend Locally  

### 1. Clone the repo  
```bash
git clone https://github.com/raviteja-tech-stack/brand-tracker-backend.git
cd brand-tracker-backend
```

### 2. Install dependencies  
```bash
npm install
```

### 3. Create `.env` file  
Create a file named **.env** with the following content:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
OPENAI_KEY=your_openai_api_key
```

### 4. Start development server  
```bash
npm run dev
```

---

## API Endpoints  

### Brands  
- `GET /api/brands`

### Mentions  
- `POST /api/ingest`  
- `GET /api/analytics/:brand/summary`

### Insights  
- `GET /api/insights/:brand`

### Spike Detection  
- `GET /api/spikes/:brand`

---

## Folder Structure  
```
server.js
routes/
controllers/
models/
utils/
```

---

## Deployment  
Backend hosted on Render:  
https://brand-tracker-backend-dh74.onrender.com/api

## Author  
Built by Raviteja for a 48-hour Virtual Hackathon Challenge.
