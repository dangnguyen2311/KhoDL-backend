import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Card } from 'react-bootstrap';

const CustomerType = () => {
    const [travelCustomers, setTravelCustomers] = useState([]);
    const [mailOrderCustomers, setMailOrderCustomers] = useState([]);
    const [bothCustomers, setBothCustomers] = useState([]);
    const [error, setError] = useState(null);

    const fetchCustomerTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5262/api/customer/type');
            setTravelCustomers(response.data.travelCustomers || []);
            setMailOrderCustomers(response.data.mailOrderCustomers || []);
            setBothCustomers(response.data.bothCustomers || []);
            setError(null);
        } catch (err) {
            setError('Không thể tải dữ liệu khách hàng. Vui lòng thử lại.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCustomerTypes();
    }, []);

    const renderCustomerTable = (customers, title) => (
        <div className="col-md-4">
            <Card className="shadow-sm rounded mb-4">
                <Card.Body>
                    <Card.Title className="text-center fs-5 mb-3">{title}</Card.Title>
                    <Table striped hover responsive size="sm" className="mb-0">
                        <thead>
                        <tr>
                            <th>Mã KH</th>
                            <th>Tên KH</th>
                        </tr>
                        </thead>
                        <tbody>
                        {customers.length > 0 ? (
                            customers.map((customer, index) => (
                                <tr key={index}>
                                    <td>{customer.maKH}</td>
                                    <td>{customer.tenKH}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center text-muted">
                                    Không có KH nào
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );

    return (
        <div className="container-fluid mt-4 px-5">
            <h2 className="text-center mb-4">Phân Loại Khách Hàng</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="d-flex justify-content-center mb-4">
                <Button variant="primary" onClick={fetchCustomerTypes}>
                    Tải Lại Dữ Liệu
                </Button>
            </div>
            <div className="row gx-4">
                {renderCustomerTable(travelCustomers, 'Khách Hàng Du Lịch')}
                {renderCustomerTable(mailOrderCustomers, 'Khách Hàng Bưu Điện')}
                {renderCustomerTable(bothCustomers, 'Khách Hàng Cả Hai')}
            </div>
        </div>
    );
};

export default CustomerType;
