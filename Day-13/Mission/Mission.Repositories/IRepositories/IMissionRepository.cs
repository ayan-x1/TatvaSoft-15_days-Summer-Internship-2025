using Mission.Entities;
using Mission.Entities.Models;

namespace Mission.Repositories.IRepositories
{
    public interface IMissionRepository
    {
        Task<List<MissionRequestViewModel>> GetAllMissionAsync();
        Task<MissionRequestViewModel?> GetMissionById(int id);
        Task<bool> AddMission(Missions mission);
        Task<IList<Missions>> ClientSideMissionList();

        Task<bool> ApplyMission(AddMissionApplicationRequestModel model);
        Task<List<MissionApplicationListViewModel>> GetMissionApplicationListWithDetails();

        List<MissionApplication> GetMissionApplicationList();
        Task<bool> MissionApplicationApprove(UpdateMissionApplicationModel missionApplication);
        Task<bool> DeleteMissionApplication(int applicationId);

        // Ensure no abstract methods are added dynamically during runtime
        // If new methods are required, restart the application after adding them
    }
}
