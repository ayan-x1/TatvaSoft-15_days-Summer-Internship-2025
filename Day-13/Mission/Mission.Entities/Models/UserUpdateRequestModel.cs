using System.ComponentModel.DataAnnotations;

namespace Mission.Entities.Models
{
    public class UserUpdateRequestModel
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [StringLength(15)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string EmailAddress { get; set; } = string.Empty;

        public string? ProfileImage { get; set; }
        public bool RemoveImage { get; set; }
        public int Id { get; set; }
    }
}