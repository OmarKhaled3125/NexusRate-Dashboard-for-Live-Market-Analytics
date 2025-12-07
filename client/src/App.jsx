import React, { useState, useEffect } from 'react';
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-12 selection:bg-cyan-500 selection:text-slate-900">

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-light text-white tracking-tight">
            NEXUS<span className="font-bold text-cyan-500">RATE</span>
          </h1>
          <p className="text-slate-500 text-sm tracking-[0.2em] uppercase mt-2">Advanced Market Analytics</p>
        </div>
        <div className="flex items-center space-x-6 mt-6 md:mt-0">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase">System Status</p>
            <div className="flex items-center justify-end space-x-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-emerald-400">ONLINE</span>
            </div>
          </div>
          <div className="hidden md:block w-px h-8 bg-slate-800"></div>
          <div className="text-right hidden md:block">
            <p className="text-xs text-slate-500 uppercase">Server Time</p>
            <p className="text-sm font-mono text-slate-300">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">

        {/* Left Column: Stats & Progress */}
        <div className="lg:col-span-1 space-y-6">

          {/* Gold Summary Card - RESTORED GRADIENT */}
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

          {/* Currency Summary Card - RESTORED GRADIENT */}
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

          {/* Circular Stats */}
          <Card>
            <SectionTitle title="Market Sentiment" subtitle="Real-time Analysis" />
            <div className="flex justify-between items-center py-2">
              <StatRing value={68} label="Buy" color="#06b6d4" /> {/* Cyan */}
              <StatRing value={43} label="Hold" color="#8b5cf6" /> {/* Purple */}
              <StatRing value={12} label="Sell" color="#ef4444" /> {/* Red */}
            </div>
          </Card>

        </div>

        {/* Center/Right Column: Charts */}
        <div className="lg:col-span-3 space-y-6">

          {/* Main Chart Area */}
          <Card className="min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <SectionTitle title="Gold Price Volatility" subtitle="24 Hour Performance (1 Gram)" />
              <div className="flex space-x-2">
                {["1H", "24H", "7D", "1M"].map(period => (
                  <button key={period} className={`px - 3 py - 1 text - xs font - bold rounded hover: bg - slate - 700 ${period === "24H" ? "bg-cyan-500 text-white" : "bg-slate-800 text-slate-400 border border-slate-700"} `}>
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={goldData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="price" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" unit=" EGP" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Line Chart */}
            <Card>
              <SectionTitle title="USD Exchange Rate" subtitle="Official Bank Rate" />
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={false} unit=" EGP" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Bar Chart Mockup */}
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
                        <Cell key={`cell - ${index} `} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

          </div>
        </div>

      </div>

      {/* Footer Metrics - Mocking the progress bars in the image */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-800">
        {[
          { label: "Global Liquidity", val: "87%", color: "bg-cyan-500" },
          { label: "Market Cap", val: "63%", color: "bg-emerald-500" },
          { label: "Volatility Index", val: "91%", color: "bg-purple-500" },
          { label: "User Sentiment", val: "72%", color: "bg-amber-500" }
        ].map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-bold tracking-wider">{item.label}</span>
              <span className="text-white font-mono">{item.val}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className={`h - full ${item.color} rounded - full`} style={{ width: item.val }}></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
