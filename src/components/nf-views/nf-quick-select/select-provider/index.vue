<template>
  <nf-dialog
    title="添加承运方"
    :dialog-visible.sync="dialogProvider"
    width="400px"
    @close="dialogClose"
    :click-sure-btn="clickSureBtn">
    <div class="nf-dialog-content" slot="content">
      <el-form :model="formData" :rules="rules" ref="formData" label-position="top">
        <el-form-item label="请选择承运方：" prop="provider_id">
          <el-select
            v-model="formData.provider_id"
            filterable
            clearable
            remote
            reserve-keyword
            :loading="loading"
            placeholder="请输入承运方"
            :remote-method="getProvider">
            <el-option
              v-for="item in providerOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </nf-dialog>
</template>

<script>
// 快捷选择弹框
export default {
  name: 'nfQuickSelect',
  props: {
    storeModelName: {
      type: String,
      default: ''
    },
    dialogProvider: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      providerOptions: [],
      formData: {
        provider_id: ''
      },
      rules: {
        provider_id: [{ required: true, message: '请选择承运方', trigger: 'change'}]
      }
    }
  },
  methods: {
    // 获取承运方
    getProvider(query) {
      if (query !== '') {
        this.loading = true
        $get(`${api.searchItemAutocomplete}/provider_name`, {keyword: query}).then(res => {
          this.providerOptions = res
          this.loading = false
        })
      } else {
        this.providerOptions = []
      }
    },
    // 添加承运方
    clickSureBtn(loading) {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          loading(true)
          $post(api.providerRuleSet, this.formData).then(() =>{
            loading(false)
            this.dialogProvider = false
            this.$emit('update:dialogProvider', false)
            this.$message.success('添加成功')
            this.$store.dispatch('pageData/getTableData', this.storeModelName)
          }).catch(() => {
            loading(false)
          })
        } else {
          return false;
        }
      })
    },
    // 弹框关闭事件
    dialogClose() {
      this.dialogProvider = false
      this.$emit('update:dialogProvider', false)
    }
  }
}
</script>

<style scoped>
  .el-select{
    display: block;
  }
</style>
