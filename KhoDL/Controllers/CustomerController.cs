using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

[Route("api/[controller]")]
[ApiController]
public class CustomerController : ControllerBase
{
    private readonly string _connectionString = "Server=DangNguyen\\SERVER_MULTI_01;Database=BTL_IDB;Trusted_Connection=True;";

    // Lấy danh sách tất cả khách hàng YÊU CẦU 6
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
                    ORDER BY tenKH
                ";

                using (var cmd = new SqlCommand(sql, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    var result = new List<object>();
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            maKH = reader["maKH"].ToString(),
                            tenKH = reader["tenKH"].ToString(),
                            ngayDatHangDauTien = reader["ngaydathangdautien"] != DBNull.Value 
                                ? Convert.ToDateTime(reader["ngaydathangdautien"]).ToString("yyyy-MM-dd") 
                                : null
                        });
                    }
                    return Ok(result);
                }
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Lỗi: " + ex.Message);
        }
    }

    // Lấy thành phố và bang của một khách hàng
    [HttpGet("{maKH}/location")]
    public IActionResult GetCustomerLocation(string maKH)
    {
        try
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string sql = @"
                    SELECT 
                        k.tenKH,
                        vpdd.tenTP,
                        vpdd.bang
                    FROM KhachHang k
                    LEFT JOIN VanPhongDaiDien vpdd ON k.maTP = vpdd.maTP
                    WHERE k.maKH = @maKH
                ";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@maKH", maKH);
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return Ok(new
                            {
                                tenKH = reader["tenKH"].ToString(),
                                tenTP = reader["tenTP"] != DBNull.Value ? reader["tenTP"].ToString() : "Không xác định",
                                bang = reader["bang"] != DBNull.Value ? reader["bang"].ToString() : "Không xác định"
                            });
                        }
                        return NotFound("Không tìm thấy khách hàng hoặc thông tin địa điểm.");
                    }
                }
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Lỗi: " + ex.Message);
        }
    }




    // Lấy danh sách khách hàng theo loại (du lịch, bưu điện, cả hai)
    [HttpGet("type")]
    public IActionResult GetCustomerTypes()
    {
        string connStr = "Server=DangNguyen\\SERVER_MULTI_01;Database=BTL_Kho;Trusted_Connection=True;";
        try
        {
            using (var conn = new SqlConnection(connStr))
            {
                conn.Open();

                // Danh sách khách hàng du lịch
                var travelCustomers = new List<object>();
                string travelSql = @"
                    SELECT maKH, tenKH
                    FROM Dim_KhachHang
                    WHERE loaiKH = N'Du lich'
                    ORDER BY maKH
                ";
                using (var cmd = new SqlCommand(travelSql, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        travelCustomers.Add(new
                        {
                            maKH = reader["maKH"].ToString(),
                            tenKH = reader["tenKH"].ToString()
                        });
                    }
                }

                // Danh sách khách hàng đặt qua bưu điện
                var mailOrderCustomers = new List<object>();
                string mailOrderSql = @"
                    SELECT maKH, tenKH
                    FROM Dim_KhachHang
                    WHERE loaiKH = N'Buu dien'
                    ORDER BY maKH
                ";
                using (var cmd = new SqlCommand(mailOrderSql, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        mailOrderCustomers.Add(new
                        {
                            maKH = reader["maKH"].ToString(),
                            tenKH = reader["tenKH"].ToString()
                        });
                    }
                }

                // Danh sách khách hàng thuộc cả hai loại
                var bothCustomers = new List<object>();
                string bothSql = @"
                    SELECT maKH, tenKH
                    FROM Dim_KhachHang
                    WHERE loaiKH = N'Ca hai'
                    ORDER BY maKH
                ";
                using (var cmd = new SqlCommand(bothSql, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        bothCustomers.Add(new
                        {
                            maKH = reader["maKH"].ToString(),
                            tenKH = reader["tenKH"].ToString()
                        });
                    }
                }

                return Ok(new
                {
                    travelCustomers,
                    mailOrderCustomers,
                    bothCustomers
                });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Lỗi: " + ex.Message);
        }
    }
}