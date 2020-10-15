<template>
  <div>
    <el-form
      :model="formData"
      ref="ruleForm"
      :rules="formRules"
      label-position="top"
      inline>
      <nf-form-wrap title="基础信息" :show-footer="false">
        <el-form-item label="报表名称：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入报表名称"></el-input>
        </el-form-item>
        <el-form-item label="数据源：" prop="source">
          <nf-select
            placeholder="请选择报表数据源"
            :options="dataSourceList"
            :value.sync="formData.source"
            @change="getDataSourceConfig(1)">
          </nf-select>
        </el-form-item>
        <el-form-item label="报表类型：" prop="config.display_type">
          <nf-select
            placeholder="请报表类型"
            :filterable="false"
            :options="dataSourceConfig.display_type"
            :value.sync="formData.config.display_type">
          </nf-select>
        </el-form-item>
        <el-form-item label="可见性：">
          <el-radio v-model="formData.visibility" label="public">公开</el-radio>
          <el-radio v-model="formData.visibility" label="private">私有</el-radio>
        </el-form-item>
        <div class="share-box" v-if="formData.visibility === 'private'">
          <div class="department">
            <label class="label">指定部门：</label>
            <el-tag
              v-for="(item, index) in defaultDepartment"
              :key="index"
              closable
              @close="deleteDepartment(index)">
              {{item.name}}
            </el-tag>
            <el-button type="primary" size="mini" @click="dialogDepartment = true">选择部门</el-button>
          </div>
          <div class="member">
            <label class="label">指定员工：</label>
            <el-tag
              v-for="(item, index) in defaultMember"
              :key="index"
              closable
              @close="deleteMember(index)">
              {{item.name}}
            </el-tag>
            <el-button type="primary" size="mini" @click="dialogMember = true">选择员工</el-button>
          </div>
        </div>
      </nf-form-wrap>
      <nf-form-wrap title="显示配置" :show-footer="false" v-if="configDone">
        <!-- list 表格形式 -->
        <list
          ref="list_type"
          v-if="formData.config.display_type === 'list'"
          :is-switch="isSwitch"
          :formData="formData"
          :lastSource="theLastSource"
          :dataSourceConfig="dataSourceConfig">
        </list>
        <!-- pie 饼状形式 -->
        <basic-pie
          ref="basic_pie_type"
          v-if="formData.config.display_type === 'basic_pie'"
          :dataSourceConfig="dataSourceConfig">
        </basic-pie>
      </nf-form-wrap>
      <nf-form-wrap title="筛选项配置" :show-footer="false" v-if="configDone">
        <el-checkbox-group class="search-items clearfix" v-model="formData.config.config.search_items">
          <el-checkbox
            v-for="(item, index) in dataSourceConfig.search_items"
            :key="index"
            :label="item.id">
            {{item.name}}
          </el-checkbox>
        </el-checkbox-group>
      </nf-form-wrap>
      <nf-form-wrap title="数据过滤配置" :on-save-btn-click="onSaveBtnClick" v-if="configDone">
        <filter-condition ref="filterCondition" :lastSource="theLastSource" :is-switch="isSwitch" :filter-data="dataSourceConfig.search_items"></filter-condition>
      </nf-form-wrap>
    </el-form>

    <!-- 指定部门 -->
    <nf-dialog-department
      v-if="dialogDepartment"
      :multiple="true"
      :default-department="defaultDepartment"
      :dialog-department.sync="dialogDepartment"
      ref="nfDialogDepartment"
      @selectData="getSelectData"/>

    <!-- 指定人 -->
    <nf-dialog-member
      v-if="dialogMember"
      :dialog-member.sync="dialogMember"
      :select-members="defaultMember"
      @handle-click-sure="handleClickSure">
    </nf-dialog-member>
  </div>
</template>

<script>
import filterCondition from './components/filter'
import list from './components/list'
import basicPie from './components/basicPie'
export default {
  components: {
    filterCondition,
    list,
    basicPie
  },
  data() {
    return {
      isEditing: false,
      configDone: false,
      dataSourceList: [],
      dataSourceConfig: {},
      dialogDepartment: false,
      defaultDepartment: [],
      dialogMember: false,
      defaultMember: [],
      isSwitch: 0,
      cloneData: {},
      theLastSource: '',
      formData: {
        name: '',
        source: '',
        visibility: 'public',
        config: {
          display_type: '',
          config: {
            aggregation_fields: [],
            aggregation_display_fields: [],
            display_fields: [],
            search_items: [],
            condition: {}
          }
        }
      },
      shareData: {
        department: [],
        user: []
      },
      formRules: {
        name: [{ required: true, message: '请输入报表名称', trigger: 'blur'},{ min: 1, max: 30, message: '长度最多30个字符', trigger: 'blur' }],
        source: [{ required: true, message: '请选择数据源', trigger: 'change' }],
        'config.display_type': [{ required: true, message: '请选择报表展现形式', trigger: 'change' }]
      }
    }
  },
  computed: {
    targetRef() {
      return `${this.formData.config.display_type}_type`
    }
  },
  methods: {
    // 获取指定部门信息
    getSelectData(val) {
      this.defaultDepartment = val
      this.shareData.department = val.map(item => item.id)
    },
    // 获取指定员工信息
    handleClickSure(val) {
      this.defaultMember = val
      this.shareData.user = val.map(item => item.id)
    },
    deleteDepartment(index) {
      this.defaultDepartment.splice(index, 1)
      this.shareData.department = this.defaultDepartment.map(item => item.id)
    },
    deleteMember(index) {
      this.defaultMember.splice(index, 1)
      this.shareData.user = this.defaultMember.map(item => item.id)
    },
    // 判断上一个数据源名称
    lastSource() {
      let last = this.dataSourceList.filter(item => item.key !== this.formData.source)[0].key
      this.theLastSource = last
    },
    // 获取配置项
    getDataSourceConfig(type) {
      if (!this.formData.source) return
      this.lastSource()
      let apiUrl = `${api.customChart}/data_source/${this.formData.source}/config`
      $get(apiUrl).then(res => {
        this.configDone = true
        this.dataSourceConfig = res
        if(type) {
          // 切换数据源来的
          this.formData.config = {
            display_type: '',
            config: {
              aggregation_fields: [],
              aggregation_display_fields: [],
              display_fields: [],
              search_items: [],
              condition: {}
            }
          }
          this.isSwitch ++
        }
        // TODO: 处理search_items  type  option
        let condition = _.cloneDeep(this.formData.config.config.condition)
        _.forIn(condition, (value, key) => {
          let searchItem = _.find(this.dataSourceConfig.search_items, item => item.id === key)
          if (searchItem.type === 'auto_complete') {
            this.$set(searchItem, 'options', [value])
            condition[key] = value
          } else if (searchItem.type === 'select') {
            condition[key] = value
          } else if (searchItem.type === 'date_range') {
            condition[key] = [value.value.start, value.value.end]
          } else if (searchItem.type === 'text') {
            condition[key] = value.value
          }
        })
        this.$nextTick(() => {
          this.$refs.filterCondition.formData = condition
          if (!this.isEditing) {
            this.formData.config.display_type = 'list'
          }
        })
      })
    },
    getDetail(id) {
      $get(`${api.customChart}/${id}`).then(res => {
        this.configDone = true
        this.formData = res.chart
        this.$set(this.cloneData, `cloneData_${this.formData.source}`, _.cloneDeep(this.formData))
        let sharing = res.sharing
        if (!_.isEmpty(sharing)) {
          if (sharing.department) {
            this.shareData.department = sharing.department
            this.defaultDepartment = sharing.department_display
          }
          if (sharing.user) {
            this.shareData.user = sharing.user
            this.defaultMember = sharing.user_display
          }
        }
        let config = res.chart.config.config
        this.getDataSourceConfig()
        this.$nextTick(() => {
          this.$refs[this.targetRef].initFieldConfig(config)
        })
      })
    },
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let fieldConfig = this.$refs[this.targetRef].getFieldConfig()
          if (!fieldConfig) return
          let searchItems = {
            search_items: this.formData.config.config.search_items
          }
          let condition = {
            condition: this.$refs['filterCondition'].getCondition()
          }
          let chartData = {
            name: this.formData.name,
            source: this.formData.source,
            visibility: this.formData.visibility,
            config: {
              display_type: this.formData.config.display_type,
              config: {}
            }
          }
          let configConfig = Object.assign({}, fieldConfig, searchItems, condition)
          chartData.config.config = configConfig
          let params = {
            chart: chartData,
            sharing: chartData.visibility === 'private' ? this.shareData : {}
          }
          loading(true)
          if (this.isEditing) {
            let apiUrl = `${api.customChart}/${this.edit_id}`
            $put(apiUrl, params).then(() =>{
              loading(false)
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.customChart, params).then(() =>{
              loading(false)
              this.$message.success('添加成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          }
        } else {
          return false;
        }
      })
    }
  },
  async created() {
    // 获取数据源
    this.dataSourceList = await $get(api.customChartDataSource)
    this.edit_id = this.$route.query.id
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      // 获取详情
      this.getDetail(this.edit_id)
    }
  }
}
</script>

<style lang="scss" scoped>
.nf-form-wrap /deep/ {
  .el-checkbox{
    min-width: 120px;
  }
}
.search-items{
  .el-checkbox{
    display: inline-block;
    margin-bottom: 15px;
  }
}
.search-items /deep/ .el-checkbox .el-checkbox__label {
  width: 120px;
  word-break: break-all;
  white-space: normal!important;
  display: inline-block;
  vertical-align: middle;
}
.department{
  margin-bottom: 15px;
}
.department, .member{
  .label{
    display: inline-block;
    margin-right: 10px;
  }
  .el-tag{
    margin-right: 20px;
    margin-bottom: 15px;
  }
}
</style>
