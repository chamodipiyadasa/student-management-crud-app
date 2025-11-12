using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _repo;
        public StudentService(IStudentRepository repo)
        {
            _repo = repo;
        }

        public Task<int> CreateAsync(Student student) => _repo.CreateAsync(student);
        public Task<IEnumerable<Student>> GetAllAsync() => _repo.GetAllAsync();
        public Task<Student?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
        public Task<bool> UpdateAsync(Student student) => _repo.UpdateAsync(student);
        public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);
    }
}
