using Microsoft.AnalysisServices.AdomdClient;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

[Route("api/facthanhnhap")]
[ApiController]
public class FactHangNhapController : ControllerBase
{
    private readonly string _connectionString = "Data Source=DangNguyen\\SERVER_MULTI_01;Catalog=BTL_Kho_OLAP_Multi;Integrated Security=SSPI;";

    [HttpGet("mh")]
    public IActionResult GetMatHang_SLCL()
    {
        try
        {
            using (var conn = new AdomdConnection(_connectionString))
            {
                conn.Open();

                // Sử dụng MDX query mới
                string mdxQuery = @"
                    SELECT
                        NON EMPTY [Dim Mat Hang].[Ma MH].MEMBERS ON ROWS,
                        {[Measures].[Soluongconlaitrongkho]} ON COLUMNS
                    FROM [2D_HangNhap_MH_CH]
                ";

                using (var cmd = new AdomdCommand(mdxQuery, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    var result = new List<object>();
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            maMH = reader[0]?.ToString(), // [Dim Mat Hang].[Ma MH]
                            soluongconlaitrongkho = reader.IsDBNull(1) ? 0 : Convert.ToInt64(reader[1]) // [Measures].[Soluongconlaitrongkho]

                        });
                        Console.WriteLine("Mã mặt hàng: " + reader[0]?.ToString() + ", Số lượng còn lại trong kho: " + (reader.IsDBNull(1) ? 0 : Convert.ToInt64(reader[1])));
                        
                    }
                    Console.WriteLine("Lấy thành công danh sách mặt hàng và số lượng còn lại trong kho.");

                    return Ok(result);
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Chi tiết lỗi: " + ex.ToString());
            return StatusCode(500, "Lỗi: " + ex.Message);
        }
    }


    [HttpGet("ch")]
    public IActionResult GetCuaHang_SLCL()
    {
        try
        {
            using (var conn = new AdomdConnection(_connectionString))
            {
                conn.Open();

                // Sử dụng MDX query mới
                string mdxQuery = @"
                    SELECT 
                        NON EMPTY [Dim Cua Hang].[Ma CH].[Ma CH].MEMBERS ON ROWS,
                        {[Measures].[Soluongconlaitrongkho]} ON COLUMNS
                    FROM [2D_HangNhap_MH_CH]
                ";

                using (var cmd = new AdomdCommand(mdxQuery, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    var result = new List<object>();
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            maCH = reader[0]?.ToString(), // [Dim Cua Hang].[Ma CH]
                            soluongconlaitrongkho = reader.IsDBNull(1) ? 0 : Convert.ToInt64(reader[1]) // [Measures].[Soluongconlaitrongkho]

                        });
                        Console.WriteLine("Mã cửa hàng: " + reader[0]?.ToString() + ", Số lượng còn lại trong kho: " + (reader.IsDBNull(1) ? 0 : Convert.ToInt64(reader[1])));
                    }
                    Console.WriteLine("Lấy dữ liệu thành công từ CuaHang_SLCL");

                    return Ok(result);
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Chi tiết lỗi: " + ex.ToString());
            return StatusCode(500, "Lỗi: " + ex.Message);
        }
    }
}
