<template>
  <div>
    <nf-form-wrap title="内部里程管理" :on-save-btn-click="onSaveBtnClick" :is-loading="btnLoading">
      <el-form class="box_260" :model="ruleForm" ref="ruleForm" :rules="rules" label-position="top">
        <div class="clearfix line">
          <el-form-item label="出发地：" prop="from_region_id">
          <nf-select
            placeholder="请输入出发地"
            search-key="region_no_province_from"
            :options="options_f"
            :value.sync="ruleForm.from_region_id">
          </nf-select>
        </el-form-item>
        <el-form-item label="目的地：" prop="to_region_id">
          <nf-select
            placeholder="请输入目的地"
            search-key="region_no_province_to"
            :options="options_t"
            :value.sync="ruleForm.to_region_id">
          </nf-select>
        </el-form-item>
        </div>
        <p style="margin-bottom: 20px;margin-top:0;">
          <el-checkbox v-model="ruleForm.reverse">去程返程一样</el-checkbox>
        </p>
        <div class="clearfix line">
          <el-form-item label="里程数" prop="mileage">
            <el-input v-model="ruleForm.mileage" placeholder="请输入里程数">
              <template slot="append">KM</template>
            </el-input>
          </el-form-item>
        </div>
        <div class="clearfix line">
          <el-form-item label="适用行驶类型" prop="carry_type">
            <el-select v-model="ruleForm.carry_type" placeholder="请选择适用行驶类型" clearable>
              <el-option v-for="(item, index) in carryTypeList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </nf-form-wrap>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      options_f: [],
      options_t: [],
      carryTypeList: [],
      ruleForm: {
        from_region_id: '',
        to_region_id: '',
        from_region_name: '',
        to_region_name: '',
        reverse: true,
        carry_type: '',
        mileage: ''
      },
      rules: {
        from_region_id: [{
          required: true,
          message: '请选择出发地',
          trigger: 'change'
        }],
        to_region_id: [{
          required: true,
          message: '请选择目的地',
          trigger: 'change'
        }],
        mileage: [{ required: true, validator: this.$valid.isFloatNumber(true, '请输入里程数'), trigger: 'blur' }],
        carry_type: [{
          required: true,
          message: '请选择行驶类型',
          trigger: 'change'
        }]
      }
    }
  },
  created() {
    this.getCarryType();
    this.edit_id = this.$route.query.id;
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      // 获取详情
      this.getDetail(this.edit_id)
    }
  },
  methods: {
    getDetail(id) {
      $get(`${api.mileage}/${id}`).then(res => {
        this.ruleForm = res;
        this.options_f.push({
          key: res.from_region_id,
          value: res.from_region_name
        });
        this.options_t.push({
          key: res.to_region_id,
          value: res.to_region_name
        });
      })
    },
    // 获取行驶类型
    getCarryType() {
      $get(`${api.carry_type}`).then(res => {
        this.carryTypeList = res.carry_type;
      })
    },
    // 保存
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true)
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.mileage}/${this.edit_id}`
            $put(apiUrl, this.ruleForm).then(() => {
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.mileage, this.ruleForm).then(() => {
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
  }
}

</script>

<style lang="scss" scoped>
  .box_260 {
    /deep/ .el-form-item__label {
      height: 20px;
      line-height: 20px;
      padding: 0 0 7px !important;
      box-sizing: content-box;
    }

    /deep/ .el-input {
      width: 260px;
    }
  }

  .clearfix {
    .el-form-item {
      float: left;
      margin-right: 20px;
    }
  }

</style>
