<template>
  <div>
    <nf-form-wrap title="加油卡管理" :on-save-btn-click="onSaveBtnClick">
      <el-form
        :model="formData"
        ref="ruleForm"
        :rules="formRules"
        label-position="top"
        inline>
        <div>
          <div class="card-type">
            <label>类型：</label>
            <el-radio-group v-model="formData.type" :disabled="isEditing">
              <el-radio label="master_card">主卡</el-radio>
              <el-radio label="supplemental_card">副卡</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div>
          <el-form-item label="油卡品牌：" prop="card_brand" v-if="formData.type === 'master_card'">
            <el-select
              filterable
              v-model="formData.card_brand"
              :disabled="formData.supplemental_number > 0"
              placeholder="请选择油卡品牌">
              <el-option
                v-for="(item, index) in oilCardBrandList"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="油卡卡号：" prop="card_number">
            <el-input v-model="formData.card_number"></el-input>
          </el-form-item>
          <el-form-item label="所属主卡：" prop="master_card_id" v-if="formData.type === 'supplemental_card'">
            <el-select filterable v-model="formData.master_card_id" placeholder="请选择主卡">
              <el-option
                v-for="(item, index) in masterCardList"
                :key="index"
                :label="item.card_number"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注：" style="width: 530px;">
            <el-input
              type="textarea"
              :rows="4"
              maxlength="255"
              show-word-limit
              placeholder="请输入备注信息"
              v-model="formData.notation">
            </el-input>
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
      isEditing: false,
      oilCardBrandList: [],
      masterCardList: [],
      formData: {
        type: 'master_card',
        notation: '',
        card_brand: '',
        card_number: '',
        relation_type: 'no_relation',
        master_card_id: ''
      },
      formRules: {
        card_brand: [{ required: true, message: '请选择油卡品牌', trigger: 'blur' }],
        card_number: [{ required: true, message: '请输入油卡卡号', trigger: 'blur' }],
        master_card_id: [{ required: true, message: '请选择所属主卡', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getList() {
      // 获取油卡品牌
      $get(api.oilCardBrands).then(res => {
        this.oilCardBrandList = res
      })
      let params = {
        page: 1,
        per_page: 500,
        condition: {
          oil_card_type: {
            key: 'master_card',
            value: '主卡'
          }
        } 
      }
      // 获取主卡
      $get(api.oilCards, params).then(res => {
        this.masterCardList = res.data
      })
    },
    // 切换主副卡
    typeChanged() {
      if (this.formData.type === 'master_card') {
        this.formData.relation_type = 'no_relation'
      } else {
        this.formData.relation_type = 'tractor'
      }

    },
    // 编辑时获取详情信息
    getDetail(id) {
      $get(`${api.oilCard}/${id}`).then(res => {
        this.formData = res
      })
    },
    // 保存提交
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true)
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.oilCard}/${this.edit_id}`
            $put(apiUrl, this.formData).then(() =>{
              loading(false)
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.oilCard, this.formData).then(() =>{
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
    this.getList()
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
  .card-type{
    margin-bottom: 20px;
    &>label{
      margin-right: 10px;
    }
  }
  .item-btns{
    display: inline-block;
    margin-top: 35px;
    .el-button{
      padding: 5px 10px;
      font-size: 20px;
      font-weight: 600;
    }
  }
</style>
