using Mission.Entities;
using Mission.Entities.Models;
using Mission.Repositories.IRepositories;
using Mission.Services.IServices;

namespace Mission.Services.Services
{
    public class MissionService : IMissionService
    {
        private readonly IMissionRepository _missionRepository;
        private readonly IMissionSkillRepository _missionSkillRepository;

        public MissionService(IMissionRepository missionRepository, IMissionSkillRepository missionSkillRepository)
        {
            _missionRepository = missionRepository;
            _missionSkillRepository = missionSkillRepository;
        }
        public async Task<bool> AddMission(MissionRequestViewModel model)
        {
            var mission = new Entities.Missions()
            {
                CityId = model.CityId,
                CountryId = model.CountryId,
                EndDate = model.EndDate,
                MissionDescription = model.MissionDescription,
                MissionImages = model.MissionImages,
                MissionSkillId = model.MissionSkillId,
                MissionThemeId = model.MissionThemeId,
                MissionTitle = model.MissionTitle,
                StartDate = model.StartDate,
                TotalSheets = model.TotalSeats,
            };
            return await _missionRepository.AddMission(mission);
        }

        public async Task<bool> UpdateMission(MissionRequestViewModel model)
        {
            var mission = new Entities.Missions()
            {
                Id = model.Id,
                CityId = model.CityId,
                CountryId = model.CountryId,
                EndDate = model.EndDate,
                MissionDescription = model.MissionDescription,
                MissionImages = model.MissionImages,
                MissionSkillId = model.MissionSkillId,
                MissionThemeId = model.MissionThemeId,
                MissionTitle = model.MissionTitle,
                StartDate = model.StartDate,
                TotalSheets = model.TotalSeats,
            };

            return await _missionRepository.UpdateMission(mission);
        }

        public async Task<bool> DeleteMission(int id)
        {
            return await _missionRepository.DeleteMission(id);
        }

        public Task<List<MissionRequestViewModel>> GetAllMissionAsync()
        {
            return _missionRepository.GetAllMissionAsync();
        }

        public Task<MissionRequestViewModel?> GetMissionById(int id)
        {
            return _missionRepository.GetMissionById(id);
        }

        public async Task<IList<MissionDetailResponseModel>> ClientSideMissionList()
        {
            var missions = await _missionRepository.ClientSideMissionList();
            return MapToResponseModel(missions, 0); // 0 for no user filtering
        }

        public async Task<IList<MissionDetailResponseModel>> ClientSideMissionList(int userId)
        {
            var missions = await _missionRepository.ClientSideMissionList();
            return MapToResponseModel(missions, userId);
        }

        private List<MissionDetailResponseModel> MapToResponseModel(IList<Missions> missions, int userId)
        {
            return missions.Select(m => new MissionDetailResponseModel
            {
                Id = m.Id,
                MissionTitle = m.MissionTitle,
                MissionDescription = m.MissionDescription,
                MissionImages = m.MissionImages,
                StartDate = m.StartDate,
                EndDate = m.EndDate,
                TotalSheets = m.TotalSheets,
                RegistrationDeadLine = m.RegistrationDeadLine,
                CityId = m.CityId,
                CityName = m.City?.CityName,
                CountryId = m.CountryId,
                CountryName = m.Country?.CountryName,
                MissionSkillId = int.Parse(m.MissionSkillId),  // if you're sure it's a valid number
                MissionSkillName = _missionSkillRepository.GetMissionSkills(m.MissionSkillId),
                MissionThemeId = m.MissionThemeId,
                MissionThemeName = m.MissionTheme?.ThemeName,
                IsApplied = userId > 0 && (m.MissionApplications?.Any(ma => ma.UserId == userId && !ma.IsDeleted) ?? false)
            }).ToList();
        }

        // Mission application methods
        public async Task<bool> ApplyMission(AddMissionApplicationRequestModel model)
        {
            if (model is null) return false;
            return await _missionRepository.ApplyMission(model);
        }

        public List<MissionApplication> GetMissionApplicationList()
        {
            return _missionRepository.GetMissionApplicationList();
        }

        public async Task<bool> MissionApplicationApprove(UpdateMissionApplicationModel missionApplication)
        {
            if (missionApplication is null) return false;
            return await _missionRepository.MissionApplicationApprove(missionApplication);
        }

        public async Task<bool> DeleteMissionApplication(int applicationId)
        {
            if (applicationId <= 0) return false;
            return await _missionRepository.DeleteMissionApplication(applicationId);
        }
    }
}