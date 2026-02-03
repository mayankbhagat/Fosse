import React, { useEffect, useState } from 'react';
import { FileText, Clock } from 'lucide-react';
import axios from 'axios';

const RecentUploads = () => {
    const [uploads, setUploads] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
                const response = await axios.get(`${API_URL}/api/history/`);
                setUploads(response.data);
            } catch (error) {
                console.error("Failed to fetch history", error);
            }
        };
        fetchHistory();
    }, []);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Uploads</h3>
            <div className="space-y-4">
                {uploads.length === 0 ? (
                    <p className="text-slate-400 text-sm">No recent uploads.</p>
                ) : (
                    uploads.map((upload) => (
                        <div key={upload.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-chemical-100 rounded text-chemical-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-700 text-sm">{upload.file_name}</span>
                                    <span className="text-xs text-slate-400 flex items-center mt-1">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatDate(upload.upload_time)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentUploads;
