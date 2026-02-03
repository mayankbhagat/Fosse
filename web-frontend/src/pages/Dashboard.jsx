import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import UploadCard from '../components/UploadCard';
import EquipmentChart from '../components/EquipmentChart';
import RecentUploads from '../components/RecentUploads';
import { Activity, Gauge, Thermometer, Droplets } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [currentUploadId, setCurrentUploadId] = useState(null);

    const fetchStats = async (uploadId = null) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            let url = `${API_URL}/api/statistics/`;
            if (uploadId) url += `${uploadId}/`;

            const response = await axios.get(url);
            setStats(response.data);
        } catch (error) {
            console.error("Error fetching stats", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleUploadSuccess = (uploadId) => {
        setCurrentUploadId(uploadId);
        fetchStats(uploadId);
        setRefreshKey(old => old + 1);
    };

    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
            <Sidebar />

            <main className="flex-1 ml-72 p-10 transition-all duration-300">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-end">
                        <div className="animate-fade-in-up">
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            <p className="text-slate-500 mt-2 font-medium text-lg">Real-time equipment monitoring system</p>
                        </div>
                        <div className="flex space-x-4">
                            <button className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all font-semibold text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                System Healthy
                            </button>
                            <button className="px-5 py-2.5 bg-chemical-600 text-white rounded-xl hover:bg-chemical-700 hover:shadow-lg hover:shadow-chemical-500/20 transition-all transform hover:-translate-y-0.5 font-semibold text-sm">
                                + New Analysis
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            title="Avg Flowrate"
                            value={stats?.flowrate?.mean ? stats.flowrate.mean.toFixed(1) : "---"}
                            unit="L/hr"
                            icon={Droplets}
                            color="bg-blue-500"
                        />
                        <StatsCard
                            title="Avg Pressure"
                            value={stats?.pressure?.mean ? stats.pressure.mean.toFixed(1) : "---"}
                            unit="bar"
                            icon={Gauge}
                            color="bg-red-500"
                        />
                        <StatsCard
                            title="Avg Temp"
                            value={stats?.temperature?.mean ? stats.temperature.mean.toFixed(1) : "---"}
                            unit="°C"
                            icon={Thermometer}
                            color="bg-yellow-500"
                        />
                        <StatsCard
                            title="Equipment Count"
                            value={stats?.flowrate?.count ? parseInt(stats.flowrate.count) : "---"}
                            unit="units"
                            icon={Activity}
                            color="bg-emerald-500"
                        />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="space-y-8">
                            <UploadCard onUploadSuccess={handleUploadSuccess} />
                            <RecentUploads key={refreshKey} />
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Chart Section */}
                            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                <EquipmentChart data={null} />
                            </div>

                            <div className="bg-gradient-to-r from-chemical-50 to-blue-50 p-6 rounded-2xl border border-chemical-100 flex items-start space-x-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <span className="text-2xl">💡</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-chemical-900 mb-1 text-lg">Pro Tip</h4>
                                    <p className="text-chemical-700 text-sm leading-relaxed">
                                        The current API provides summary statistics. To visualize trend lines, verify data integrity in the Upload card before running full analytics.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
