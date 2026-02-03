import React from 'react';

const StatsCard = ({ title, value, unit, icon: Icon, color }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px] group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${color} shadow-lg shadow-current/30 text-white transform transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                    Last Batch
                </span>
            </div>
            <h3 className="text-slate-500 text-sm font-semibold mb-1">{title}</h3>
            <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</span>
                <span className="text-sm font-medium text-slate-400">{unit}</span>
            </div>
        </div>
    );
};

export default StatsCard;
