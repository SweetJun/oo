<template>
  <div>
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :selection="false"
      :table-operation="tableOperation">
      <div class="table-top-left" slot="top-btn-left" v-if="roles['wjy_company_add']">
        <el-button
          size="medium"
          type="primary"
          @click="handleBindClick">
          绑定企业
        </el-button>
      </div>
    </nf-table-page>
    <nf-dialog
      title="绑定企业"
      :dialog-visible.sync="dialogVisible"
      width="580px"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <el-form :model="formData" :rules="formRules" ref="formData" inline label-position="top">
          <el-form-item label="APPID：" prop="app_id">
            <el-input v-model="formData.app_id" @change="getWjyCompanyName"></el-input>
          </el-form-item>
          <el-form-item label="SECRET：" prop="app_secret">
            <el-input v-model="formData.app_secret" @change="getWjyCompanyName"></el-input>
          </el-form-item>
          <el-form-item label="企业名称：" prop="name">
            <el-input v-model="formData.name" disabled></el-input>
          </el-form-item>
          <el-button type="text" class="appid-btn" @click="getAPPID">如何获取APPID？</el-button>
        </el-form>
      </div>
    </nf-dialog>
    <nf-dialog
      title="获取APPID帮助"
      :dialog-visible.sync="dialogAPPID"
      width="700px"
      cancel-btn-text="知道了">
      <div slot="content">
        <p class="step-text">
          ①打开登录万金油系统（
          <a class="wjy-link" href="https://vip.nucarf.net" target="_blank">https://vip.nucarf.net</a>
          ）
        </p>
        <p class="step-text">②菜单点击“API密钥” <span class="orange">（如果没有菜单，请联系万金油服务人员）</span></p>
        <div>
          <img src="@/assets/images/view/miyao-menu.png" alt="">
        </div>
        <p class="step-text">③在弹出框内就可以查看APPID和SECRET</p>
        <div>
          <img src="@/assets/images/view/api-miyao.png" alt="" style="width: 100%">
        </div>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'wjyAuthoriseModule',
      tableOperation: {
        width: 105,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: "取消绑定",
              type: "primary",
              isShow: scope.row.acl.can_cancel_bind,
              click: ({row}) => {
                this.unbind(row)
              }
            }
          }
        ]
      },
      dialogVisible: false,
      dialogAPPID: false,
      formData: {
        app_id: '',
        app_secret: '',
        name: ''
      },
      formRules: {
        app_id: [{ required: true, message: '请输入APPID', trigger: 'blur' }],
        app_secret: [{ required: true, message: '请输入SECRET', trigger: 'blur' }]
      }
    }
  },
  computed: {
    // 权限
    roles() {
      return this.$store.state[this.storeModelName].roles
    }
  },
  methods: {
    // 取消绑定
    unbind(row) {
      this.confirm('确认要与该企业解绑吗？').then(() => {
        $delete(`${api.wjyCompany}/${row.id}`).then(() => {
          this.$message.success('解绑成功')
          this.$store.dispatch('pageData/getTableData', this.storeModelName)
        })
      }).catch(() => {})
    },
    // 绑定企业
    handleBindClick() {
      this.dialogVisible = true
      this.formData = {
        app_id: '',
        app_secret: '',
        name: ''
      }
    },
    // 获取万金油企业名称
    getWjyCompanyName() {
      if (this.formData.app_id && this.formData.app_secret) {
        let params = {
          app_id: this.formData.app_id,
          app_secret: this.formData.app_secret
        }
        $post(api.getWjyCompanyName, params).then(res => {
          this.formData.name = res.name ? res.name : ''
        })
      }
    },
    // 确认绑定
    clickSureBtn(loading) {
      this.confirm('请确认要与该企业进行绑定。').then(() => {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            if (!this.formData.name) {
              this.$message.warning('未查询到该企业信息，请核实所填信息！')
              return false
            }
            loading(true)
            $post(api.wjyCompany, this.formData).then(() => {
              loading(false)
              this.dialogVisible = false
              this.$message.success('绑定成功')
              this.$store.dispatch('pageData/getTableData', this.storeModelName)
            })
          } else {
            return false
          }
        })
      }).catch(() => {
        loading(false)
      })
    },
    getAPPID() {
      this.dialogAPPID = true
    }
  }
}
</script>

<style lang="scss" scoped>
.appid-btn{
  margin-top: 37px;
  &/deep/{
    text-decoration: underline;
  }
}
.step-text{
  font-weight: 600;
  font-size: 16px;
}
.orange{
  color: #FF6600;
}
.wjy-link{
  color: $themeColor;
  &:hover{
    opacity: .7;
  }
}

</style>
