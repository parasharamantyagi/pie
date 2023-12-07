const api = "http://localhost:7000";
// const api = 'http://54.202.120.56:7000';

module.exports = {
  API_BASE_URL: api,
  LOGIN_API_URL: api + "/api/auth/authenticate",
  PROJECTS_YEARS_API_URL: api + "/api/projects-years",
  FT_SEARCH_API_URL: api + "/api/ft-search",
  ORGANIZATION_DASHBOARD_API_URL: api + "/api/organizations-dashboard",
  ORGANIZATION_SELECT_API_URL: api + "/api/organizations/?format=select",
  ORGANIZATION_PROJECT_STATUS_API_URL: api + "/api/orgnization-project-status/",
  ORGANIZATION_PROJECT_ACTION_STATUS_API_URL: api + "/api/orgnization-project-action-status/",
  ORGANIZATION_PROJECT_ACTION_NEW_VS_CLOSE_API_URL: api + "/api/orgnization-project-action-new-vs-close/",
  ORGANIZATION_ACTION_PERSONS_API_URL: api + "/api/organization-action-persons/",
  MIND_MAPS_LIST_API_URL: api + "/api/orgnization-project-status/",
  PROJECTS_FILTERED_API_URL: api + "/api/projects-filtered",
};
