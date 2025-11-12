using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IStudentService
    {
        Task<int> CreateAsync(Student student);
        Task<IEnumerable<Student>> GetAllAsync();
        Task<Student?> GetByIdAsync(int id);
        Task<bool> UpdateAsync(Student student);
        Task<bool> DeleteAsync(int id);
    }
}
