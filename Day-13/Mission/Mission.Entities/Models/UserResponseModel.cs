namespace Mission.Entities.Models
{
    public class UserResponseModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? UserType { get; set; }
        public string? ProfileImagePath { get; set; }
    }
}