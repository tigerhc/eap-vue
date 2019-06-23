const getters = {
  sidebar: state => state.app.sidebar,
  project: state => state.app.project,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  dicts: state => state.dict.dicts,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  fetchRoutes: state => state.permission.fetchRoutes,
  meunRouter: state => state.permission.meunRouter,
  permissions: state => state.permission.permissions,
  errorLogs: state => state.errorLog.logs
}
export default getters
