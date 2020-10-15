import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// 自动导入Modules/ 模块
let customModules = {}
const customModuleFiles = require.context('./modules', true, /\.js$/)
customModuleFiles.keys().forEach( key => {
  const keys = key.replace(/(\.\/|\.js)/g, '')
  const moduleName = _.last(keys.split('/'))
  customModules[moduleName] = customModuleFiles(key).default
});

// 自动导入views/Module模块
let viewModules = {}
const viewModuleFiles = require.context('../views', true, /Module.js$/)
viewModuleFiles.keys().forEach( key => {
  const keys = key.replace(/(\.\/|\.js)/g, '')
  const moduleName = _.last(keys.split('/'))
  viewModules[moduleName] = viewModuleFiles(key).default
});

const store = new Vuex.Store({
  getters,
  modules: {
    ...customModules,
    ...viewModules
  }
})

export default store
