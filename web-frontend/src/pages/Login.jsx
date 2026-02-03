import React, { useState } from 'react';
import { FlaskConical, Lock, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            const response = await axios.post(`${API_URL}/api/login/`, {
                username,
                password
            });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-chemical-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 relative">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-chemical-500 rounded-xl mb-4 shadow-lg shadow-chemical-500/30">
                        <FlaskConical className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                    <p className="text-slate-400 mt-2">Sign in to access the Engineering Dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-chemical-500 transition"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-chemical-500 transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-linear-to-r from-chemical-600 to-chemical-500 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-chemical-500/25 transition-all transform hover:-translate-y-0.5"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
