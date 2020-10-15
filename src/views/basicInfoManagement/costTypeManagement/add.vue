<template>
  <div>
    <nf-form-wrap title="费用类型管理" :on-save-btn-click="onSaveBtnClick" :is-loading="btnLoading">
      <el-form class="box_260" :model="ruleForm" ref="ruleForm" :rules="rules" label-position="top">
        <el-form-item label="费用名称：" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入费用名称"></el-input>
          <el-checkbox v-model="ruleForm.driver_enable" style="margin-left:20px;">驾驶员端可见</el-checkbox>
        </el-form-item>
        <el-form-item label="所属类目：" prop="expense_category_id">
          <el-select v-model="ruleForm.expense_category_id" placeholder="请选择所属类目" @change="change">
            <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认支付方式：" prop="payment_mode">
          <el-radio v-model="ruleForm.payment_mode" label="bank_card">银行卡转账</el-radio>
          <el-radio v-model="ruleForm.payment_mode" label="oil_card">加油卡</el-radio>
          <el-radio v-model="ruleForm.payment_mode" label="wjy">万金油</el-radio>
          <el-radio v-model="ruleForm.payment_mode" label="default">其他</el-radio>
        </el-form-item>
      </el-form>
    </nf-form-wrap>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btnLoading: false,
      categoryOptions: [],
      ruleForm: {
        name: '',
        expense_category_id: '',
        driver_enable: false,
        scene_ids: [],
        payment_mode: 'bank_card'
      },
      rules: {
        name: [{
          required: true,
          message: '请输入费用名称',
          trigger: 'blur'
        }],
        expense_category_id: [{
          required: true,
          message: '请选择所属类目',
          trigger: 'change'
        }],
        payment_mode: [{
          required: true,
          message: '请选择默认支付方式',
          trigger: 'change'
        }]
      },
      edit_id: '',
      isEditing: false
    }
  },
  created() {
    // 获取所属类目
    this.getExpenseCategory();

    this.edit_id = this.$route.query.id;
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      // 获取详情
      this.getDetail(this.edit_id)
    }
  },
  methods: {
    getDetail(id) {
      $get(`${api.expense}/${id}`).then(res => {
        this.ruleForm = res;
      })
    },
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true);
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.expense}/${this.edit_id}`
            $put(apiUrl, this.ruleForm).then(() =>{
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false);
            })
          } else {
            $post(api.expense, this.ruleForm).then(() =>{
              this.$message.success('添加成功')
              this.$router.back()
            }).catch(() => {
              loading(false);
            })
          }
        } else {
          return false;
        }
      })
    },
    // 获取所属类目
    async getExpenseCategory() {
      this.categoryOptions = await $get(api.expense_category_options, {all: 1});
    }
  }
}

</script>

<style lang="scss" scoped>
  .box_260{
    /deep/ .el-form-item__label{
      height: 20px;
      line-height: 20px;
      padding: 0 0 7px!important;
      box-sizing: content-box;
    }
    /deep/ .el-input{
      width: 260px;
    }
  }
</style>
