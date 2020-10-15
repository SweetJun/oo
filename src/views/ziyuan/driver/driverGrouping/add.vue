<template>
  <div>
    <nf-form-wrap title="驾驶员分组设置" :on-save-btn-click="onSaveBtnClick">
      <el-form
        :model="formData"
        ref="ruleForm"
        :rules="formRules"
        label-position="top">
        <el-form-item label="分组名称：" prop="name"  style="width: 280px">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="选择驾驶员：" prop="driver_ids">
          <el-transfer
            filterable
            filter-placeholder="请输入驾驶员名称"
            :props="{key: 'id', label: 'name'}"
            :titles="['待选列表', '已选列表']"
            v-model="formData.driver_ids"
            :data="driverList">
          </el-transfer>
        </el-form-item>
      </el-form>
    </nf-form-wrap>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEditing: false,
      formData: {
        name: '',
        driver_ids: []
      },
      formRules: {
        name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
      },
      driverList: []
    }
  },
  methods: {
    // 获取驾驶员下拉列表
    getDriverOptions() {
      $get(api.driverOptions, {type: 'own'}).then(res => {
        this.driverList = res
      })
    },
    // 编辑时获取详情信息
    getDetail(id) {
      $get(`${api.driverGroup}/${id}`).then(res => {
        this.formData = res
      })
    },
    // 保存提交
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true)
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.driverGroup}/${this.edit_id}`
            $put(apiUrl, this.formData).then(() =>{
              loading(false)
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.driverGroup, this.formData).then(() =>{
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
  created() {
    this.getDriverOptions()
    this.edit_id = this.$route.query.id
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      // 获取详情
      this.getDetail(this.edit_id)
    }
  }
}
</script>
