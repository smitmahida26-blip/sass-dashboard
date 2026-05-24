import React, { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend 
} from 'chart.js';
import { DollarSign, Users, ShoppingCart, ArrowUpRight, Download, Upload, Filter } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

// અલગ અલગ ફિલ્ટર માટેનો ડમી ડેટા
const dataStore = {
  '7days': {
    revenue: '$15,200', users: '1,420', sales: '94',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    revenueData: [1200, 1900, 1500, 2500, 2200, 3000, 2900],
    sources: [40, 45, 15]
  },
  '30days': {
    revenue: '$62,450', users: '5,840', sales: '342',
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    revenueData: [12000, 19000, 15000, 16450],
    sources: [50, 35, 15]
  },
  '12months': {
    revenue: '$245,900', users: '24,890', sales: '1,840',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    revenueData: [15000, 19000, 18000, 25000, 22000, 30000, 28000, 32000, 29000, 34000, 31000, 35000],
    sources: [55, 30, 15]
  }
};

export default function App() {
  const [filter, setFilter] = useState('12months');
  const [currentData, setCurrentData] = useState(dataStore['12months']);

  // ૧. ફિલ્ટર બદલવાનું ફંક્શન
  const handleFilterChange = (timeframe) => {
    setFilter(timeframe);
    setCurrentData(dataStore[timeframe]);
  };

  // ૨. ફાઈલ અપલોડ (JSON) ફીચર
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const customData = JSON.parse(e.target.result);
        if (customData.labels && customData.revenueData) {
          setCurrentData({
            revenue: customData.revenue || '$50,000',
            users: customData.users || '2,500',
            sales: customData.sales || '150',
            labels: customData.labels,
            revenueData: customData.revenueData,
            sources: customData.sources || [40, 40, 20]
          });
          alert("Custom Data Loaded Successfully! 🚀");
        } else {
          alert("Invalid format! JSON must have 'labels' and 'revenueData'.");
        }
      } catch (err) {
        alert("Error parsing JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // ૩. રિપોર્ટ ડાઉનલોડ કરવાનું ફંક્શન
  const downloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dashboard_report_${filter}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // ચાર્ટ સેટઅપ
  const lineChartData = {
    labels: currentData.labels,
    datasets: [{
      label: 'Revenue Growth ($)',
      data: currentData.revenueData,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  const doughnutChartData = {
    labels: ['Organic', 'Social Media', 'Referrals'],
    datasets: [{
      data: currentData.sources,
      backgroundColor: ['#2563eb', '#10b981', '#f59e0b'],
    }]
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '32px' }}>
      
      {/* Top Navbar Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: '8px', color: '#0f172a', margin: 0 }}>BI Analytics Dashboard</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>Advanced data visualization and business intelligence tool</p>
        </div>

        {/* Action Buttons & Filters */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          
          {/* File Upload */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#334155' }}>
            <Upload size={16} /> Upload JSON
            <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          {/* Export Button */}
          <button onClick={downloadReport} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#334155' }}>
            <Download size={16} /> Export Report
          </button>

          {/* Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500' }}>
            <Filter size={16} />
            <select value={filter} onChange={(e) => handleFilterChange(e.target.value)} style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', outline: 'none', cursor: 'pointer', fontWeight: '600' }}>
              <option value="7days" style={{color: '#000'}}>Last 7 Days</option>
              <option value="30days" style={{color: '#000'}}>Last 30 Days</option>
              <option value="12months" style={{color: '#000'}}>Last 12 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontWeight: '500' }}>Total Revenue</span>
            <div style={{ backgroundColor: '#eff6ff', padding: '8px', borderRadius: '8px' }}><DollarSign size={20} color="#2563eb" /></div>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '12px 0 4px 0' }}>{currentData.revenue}</h2>
          <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowUpRight size={16} /> +12% growth</span>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontWeight: '500' }}>Active Users</span>
            <div style={{ backgroundColor: '#ecfdf5', padding: '8px', borderRadius: '8px' }}><Users size={20} color="#10b981" /></div>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '12px 0 4px 0' }}>{currentData.users}</h2>
          <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowUpRight size={16} /> +8% active</span>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontWeight: '500' }}>Total Sales</span>
            <div style={{ backgroundColor: '#fff7ed', padding: '8px', borderRadius: '8px' }}><ShoppingCart size={20} color="#f59e0b" /></div>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '12px 0 4px 0' }}>{currentData.sales}</h2>
          <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowUpRight size={16} /> +15% conversion</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '32px' }}>
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1e293b' }}>Revenue Timeline</h3>
          <div style={{ height: '320px' }}>
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1e293b' }}>Acquisition Channels</h3>
          <div style={{ height: '320px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

    </div>
  );
}