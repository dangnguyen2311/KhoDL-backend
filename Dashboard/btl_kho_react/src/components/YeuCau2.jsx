import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap';

const YeuCau2 = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5262/api/ssas/yc2');
            setOrders(response.data);
            setError(null);
        } catch (err) {
            setError('Không thể tải dữ liệu đơn đặt hàng. Vui lòng thử lại.');
            console.error(err);
        }
    };

    // Gọi API khi component được mount
    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Danh Sách Đơn Đặt Hàng</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" onClick={fetchOrders} className="mb-3">
                Tải Lại Dữ Liệu
            </Button>
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Mã Đơn</th>
                    <th>Tên Khách Hàng</th>
                    <th>Ngày Đặt Hàng</th>
                </tr>
                </thead>
                <tbody>
                {orders.length > 0 ? (
                    orders.map((order, index) => (
                        <tr key={index}>
                            <td>{order.maDon}</td>
                            <td>{order.tenKH}</td>
                            <td>{order.ngayDatHang}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="text-center">
                            Không có dữ liệu
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default YeuCau2;