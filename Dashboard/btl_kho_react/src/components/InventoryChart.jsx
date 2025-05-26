import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Alert, Button } from 'react-bootstrap';

const InventoryChart = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    // Lấy dữ liệu từ API
    const fetchInventoryData = async () => {
        try {
            const response = await axios.get('http://localhost:5262/api/facthanhnhap/mh');

            // ✅ Group theo maMH
            const grouped = {};
            response.data.forEach(item => {
                const { maMH, maCH, soluongconlaitrongkho } = item;
                if (!grouped[maMH]) {
                    grouped[maMH] = { maMH };
                }
                grouped[maMH][maCH] = soluongconlaitrongkho;
            });

            const transformed = Object.values(grouped);
            setData(transformed);
            setError(null);
        } catch (err) {
            setError('Không thể tải dữ liệu hàng tồn kho. Vui lòng thử lại.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchInventoryData();
    }, []);

    // ✅ Lấy danh sách các maCH (cửa hàng)
    const stores = [...new Set(data.flatMap(item => Object.keys(item).filter(k => k !== 'maMH')))];

    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <div className="container mt-4">
            <h2>Biểu Đồ Hàng Tồn Kho Theo Mặt Hàng và Cửa Hàng</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" onClick={fetchInventoryData} className="mb-3">
                Tải Lại Dữ Liệu
            </Button>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="maMH" />
                        <YAxis label={{ value: 'Số Lượng Tồn Kho', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        {stores.map((store, index) => (
                            <Bar key={store} dataKey={store} name={`CH ${store}`} fill={colors[index % colors.length]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default InventoryChart;
