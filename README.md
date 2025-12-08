# NexusRate | Live Market Analytics Dashboard 🚀

NexusRate is a high-performance, real-time financial analytics dashboard tailored for the Egyptian market. It provides instantaneous tracking of Gold prices (XAU/EGP) and official USD/EGP exchange rates, visualized through a professional, sleek, and responsive interface.

Designed for investors and market watchers, NexusRate aggregates data from reliable sources and presents it with rich interactions, historical trends, and actionable insights.

## ✨ Key Features

*   **Real-Time Data**: Live tracking of 24K Gold prices and Bank USD exchange rates.
*   **Serverless Architecture**: Custom-engineered Django backend optimized for Vercel Serverless Functions, featuring "on-demand" data synchronization to bypass traditional background worker limitations.
*   **Interactive Visualizations**:
    *   **Gold Volatility**: Dynamic area charts with time-range filtering (1H, 24H, 7D, 1M).
    *   **Currency Trends**: Step charts for official bank rate stability.
    *   **Volume & Sentiment**: Additional metrics for market analysis.
*   **Modern UI/UX**:
    *   **Dark Mode**: Deep slate aesthetic with neon accents (Cyan/Emerald/Amber).
    *   **Glassmorphism**: Premium frosted glass effects on cards.
    *   **Responsive**: Fully optimized for desktop, tablet, and mobile.

## 🛠️ Technology Stack

### Frontend
*   **Framework**: [React.js](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Charts**: [Recharts.js](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **State Management**: React Hooks (useState, useEffect, useMemo)

### Backend
*   **Framework**: [Django](https://www.djangoproject.com/) + [Django REST Framework](https://www.django-rest-framework.org/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/) (via Vercel Postgres / Supabase)
*   **Task Management**: Custom synchronous polling strategy (Serverless-compatible replacement for Celery).
*   **Deployment**: Vercel (Python Runtime).

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (v3.9+)
*   PostgreSQL

### 1. Clone the Repository
```bash
git clone https://github.com/OmarKhaled3125/NexusRate-Dashboard-for-Live-Market-Analytics.git
cd NexusRate-Dashboard-for-Live-Market-Analytics
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # or .\.venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Migrate Database
python manage.py migrate

# Create Superuser
python manage.py createsuperuser

# Run Development Server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Run Development Server
npm run dev
```

Visit `http://localhost:5173` to view the dashboard.

## 📡 API Endpoints

The backend exposes the following RESTful endpoints:

*   `GET /api/gold-history/`: Retrieve historical gold price data (JSON).
*   `GET /api/currency-history/`: Retrieve historical USD exchange rates (JSON).

## ☁️ Deployment

This project is configured for seamless deployment on **Vercel**.

1.  **Backend**: Deployed as Serverless Functions (`vercel.json` configured).
2.  **Frontend**: Deployed as a static React site.
3.  **Database**: Connected via `POSTGRES_URL` environment variable.

## 📄 License

This project is licensed under the MIT License.

---

**Developed by Omar Khaled**
