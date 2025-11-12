using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Backend.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly string _connectionString;
        public StudentRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public async Task<int> CreateAsync(Student student)
        {
            await using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            await using var cmd = new SqlCommand("dbo.usp_CreateStudent", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@FirstName", student.FirstName);
            cmd.Parameters.AddWithValue("@LastName", student.LastName);
            cmd.Parameters.AddWithValue("@Email", (object?)student.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@DateOfBirth", (object?)student.DateOfBirth ?? DBNull.Value);

            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<IEnumerable<Student>> GetAllAsync()
        {
            var list = new List<Student>();
            await using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            await using var cmd = new SqlCommand("dbo.usp_GetStudents", conn) { CommandType = CommandType.StoredProcedure };
            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new Student
                {
                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                    FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                    LastName = reader.GetString(reader.GetOrdinal("LastName")),
                    Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? null : reader.GetString(reader.GetOrdinal("Email")),
                    DateOfBirth = reader.IsDBNull(reader.GetOrdinal("DateOfBirth")) ? null : reader.GetDateTime(reader.GetOrdinal("DateOfBirth")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt"))
                });
            }
            return list;
        }

        public async Task<Student?> GetByIdAsync(int id)
        {
            await using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            await using var cmd = new SqlCommand("dbo.usp_GetStudentById", conn) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@Id", id);
            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Student
                {
                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                    FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                    LastName = reader.GetString(reader.GetOrdinal("LastName")),
                    Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? null : reader.GetString(reader.GetOrdinal("Email")),
                    DateOfBirth = reader.IsDBNull(reader.GetOrdinal("DateOfBirth")) ? null : reader.GetDateTime(reader.GetOrdinal("DateOfBirth")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt"))
                };
            }
            return null;
        }

        public async Task<bool> UpdateAsync(Student student)
        {
            await using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            await using var cmd = new SqlCommand("dbo.usp_UpdateStudent", conn) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@Id", student.Id);
            cmd.Parameters.AddWithValue("@FirstName", student.FirstName);
            cmd.Parameters.AddWithValue("@LastName", student.LastName);
            cmd.Parameters.AddWithValue("@Email", (object?)student.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@DateOfBirth", (object?)student.DateOfBirth ?? DBNull.Value);

            var rowsObj = await cmd.ExecuteScalarAsync();
            var rows = Convert.ToInt32(rowsObj);
            return rows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            await using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            await using var cmd = new SqlCommand("dbo.usp_DeleteStudent", conn) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@Id", id);
            var rowsObj = await cmd.ExecuteScalarAsync();
            var rows = Convert.ToInt32(rowsObj);
            return rows > 0;
        }
    }
}
