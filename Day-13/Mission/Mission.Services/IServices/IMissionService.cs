﻿using Mission.Entities.Models;
using Mission.Entities;

namespace Mission.Services.IServices
{
    public interface IMissionService
    {
        Task<List<MissionRequestViewModel>> GetAllMissionAsync();
        Task<MissionRequestViewModel?> GetMissionById(int id);
        Task<bool> AddMission(MissionRequestViewModel model);
        Task<IList<MissionDetailResponseModel>> ClientSideMissionList(int userId);
        Task<List<MissionApplicationListViewModel>> GetMissionApplicationListWithDetails();
        Task<bool> ApplyMission(AddMissionApplicationRequestModel model);
        List<MissionApplication> GetMissionApplicationList();
        Task<bool> MissionApplicationApprove(UpdateMissionApplicationModel missionApplication);
        Task<bool> DeleteMissionApplication(int applicationId);
    }
}
