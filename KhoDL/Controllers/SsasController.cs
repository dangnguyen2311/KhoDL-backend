using Microsoft.AspNetCore.Mvc;
using Microsoft.AnalysisServices.AdomdClient;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace SsasApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SsasController : ControllerBase
    {
        [HttpGet("doanhthu")]
        public IActionResult GetDoanhThu()
        {
            string connStr = "Data Source=DANGNGUYEN\\SERVER_MULTI_01;Catalog=BTL_Kho_OLAP_Multi";
            try
            {
                using (var conn = new AdomdConnection(connStr))
                {
                    conn.Open();
                    string mdx = "SELECT [Measures].[Soluongdat] ON COLUMNS FROM [4D_Cube_DatHang]";

                    using (var cmd = new AdomdCommand(mdx, conn))
                    using (var reader = cmd.ExecuteReader())
                    {
                        var result = new List<object>();
                        while (reader.Read())
                        {
                            result.Add(new {
                                Measure = "Soluongdat",
                                Value = reader[0]?.ToString()
                            });
                        }
                        return Ok(result); // Trả JSON [{Measure:..., Value:...}]
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi: " + ex.Message);
            }
        }


        [HttpGet("ping")]
        public IActionResult Ping()
        {
            Console.WriteLine("✅ Ping thành công - API đang chạy!");
            return Ok("✅ API Ssas hoạt động OK!");
        }

        [HttpGet("yc1")]
        public IActionResult GetYeuCau1()
        {
            string connStr = "Data Source=DANGNGUYEN\\SERVER_MULTI_01;Catalog=BTL_Kho_OLAP_Multi";

            try
            {
                using (var conn = new AdomdConnection(connStr))
                {
                    conn.Open();

                    string mdx = @"
                        SELECT 
	                        NON EMPTY 
		                        [Dim_VanPhongDaiDien].[tenTP].[tenTP].Members * 
		                        [Dim_VanPhongDaiDien].[bang].[bang].Members * 
		                        [Dim_CuaHang].[sodienthoai].[sodienthoai].Members * 
		                        [Dim_MatHang].[mota].[mota].Members * 
		                        [Dim_MatHang].[kichco].[kichco].Members * 
		                        [Dim_MatHang].[trongluong].[trongluong].Members * 
		                        [Dim_MatHang].[gia].[gia].Members 
                        ON ROWS,
                        { [Measures].[Soluongdat] } ON COLUMNS 
                        FROM [4D_Cube_DatHang]
                    ";

                    using (var cmd = new AdomdCommand(mdx, conn))
                    using (var reader = cmd.ExecuteReader())
                    {
                        var results = new List<object>();

                        while (reader.Read())
                        {
                            results.Add(new
                            {
                                ThanhPho = reader[0]?.ToString(),
                                Bang = reader[1]?.ToString(),
                                SoDienThoai = reader[2]?.ToString(),
                                MoTa = reader[3]?.ToString(),
                                KichCo = reader[4]?.ToString(),
                                TrongLuong = reader[5]?.ToString(),
                                DonGia = reader[6]?.ToString(),
                                SoLuongDat = reader[7]?.ToString()
                            });
                        }

                        return Ok(results);
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi: " + ex.Message);
            }
        }


        [HttpGet("yc2")]
        public IActionResult GetOrders()
        {
            string _connectionString = "Server=DangNguyen\\SERVER_MULTI_01;Database=BTL_IDB;Trusted_Connection=True;";
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
                        ORDER BY d.ngaydathang 
                    ";

                    using (var cmd = new SqlCommand(sql, conn))
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
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi: " + ex.Message);
            }
        }
    }
}
