using Mission.Entities.Models;

namespace Mission.Repositories.IRepositories
{
    public interface IUserRepository
    {
        Task<string> DeleteUser(int id);
        Task<UserResponseModel> GetUserById(int id);
        Task<List<UserResponseModel>> GetAllUsers();
        Task<UserResponseModel> CreateUser(CreateUserRequest request);
        Task<UserResponseModel> UpdateUser(UpdateUserRequest request);
    }
}