import React from 'react';
import { LayoutDashboard, Upload, History, Settings, FlaskConical } from 'lucide-react';

const Sidebar = () => {
    return (
        <div className="h-screen w-72 bg-slate-900/95 backdrop-blur-xl text-white flex flex-col fixed left-0 top-0 border-r border-slate-800 shadow-2xl z-50">
            {/* Brand */}
            <div className="p-8 flex items-center space-x-4 border-b border-white/5">
                <div className="p-2 bg-gradient-to-br from-chemical-400 to-chemical-600 rounded-lg shadow-lg shadow-chemical-500/20">
                    <FlaskConical className="w-8 h-8 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        ChemViz
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Pro Dashboard</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-6 space-y-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>

                <a href="#" className="flex items-center space-x-3 px-4 py-3.5 bg-gradient-to-r from-chemical-600/20 to-transparent text-chemical-400 border-l-4 border-chemical-500 rounded-r-xl transition-all hover:pl-6 group">
                    <LayoutDashboard className="w-5 h-5 group-hover:text-chemical-300" />
                    <span className="font-medium">Overview</span>
                </a>

                <a href="#" className="flex items-center space-x-3 px-4 py-3.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all hover:translate-x-1">
                    <History className="w-5 h-5" />
                    <span className="font-medium">History Log</span>
                </a>

                <a href="#" className="flex items-center space-x-3 px-4 py-3.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all hover:translate-x-1">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </a>
            </nav>

            {/* User Profile */}
            <div className="p-6 border-t border-white/5 bg-slate-900/50">
                <div className="flex items-center space-x-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-chemical-500/30 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chemical-500 to-indigo-600 flex items-center justify-center font-bold shadow-lg text-sm text-white">
                        AD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">Admin User</span>
                        <span className="text-xs text-chemical-400">Senior Engineer</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
