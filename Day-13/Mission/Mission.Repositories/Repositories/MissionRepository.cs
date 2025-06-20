using Microsoft.EntityFrameworkCore;
using Mission.Entities;
using Mission.Entities.Context;
using Mission.Entities.Models;
using Mission.Repositories.IRepositories;

namespace Mission.Repositories.Repositories
{
    public class MissionRepository(MissionDbContext dbContext) : IMissionRepository
    {
        private readonly MissionDbContext _dbContext = dbContext;

        public async Task<List<MissionApplicationListViewModel>> GetMissionApplicationListWithDetails()
        {
            return await _dbContext.MissionApplications
                .Include(ma => ma.Mission)
                    .ThenInclude(m => m.MissionTheme)
                .Include(ma => ma.User) // Assuming you have a User navigation property
                .Where(ma => !ma.IsDeleted)
                .Select(ma => new MissionApplicationListViewModel
                {
                    Id = ma.Id,
                    MissionId = ma.MissionId,
                    MissionTitle = ma.Mission.MissionTitle,
                    MissionThemeName = ma.Mission.MissionTheme.ThemeName,
                    UserId = ma.UserId,
                    UserName = ma.User.FirstName + " " + ma.User.LastName, // Adjust based on your User model
                    AppliedDate = ma.AppliedDate,
                    Status = ma.Status,
                    Seats = ma.Seats,
                    CreatedDate = (DateTime)ma.CreatedDate
                })
                .OrderByDescending(ma => ma.CreatedDate)
                .ToListAsync();
        }

        public async Task<bool> DeleteMissionApplication(int applicationId)
        {
            try
            {
                var application = await _dbContext.MissionApplications
                    .FirstOrDefaultAsync(x => x.Id == applicationId && !x.IsDeleted);

                if (application == null)
                    throw new Exception("Mission application not found");

                // Soft delete - mark as deleted
                application.IsDeleted = true;
                application.ModifiedDate = DateTime.Now;

                // Optional: Restore the seats back to the mission
                var mission = await _dbContext.Missions.FirstOrDefaultAsync(m => m.Id == application.MissionId);
                if (mission != null)
                {
                    mission.TotalSheets += application.Seats;
                    _dbContext.Missions.Update(mission);
                }

                _dbContext.MissionApplications.Update(application);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public Task<List<MissionRequestViewModel>> GetAllMissionAsync()
        {
            return _dbContext.Missions.Select(m => new MissionRequestViewModel()
            {
                Id = m.Id,
                CityId = m.CityId,
                CountryId = m.CountryId,
                EndDate = m.EndDate,
                MissionDescription = m.MissionDescription,
                MissionImages = m.MissionImages,
                MissionSkillId = m.MissionSkillId,
                MissionThemeId = m.MissionThemeId,
                MissionTitle = m.MissionTitle,
                StartDate = m.StartDate,
                TotalSeats = m.TotalSheets ?? 0,
            }).ToListAsync();
        }

        public async Task<MissionRequestViewModel?> GetMissionById(int id)
        {
            return await _dbContext.Missions.Where(m => m.Id == id).Select(m => new MissionRequestViewModel()
            {
                Id = m.Id,
                CityId = m.CityId,
                CountryId = m.CountryId,
                EndDate = m.EndDate,
                MissionDescription = m.MissionDescription,
                MissionImages = m.MissionImages,
                MissionSkillId = m.MissionSkillId,
                MissionThemeId = m.MissionThemeId,
                MissionTitle = m.MissionTitle,
                StartDate = m.StartDate,
                TotalSeats = m.TotalSheets ?? 0,
            }).FirstOrDefaultAsync();
        }

        public async Task<bool> AddMission(Missions model)
        {
            try
            {
                var isExist = dbContext.Missions.Where(x =>
                            x.MissionTitle == model.MissionTitle
                            && x.StartDate == model.StartDate
                            && x.EndDate == model.EndDate
                            && x.CityId == model.CityId
                            && !x.IsDeleted
                        ).FirstOrDefault();

                if (isExist != null) throw new Exception("Mission already exist!");

                Missions missions = new Missions()
                {
                    MissionTitle = model.MissionTitle,
                    MissionDescription = model.MissionDescription,
                    MissionImages = model.MissionImages,
                    StartDate = model.StartDate,
                    EndDate = model.EndDate,
                    CountryId = model.CountryId,
                    CityId = model.CityId,
                    TotalSheets = model.TotalSheets,
                    MissionThemeId = model.MissionThemeId,
                    MissionSkillId = model.MissionSkillId,


                    IsDeleted = false,
                    CreatedDate = DateTime.Now,
                };
                await dbContext.Missions.AddAsync(missions);
                dbContext.SaveChanges();

                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
            
        }

        // int userId
        public async Task<IList<Missions>> ClientSideMissionList()
        {
            return await _dbContext.Missions
                .Include(m => m.City)
                .Include(m => m.Country)
               .Include(m => m.MissionTheme)
               .Include(m => m.MissionApplications)
                .Where(m => !m.IsDeleted)
                .OrderBy(m => m.CreatedDate)
                .ToListAsync();
        }

        public async Task<bool> ApplyMission(AddMissionApplicationRequestModel model)
        {
            try
            {
                var mission = _dbContext.Missions.Where(x => x.Id == model.MissionId).FirstOrDefault();

                if (mission == null) throw new Exception("Mission not found");

                var application = _dbContext.MissionApplications.Where(x => x.MissionId == model.MissionId && x.UserId == model.UserId).FirstOrDefault();

                if (application != null) throw new Exception("Already applied!");

                MissionApplication app = new MissionApplication()
                {
                    UserId = model.UserId,
                    MissionId = model.MissionId,
                    AppliedDate = model.AppliedDate,
                    Seats = model.Sheet,
                    Status = model.Status,

                    IsDeleted = false,
                    CreatedDate = DateTime.Now,
                };

                mission.TotalSheets -= model.Sheet;

                await _dbContext.MissionApplications.AddAsync(app);
                _dbContext.Missions.Update(mission);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public List<MissionApplication> GetMissionApplicationList()
        {
            return _dbContext.MissionApplications.Where(x => !x.IsDeleted).ToList();
        }

        public async Task<bool> MissionApplicationApprove(UpdateMissionApplicationModel missionApplication)
        {
            var tMissionApp = _dbContext.MissionApplications.Where(x => x.Id == missionApplication.Id).FirstOrDefault();

            if (tMissionApp == null) throw new Exception("Mission application not found");

            tMissionApp.Status = true;
            tMissionApp.ModifiedDate = DateTime.Now;

            _dbContext.MissionApplications.Update(tMissionApp);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
