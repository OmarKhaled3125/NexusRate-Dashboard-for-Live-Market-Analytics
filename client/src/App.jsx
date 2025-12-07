import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'; // Dynamic for Vercel

function App() {
  const [goldPrice, setGoldPrice] = useState('...');
  const [currencyRate, setCurrencyRate] = useState('...');

  useEffect(() => {
    // 1. Fetch Gold Price
    axios.get(`${API_BASE_URL}/gold-history/`)
      .then(response => {
        if (response.data.length > 0) {
          // Format with commas for readability
          const price = parseFloat(response.data[0].price_egp).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          setGoldPrice(price);
        }
      })
      .catch(error => console.error("Gold API Error:", error));

    // 2. Fetch Currency Rate
    axios.get(`${API_BASE_URL}/currency-history/`)
      .then(response => {
        if (response.data.length > 0) {
          const rate = parseFloat(response.data[0].rate).toFixed(2);
          setCurrencyRate(rate);
        }
      })
      .catch(error => console.error("Currency API Error:", error));
  }, []);

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      <header className="mb-10 border-b border-slate-700 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-white">
            Nexus<span className="font-bold text-teal-500">Rate</span>
            <span className="text-slate-500 mx-2">|</span>
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1 tracking-wider uppercase">Live Market Analytics</p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            STATUS: LIVE
          </div>
        </div>
      </header>

      {/* Intro / Context Section */}
      <div className="mb-12 max-w-3xl">
        <h2 className="text-2xl font-light text-slate-200 mb-4">Market Intelligence, Simplified.</h2>
        <p className="text-slate-400 leading-relaxed text-lg">
          NexusRate provides instant, accurate financial data for the Egyptian market.
          Monitor the live fluctuations of Gold and the official USD/EGP exchange rate
          to make informed investment decisions. Data is synchronized directly with
          global market providers every 5 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* GOLD CARD - Light Gold Design */}
        <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 text-amber-900 shadow-2xl shadow-amber-900/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-amber-900/20">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-amber-800/70 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase">Gold Price (1g)</span>
            </div>

            <div className="flex items-baseline">
              <span className="text-5xl font-black tracking-tight text-amber-950">
                {goldPrice}
              </span>
              <span className="ml-2 text-xl font-medium text-amber-700">EGP</span>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-amber-800/60 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
              Updated Just Now
            </div>
          </div>
        </div>

        {/* CURRENCY CARD - Mint Green Design */}
        <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-200 text-emerald-900 shadow-2xl shadow-emerald-900/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-emerald-900/20">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-emerald-800/70 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase">USD / EGP Rate</span>
            </div>

            <div className="flex items-baseline">
              <span className="text-5xl font-black tracking-tight text-emerald-950">
                {currencyRate}
              </span>
              <span className="ml-2 text-xl font-medium text-emerald-700">EGP</span>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-800/60 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Official Exchange
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
export default App;
