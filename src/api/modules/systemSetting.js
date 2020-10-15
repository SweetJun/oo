// 系统设置

const api = process.env.VUE_APP_API

export default {
  users: api + '/users', // 获取账户列表
  user: api + '/user', // 账户设置、详情
  roles: api + '/roles', // 角色下拉

  role: api + '/role', // 角色管理添加
  userDataPrivilege: api + '/user_data_privilege', // 数据权限
  privilegesCandidate: api + '/privileges/candidate', // 获取所有权限

  transportTypes: api + '/transport_types', // 承运类型列表
  transportType: api + '/transport_type', // 承运类型操作
  transportTypeStatus: api + '/transport_type/status', // 启用/禁用

  departmentUsers: api + '/department/users', // 组织架构
  departmentUsersAdd: api + '/department/user/add', // 部门添加人员
  departmentUsersDelete: api + '/department/user/delete', // 删除部门人员
  departmentDeleteCheck: api + '/department/delete_check', // 删除部门验证
  department: api + '/department', // 添加、编辑、删除部门

  wjyCompany: api + '/wjy_company', // 列表、绑定，解绑
  getWjyCompanyName: api + '/get_wjy_company_name', // 获取万金油企业名称

  systemSettingGet: api + '/system_setting/get', // 获取系统设置
  systemSettingSet: api + '/system_setting/set' // 保存系统设置
}
