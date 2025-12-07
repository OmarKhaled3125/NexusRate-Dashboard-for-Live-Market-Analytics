import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, Cell
} from 'recharts';
import {
  Activity, DollarSign, Globe, Anchor,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// --- Utility Components ---

const Card = ({ children, className = "" }) => (
  // Removed backdrop-blur-sm to prevent full-page blur perception on some screens/errors
  <div className={`bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-xl ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-4">
    <h3 className="text-base font-semibold text-slate-100 tracking-wide">{title}</h3>
    {subtitle && <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{subtitle}</p>}
  </div>
);

const StatRing = ({ value, label, color }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} stroke="#1e293b" strokeWidth="6" fill="none" />
          <circle
            cx="40" cy="40" r={radius} stroke={color} strokeWidth="6" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{value}%</span>
        </div>
      </div>
      <span className="mt-2 text-[10px] font-medium text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-2 rounded-lg shadow-2xl">
        <p className="text-slate-400 text-[10px] mb-1">{label}</p>
        <p className="text-cyan-400 font-bold text-xs">
          {parseFloat(payload[0].value).toLocaleString()} {payload[0].unit}
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Application ---

function App() {
  const [goldData, setGoldData] = useState([]);
  const [currencyData, setCurrencyData] = useState([]);
  const [latestGold, setLatestGold] = useState(null);
  const [latestCurrency, setLatestCurrency] = useState(null);
  const [timeRange, setTimeRange] = useState("24H");

  // Mock data for "Volume" or secondary visualizations
  const mockBarData = [
    { name: 'Mon', val: 4000 }, { name: 'Tue', val: 3000 },
    { name: 'Wed', val: 2000 }, { name: 'Thu', val: 2780 },
    { name: 'Fri', val: 1890 }, { name: 'Sat', val: 2390 }, { name: 'Sun', val: 3490 },
  ];

  useEffect(() => {
    // Fetch Gold History
    axios.get(`${API_BASE_URL}/gold-history/`)
      .then(res => {
        if (res.data.length > 0) {
          // Process data for charts: Reverse to show Oldest -> Newest left to right
          const history = res.data.slice(0, 50).reverse().map(item => ({
            time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            price: parseFloat(item.price_egp)
          }));
          setGoldData(history);
          setLatestGold(res.data[0]); // First item is newest
        }
      })
      .catch(err => console.error(err));

    // Fetch Currency History
    axios.get(`${API_BASE_URL}/currency-history/`)
      .then(res => {
        if (res.data.length > 0) {
          const history = res.data.slice(0, 50).reverse().map(item => ({
            time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            rate: parseFloat(item.rate)
          }));
          setCurrencyData(history);
          setLatestCurrency(res.data[0]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Filter Gold Data based on selected Time Range
  const filteredGoldData = useMemo(() => {
    if (!goldData.length) return [];

    const total = goldData.length;
    switch (timeRange) {
      case "1H":
        return goldData.slice(Math.max(total - 12, 0));
      case "24H":
        return goldData;
      case "7D":
        return goldData;
      case "1M":
        return goldData;
      default:
        return goldData;
    }
  }, [goldData, timeRange]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 selection:bg-cyan-500 selection:text-slate-900">

      <div className="max-w-6xl mx-auto">

        {/* 1. Header & Intro */}
        <header className="mb-8 border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light tracking-wide text-white">
              Nexus<span className="font-bold text-cyan-500">Rate</span>
              <span className="text-slate-500 mx-2">|</span>
              Dashboard
            </h1>
            <p className="text-slate-400 text-xs mt-1 tracking-wider uppercase">Live Market Analytics</p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20 animate-pulse">
              STATUS: LIVE
            </div>
          </div>
        </header>

        <div className="mb-8 max-w-4xl">
          <h2 className="text-xl font-light text-slate-200 mb-2">Market Intelligence, Simplified.</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            NexusRate provides instant, accurate financial data for the Egyptian market.
            Monitor live Gold and USD/EGP fluctuations to make informed decisions.
            Data synchronized every 5 minutes.
          </p>
        </div>


        <div className="space-y-5">

          {/* 2. Top Row: Key Metrics Cards (Compact) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Gold Summary Card */}
            <div className="relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 text-amber-900 shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Anchor size={60} />
              </div>
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-white/50 backdrop-blur-sm rounded-lg text-amber-900 border border-amber-500/20">
                  <Globe size={18} />
                </div>
                <span className="text-[10px] font-bold text-amber-900/70 bg-white/50 px-2 py-0.5 rounded backdrop-blur-sm uppercase">XAU / EGP</span>
              </div>
              <div className="relative z-10 mt-2">
                <h2 className="text-3xl font-black text-amber-950 tracking-tighter">
                  {latestGold ? parseFloat(latestGold.price_egp).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "..."}
                  <span className="text-sm font-medium text-amber-800 ml-1.5">EGP</span>
                </h2>
                <p className="text-[10px] text-amber-800/80 mt-1 flex items-center font-bold uppercase tracking-wide">
                  <ArrowUpRight size={12} className="text-amber-700 mr-1" />
                  <span className="mr-1">+1.2%</span>
                  since last open
                </p>
              </div>
            </div>

            {/* Currency Summary Card */}
            <div className="relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-200 text-emerald-900 shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <DollarSign size={60} />
              </div>
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-white/50 backdrop-blur-sm rounded-lg text-emerald-900 border border-emerald-500/20">
                  <Activity size={18} />
                </div>
                <span className="text-[10px] font-bold text-emerald-900/70 bg-white/50 px-2 py-0.5 rounded backdrop-blur-sm uppercase">USD / EGP</span>
              </div>
              <div className="relative z-10 mt-2">
                <h2 className="text-3xl font-black text-emerald-950 tracking-tighter">
                  {latestCurrency ? parseFloat(latestCurrency.rate).toFixed(2) : "..."}
                  <span className="text-sm font-medium text-emerald-800 ml-1.5">EGP</span>
                </h2>
                <p className="text-[10px] text-emerald-800/80 mt-1 flex items-center font-bold uppercase tracking-wide">
                  <ArrowDownRight size={12} className="text-emerald-700 mr-1" />
                  <span className="mr-1">0.0%</span>
                  stable
                </p>
              </div>
            </div>

          </div>

          {/* 3. Middle Row: Main Charts (Reduced Height) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Gold Price Volatility */}
            <Card className="min-h-[320px] flex flex-col">
              <div className="flex flex-row justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-100">Gold Volatility</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Per Gram (24K)</p>
                </div>
                <div className="flex space-x-1 bg-slate-900 p-1 rounded-md">
                  {["1H", "24H", "7D", "1M"].map(period => (
                    <button
                      key={period}
                      onClick={() => setTimeRange(period)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${timeRange === period ? "bg-cyan-500 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredGoldData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} width={30} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="price" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" unit=" EGP" animationDuration={1000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* USD Exchange Rate */}
            <Card className="min-h-[320px] flex flex-col">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-100">USD Exchange Rate</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Official Bank Rate</p>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                    <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={30} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="stepAfter" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={false} unit=" EGP" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

          </div>

          {/* 4. Bottom Row: Secondary Metrics (Compact) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Market Sentiment */}
            <Card className="flex flex-col justify-center min-h-[180px]">
              <h3 className="text-sm font-semibold text-slate-100 mb-4">Market Sentiment</h3>
              <div className="flex justify-around items-center">
                <StatRing value={68} label="Buy" color="#06b6d4" />
                <StatRing value={43} label="Hold" color="#8b5cf6" />
                <StatRing value={12} label="Sell" color="#ef4444" />
              </div>
            </Card>

            {/* Trading Volume */}
            <Card className="flex flex-col min-h-[180px]">
              <h3 className="text-sm font-semibold text-slate-100 mb-4">Trading Volume</h3>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#334155', opacity: 0.2 }}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#94a3b8', fontSize: '12px' }}
                    />
                    <Bar dataKey="val" radius={[3, 3, 0, 0]}>
                      {mockBarData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

          </div>

        </div>
      </div>

    </div>
  );
}

export default App;
