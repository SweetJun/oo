<template>
  <div>
    <el-form
      :model="config"
      ref="ruleForm"
      :rules="formRules"
      inline>
      <el-form-item label="需要聚合的字段：" prop="aggregation_field">
        <nf-select
          placeholder="请选择聚合字段"
          :props="{key: 'field', value: 'display'}"
          :options="dataSourceConfig.aggregation_fields"
          :value.sync="config.aggregation_field">
        </nf-select>
      </el-form-item>
      <el-form-item label="需要显示的字段：" prop="display_field">
        <nf-select
          placeholder="请选择显示字段"
          :props="{key: 'field', value: 'display'}"
          :options="dataSourceConfig.aggregation_display_fields"
          :value.sync="config.display_field">
        </nf-select>
      </el-form-item>
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
    }
  },
  data() {
    return {
      config: {
        aggregation_field: '',
        display_field: ''
      },
      formRules: {
        aggregation_field: [
          { required: true, message: '请选择聚合字段', trigger: 'change' }
        ],
        display_field: [
          { required: true, message: '请选择显示字段', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    initFieldConfig(config) {
      this.config.aggregation_field = config.aggregation_field
      this.config.display_field = config.display_field

    },
    getFieldConfig() {
      let result = {}
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          result = {
            aggregation_field: this.config.aggregation_field,
            display_field: this.config.display_field
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
