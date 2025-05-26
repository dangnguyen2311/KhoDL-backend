import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Alert, Button, Spinner, ButtonGroup, Row, Col } from 'react-bootstrap';

const FactDatHang = () => {
    const [data, setData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timePeriod, setTimePeriod] = useState('nam');
    const [locationType, setLocationType] = useState('bang');
    const [locationTitle, setLocationTitle] = useState('Biểu Đồ Tổng Tiền Theo Bang');

    const fetchData = async (period) => {
        setLoading(true);
        try {
            let endpoint = '';
            switch (period) {
                case 'nam':
                    endpoint = 'http://localhost:5262/api/factdathang/nam-soluong';
                    break;
                case 'quy':
                    endpoint = 'http://localhost:5262/api/factdathang/quy-soluong';
                    break;
                case 'thang':
                    endpoint = 'http://localhost:5262/api/factdathang/thang-soluong';
                    break;
                case 'ngay':
                    endpoint = 'http://localhost:5262/api/factdathang/ngay-soluong';
                    break;
                default:
                    endpoint = 'http://localhost:5262/api/factdathang/nam-soluong';
            }

            const response = await axios.get(endpoint);
            console.log(`Raw Order Data (${period}):`, response.data);

            const transformedData = response.data.map(item => {
                let name = '';
                switch (period) {
                    case 'nam':
                        name = `${item.nam}`;
                        break;
                    case 'quy':
                        name = `${item.quy}`;
                        break;
                    case 'thang':
                        name = `${item.thang}`;
                        break;
                    case 'ngay':
                        name = `${item.ngay}`;
                        break;
                    default:
                        name = `${item.nam}`;
                }
                return {
                    name: name,
                    value: item.tongSoluongdat
                };
            });
            console.log('Transformed Order Data:', transformedData);

            setData(transformedData);
            setError(null);
        } catch (err) {
            setError('Không thể tải dữ liệu đặt hàng. Vui lòng thử lại.');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductData = async () => {
        try {
            const response = await axios.get('http://localhost:5262/api/factdathang/mh-soluong');
            console.log('Raw Product Data:', response.data);

            const transformedData = response.data.map(item => ({
                name: `MH ${item.maMH}`,
                value: item.soluongdat
            }));
            console.log('Transformed Product Data:', transformedData);

            setProductData(transformedData);
        } catch (err) {
            console.error('Error fetching product data:', err);
        }
    };

    const fetchStateData = async () => {
        try {
            const response = await axios.get('http://localhost:5262/api/factdathang/bang-tongtien');
            console.log('Raw State Data:', response.data);

            const transformedData = response.data.map(item => ({
                name: item.bang,
                value: item.tongTien
            }));
            console.log('Transformed State Data:', transformedData);

            setStateData(transformedData);
        } catch (err) {
            console.error('Error fetching state data:', err);
        }
    };

    const fetchLocationData = async (type) => {
        try {
            const endpoint = type === 'bang' 
                ? 'http://localhost:5262/api/factdathang/bang-tongtien'
                : 'http://localhost:5262/api/factdathang/thanhpho-tongtien';
            
            const response = await axios.get(endpoint);
            console.log(`Raw ${type} Data:`, response.data);

            const transformedData = response.data.map(item => ({
                name: type === 'bang' ? item.bang : item.tenTP,
                value: item.tongTien
            }));
            console.log(`Transformed ${type} Data:`, transformedData);

            setLocationData(transformedData);
        } catch (err) {
            console.error(`Error fetching ${type} data:`, err);
        }
    };

    useEffect(() => {
        fetchData(timePeriod);
        fetchProductData();
        fetchStateData();
    }, [timePeriod]);

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

    const formatCurrency = (value) => {
        if (value >= 1000000000) {
            return `${(value / 1000000000).toFixed(1)}B đ`;
        }
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M đ`;
        }
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K đ`;
        }
        return `${value.toFixed(2)}`;
    };

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
                        {`Số lượng đặt: ${formatYAxis(payload[0].value)}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ 
                    backgroundColor: 'white', 
                    padding: '10px', 
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                }}>
                    <p style={{ margin: 0 }}>{`${payload[0].name}`}</p>
                    <p style={{ margin: 0, color: '#8884d8' }}>
                        {`Tổng tiền: ${formatCurrency(payload[0].value)}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    const getChartTitle = () => {
        switch (timePeriod) {
            case 'nam':
                return 'Biểu Đồ Đặt Hàng Theo Năm';
            case 'quy':
                return 'Biểu Đồ Đặt Hàng Theo Quý';
            case 'thang':
                return 'Biểu Đồ Đặt Hàng Theo Tháng';
            case 'ngay':
                return 'Biểu Đồ Đặt Hàng Theo Ngày';
            default:
                return 'Biểu Đồ Đặt Hàng';
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

    return (
        <div className="container mt-4">
            <h2>{getChartTitle()}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <div className="d-flex justify-content-between align-items-center mb-3">
                <ButtonGroup>
                    <Button 
                        variant={timePeriod === 'nam' ? 'primary' : 'outline-primary'}
                        onClick={() => setTimePeriod('nam')}
                    >
                        Năm
                    </Button>
                    <Button 
                        variant={timePeriod === 'quy' ? 'primary' : 'outline-primary'}
                        onClick={() => setTimePeriod('quy')}
                    >
                        Quý
                    </Button>
                    <Button 
                        variant={timePeriod === 'thang' ? 'primary' : 'outline-primary'}
                        onClick={() => setTimePeriod('thang')}
                    >
                        Tháng
                    </Button>
                    <Button 
                        variant={timePeriod === 'ngay' ? 'primary' : 'outline-primary'}
                        onClick={() => setTimePeriod('ngay')}
                    >
                        Ngày
                    </Button>
                </ButtonGroup>

                <Button 
                    variant="primary" 
                    onClick={() => {
                        fetchData(timePeriod);
                        fetchProductData();
                        fetchStateData();
                    }} 
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
            </div>

            <Row>
                <Col md={12} className="mb-4">
                    <div style={{ width: '100%', height: 600 }}>
                        <ResponsiveContainer>
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="name" 
                                    angle={-45} 
                                    textAnchor="end" 
                                    height={100}
                                />
                                <YAxis 
                                    label={{ value: 'Số Lượng Đặt Hàng', angle: -90, position: 'insideLeft' }} 
                                    tickFormatter={formatYAxis}
                                />
                                <Tooltip 
                                    content={<CustomTooltip />}
                                    formatter={(value) => formatYAxis(value)}
                                />
                                <Legend />
                                <Bar 
                                    dataKey="value" 
                                    name="Số Lượng Đặt Hàng" 
                                    fill="#8884d8"
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Col>

                <Col md={12} className="mb-4">
                    <h3 className="text-center mb-3">Biểu Đồ Đặt Hàng Theo Mặt Hàng</h3>
                    <div style={{ width: '100%', height: 600 }}>
                        <ResponsiveContainer>
                            <BarChart data={productData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="name" 
                                    angle={-45} 
                                    textAnchor="end" 
                                    height={150}
                                />
                                <YAxis 
                                    label={{ value: 'Số Lượng Đặt Hàng', angle: -90, position: 'insideLeft' }} 
                                    tickFormatter={formatYAxis}
                                />
                                <Tooltip 
                                    content={<CustomTooltip />}
                                    formatter={(value) => formatYAxis(value)}
                                />
                                <Legend />
                                <Bar 
                                    dataKey="value" 
                                    name="Số Lượng Đặt Hàng" 
                                    fill="#82ca9d"
                                    barSize={50}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Col>

                <Col md={12}>
                <div className="d-flex justify-content-center mb-3">
                        <ButtonGroup>
                        <Button 
                                variant={locationType === 'bang' ? 'primary' : 'outline-primary'}
                                onClick={() => {
                                    setLocationType('bang');
                                    setLocationTitle('Biểu Đồ Tổng Tiền Theo Bang');
                                    fetchLocationData('bang')
                                }}
                            >
                                Bang
                            </Button>
                            <Button 
                                variant={locationType === 'thanhpho' ? 'primary' : 'outline-primary'}
                                onClick={() => {
                                    setLocationType('thanhpho');
                                    setLocationTitle('Biểu Đồ Tổng Tiền Theo Thành Phố');
                                    fetchLocationData('thanhpho')
                                }}
                            >
                                Thành Phố
                            </Button>
                        </ButtonGroup>
                    </div>
                    <h3 className="text-center mb-3">{locationTitle}</h3>
                    <div style={{ width: '100%', height: 600 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={stateData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stateData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default FactDatHang; 