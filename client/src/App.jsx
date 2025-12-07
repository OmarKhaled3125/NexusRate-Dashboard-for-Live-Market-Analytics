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
  <div className={`bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-slate-100 tracking-wide">{title}</h3>
    {subtitle && <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{subtitle}</p>}
  </div>
);

const StatRing = ({ value, label, color }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} stroke="#1e293b" strokeWidth="8" fill="none" />
          <circle
            cx="40" cy="40" r={radius} stroke={color} strokeWidth="8" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{value}%</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-medium text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-2xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-cyan-400 font-bold text-sm">
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

  // Mock data for "Volume"
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
          // Process data: Oldest -> Newest
          // Fetch more points to allow filtering (e.g., 200)
          const history = res.data.slice(0, 200).reverse().map(item => ({
            time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            originalTime: new Date(item.timestamp), // Keep raw date for filtering if needed
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

    // Since we likely don't have months of data yet, we will simulate the "Zoom" effect
    // by slicing the array. 
    // Assuming data comes in every ~5 mins.
    // 1H = 12 points
    // 24H = 288 points
    // 7D = 2016 points

    const total = goldData.length;

    switch (timeRange) {
      case "1H":
        return goldData.slice(Math.max(total - 12, 0));
      case "24H":
        return goldData.slice(Math.max(total - 288, 0)); // Show all available for now
      case "7D":
        return goldData; // Show all
      case "1M":
        return goldData; // Show all
      default:
        return goldData;
    }
  }, [goldData, timeRange]);


  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-12 selection:bg-cyan-500 selection:text-slate-900">

      {/* 1. Header & Intro */}
      <header className="mb-10 border-b border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-white">
            Nexus<span className="font-bold text-cyan-500">Rate</span>
            <span className="text-slate-500 mx-2">|</span>
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1 tracking-wider uppercase">Live Market Analytics</p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 animate-pulse">
            STATUS: LIVE
          </div>
        </div>
      </header>

      <div className="mb-12 max-w-3xl">
        <h2 className="text-2xl font-light text-slate-200 mb-4">Market Intelligence, Simplified.</h2>
        <p className="text-slate-400 leading-relaxed text-lg">
          NexusRate provides instant, accurate financial data for the Egyptian market.
          Monitor the live fluctuations of Gold and the official USD/EGP exchange rate
          to make informed investment decisions. Data is synchronized directly with
          global market providers every 5 minutes.
        </p>
      </div>


      <div className="space-y-8">

        {/* 2. Top Row: Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Gold Summary Card */}
          <div className="relative overflow-hidden p-6 rounded-xl bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 text-amber-900 shadow-xl shadow-amber-900/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-amber-900/20">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Anchor size={80} />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/50 backdrop-blur-sm rounded-lg text-amber-900 border border-amber-500/20">
                <Globe size={20} />
              </div>
              <span className="text-xs font-bold text-amber-900/70 bg-white/50 px-2 py-1 rounded backdrop-blur-sm">XAU / EGP</span>
            </div>
            <h2 className="text-4xl font-black text-amber-950 tracking-tighter">
              {latestGold ? parseFloat(latestGold.price_egp).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "..."}
              <span className="text-base font-medium text-amber-800 ml-2">EGP</span>
            </h2>
            <p className="text-xs text-amber-800/80 mt-2 flex items-center font-bold">
              <ArrowUpRight size={14} className="text-amber-700 mr-1" />
              <span className="mr-1">+1.2%</span>
              since last open
            </p>
          </div>

          {/* Currency Summary Card */}
          <div className="relative overflow-hidden p-6 rounded-xl bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-200 text-emerald-900 shadow-xl shadow-emerald-900/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-emerald-900/20">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign size={80} />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/50 backdrop-blur-sm rounded-lg text-emerald-900 border border-emerald-500/20">
                <Activity size={20} />
              </div>
              <span className="text-xs font-bold text-emerald-900/70 bg-white/50 px-2 py-1 rounded backdrop-blur-sm">USD / EGP</span>
            </div>
            <h2 className="text-4xl font-black text-emerald-950 tracking-tighter">
              {latestCurrency ? parseFloat(latestCurrency.rate).toFixed(2) : "..."}
              <span className="text-base font-medium text-emerald-800 ml-2">EGP</span>
            </h2>
            <p className="text-xs text-emerald-800/80 mt-2 flex items-center font-bold">
              <ArrowDownRight size={14} className="text-emerald-700 mr-1" />
              <span className="mr-1">0.0%</span>
              stable
            </p>
          </div>

        </div>

        {/* 3. Middle Row: Main Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Gold Price Volatility */}
          <Card className="min-h-[400px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <SectionTitle title="Gold Price Volatility" subtitle="Performance (1 Gram)" />
              <div className="flex space-x-2 bg-slate-900 p-1 rounded-lg">
                {["1H", "24H", "7D", "1M"].map(period => (
                  <button
                    key={period}
                    onClick={() => setTimeRange(period)}
                    className={`px-3 py-1 text-xs font-bold rounded transition-colors ${timeRange === period ? "bg-cyan-500 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredGoldData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} minTickGap={30} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="price" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" unit=" EGP" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* USD Exchange Rate */}
          <Card className="min-h-[400px]">
            <SectionTitle title="USD Exchange Rate" subtitle="Official Bank Rate Trend" />
            <div className="h-[300px] w-full mt-14">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                  <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="stepAfter" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={false} unit=" EGP" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

        {/* 4. Bottom Row: Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Market Sentiment */}
          <Card>
            <SectionTitle title="Market Sentiment" subtitle="Real-time Analysis" />
            <div className="flex justify-around items-center py-6">
              <StatRing value={68} label="Buy" color="#06b6d4" /> {/* Cyan */}
              <StatRing value={43} label="Hold" color="#8b5cf6" /> {/* Purple */}
              <StatRing value={12} label="Sell" color="#ef4444" /> {/* Red */}
            </div>
          </Card>

          {/* Trading Volume */}
          <Card>
            <SectionTitle title="Trading Volume" subtitle="Aggregated Across Platforms" />
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#334155', opacity: 0.2 }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#94a3b8' }}
                  />
                  <Bar dataKey="val" radius={[4, 4, 0, 0]}>
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
  );
}

export default App;
