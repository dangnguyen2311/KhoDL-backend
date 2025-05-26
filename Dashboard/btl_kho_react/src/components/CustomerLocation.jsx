import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Card } from 'react-bootstrap';

const CustomerLocation = () => {
    const [customers, setCustomers] = useState([]);
    const [location, setLocation] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [error, setError] = useState(null);

    // Lấy danh sách khách hàng
    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5262/api/customer/customers');
            setCustomers(response.data);
            setError(null);
        } catch (err) {
            setError('Không thể tải dữ liệu khách hàng. Vui lòng thử lại.');
            console.error(err);
        }
    };

    // Lấy thông tin thành phố và bang của khách hàng
    const fetchCustomerLocation = async (maKH) => {
        try {
            const response = await axios.get(`http://localhost:5262/api/customer/${maKH}/location`);
            setLocation(response.data);
            setError(null);
        } catch (err) {
            setError('Không thể tải thông tin địa điểm. Vui lòng thử lại.');
            console.error(err);
            setLocation(null);
        }
    };

    // Gọi API khách hàng khi component được mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Xử lý khi chọn khách hàng
    const handleCustomerSelect = (customer) => {
        if (customer && typeof customer.maKH === 'string' && customer.maKH.trim() !== '') {
            setSelectedCustomer(customer);
            fetchCustomerLocation(customer.maKH);
        } else {
            setError('Mã khách hàng không hợp lệ. Vui lòng chọn lại.');
            console.error('Dữ liệu khách hàng:', customer);
            setLocation(null);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Danh Sách Khách Hàng</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" onClick={fetchCustomers} className="mb-3">
                Tải Lại Khách Hàng
            </Button>
            {selectedCustomer && (
                <Card className="mt-4">
                    <Card.Header>Thông Tin Địa Điểm của {selectedCustomer.tenKH}</Card.Header>
                    <Card.Body>
                        {location ? (
                            <>
                                <p><strong>Thành Phố:</strong> {location.tenTP}</p>
                                <p><strong>Bang:</strong> {location.bang}</p>
                            </>
                        ) : (
                            <p>Không có thông tin địa điểm hoặc khách hàng không hợp lệ.</p>
                        )}
                    </Card.Body>
                </Card>
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
                            style={{
                                cursor: 'pointer',
                                backgroundColor: selectedCustomer && selectedCustomer.maKH === customer.maKH ? '#e0e0e0' : 'inherit'
                            }}
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

export default CustomerLocation;