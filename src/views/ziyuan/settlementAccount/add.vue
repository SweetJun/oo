<template>
  <div>
    <nf-form-wrap title="结算人管理" :on-save-btn-click="onSaveBtnClick">
      <div class="type">
        <label>类型：</label>
        <el-radio-group
          v-model="formData.type"
          :disabled="isEditing"
          @change="handleTypeChanged(formData.type)"
        >
          <el-radio label="personal">个人</el-radio>
          <el-radio label="enterprise">企业</el-radio>
        </el-radio-group>
      </div>
      <el-form
        v-if="formData.type === 'personal'"
        :model="formData"
        ref="ruleForm1"
        :rules="formRules"
        label-position="top"
        inline>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model.trim="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile_phone">
          <el-input v-model.trim="formData.mobile_phone"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" prop="id_card">
          <el-input v-model.trim="formData.id_card"></el-input>
        </el-form-item>
      </el-form>
      <el-form
        v-if="formData.type === 'enterprise'"
        :model="formData"
        ref="ruleForm2"
        :rules="formCompanyRules"
        label-position="top"
        inline>
        <el-form-item label="企业名称：" prop="name">
          <el-input v-model.trim="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码：" prop="id_card">
          <el-input v-model.trim="formData.id_card"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名：" prop="contact_name">
          <el-input v-model.trim="formData.contact_name"></el-input>
        </el-form-item>
        <el-form-item label="联系人手机号：" prop="mobile_phone">
          <el-input v-model.trim="formData.mobile_phone"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-group">
        <el-button
          @click="bankCardDialog=true"
          :disabled="formData.type === 'enterprise'&&formData.bank_cards.length>0"
          type="primary"
        >添加银行卡</el-button>
        <el-button
          v-if="formData.type === 'personal'"
          @click="oilCardDialog=true"
          type="primary"
        >添加加油卡</el-button>
        <el-button
          @click="addWJY"
          :disabled="formData.type === 'enterprise'&&formData.wjy_settlement_accounts.length>0"
          type="primary"
        >添加万金油</el-button>
      </div>
      <div class="add-content">
        <el-form
          ref="cardsForm"
          :model="formData"
          label-position="top"
          inline>
          <div class="form-item-block" v-for="(card,index) in formData.bank_cards" :key="index">
            <el-form-item
              label="开户行："
              :rules="[{ required: true, message: '请选择开户行', trigger: 'change' }]"
              :prop="'bank_cards.' + index + '.bank_id'">
              <nf-select
                placeholder="请选择开户行"
                search-key="bank"
                :options="card.options"
                :value.sync="card.bank_id">
              </nf-select>
            </el-form-item>
            <el-form-item
              label="支行名称："
              :rules="[{ required: true, message: '请输入支行名称', trigger: 'blur' }]"
              :prop="'bank_cards.' + index + '.bank_branch_name'">
              <el-input v-model="card.bank_branch_name"></el-input>
            </el-form-item>
            <el-form-item
              label="开户行卡号："
              :rules="[{ required: true, message: '请输入银行卡号', trigger: 'blur' }]"
              :prop="'bank_cards.' + index + '.bank_card'">
              <el-input v-model="card.bank_card" ></el-input>
            </el-form-item>
            <div class="radio-box">
              <el-radio v-if="formData.type==='personal'" v-model="defBank" :label="index">设为默认</el-radio>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="delItem('bank_cards', card, index)"
              ></el-button>
            </div>
          </div>

          <div class="form-item-block" v-for="(item,index) in formData.oil_cards" :key="index">
            <el-form-item
              label="油卡卡号："
              :rules="[{ required: true, message: '请选择油卡', trigger: 'change' }]"
              :prop="'oil_cards.' + index + '.id'">
              <nf-select
                placeholder="请选择开户行"
                search-key="bank"
                :options="item.options"
                :value.sync="item.id">
              </nf-select>
            </el-form-item>
            <div class="radio-box">
              <el-radio v-model="defOilCard" :label="index">设为默认</el-radio>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="delItem('oil_cards', item, index)">
              </el-button>
            </div>
          </div>

          <div class="form-item-block" v-for="(item,index) in formData.wjy_settlement_accounts" :key="index">
            <!-- 0602 lsc -->
            <el-form-item
              label="万金油协议主体："
              :rules="[{ required: true, message: '请选择万金油协议主体', trigger: 'change' }]"
              :prop="'wjy_settlement_accounts.' + index + '.wjy_company_id'">
              <nf-select
                placeholder="请选择万金油协议主体"
                :options="wjySubjectList"
                :value.sync="item.wjy_company_id">
              </nf-select>
            </el-form-item>
            <el-form-item
              v-if="item.type==='personal'"
              label="姓名："
              :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]"
              :prop="'wjy_settlement_accounts.' + index + '.name'">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item
              v-else
              label="企业名称："
              :rules="[{ required: true, message: '请输入企业名称', trigger: 'blur' }]"
              :prop="'wjy_settlement_accounts.' + index + '.name'">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item
              v-if="item.type==='personal'"
              label="身份证号："
              :rules="[{ validator: $valid.isIdCard(), trigger: 'blur' }]"
              :prop="'wjy_settlement_accounts.' + index + '.id_card'">
              <el-input v-model="item.id_card"></el-input>
            </el-form-item>
            <el-form-item
              label="万金油账号："
              :rules="[{ required: true, message: '请输入万金油账号', trigger: 'blur' }]"
              :prop="'wjy_settlement_accounts.' + index + '.account'">
              <el-input v-model="item.account"></el-input>
            </el-form-item>
            <el-form-item
              v-if="item.type==='personal'"
              label="车牌号："
              :rules="[{ validator: $valid.isCarNumber(), trigger: 'blur' }]"
              :prop="'wjy_settlement_accounts.' + index + '.vehicle_number'">
              <el-input v-model="item.vehicle_number"></el-input>
            </el-form-item>
            <div class="radio-box">
              <el-radio v-if="formData.type==='personal'" v-model="defwjy" :label="index">设为默认</el-radio>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="delItem('wjy_settlement_accounts', item, index)"
              ></el-button>
            </div>
          </div>
        </el-form>
      </div>
    </nf-form-wrap>
    <nf-dialog
      title="添加银行卡"
      :dialog-visible.sync="bankCardDialog"
      v-if="bankCardDialog"
      width="400px"
      :click-sure-btn="clickSureBtn1"
    >
      <div class="content" slot="content">
        <el-form
          :model="addBankForm"
          :rules="addBankFormRule"
          ref="addBankForm"
          label-position="top"
          label-width="100px"
          class="bank-rule-form"
        >
          <el-form-item label="开户行：" prop="bank_id">
            <nf-select
              style="width:100%"
              placeholder="请选择开户行"
              search-key="bank"
              value-key="key"
              :value.sync="addBankForm.bank_id"
            ></nf-select>
          </el-form-item>
          <el-form-item label="支行名称：" prop="bank_branch_name">
            <el-input clearable v-model.trim="addBankForm.bank_branch_name" placeholder="请输入支行名称"></el-input>
          </el-form-item>
          <el-form-item label="开户行账号：" prop="bank_card">
            <el-input clearable v-model.trim="addBankForm.bank_card" placeholder="请输入开户行账号"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </nf-dialog>
    <nf-dialog
      title="添加加油卡"
      :dialog-visible.sync="oilCardDialog"
      v-if="oilCardDialog"
      width="400px"
      :click-sure-btn="clickSureBtn2"
    >
      <div class="content" slot="content">
        <el-form
          :model="oilCardForm"
          ref="oilCardForm"
          :rules="oilCardRules"
          label-position="top"
          label-width="100px"
          class="oil-card-form"
        >
          <el-form-item label="油卡卡号：" prop="oilCard">
            <nf-select
              style="width:100%"
              placeholder="请选择加油卡"
              search-key="oil_card_number_supplemental"
              value-key="key"
              :value.sync="oilCardForm.oilCard"
            ></nf-select>
          </el-form-item>
        </el-form>
      </div>
    </nf-dialog>
    <nf-dialog
      title="添加万金油"
      :dialog-visible.sync="wjyDialog"
      v-if="wjyDialog"
      width="400px"
      :click-sure-btn="clickSureBtn3"
    >
      <div class="content" slot="content">
        <el-radio-group v-model="formType" :disabled="isFormEdit" @change="handleFormTypeChanged" style="margin-bottom: 10px;">
          <el-radio label="personal">个人</el-radio>
          <el-radio label="enterprise">企业</el-radio>
        </el-radio-group>
        <el-form
          v-if="formType==='personal'"
          :model="wjyOilForm"
          ref="wjyOilForm1"
          :rules="wjyOilRules1"
          label-position="top"
          label-width="100px"
          class="oil-card-form"
        >
          <el-form-item label="万金油协议主体：" prop="wjy_company_id">
            <nf-select
              placeholder="请选择万金油协议主体"
              :options="wjySubjectList"
              :value.sync="wjyOilForm.wjy_company_id">
            </nf-select>
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input v-model.trim="wjyOilForm.name" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="万金油账号：" prop="account">
            <el-input v-model.trim="wjyOilForm.account" placeholder="请输入手机号" clearable></el-input>
          </el-form-item>
          <el-form-item label="身份证号：" prop="id_card">
            <el-input v-model.trim="wjyOilForm.id_card" placeholder="请输入身份证号" clearable></el-input>
          </el-form-item>
          <el-form-item label="车牌号：" prop="vehicle_number">
            <el-input v-model.trim="wjyOilForm.vehicle_number" placeholder="请输入车牌号" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-form
          v-if="formType==='enterprise'"
          :model="wjyOilForm"
          ref="wjyOilForm2"
          :rules="wjyOilRules2"
          label-position="top"
          label-width="100px"
          class="oil-card-form"
        >
          <el-form-item label="万金油协议主体：" prop="wjy_company_id">
            <nf-select
              placeholder="请选择万金油协议主体"
              :options="wjySubjectList"
              :value.sync="wjyOilForm.wjy_company_id">
            </nf-select>
          </el-form-item>
          <el-form-item label="企业名称：" prop="name">
            <el-input v-model.trim="wjyOilForm.name" placeholder="请输入企业名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="万金油账号：" prop="account">
            <el-input v-model.trim="wjyOilForm.account" placeholder="请输入万金油账号" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEditing: false,
      loading: false,
      edit_id: "",
      bankCardDialog: false,
      oilCardDialog: false,
      wjyDialog: false,
      wjySubjectList: [],
      formData: {
        type: "personal",
        name: "",
        mobile_phone: "",
        id_card: "",
        contact_name: "",
        bank_cards: [],
        oil_cards: [],
        wjy_settlement_accounts: []
      },
      formRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        id_card: [
          { required: true, validator: this.$valid.isIdCard(), trigger: "blur" }
        ],
        mobile_phone: [
          { validator: this.$valid.isPhone(false), trigger: "blur" }
        ]
      },
      formCompanyRules: {
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        id_card: [
          { required: true, message: "请输入统一社会信用代码", trigger: "blur" }
        ],
        mobile_phone: [
          { validator: this.$valid.isPhone(false), trigger: "blur" }
        ]
      },
      addBankForm: {
        bank_id: "",
        bank_display: "",
        bank_branch_name: "",
        bank_card: "",
        default: false
      },
      addBankFormRule: {
        bank_id: [{ required: true, message: "请选择开户行", trigger: "blur" }],
        bank_branch_name: [
          { required: true, message: "请输入支行名称", trigger: "blur" }
        ],
        bank_card: [
          { required: true, message: "请输入开户行账号", trigger: "blur" }
        ]
      },
      oilCardForm: {
        oilCard: "",
        default: false
      },
      oilCardRules: {
        oilCard: [
          { required: true, message: "请输入开户行账号", trigger: "blur" }
        ]
      },
      wjyOilForm: {
        type: "personal",
        wjy_company_id: '',
        name: "",
        id_card: "",
        account: "",
        vehicle_number: "",
        default: false
      },
      wjyOilRules1: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        id_card: [{ required: true, validator: this.$valid.isIdCard(), trigger: "blur" }],
        wjy_company_id: [{ required: true, message: "请选择万金油协议主体", trigger: 'blur' }],
        account: [{ required: true, validator: this.$valid.isPhone(), trigger: "blur" }],
        vehicle_number: [{ required: true, validator: this.$valid.isCarNumber(), trigger: "blur" }]
      },
      wjyOilRules2: {
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        wjy_company_id: [{ required: true, message: "请选择万金油协议主体", trigger: 'blur' }],
        account: [{ required: true, message: "请输入万金油账户", trigger: "blur" }]
      },
      defBank: 0, // 默认银行卡 索引
      defOilCard: 0, // 默认加油卡 索引
      defwjy: 0, // 默认万金油 索引
      formType: "personal", // 添加万金油form type
      isFormEdit: false
    };
  },
  methods: {
    // 切换银行卡类型
    handleTypeChanged(type) {
      this.formData = {
        type: type,
        name: "",
        mobile_phone: "",
        id_card: "",
        contact_name: "",
        bank_cards: [],
        oil_cards: [],
        wjy_settlement_accounts: []
      };
      if (type === "personal") {
        this.$refs["ruleForm1"].clearValidate();
      } else {
        this.$refs["ruleForm2"].clearValidate();
      }
    },
    // 切换form 类型
    handleFormTypeChanged() {
      this.wjyOilForm.name = "";
      this.wjyOilForm.id_card = "";
      this.wjyOilForm.wjy_company_id = "";
      this.wjyOilForm.account = "";
      if (this.formType === "personal") {
        this.$refs["wjyOilForm1"].clearValidate();
      } else {
        this.$refs["wjyOilForm2"].clearValidate();
      }
    },
    // 添加银行卡
    clickSureBtn1() {
      this.$refs.addBankForm.validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.addBankForm));
          let bank = params.bank_id;
          delete params.bank_id;
          params.bank_id = bank.key;
          params.bank_display = bank.value;
          params.options = [bank]
          this.formData.bank_cards.push(params);
          this.bankCardDialog = false;
          this.resetForm("addBankForm");
        } else {
          return false;
        }
      });
    },
    // 添加加油卡
    clickSureBtn2() {
      this.$refs.oilCardForm.validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.oilCardForm.oilCard));
          this.formData.oil_cards.push({
            id: data.key,
            card_number: data.value,
            options: [data]
          });
          this.oilCardDialog = false;
          this.resetForm("oilCardForm");
        } else {
          return false;
        }
      });
    },
    async addWJY() {
      // 判断是否绑定了万金油企业
      let data = await $get(api.isBindWjy)
      this.isBindWjy = data.is_bind_wjy
      // 获取万金油主体下拉数据
      if (!this.isBindWjy) {
        this.$message.warning('请先绑定万金油企业')
        return false
      }
      $get(api.getAvailableWjyCompany).then(res => {
        this.wjySubjectList = res ? res : []
      })
      this.wjyDialog = true;
      this.wjyOilForm.wjy_company_id = ''
      if (this.formData.type === "personal") {
        this.isFormEdit = false;
        this.wjyOilForm.name = '';
        this.wjyOilForm.account = '';
        this.wjyOilForm.id_card = '';
        if (this.formData.wjy_settlement_accounts.length === 0) {
          this.wjyOilForm.name = this.formData.name;
          this.wjyOilForm.account = this.formData.mobile_phone;
          this.wjyOilForm.id_card = this.formData.id_card;
        }
      } else {
        this.isFormEdit = true;
        this.wjyOilForm.name = '';
        if (this.formData.wjy_settlement_accounts.length === 0) {
          this.wjyOilForm.name = this.formData.name;
        }
      }
      this.formType = this.formData.type;
    },
    // 添加万金油
    clickSureBtn3() {
      this.wjyOilForm.type = this.formType;
      this.$refs[
        this.formType === "personal" ? "wjyOilForm1" : "wjyOilForm2"
      ].validate(valid => {
        if (valid) {
          this.formData.wjy_settlement_accounts.push(
            JSON.parse(JSON.stringify(this.wjyOilForm))
          );
          this.wjyDialog = false;
          this.resetForm(
            this.formType === "personal" ? "wjyOilForm1" : "wjyOilForm2"
          );
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 删除
    delItem(type, item, index) {
      this.formData[type].splice(index, 1);
      if (!item.default) return
      if (type === 'bank_cards') {
        this.defBank = 0
        this.formData.bank_cards[0].default = true
      } else if (type === 'oil_cards') {
        this.defOilCard = 0
        this.formData.oil_cards[0].default = true
      } else if (type === 'wjy_settlement_accounts') {
        this.defwjy = 0
        this.formData.wjy_settlement_accounts[0].default = true
      }
    },
    // 编辑时获取详情信息
    getDetail(id) {
      $get(`${api.settlementAccount}/${id}`).then(res => {
        res.bank_cards.forEach(item => {
          this.$set(item, 'options', [{
            key: item.bank_id,
            value: item.bank_display
          }])
        })
        res.oil_cards.forEach(item => {
          this.$set(item, 'options', [{
            key: item.id,
            value: item.card_number
          }])
        })
        // 0602 lsc
        res.wjy_settlement_accounts.forEach(item => {
          let wjy = item.wjy_company_id === 0 ? '' : item.wjy_company_id
          this.$set(item, 'wjy_company_id', wjy)
        })
        this.formData = res;
        // 默认银行卡 索引
        let defBankIndex = res.bank_cards.findIndex(ele => {
          return ele.default;
        });
        this.defBank = defBankIndex !== -1 ? defBankIndex : 0;
        // 默认加油卡 索引
        let defOilIndex = res.oil_cards.findIndex(ele => {
          return ele.default;
        });
        this.defOilCard = defOilIndex !== -1 ? defOilIndex : 0;
        // 默认万金油 索引
        let defwjyIndex = res.wjy_settlement_accounts.findIndex(ele => {
          return ele.default;
        });
        this.defwjy = defwjyIndex !== -1 ? defwjyIndex : 0;
        if (res.mobile_phone === 0) {
          this.formData.mobile_phone = "";
        }
      });
    },
    // 默认值
    renderDef() {
      for (let i = 0; i < this.formData.bank_cards.length; i++) {
        if (i === this.defBank) {
          this.formData.bank_cards[i].default = true;
        } else {
          this.formData.bank_cards[i].default = false;
        }
      }
      for (let i = 0; i < this.formData.oil_cards.length; i++) {
        if (i === this.defOilCard) {
          this.formData.oil_cards[i].default = true;
        } else {
          this.formData.oil_cards[i].default = false;
        }
      }
      for (let i = 0; i < this.formData.wjy_settlement_accounts.length; i++) {
        if (i === this.defwjy) {
          this.formData.wjy_settlement_accounts[i].default = true;
        } else {
          this.formData.wjy_settlement_accounts[i].default = false;
        }
      }
    },
    // 保存提交
    onSaveBtnClick(loading) {
      let formName = this.formData.type === "personal" ? "ruleForm1" : "ruleForm2";
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs['cardsForm'].validate(valid => {
            if (valid) {
              if (this.formData.type === "personal") {
                if (
                  this.formData.bank_cards.length <= 0 &&
                  this.formData.oil_cards.length <= 0 &&
                  this.formData.wjy_settlement_accounts.length <= 0
                ) {
                  this.$message.closeAll()
                  this.$message.warning(
                    "银行卡、加油卡、万金油三项至少填写其中一项"
                  );
                  return;
                }
              } else {
                if (
                  this.formData.bank_cards.length <= 0 &&
                  this.formData.wjy_settlement_accounts.length <= 0
                ) {
                  this.$message.closeAll()
                  this.$message.warning("银行卡、万金油两项至少填写其中一项");
                  return;
                }
              }
              // 检查是否重复添加银行卡号
              let bankCards = _.cloneDeep(this.formData.bank_cards);
              bankCards = _.uniqBy(bankCards, "bank_card");
              if (bankCards.length !== this.formData.bank_cards.length) {
                this.$message.warning("银行卡号重复，请核实！");
                return;
              }
              // 检查是否重复添加加油卡
              let oil_cards = _.cloneDeep(this.formData.oil_cards);
              oil_cards = _.uniqBy(oil_cards, "id");
              if (oil_cards.length !== this.formData.oil_cards.length) {
                this.$message.warning("加油卡卡号重复，请核实！");
                return;
              }
              // 检查是否重复添加万金油个人账号
              let arrP = this.formData.wjy_settlement_accounts.filter(ele => {
                return ele.type === "personal";
              });
              arrP.map(ele => {
                ele.account = ele.account + "";
              });
              let uArrP = _.uniqBy(arrP, "account");
              if (uArrP.length !== arrP.length) {
                this.$message.warning("万金油个人账号重复，请核实！");
                return;
              }
              // 检查是否重复添加万金油企业账号
              let arrE = this.formData.wjy_settlement_accounts.filter(ele => {
                return ele.type === "enterprise";
              });
              arrE.map(ele => {
                ele.account = ele.account + "";
              });
              let uArrE = _.uniqBy(arrE, "account");
              if (uArrE.length !== arrE.length) {
                this.$message.warning("万金油企业账号重复，请核实！");
                return;
              }
              this.renderDef();
              loading(true);
              if (this.isEditing) {
                // 判断 编辑 和 新增
                let apiUrl = `${api.settlementAccount}/${this.edit_id}`;
                $put(apiUrl, this.formData)
                  .then(() => {
                    loading(false);
                    this.$message.success("编辑成功");
                    this.$router.back();
                  })
                  .catch(() => {
                    loading(false);
                  });
              } else {
                $post(api.settlementAccount, this.formData)
                  .then(() => {
                    loading(false);
                    this.$message.success("添加成功");
                    this.$router.back();
                  })
                  .catch(() => {
                    loading(false);
                  });
              }
            } else {
              return false
            }
          })
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.edit_id = this.$route.query.id;
    this.isEditing = this.edit_id ? true : false;
    if (this.isEditing) {
      // 获取详情
      this.getDetail(this.edit_id);
    }
    // 0602 lsc
    $get(api.getAvailableWjyCompany).then(res => {
      this.wjySubjectList = res ? res : []
    })
  }
};
</script>

<style lang="scss" scoped>
.nf-select{
  width: 100%;
}
.type {
  margin-bottom: 20px;
  & > label {
    margin-right: 10px;
  }
}
.add-content{
  .el-form{
    .el-form-item{
      width: 200px;
    }
  }
}
.btn-group{
  margin-bottom: 20px;
}
.item-btns {
  display: inline-block;
  margin-top: 35px;
  .el-button {
    padding: 8px 10px;
    font-size: 20px;
    font-weight: 600;
  }
}
.radio-box {
  display: inline-block;
  margin-top: 35px;
  .el-radio{
    margin-top: 13px;
  }
}
</style>
