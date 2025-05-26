import { Button } from "react-bootstrap";
import { Link } from "react-router";

export const HomePage = () => {
    return (
        <div className="container d-flex flex-column align-items-center justify-content-center mt-5">
            <Button
                as={Link}
                to="/factHN"
                variant="outline-danger"
                className="mb-3 w-100"
            >
                Hàng Nhập
            </Button>


            <Button
                as={Link}
                to="/factDH"
                variant="outline-danger"
                className="mb-3 w-100"
            >
                Đặt hàng
            </Button>

            {/* <Button
                as={Link}
                to="/yc1"
                variant="primary"
                className="mb-3 w-100"
            >
                Yêu cầu 1: Tìm tất cả các cửa hàng cùng với thành phố, bang, số điện thoại, mô tả, kích cỡ, trọng lượng và đơn giá của tất cả các mặt hàng được bán ở kho đó
            </Button>

            <Button
                as={Link}
                to="/order-yc2"
                variant="success"
                className="mb-3 w-100"
            >
                Yêu cầu 2: Tìm tất cả các đơn đặt hàng với tên khách hàng và ngày đặt hàng được thực hiện bởi khách hàng đó
            </Button>

            <Button
                as={Link}
                to="/location-yc6"
                variant="info"
                className="mb-3 w-100"
            >
                Yêu cầu 6: Tìm thành phố và bang mà một khách hàng nào đó sinh sống
            </Button>

            <Button
                as={Link}
                to="/KH-type-yc9"
                variant="warning"
                className="mb-3 w-100"
            >
                Yêu cầu 9: Tìm các khách hàng du lịch, khách hàng đặt theo đường bưu điện và khách hàng thuộc cả hai loại
            </Button> */}
        </div>
    );
};
