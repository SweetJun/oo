<template>
  <div>
    <!-- 关联的加油卡列表 -->
    <div class="clearfix">
      <div class="person-item" v-for="(item, index) in oilcard_list" :key="index">
        <div class="top oilcard-top">
          <span class="name">{{item.card_brand_name}}</span>
          <el-button type="text" class="cancel" @click="cancelOilcard(item.id)">取消关联</el-button>
        </div>
        <div class="middle">
          <p class="oil_card">{{item.card_number}}</p>
        </div>
        <div class="bottom">
          <p></p>
          <el-radio v-model="default_o" :label="item.id">设为默认</el-radio>
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="btns">
      <el-button @click="relatedOilcardClick">关联加油卡</el-button>
    </div>
    <!-- 关联加油卡弹框 -->
    <nf-dialog title="关联加油卡" :dialog-visible.sync="relatedOilcardShow" v-if="relatedOilcardShow"
      :click-sure-btn="clickSureBtn">
      <div class="content" slot="content">
        <el-select v-model="oilCard" filterable clearable placeholder="请选择加油卡" style="width:260px;">
          <el-option v-for="item in oilcardOptions" :key="item.id" :label="item.card_number" :value="item.id">
          </el-option>
        </el-select>
        <p style="margin-top:20px;">
          <el-button type="primary" @click="createOilcardClick">新建加油卡</el-button>
        </p>
      </div>
    </nf-dialog>
    <!-- 新建加油卡弹框 -->
    <nf-dialog title="新建加油卡" :dialog-visible.sync="createOilcardShow" v-if="createOilcardShow" :width="'1000px'"
      :click-sure-btn="clickSureBtn1">
      <div class="content" slot="content">
        <el-form :model="formData" ref="ruleForm" :rules="formRules" label-position="top" inline>
          <div>
            <el-form-item label="油卡品牌：" prop="card_brand" style="margin-right:20px;" v-if="formData.type !== 'supplemental_card'">
              <el-select filterable v-model="formData.card_brand" placeholder="请选择油卡品牌">
                <el-option v-for="(item, index) in oilCardBrandList" :key="index" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=" " prop="type">
              <label>类型：</label>
              <el-radio-group v-model="formData.type" @change="typeChanged">
                <el-radio label="master_card">主卡</el-radio>
                <el-radio label="supplemental_card">副卡</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="油卡卡号：" prop="card_number">
              <el-input v-model="formData.card_number" placeholder="请输入油卡卡号"></el-input>
            </el-form-item>
            <el-form-item label="所属主卡：" prop="master_card_id" v-if="formData.type === 'supplemental_card'">
              <el-select filterable v-model="formData.master_card_id" placeholder="请选择主卡">
                <el-option v-for="(item, index) in masterCardList" :key="index" :label="item.card_number"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="油卡给到：" style="margin-left: 20px;width: 350px;" v-if="false">
              <el-radio-group v-model="formData.relation_type" :disabled="isEditing">
                <el-radio label="no_relation">不做关联</el-radio>
                <el-radio label="tractor">指定车辆</el-radio>
                <el-radio label="driver">指定驾驶员</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="备注：" style="width: 530px;">
              <el-input type="textarea" :rows="4" maxlength="255" show-word-limit placeholder="请输入备注信息"
                v-model="formData.notation">
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      relatedOilcardShow: false, // 关联加油卡弹框是否展示
      createOilcardShow: false, // 新建加油卡弹框是否展示
      oilCard: '', // 选中的加油卡id
      oilcardOptions: [], // 搜索的加油卡下拉数据
      oilcard_list: [], // 关联的加油卡
      default_o: false, // 默认
      oilCardBrandList: [],
      masterCardList: [],
      carList: [],
      driverList: [],
      formData: {
        type: 'master_card',
        notation: '',
        card_brand: '',
        card_number: '',
        relation_id: '',
        relation_type: 'no_relation',
        master_card_id: ''
      },
      formRules: {
        card_brand: [{
          required: true,
          message: '请选择油卡品牌',
          trigger: 'change'
        }],
        card_number: [{
          required: true,
          message: '请输入油卡卡号',
          trigger: 'blur'
        }],
        master_card_id: [{
          required: true,
          message: '请选择所属主卡',
          trigger: 'change'
        }],
        relation_id: [{
          required: true,
          message: '请选择指定目标',
          trigger: 'change'
        }]
      }
    }
  },
  props: {
    // 关联车辆还是驾驶员
    mode: {
      type: String,
      default: 'no_relation'
    },
    // 编辑的详情数据，回显
    detailCard: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    detailCard: function() {
      this.showOilcardInfo();
    }
  },
  created() {
    this.getList();
    this.getGractorOptions();
    this.getDriverOptions();
  },
  methods: {
    // 点击关联油卡
    relatedOilcardClick() {
      this.getOilCards();
      this.relatedOilcardShow = !this.relatedOilcardShow;
    },
    // 新建加油卡
    createOilcardClick() {
      this.createOilcardShow = !this.createOilcardShow;
    },
    // 获取加油卡
    getOilCards() {
      $get(api.oil_card_no_relations).then(res => {
        this.oilcardOptions = res.data;
      })
    },
    // 关联加油卡弹框确定
    clickSureBtn() {
      let a = this.oilCard;
      let b = JSON.parse(JSON.stringify(this.oilcardOptions));
      this.getOilcardInfo(a, b);
      this.oilCard = '';
      this.oilcardOptions = [];
      this.relatedOilcardClick();
    },
    // 获取加油卡信息
    async getOilcardInfo(id, option) {
      let arr = option.filter(item => item.id === id);
      arr.forEach(item => {
        this.$set(item, 'default', false);
        if (!this.oilcard_list.find(item1 => item1.id === item.id)) this.oilcard_list.push(item);
      });
    },
    // 编辑回显
    showOilcardInfo() {
      this.detailCard.forEach(item => {
        if(item.relation_default) {
          this.default_o = item.id
        }
        if (!this.oilcard_list.find(item1 => item1.id === item.id)) this.oilcard_list.push(item);
      })
    },
    // 取消关联加油卡
    cancelOilcard(id) {
      this.oilcard_list = this.oilcard_list.filter(item => item.id !== id);
    },
    // 获取油卡品牌
    getList() {
      $get(api.oilCardBrands).then(res => {
        this.oilCardBrandList = res
      })
      let params = {
        page: 1,
        per_page: 500,
        type: 'master_card',
        card_number: '',
        card_brand: '',
        relation_type: '',
        relation_id: ''
      }
      // 获取主卡
      $get(api.oilCards, params).then(res => {
        this.masterCardList = res.data
      })
    },
    // 获取牵引车下拉列表
    getGractorOptions() {
      $get(api.tractorOptions, {
        type: 'own'
      }).then(res => {
        this.carList = res
      })
    },
    // 获取驾驶员下拉列表
    getDriverOptions() {
      $get(api.driverOptions, {
        type: 'own'
      }).then(res => {
        this.driverList = res
      })
    },
    // 切换主副卡
    typeChanged() {
      this.formData.relation_type = 'no_relation'
    },
    // 新建加油卡确定
    clickSureBtn1(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true);
          $post(api.oilCard, this.formData).then(res => {
            this.$message.success('添加成功');
            // 根据id请求油卡数据
            $get(`${api.oilCard}/${res.oilCardId}`,{}).then(res1 => {
              this.$set(res1, 'default', false);
              if (!this.oilcard_list.find(item => item.id === res1.id)) this.oilcard_list.push(res1);
            })
            this.createOilcardClick();
            this.relatedOilcardShow = false;
            this.formData = {
              type: 'master_card',
              notation: '',
              card_brand: '',
              card_number: '',
              relation_id: '',
              relation_type: 'no_relation',
              master_card_id: ''
            }
            loading(false);
          }).catch(() => {
            loading(false);
          })
        } else {
          return false;
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  .person-item {
    width: 268px;
    height: 162px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 4px 4px 8px 0px rgba(237, 242, 251, 1);
    border-radius: 8px;
    border: 1px solid rgba(231, 235, 241, 1);
    float: left;
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 15px 15px 15px 20px;
    box-sizing: border-box;

    .top {
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .name {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(32, 44, 85, 1);
        line-height: 22px;
      }

      .cancel {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(245, 108, 109, 1);
        line-height: 17px;
      }

    }

    .middle {
      .bank_card {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(120, 127, 149, 1);
        line-height: 20px;
        letter-spacing: 1px;
        margin-bottom: 10px;
      }

      .bank {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(120, 127, 149, 1);
        line-height: 17px;
        margin-bottom: 15px;
      }

      .oil_card {
        margin-top: 25px;
        margin-bottom: 39px;
      }
    }

    .bottom,
    .oilcard-top {
      display: flex;
      justify-content: space-between;
    }
  }

  .card-type {
    margin-bottom: 20px;

    &>label {
      margin-right: 10px;
    }
  }

  .item-btns {
    display: inline-block;
    margin-top: 35px;

    .el-button {
      padding: 5px 10px;
      font-size: 20px;
      font-weight: 600;
    }
  }

</style>
