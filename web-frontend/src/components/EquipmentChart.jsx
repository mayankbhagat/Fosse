import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const EquipmentChart = ({ data }) => {
    if (!data) return <div className="p-4 text-slate-400 text-center">No data available</div>;

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Equipment Parameters',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const labels = data.map(item => item.equipment_name || item.id);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Flowrate (L/hr)',
                data: data.map(item => item.flowrate),
                backgroundColor: 'rgba(2, 132, 199, 0.6)', // chemical-600 with opacity
            },
            {
                label: 'Pressure (bar)',
                data: data.map(item => item.pressure),
                backgroundColor: 'rgba(244, 63, 94, 0.6)', // Rose color for pressure
            },
            {
                label: 'Temperature (C)',
                data: data.map(item => item.temperature),
                backgroundColor: 'rgba(234, 179, 8, 0.6)', // Yellow for temp
            }
        ],
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
            <Bar options={options} data={chartData} />
        </div>
    );
};

export default EquipmentChart;
