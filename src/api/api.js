/**
 * 抽离接口地址
 * 如果地址很多，可以按模块拆分modules
 */
const api = process.env.VUE_APP_API

// 导入路由模块
let apiModules = {}
const apiModuleFiles = require.context('./modules', true, /\.js$/)
apiModuleFiles.keys().forEach(item => {
  let objs = apiModuleFiles(item).default
  Object.keys(objs).forEach(key => {
    apiModules[key] = objs[key]
  })
})

export default {
  login: api + '/login', // 登录
  logout: api + '/logout', // 登录
  codePhoneNo: api + '/sms_code/phone_no', // 获取验证码
  password: api + '/password', // 设置密码
  switchCompany: api + '/switch/company', // 切换公司

  userLogin: api + '/user/login', // 获取用户信息
  menuList: api + '/menu', // 获取菜单

  fileUpload: api + '/file', // 上传文件
  downImportTemplate: api + '/import/template', // 下载导入模版
  importExcel: api + '/import', // 上传数据
  downImportExcel: api + '/import/file', // 下载用户上传的数据导入文件

  importsList: api + '/imports', // 获取数据导入对象列表
  importsProgress: api + '/imports/progress', // 导入进度

  export: api + '/export', // 发起数据导出操作
  exports: api + '/exports', // 获取数据导出对象列表
  exportFile: api + '/export/file', // 导出文件

  searchItemConfig: api + '/search_item_config', // 获取页面搜索内容
  searchItemOption: api + '/search_item/option', // 获取指定搜索项的下拉列表
  searchItemAutocomplete: api + '/search_item/autocomplete', // 获取指定搜索项的自动补全列表

  privilegesCheck: api + '/privileges/check', // 权限检测

  ...apiModules
}
