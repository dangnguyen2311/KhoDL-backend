import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap';

const CustomerOrderList = () => {
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [error, setError] = useState(null);

    // Lấy danh sách khách hàng
    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5262/api/order/customers');
            setCustomers(response.data);
            setError(null);
        } catch (err) {
            setError('Không thể tải dữ liệu khách hàng. Vui lòng thử lại.');
            console.error(err);
        }
    };

    // Lấy danh sách đơn hàng của khách hàng được chọn
    const fetchOrders = async (maKH) => {
        try {
            console.log('Fetching orders for customer:', maKH);
            const response = await axios.get(`http://localhost:5262/api/order/orders/customer/${maKH}`);
            setOrders(response.data);
            setError(null);
        } catch (err) {
            setError('Không thể tải dữ liệu đơn hàng. Vui lòng thử lại.');
            console.error(err);
        }
    };

    // Gọi API khách hàng khi component được mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Xử lý khi chọn khách hàng
    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
        fetchOrders(customer.maKH);
    };

    return (
        <div className="container mt-4">
            <h2>Danh Sách Khách Hàng</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" onClick={fetchCustomers} className="mb-3">
                Tải Lại Khách Hàng
            </Button>
            {selectedCustomer && (
                <>
                    <h3 className="mt-4">Đơn Hàng của {selectedCustomer.TenKH}</h3>
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
                                    Không có đơn hàng nào
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </>
            )}
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Mã KH</th>
                    <th>Tên Khách Hàng</th>
                    <th>Ngày Đặt Hàng Đầu Tiên</th>
                </tr>
                </thead>
                <tbody>
                {customers.length > 0 ? (
                    customers.map((customer, index) => (
                        <tr
                            key={index}
                            onClick={() => handleCustomerSelect(customer)}
                            style={{ cursor: 'pointer', backgroundColor: selectedCustomer && selectedCustomer.MaKH === customer.MaKH ? '#e0e0e0' : 'inherit' }}
                        >
                            <td>{customer.maKH}</td>
                            <td>{customer.tenKH}</td>
                            <td>{customer.ngayDatHangDauTien || 'Chưa có'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="text-center">
                            Không có dữ liệu khách hàng
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>


        </div>
    );
};

export default CustomerOrderList;