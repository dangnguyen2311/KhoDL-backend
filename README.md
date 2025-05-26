# Bài Tập Lớn: Thiết Kế và Cài Đặt Kho Dữ Liệu Hệ Thống Đặt Hàng

## Mô tả bài toán

Hệ thống kho dữ liệu được xây dựng cho một doanh nghiệp có nhiều cửa hàng phân bố tại nhiều **thành phố** và **bang khác nhau**. Doanh nghiệp tiếp nhận các **đơn đặt hàng từ hai loại khách hàng**:

- **Khách du lịch**, thường do hướng dẫn viên dẫn đến
- **Khách hàng bưu điện**, đặt hàng qua đường gửi thư

Hệ thống yêu cầu xây dựng một **kho dữ liệu (Data Warehouse)** để lưu trữ và phân tích các thông tin quan trọng, giúp đưa ra quyết định kinh doanh nhanh chóng và chính xác.

---

## Cơ sở dữ liệu nguồn

Dữ liệu được lấy từ 2 hệ thống:
- CSDL **Văn phòng đại diện**
- CSDL **Bán hàng**

### Các bảng chính:
- **Khách hàng**: mã KH, tên, thành phố, ngày đặt hàng đầu tiên
- **Khách hàng du lịch** và **Khách hàng bưu điện**
- **Cửa hàng**: mã cửa hàng, mã thành phố, điện thoại
- **Mặt hàng**: mô tả, kích cỡ, trọng lượng, giá
- **Mặt hàng lưu kho**: số lượng trong kho theo từng cửa hàng
- **Đơn đặt hàng** và **Chi tiết đặt hàng**

---

## Kho dữ liệu thiết kế

Kho dữ liệu được thiết kế theo mô hình **Star Schema** với hai bảng sự kiện (Fact) chính:

1. **Fact_ĐặtHàng**  
   - Ghi nhận số lượng và giá trị các mặt hàng được khách hàng đặt theo từng thời điểm, cửa hàng, thành phố.
2. **Fact_HàngNhập**  
   - Theo dõi lượng hàng được lưu trữ tại các cửa hàng theo thời gian, phục vụ tính tồn kho.

### Các bảng chiều (Dimension):
- **Dim_KhachHang**
- **Dim_ThoiGian**
- **Dim_MatHang**
- **Dim_CuaHang**
- **Dim_DiaChi**

---

## 📊 Các yêu cầu nghiệp vụ được hỗ trợ

Hệ thống báo cáo OLAP hỗ trợ các nghiệp vụ phân tích như:

1. Liệt kê thông tin cửa hàng, thành phố, mặt hàng đang bán.
2. Truy xuất các đơn hàng theo khách hàng và thời gian.
3. Tìm các cửa hàng đã bán hàng cho một khách hàng cụ thể.
4. Truy vấn mặt hàng có tồn kho vượt mức tại các cửa hàng.
5. Xác định mặt hàng, mã cửa hàng, thành phố tương ứng cho từng đơn hàng.
6. Truy vấn thành phố và bang của một khách hàng.
7. Kiểm tra mức tồn kho theo mặt hàng và thành phố.
8. Tổng hợp thông tin chi tiết của một đơn đặt hàng.
9. Phân loại khách hàng theo hình thức: du lịch, bưu điện hoặc cả hai.

---

## Công nghệ sử dụng

- **Cơ sở dữ liệu nguồn**: MS SQL Server
- **ETL (Extract - Transform - Load)**: Integration Services, SSAS
- **Kho dữ liệu**: MS SQL Server
- **Báo cáo và xử lý OLAP**: Câu truy vấn SQL, truy vấn Cube

