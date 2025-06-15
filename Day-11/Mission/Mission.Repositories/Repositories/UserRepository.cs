using Microsoft.EntityFrameworkCore;
using Mission.Entities;
using Mission.Entities.Context;
using Mission.Entities.Models;
using Mission.Repositories.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mission.Repositories.Repositories
{
    public class UserRepository(MissionDbContext cIDbContext) : IUserRepository
    {
        private readonly MissionDbContext _cIDbContext = cIDbContext;

        public async Task<string> DeleteUser(int id)
        {
            var user = await _cIDbContext.User.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) throw new Exception("User not exist");

            user.IsDeleted = true;
            user.ModifiedDate = DateTime.UtcNow;
            _cIDbContext.User.Update(user);
            await _cIDbContext.SaveChangesAsync();
            return "User deleted!";
        }

        public async Task<UserResponseModel> GetUserById(int id)
        {
            var user = await _cIDbContext.User.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);

            if (user == null) throw new Exception("User not exist");

            return new UserResponseModel()
            {
                EmailAddress = user.EmailAddress,
                FirstName = user.FirstName,
                Id = user.Id,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                UserType = user.UserType,
                UserImage = user.UserImage
            };
        }

        public async Task<List<UserResponseModel>> GetAllUsers()
        {
            return await _cIDbContext.User.Where(u => !u.IsDeleted)
                .Select(user => new UserResponseModel()
                {
                    EmailAddress = user.EmailAddress,
                    FirstName = user.FirstName,
                    Id = user.Id,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    UserType = user.UserType,
                    UserImage = user.UserImage
                }).ToListAsync();
        }

        public async Task<UserResponseModel> CreateUser(CreateUserRequest request)
        {
            // Check if user already exists
            var existingUser = await _cIDbContext.User.FirstOrDefaultAsync(u => u.EmailAddress == request.EmailAddress && !u.IsDeleted);
            if (existingUser != null)
            {
                throw new Exception("User with this email already exists");
            }

            var user = new User()
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber,
                EmailAddress = request.EmailAddress,
                UserType = request.UserType,
                Password = request.Password, // Note: You should hash the password before storing
                UserImage = request.UserImage,
                CreatedDate = DateTime.UtcNow,
                IsDeleted = false
            };

            _cIDbContext.User.Add(user);
            await _cIDbContext.SaveChangesAsync();

            return new UserResponseModel()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                EmailAddress = user.EmailAddress,
                UserType = user.UserType,
                UserImage = user.UserImage
            };
        }

        public async Task<UserResponseModel> UpdateUser(UpdateUserRequest request)
        {
            var user = await _cIDbContext.User.FirstOrDefaultAsync(u => u.Id == request.Id && !u.IsDeleted);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            // Check if email is being changed and if it already exists
            if (user.EmailAddress != request.EmailAddress)
            {
                var existingUser = await _cIDbContext.User.FirstOrDefaultAsync(u => u.EmailAddress == request.EmailAddress && !u.IsDeleted && u.Id != request.Id);
                if (existingUser != null)
                {
                    throw new Exception("User with this email already exists");
                }
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.PhoneNumber = request.PhoneNumber;
            user.EmailAddress = request.EmailAddress;
            user.UserType = request.UserType;
            user.UserImage = request.UserImage;
            user.ModifiedDate = DateTime.UtcNow;

            _cIDbContext.User.Update(user);
            await _cIDbContext.SaveChangesAsync();

            return new UserResponseModel()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                EmailAddress = user.EmailAddress,
                UserType = user.UserType,
                UserImage = user.UserImage
            };
        }
    }
}