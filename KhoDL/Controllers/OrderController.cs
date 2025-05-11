using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly string _connectionString = "Server=DangNguyen\\SERVER_MULTI_01;Database=BTL_IDB;Trusted_Connection=True;";

    // Lấy danh sách tất cả khách hàng
    [HttpGet("customers")]
    public IActionResult GetCustomers()
    {
        try
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string sql = @"
                    SELECT 
                        maKH, 
                        tenKH, 
                        ngaydathangdautien
                    FROM KhachHang
                    ORDER BY maKH
                ";

                using (var cmd = new SqlCommand(sql, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    var result = new List<object>();
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            MaKH = reader["maKH"].ToString(),
                            TenKH = reader["tenKH"].ToString(),
                            NgayDatHangDauTien = reader["ngaydathangdautien"] != DBNull.Value 
                                ? Convert.ToDateTime(reader["ngaydathangdautien"]).ToString("yyyy-MM-dd") 
                                : null
                        });
                    }
                    return Ok(result); // Trả JSON [{MaKH:..., TenKH:..., NgayDatHangDauTien:...}]
                }
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Lỗi: " + ex.Message);
        }
    }

    // Lấy danh sách đơn hàng của một khách hàng dựa trên maKH
    [HttpGet("orders/customer/{maKH}")]
    public IActionResult GetOrdersByCustomer(string maKH)
    {
        try
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string sql = @"
                    SELECT 
                        d.maDon, 
                        k.tenKH, 
                        d.ngaydathang
                    FROM DonDatHang d
                    INNER JOIN KhachHang k ON d.maKH = k.maKH
                    WHERE d.maKH = @maKH
                    ORDER BY d.ngaydathang DESC
                ";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@maKH", maKH);
                    using (var reader = cmd.ExecuteReader())
                    {
                        var result = new List<object>();
                        while (reader.Read())
                        {
                            result.Add(new
                            {
                                MaDon = reader["maDon"].ToString(),
                                TenKH = reader["tenKH"].ToString(),
                                NgayDatHang = Convert.ToDateTime(reader["ngaydathang"]).ToString("yyyy-MM-dd")
                            });
                        }
                        return Ok(result); // Trả JSON [{MaDon:..., TenKH:..., NgayDatHang:...}]
                    }
                }
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Lỗi: " + ex.Message);
        }
    }
}