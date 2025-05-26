import { useEffect, useState } from 'react';
import axios from 'axios';

function YeuCau1() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5262/api/ssas/yc1')
            .then((res) => setData(res.data))
            .catch((err) => console.error('Lỗi khi lấy dữ liệu:', err));
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Danh sách cửa hàng và mặt hàng bán trong kho</h2>
            <table border="1" cellPadding="8" cellSpacing="0">
                <thead>
                <tr>
                    <th>Tên Thành phố</th>
                    <th>Bang</th>
                    <th>Số điện thoại</th>
                    <th>Mô tả mặt hàng</th>
                    <th>Kích cỡ</th>
                    <th>Trọng lượng</th>
                    <th>Đơn giá</th>
                </tr>
                </thead>
                <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan="7" align="center">Không có dữ liệu</td>
                    </tr>
                ) : (
                    data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.thanhPho}</td>
                            <td>{item.bang}</td>
                            <td>{item.soDienThoai}</td>
                            <td>{item.moTa}</td>
                            <td>{item.kichCo}</td>
                            <td>{item.trongLuong}</td>
                            <td>{item.donGia}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default YeuCau1;
