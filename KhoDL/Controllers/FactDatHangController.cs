using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.AnalysisServices.AdomdClient;

[Route("api/factdathang")]
[ApiController]
public class DatHangController : ControllerBase
{
    private readonly string _connectionStringSQL = "Server=DangNguyen\\SERVER_MULTI_01;Database=BTL_Kho;Trusted_Connection=True;";
    private readonly string _connectionString = "Data Source=DangNguyen\\SERVER_MULTI_01;Catalog=BTL_Kho_OLAP_Multi;Integrated Security=SSPI;";

    [HttpGet("nam-soluong")]
    public IActionResult GetDatHangByYear()

    {
        try
        {
            using (var conn = new SqlConnection(_connectionStringSQL))
            {
                conn.Open();

                string sqlQuery = @"
                    SELECT 
                        YEAR([Dim_ThoiGian].[maTG]) AS Nam,
                        SUM([Fact_DatHang].[soluongdat]) AS Tong_Soluongdat
                    FROM 
                        [Fact_DatHang]
                    JOIN 
                        [Dim_ThoiGian] ON [Fact_DatHang].[maTG] = [Dim_ThoiGian].[maTG]
                    GROUP BY 
                        YEAR([Dim_ThoiGian].[maTG])
                    ORDER BY 
                        Nam
                ";

                using (var cmd = new SqlCommand(sqlQuery, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    var result = new List<object>();
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            nam = reader["Nam"].ToString(),
                            tongSoluongdat = Convert.ToInt32(reader["Tong_Soluongdat"])
                        });
                    }

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

    [HttpGet("quy-soluong")]
    public IActionResult GetDatHangByQuarter()

    {
        try
        {
            using (var conn = new SqlConnection(_connectionStringSQL))
            {
                conn.Open();

                string sqlQuery = @"
                    SELECT 
                        ((CAST(SUBSTRING(CAST([Dim_ThoiGian].[maTG] AS VARCHAR), 5, 2) AS INT) - 1) / 3 + 1) AS Quy,
                        SUM([Fact_DatHang].[Soluongdat]) AS Tong_Soluongdat
                    FROM 
                        [Fact_DatHang]
                    JOIN 
                        [Dim_ThoiGian] ON [Fact_DatHang].[maTG] = [Dim_ThoiGian].[maTG]
                    GROUP BY 
                        ((CAST(SUBSTRING(CAST([Dim_ThoiGian].[maTG] AS VARCHAR), 5, 2) AS INT) - 1) / 3 + 1)
                    ORDER BY 
                        Quy;


                ";

                using (var cmd = new SqlCommand(sqlQuery, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    var result = new List<object>();
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            quy = reader["Quy"].ToString(),
                            tongSoluongdat = Convert.ToInt32(reader["Tong_Soluongdat"])
                        });
                    }

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

    [HttpGet("thang-soluong")]
    public IActionResult GetDatHangByMonth()

    {
        try
        {
            using (var conn = new SqlConnection(_connectionStringSQL))
            {
                conn.Open();

                string sqlQuery = @"
                    SELECT 
                        MONTH([Dim_ThoiGian].[maTG]) AS Thang,
                        SUM([Fact_DatHang].[Soluongdat]) AS Tong_Soluongdat
                    FROM 
                        [Fact_DatHang]
                    JOIN 
                        [Dim_ThoiGian] ON [Fact_DatHang].[maTG] = [Dim_ThoiGian].[maTG]
                    GROUP BY 
                        MONTH([Dim_ThoiGian].[maTG])
                    ORDER BY 
                        Thang;


                ";

                using (var cmd = new SqlCommand(sqlQuery, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    var result = new List<object>();
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            thang = reader["Thang"].ToString(),
                            tongSoluongdat = Convert.ToInt32(reader["Tong_Soluongdat"])
                        });
                    }

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
    [HttpGet("ngay-soluong")]
    public IActionResult GetDatHangByDay()

    {
        try
        {
            using (var conn = new SqlConnection(_connectionStringSQL))
            {
                conn.Open();

                string sqlQuery = @"
                    SELECT 
                        DAY([Dim_ThoiGian].[maTG]) AS Ngay,
                        SUM([Fact_DatHang].[Soluongdat]) AS Tong_Soluongdat
                    FROM 
                        [Fact_DatHang]
                    JOIN 
                        [Dim_ThoiGian] ON [Fact_DatHang].[maTG] = [Dim_ThoiGian].[maTG]
                    GROUP BY 
                        DAY([Dim_ThoiGian].[maTG])
                    ORDER BY 
                        Ngay;


                ";

                using (var cmd = new SqlCommand(sqlQuery, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    var result = new List<object>();
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            ngay = reader["Ngay"].ToString(),
                            tongSoluongdat = Convert.ToInt32(reader["Tong_Soluongdat"])
                        });
                    }

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

    [HttpGet("mh-soluong")]
    public IActionResult GetDatHangByMatHang()
    {
        try
        {
            using (var conn = new AdomdConnection(_connectionString))
            {
                conn.Open();

                string mdxQuery = @"
                    SELECT 
                        {[Measures].[Soluongdat]} ON COLUMNS,
                        [Dim Mat Hang].[Ma MH].[Ma MH].MEMBERS ON ROWS
                    FROM [4D_DatHang]
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
                            soluongdat = reader.IsDBNull(1) ? 0 : Convert.ToInt32(reader[1]) // [Measures].[Soluongdat]
                        });
                    }

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
    [HttpGet("bang-tongtien")]
    public IActionResult GetTongTienByBang()
    {
        try
        {
            using (var conn = new AdomdConnection(_connectionString))
            {
                conn.Open();

                string mdxQuery = @"
                    SELECT 
                        {[Measures].[Tongtien]} ON COLUMNS,
                        [Dim Dia Chi].[Bang].[Bang].MEMBERS ON ROWS
                    FROM [4D_DatHang]
                ";

                using (var cmd = new AdomdCommand(mdxQuery, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    var result = new List<object>();
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            bang = reader[0]?.ToString(), // [Dim Dia Chi].[Bang]
                            tongTien = reader.IsDBNull(1) ? 0 : Convert.ToDecimal(reader[1]) // [Measures].[Tongtien]
                        });
                    }

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