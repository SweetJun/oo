<template>
  <nf-dialog
    title="添加内部里程"
    :dialog-visible.sync="dialogMileage"
    width="600px"
    @close="dialogClose"
    :click-sure-btn="clickSureBtn">
    <div class="nf-dialog-content" slot="content">
      <el-form :model="formData" :rules="formRules" inline ref="formData" label-position="top">
        <el-form-item label="出发地：" prop="from">
          <nf-select
            placeholder="请选择出发地"
            value-key="key"
            search-key="region_no_province_from"
            :value.sync="formData.from"
            :options="fromMileage">
          </nf-select>
        </el-form-item>
        <el-form-item label="目的地：" prop="to">
          <nf-select
            placeholder="请选择目的地"
            value-key="key"
            search-key="region_no_province_to"
            :value.sync="formData.to"
            :options="toMileage">
          </nf-select>
        </el-form-item>
        <div class="reverse">
          <el-checkbox v-model="formData.reverse">去程返程一样</el-checkbox>
        </div>
        <el-form-item label="里程数" prop="mileage">
          <el-input v-model="formData.mileage" placeholder="请输入里程数">
            <template slot="append">KM</template>
          </el-input>
        </el-form-item>
        <el-form-item label="适用行驶类型" prop="carry_type">
          <nf-select
            placeholder="请选择适用行驶类型"
            :options="carryTypeList"
            :value.sync="formData.carry_type">
          </nf-select>
        </el-form-item>
      </el-form>
    </div>
  </nf-dialog>
</template>

<script>
/**
 * @Description: 快捷添加内部里程
 * @Author: wjw
 * @Date: 2020-04-14 10:19:33
 */
export default {
  name: 'nfQuickMileage',
  props: {
    dialogMileage: {
      type: Boolean,
      default: false
    },
    fromMileage: {
      type: Array,
      default: () => []
    },
    toMileage: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      // 行驶类型
      carryTypeList: [
        {key: 'no_limit', value: '不限'},
        {key: 'heavy', value: '重驶'},
        {key: 'empty', value: '空驶'}
      ],
      formData: {
        from: '',
        to: '',
        from_region_id: '',
        to_region_id: '',
        reverse: true,
        carry_type: 'heavy',
        mileage: ''
      },
      formRules: {
        from: [{ required: true, message: '请选择出发地', trigger: 'blur'}],
        to: [{ required: true, message: '请选择目的地', trigger: 'blur'}],
        carry_type: [{ required: true, message: '请选择行驶类型', trigger: 'blur'}],
        mileage: [{ required: true, validator: this.$valid.isFloatNumber(true, '请输入里程数'), trigger: 'blur' }]
      }
    }
  },
  watch: {
    'dialogMileage'(val) {
      if (val) {
        if (this.fromMileage.length > 0) {
          this.formData.from = this.fromMileage[0]
        }
        if (this.toMileage.length > 0) {
          this.formData.to = this.toMileage[0]
        }
      }
    }
  },
  methods: {
    // 确认添加内部里程
    clickSureBtn(loading) {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          loading(false)
          let params = {
            from_region_id: this.formData.from.key,
            to_region_id: this.formData.to.key,
            reverse: this.formData.reverse,
            carry_type: this.formData.carry_type,
            mileage: this.formData.mileage
          }
          $post(api.mileage, params).then(() =>{
            this.$message.success('添加成功')
            loading(false)
            this.dialogClose()
            this.$emit('success', this.formData)
          }).catch(() => {
            loading(false)
          })
        } else {
          return false
        }
      })
    },
    // 弹框关闭事件
    dialogClose() {
      this.dialogMileage = false
      this.$emit('update:dialogMileage', false)
    }
  }
}
</script>

<style scoped>
  .reverse{
    margin-top: -5px;
    margin-bottom: 20px;
  }
</style>
