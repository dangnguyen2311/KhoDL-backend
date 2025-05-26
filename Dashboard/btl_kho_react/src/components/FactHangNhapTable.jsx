import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Alert, Button, Spinner, Row, Col } from 'react-bootstrap';

const FactHangNhapTable = () => {
    const [mhData, setMHData] = useState([]);
    const [chData, setCHData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch data for Mặt Hàng
            const mhResponse = await axios.get('http://localhost:5262/api/facthanhnhap/mh');
            console.log('Raw MH Data:', mhResponse.data); // Debug log

            const transformedMHData = mhResponse.data
                .filter(item => item.maMH && item.maMH.trim() !== '') // Filter out empty maMH
                .map(item => ({
                    name: `MH ${item.maMH}`,
                    value: item.soluongconlaitrongkho
                }));
            console.log('Transformed MH Data:', transformedMHData); // Debug log

            // Fetch data for Cửa Hàng
            const chResponse = await axios.get('http://localhost:5262/api/facthanhnhap/ch');
            console.log('Raw CH Data:', chResponse.data); // Debug log

            const transformedCHData = chResponse.data.map(item => ({
                name: `CH ${item.maCH}`,
                value: item.soluongconlaitrongkho
            }));
            console.log('Transformed CH Data:', transformedCHData); // Debug log

            setMHData(transformedMHData);
            setCHData(transformedCHData);
            setError(null);
        } catch (err) {
            setError('Không thể tải dữ liệu. Vui lòng thử lại.');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ 
                    backgroundColor: 'white', 
                    padding: '10px', 
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                }}>
                    <p style={{ margin: 0 }}>{`${label}`}</p>
                    <p style={{ margin: 0, color: '#8884d8' }}>
                        {`Số lượng: ${payload[0].value}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    const formatYAxis = (tickItem) => {
        if (tickItem >= 1000000000) {
            return (tickItem / 1000000000).toFixed(1) + 'B';
        }
        if (tickItem >= 1000000) {
            return (tickItem / 1000000).toFixed(1) + 'M';
        }
        if (tickItem >= 1000) {
            return (tickItem / 1000).toFixed(1) + 'K';
        }
        return tickItem;
    };

    return (
        <div className="container mt-4">
            <h2>Biểu Đồ Kho</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Button 
                variant="primary" 
                onClick={fetchData} 
                className="mb-3"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                        />
                        Đang tải...
                    </>
                ) : (
                    'Tải Lại Dữ Liệu'
                )}
            </Button>

            <Row>
                <Col md={12}>
                    <h3 className="text-center mb-3">Theo Mặt Hàng</h3>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <BarChart data={mhData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} width={100}/>
                                <YAxis 
                                    label={{ value: 'Số Lượng Tồn Kho', angle: -90, position: 'insideLeft' }} 
                                    tickFormatter={formatYAxis}
                                />
                                <Tooltip 
                                    content={<CustomTooltip />}
                                    formatter={(value) => formatYAxis(value)}
                                />
                                <Legend />
                                <Bar dataKey="value" name="Số Lượng Tồn Kho" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
                <Col md={12}>
                    <h3 className="text-center mb-3">Theo Cửa Hàng</h3>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <BarChart data={chData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                <YAxis 
                                    label={{ value: 'Số Lượng Tồn Kho', angle: -90, position: 'insideLeft' }} 
                                    tickFormatter={formatYAxis}
                                />
                                <Tooltip 
                                    content={<CustomTooltip />}
                                    formatter={(value) => formatYAxis(value)}
                                />
                                <Legend />
                                <Bar dataKey="value" name="Số Lượng Tồn Kho" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default FactHangNhapTable; 