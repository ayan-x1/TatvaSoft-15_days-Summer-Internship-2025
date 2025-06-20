using Microsoft.EntityFrameworkCore;
using Mission.Entities.Context;
using Mission.Entities.Models;
using Mission.Repositories.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http; // Add this using directive to resolve IFormFile

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
                ProfileImagePath = user.Avatar // Make sure Avatar property exists in User entity
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
                    ProfileImagePath = user.Avatar
                }).ToListAsync();
        }

        public async Task<UserResponseModel> UpdateUser(UserUpdateRequestModel request)
        {
            var user = await _cIDbContext.User.FirstOrDefaultAsync(u => u.Id == request.Id && !u.IsDeleted);

            if (user == null) throw new Exception("User not found");

            // Update basic user information
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.PhoneNumber = request.PhoneNumber;
            user.EmailAddress = request.EmailAddress;
            user.ModifiedDate = DateTime.UtcNow;

            // Handle profile image
            if (request.RemoveImage)
            {
                // Remove existing image if requested
                if (!string.IsNullOrEmpty(user.Avatar))
                {
                    DeleteImageFile(user.Avatar);
                    user.Avatar = null;
                }
            }
            else if (request.ProfileImage != null && request.ProfileImage.Length > 0)
            {
                // Remove old image if exists
                if (!string.IsNullOrEmpty(user.Avatar))
                {
                    DeleteImageFile(user.Avatar);
                }

                // Save new image
                user.Avatar = await SaveImageFile(request.ProfileImage, request.Id);
            }

            _cIDbContext.User.Update(user);
            await _cIDbContext.SaveChangesAsync();

            return new UserResponseModel()
            {
                EmailAddress = user.EmailAddress,
                FirstName = user.FirstName,
                Id = user.Id,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                UserType = user.UserType,
                ProfileImagePath = user.Avatar
            };
        }

        private async Task<string?> SaveImageFile(string profileImage, int id)
        {
            throw new NotImplementedException();
        }

        private async Task<string> SaveImageFile(Microsoft.AspNetCore.Http.IFormFile imageFile, int userId)
        {
            try
            {
                // Create directory if it doesn't exist
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles");
                Directory.CreateDirectory(uploadsFolder);

                // Generate unique filename
                var fileExtension = Path.GetExtension(imageFile.FileName);
                var fileName = $"profile_{userId}_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp" };
                if (!allowedExtensions.Contains(fileExtension.ToLower()))
                {
                    throw new Exception("Invalid file type. Only image files are allowed.");
                }

                // Validate file size (5MB limit)
                if (imageFile.Length > 5 * 1024 * 1024)
                {
                    throw new Exception("File size cannot exceed 5MB.");
                }

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                // Return relative path
                return $"/uploads/profiles/{fileName}";
            }
            catch (Exception ex)
            {
                throw new Exception($"Error saving image: {ex.Message}");
            }
        }

        private void DeleteImageFile(string imagePath)
        {
            try
            {
                if (!string.IsNullOrEmpty(imagePath))
                {
                    var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imagePath.TrimStart('/'));
                    if (File.Exists(fullPath))
                    {
                        File.Delete(fullPath);
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error but don't throw - this shouldn't stop the update process
                Console.WriteLine($"Error deleting image file: {ex.Message}");
            }
        }
    }
}