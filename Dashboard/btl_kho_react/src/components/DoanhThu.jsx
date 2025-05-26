import { useEffect, useState } from 'react';
import axios from 'axios';

function DoanhThuTable() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5262/api/ssas/doanhthu')
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => console.error('Lỗi:', err));
    }, []);

    return (
        <div className="container d-flex justify-content-start mx-auto">
            <div className="row">
                <div className="col-12">
                    <h2>Dữ liệu Fact_DatHang</h2>
                    <table border="1">
                        <thead>
                        <tr>
                            <th>Tên độ đo</th>
                            <th>Giá trị</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row, idx) => (
                            <tr key={idx}>
                                <td>{row.measure}</td>
                                <td>{row.value}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default DoanhThuTable;
