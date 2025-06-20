using System;

namespace Mission.Entities.Models
{
    public class MissionApplicationListViewModel
    {
        public int Id { get; set; }
        public int MissionId { get; set; }
        public string MissionTitle { get; set; }
        public string MissionThemeName { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public DateTime AppliedDate { get; set; }
        public bool Status { get; set; }
        public int Seats { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}