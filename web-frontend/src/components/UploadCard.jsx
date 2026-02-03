import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

const UploadCard = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [message, setMessage] = useState('');

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (selectedFile) => {
        if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
            setStatus('error');
            setMessage('Please upload a CSV file.');
            return;
        }

        setFile(selectedFile);
        setStatus('uploading');

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'multipart/form-data',
            };
            if (token) headers['Authorization'] = `Token ${token}`;

            const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            const response = await axios.post(`${API_URL}/api/upload/`, formData, { headers });
            setStatus('success');
            setMessage('Upload successful!');
            if (onUploadSuccess) onUploadSuccess(response.data.upload_id);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.error || 'Upload failed');
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-1 h-6 bg-chemical-500 rounded-full"></span>
                    Upload Data
                </h3>
                <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">CSV Only</span>
            </div>

            <div
                className={`flex-1 border-3 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 group cursor-pointer relative overflow-hidden
          ${isDragging ? 'border-chemical-500 bg-chemical-50/50 scale-[1.02]' : 'border-slate-200 hover:border-chemical-400 hover:bg-slate-50/50'}
          ${status === 'success' ? 'border-green-500 bg-green-50/30' : ''}
          ${status === 'error' ? 'border-red-500 bg-red-50/30' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {status === 'uploading' ? (
                    <Loader className="w-16 h-16 text-chemical-500 animate-spin mb-4" />
                ) : status === 'success' ? (
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
                ) : status === 'error' ? (
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                ) : (
                    <UploadCloud className="w-16 h-16 text-slate-300 mb-4 transition-colors group-hover:text-chemical-400" />
                )}

                <p className="text-slate-700 font-bold text-lg mb-2">
                    {status === 'idle' ? 'Drag & Drop CSV' :
                        status === 'uploading' ? 'Processing Data...' :
                            status === 'success' ? 'Upload Complete!' : 'Upload Failed'}
                </p>

                {status === 'idle' && (
                    <>
                        <p className="text-slate-400 text-sm mb-6">or select from computer</p>
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".csv"
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="file-upload"
                            className="px-6 py-3 bg-slate-800 text-white rounded-xl cursor-pointer hover:bg-chemical-600 transition-all shadow-lg shadow-slate-800/20 hover:shadow-chemical-500/30 font-semibold"
                        >
                            Browse Files
                        </label>
                    </>
                )}

                {message && <p className={`mt-4 text-sm font-bold ${status === 'error' ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
            </div>
        </div>
    );
};

export default UploadCard;
