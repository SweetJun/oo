<template>
  <div>
    <el-form
      :model="config"
      ref="ruleForm"
      :rules="formRules"
      label-position="top"
      inline>
      <div class="classify">
        <label>聚合显示：</label>
        <el-radio-group v-model="classify">
          <el-radio :label="true" >是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </div>
      <div v-if="classify" class="field-content">
        <div class="class-field">
          <el-form-item label="需要聚合的字段：" prop="aggregation_fields" style="width: 100%">
            <el-checkbox-group class="clearfix" v-model="config.aggregation_fields">
              <el-checkbox
                v-for="(item, index) in dataSourceConfig.aggregation_fields"
                :key="index"
                :label="item.field">
                {{item.display}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div class="class-view-field">
          <el-form-item label="需要显示的字段：" prop="aggregation_display_fields" style="width: 100%">
            <el-checkbox-group class="clearfix" v-model="config.aggregation_display_fields">
              <el-checkbox
                v-for="(item, index) in dataSourceConfig.aggregation_display_fields"
                :key="index"
                :label="item.field">
                {{item.display}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </div>
      <div v-else class="field-content">
        <div class="class-view-field">
          <el-form-item label="需要显示的字段：" prop="display_fields" style="width: 100%">
            <el-checkbox-group class="clearfix" v-model="config.display_fields">
              <el-checkbox
                v-for="(item, index) in dataSourceConfig.non_aggregation_display_fields"
                :key="index"
                :label="item.field">
                {{item.display}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    dataSourceConfig: {
      type: Object,
      default: () => {}
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    isSwitch: {
      type: Number,
      default: 0
    },
    // 数据源
    lastSource: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      classify: true,
      config: {
        aggregation_fields: [],
        aggregation_display_fields: [],
        display_fields: []
      },
      formData: {},
      cloneData: {},
      formRules: {
        aggregation_fields: [
          { type: 'array', required: true, message: '请至少选择一个聚合字段', trigger: 'change' }
        ],
        aggregation_display_fields: [
          { type: 'array', required: true, message: '请至少选择一个显示字段', trigger: 'change' }
        ],
        display_fields: [
          { type: 'array', required: true, message: '请至少选择一个显示字段', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    isSwitch(val) {
      if(val) {
        this.config= {
          aggregation_fields: [],
          aggregation_display_fields: [],
          display_fields: []
        }
      }
    }
  },
  methods: {
    initFieldConfig(config) {
      this.$set(this.config, 'aggregation_display_fields', [])
      if (config.aggregation_fields) {
        this.classify = true
        this.config.aggregation_fields = config.aggregation_fields
        this.config.aggregation_display_fields = config.display_fields
        this.config.display_fields = []
      } else {
        this.classify = false
        this.$set(this.config, 'aggregation_fields', [])
        this.config.display_fields = config.display_fields
      }
    },
    getFieldConfig() {
      let result = {}
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          if (this.classify) {
            result = {
              aggregation_fields: this.config.aggregation_fields,
              display_fields: this.config.aggregation_display_fields
            }
          } else {
            result = {
              display_fields: this.config.display_fields
            }
          }
          //
          let arr = this.classify ? this.dataSourceConfig.aggregation_display_fields : this.dataSourceConfig.non_aggregation_display_fields
          let display_fields_arr = []
          arr.forEach(item => {
            result.display_fields.forEach(item1 => {
              if(item.field === item1) {
                display_fields_arr.push(item1)
              }
            })
          })
          result.display_fields = display_fields_arr
          //
          if(result.aggregation_fields) {
            let aggregation_fields_arr = []
            this.dataSourceConfig.aggregation_fields.forEach(item => {
              result.aggregation_fields.forEach(item1 => {
                if(item.field === item1) {
                  aggregation_fields_arr.push(item1)
                }
              })
            })
            result.aggregation_fields = aggregation_fields_arr
          }
        } else {
          result = false
          return false
        }
      })
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.field-content /deep/ {
  .el-form-item__content{
    line-height: 30px;
  }
}
.classify{
  margin-bottom: 20px;
  label{
    margin-right: 20px;
  }
}
.field-content /deep/ .el-checkbox .el-checkbox__label{
  width: 120px;
  word-break: break-all;
  white-space: normal!important;
  display: inline-block;
  vertical-align: middle;
}
.field-content /deep/ .el-checkbox{
  display: inline-block;
  margin-bottom: 15px;
}
</style>
