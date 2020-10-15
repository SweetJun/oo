# OO运车

#### 介绍


#### 目录结构
```code
├── node_modules        // 项目依赖包文件夹
├── public              // public中的静态资源会被复制输出到目录(dist)中
│   └── index.html      // 项目入口文件
│   └── favicon.ico     // 网页图标
├── src                 // 项目源码
│   ├── api             // 与后端交互使用的api方法和数据处理
│   ├── assets          // 放置一些静态资源
│   │       └── styles  // 样式资源
│   │       └── images  // 图片资源
│   ├── components      // 全局的公共组件
│   ├── directives      // 全局的指令
│   ├── mixins          // 全局的mixins混入功能
│   ├── router          // vue-router相关配置
│   │   ├── modules     // 功能模块路由
│   │   ├── index.js    // 路由的配置
│   ├── store           // vuex相关配置
│   │   ├── modules     // 功能模块状态管理
│   │   ├── index.js    // 我们组装模块并导出 store 的地方
│   │  
│   ├── views           // 存在vue页面组件的文件夹
│   ├── utils           // 工具方法目录
│   │   └── pageType    // 导入、导出、权限、搜索的关键词(type)
│   │   └── global.js   // 全局的一些方法，可以通过this.xxx调用
│   │   └── transformSearchData.js   // 接口适配器（搜索数据的对前后端适用的转换）
│   │   └── validation.js
│   │   └── vueMenus.js
├── .eslintrc.js  // eslint配置的规则
├── .gititnore  // 配置不提交git仓库的文件
├── .babel.config.js  
└── vue.config.js  // 详细见https://cli.vuejs.org/zh/config/#vue-config-js 
```

#### 安装教程

1. yarn install

#### 使用说明

1. yarn serve
2. yarn build 


