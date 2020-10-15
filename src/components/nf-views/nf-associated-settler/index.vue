<template>
  <div>
    <nf-form-wrap title="已关联的结算人" :show-footer="false">
      <div class="department-box">
        <el-button @click="createdSettler" type="primary">创建结算人</el-button>
        <el-button @click="linkReckoner" type="primary">关联结算人</el-button>
        <el-table size="mini" :data="tableData" style="margin-top:15px;width: 100%">
          <el-table-column
            v-for="(item,index) in tableHead"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.minWidth"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="{row,$index}">
              <el-button
                @click="setDefSettler(row,$index)"
                type="text"
                size="small"
              >{{row.default?'当前默认':'设为默认'}}</el-button>
              <el-button
                @click="cancelRelated(row,$index)"
                type="text"
                style="color:#CC0000;"
                size="small"
              >取消关联</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </nf-form-wrap>
    <nf-dialog
      title="创建结算人"
      :dialog-visible.sync="settlerDialog"
      v-if="settlerDialog"
      width="900px"
      :click-sure-btn="clickSureBtn"
    >
      <div class="content" slot="content">
        <div style="display:flex;align-items:center;padding-bottom:10px;">
          <p style="margin:0 20px 0 0;">类型</p>
          <el-radio-group
            v-model="settlerForm.type"
            :disabled="isFormEdit"
            @change="handleTypeChanged"
          >
            <el-radio label="personal">个人</el-radio>
            <el-radio label="enterprise">企业</el-radio>
          </el-radio-group>
          <el-checkbox style="margin-left:20px;" v-model="useCurDriver">使用当前驾驶员创建</el-checkbox>
        </div>
        <el-form
          v-if="settlerForm.type==='personal'"
          :model="settlerForm"
          ref="settlerForm1"
          :rules="settlerRules1"
          label-position="top"
          label-width="100px"
          class="settler-form"
        >
          <el-row type="flex" :gutter="20">
            <el-col :span="8">
              <el-form-item label="姓名：" prop="name">
                <el-input v-model.trim="settlerForm.name" placeholder="请输入姓名" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号：" prop="mobile_phone">
                <el-input v-model.trim="settlerForm.mobile_phone" placeholder="请输入手机号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号：" prop="id_card">
                <el-input v-model.trim="settlerForm.id_card" placeholder="请输入身份证号" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="20">
            <el-col :span="8">
              <el-form-item label="开户行：">
                <nf-select
                  style="width:100%"
                  placeholder="请选择开户行"
                  search-key="bank"
                  value-key="key"
                  :value.sync="settlerForm.bank_cards[0].bank_id"
                ></nf-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="支行名称：">
                <el-input
                  clearable
                  v-model.trim="settlerForm.bank_cards[0].bank_branch_name"
                  placeholder="请输入支行名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开户行账号：">
                <el-input
                  clearable
                  v-model.trim="settlerForm.bank_cards[0].bank_card"
                  placeholder="请输入开户行账号"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="20">
            <el-col :span="8">
              <el-form-item label="油卡卡号：">
                <nf-select
                  style="width:100%"
                  placeholder="请选择加油卡"
                  search-key="oil_card_number_supplemental"
                  value-key="key"
                  :value.sync="settlerForm.oil_cards[0]"
                ></nf-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="20">
            <el-col :span="8">
              <el-form-item label="万金油账号：">
                <el-input
                  v-model.trim="settlerForm.wjy_settlement_accounts[0].account"
                  placeholder="请输入万金油账号"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="万金油姓名：">
                <el-input
                  v-model.trim="settlerForm.wjy_settlement_accounts[0].name"
                  placeholder="请输入万金油姓名"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车牌号：">
                <el-input
                  v-model.trim="settlerForm.wjy_settlement_accounts[0].vehicle_number"
                  placeholder="请输入车牌号"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号：">
                <el-input
                  v-model.trim="settlerForm.wjy_settlement_accounts[0].id_card"
                  placeholder="请输入身份证号"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form
          v-if="settlerForm.type==='enterprise'"
          :model="settlerForm"
          ref="settlerForm2"
          :rules="settlerRules2"
          label-position="top"
          label-width="100px"
          class="oil-card-form"
        >
          <el-row type="flex" :gutter="20">
            <el-col :span="12">
              <el-form-item style="width:408px;" label="企业名称：" prop="name">
                <el-input v-model.trim="settlerForm.name" placeholder="请输入企业名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="width:408px;" label="统一社会信用代码：" prop="id_card">
                <el-input v-model.trim="settlerForm.id_card" placeholder="请输入统一社会信用代码" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="20">
            <el-col :span="12">
              <el-form-item style="width:408px;" label="联系人姓名：" prop="contact_name">
                <el-input v-model.trim="settlerForm.contact_name" placeholder="请输入联系人姓名" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="width:408px;" label="联系人手机号：" prop="mobile_phone">
                <el-input v-model.trim="settlerForm.mobile_phone" placeholder="请输入联系人手机号" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="20">
            <el-col :span="8">
              <el-form-item label="开户行：">
                <nf-select
                  style="width:100%"
                  placeholder="请选择开户行"
                  search-key="bank"
                  value-key="key"
                  :value.sync="settlerForm.bank_cards[0].bank_id"
                ></nf-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="支行名称：">
                <el-input
                  clearable
                  v-model.trim="settlerForm.bank_cards[0].bank_branch_name"
                  placeholder="请输入支行名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开户行账号：">
                <el-input
                  clearable
                  v-model.trim="settlerForm.bank_cards[0].bank_card"
                  placeholder="请输入开户行账号"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="20">
            <el-col :span="12">
              <el-form-item style="width:408px;" label="企业名称：">
                <el-input
                  v-model.trim="settlerForm.wjy_settlement_accounts[0].name"
                  placeholder="请输入企业名称"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="width:408px;" label="万金油账号：">
                <el-input
                  v-model.trim="settlerForm.wjy_settlement_accounts[0].account"
                  placeholder="请输入万金油账号"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <p>更多结算人信息请在“结算人管理”内维护。</p>
      </div>
    </nf-dialog>
    <nf-select-reckoner
      :type="type"
      :multiple="true"
      :id="driverInfo.driver_id"
      :dialog-reckoner.sync="dialogReckoner"
      :select-data="selectReckoner"
      @select-change="getSelectReckoner"
    ></nf-select-reckoner>
  </div>
</template>
<script>
import { isIdCard, isPhone, isCarNumber } from "@/utils/utils";
export default {
  name: "associatedSettler",
  props: {
    type: { type: String, default: "truck_personal" },
    driverInfo: Object,
    settlerInfo: Array
  },
  watch: {
    useCurDriver: function(val) {
      if (val) {
        let driverInfo = _.cloneDeep(this.driverInfo);
        if (this.settlerForm.type === "personal") {
          this.settlerForm.name = driverInfo.driver_name;
          this.settlerForm.mobile_phone = driverInfo.mobile_phone;
          this.settlerForm.id_card = driverInfo.id_card;
        } else {
          this.settlerForm.mobile_phone = driverInfo.mobile_phone;
          this.settlerForm.contact_name = driverInfo.driver_name;
        }
      }
    },
    tableData: {
      handler(newVal) {
        let arr = newVal.map(ele => {
          return {
            id: ele.id,
            default: ele.default
          };
        });
        this.$emit("updateSettlerId", arr);
      },
      deep: true
    }
  },
  data() {
    return {
      loading: false,
      settlerDialog: false,
      dialogReckoner: false,
      useCurDriver: false,
      openingBanks: [],
      tableHead: [
        {
          label: "类型",
          prop: "type_display"
        },
        {
          label: "名称",
          prop: "name"
        },
        {
          label: "手机号",
          prop: "mobile_phone"
        },
        {
          label: "开户行",
          prop: "bank_display"
        },
        {
          label: "支行名称",
          prop: "bank_branch_name"
        },
        {
          label: "开户行卡号",
          prop: "bank_card",
          minWidth: 110
        },
        {
          label: "关联油卡",
          prop: "card_number"
        },
        {
          label: "万金油账号",
          prop: "account"
        }
      ],
      tableData: [],
      settlerForm: {
        type: "personal",
        type_display: "个人",
        name: "",
        mobile_phone: "",
        id_card: "",
        contact_name: "",
        bank_cards: [
          {
            bank_id: "",
            bank_display: "",
            bank_branch_name: "",
            bank_card: ""
          }
        ],
        oil_cards: [{}],
        wjy_settlement_accounts: [
          {
            type: "personal",
            name: "",
            id_card: "",
            account: "",
            vehicle_number: ""
          }
        ]
      },
      settlerRules1: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        id_card: [
          { required: true, validator: this.$valid.isIdCard(), trigger: "blur" }
        ],
        mobile_phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: this.$valid.isPhone(false), trigger: "blur" }
        ]
      },
      settlerRules2: {
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        id_card: [
          { required: true, message: "请输入统一社会信用代码", trigger: "blur" }
        ],
        mobile_phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: this.$valid.isPhone(false), trigger: "blur" }
        ]
      },
      selectReckoner: []
    };
  },
  created() {
    this.renderTable(this.settlerInfo);
  },
  methods: {
    // 创建结算人
    createdSettler() {
      this.cleanForm("personal");
      this.settlerDialog = true;
    },
    cleanForm(type) {
      this.settlerForm = {
        type: type,
        type_display: type === "personal" ? "个人" : "企业",
        name: "",
        mobile_phone: "",
        id_card: "",
        contact_name: "",
        bank_cards: [
          {
            bank_id: "",
            bank_display: "",
            bank_branch_name: "",
            bank_card: ""
          }
        ],
        oil_cards: [{}],
        wjy_settlement_accounts: [
          {
            type: type,
            name: "",
            id_card: "",
            account: "",
            vehicle_number: ""
          }
        ]
      };
    },
    handleTypeChanged(type) {
      this.useCurDriver = false;
      this.cleanForm(type);
      if (type === "personal") {
        this.$refs["settlerForm1"].clearValidate();
      } else {
        this.$refs["settlerForm2"].clearValidate();
      }
    },
    // 验证银行卡
    validatorBank() {
      let bank = this.settlerForm.bank_cards[0];
      if (!bank.bank_id) {
        this.$message.warning("请选择开户行");
        return false;
      } else if (!bank.bank_branch_name) {
        this.$message.warning("请输入支行名称");
        return false;
      } else if (!bank.bank_card) {
        this.$message.warning("请输入开户行账号");
        return false;
      } else {
        return true;
      }
    },
    // 验证万金油账号
    validatorWjy() {
      let wjy = this.settlerForm.wjy_settlement_accounts[0];
      if (this.settlerForm.type === "personal") {
        if (!wjy.name) {
          this.$message.warning("请输入万金油姓名");
          return false;
        } else if (!wjy.vehicle_number || !isCarNumber(wjy.vehicle_number)) {
          this.$message.warning("请输入正确的车牌号");
          return false;
        } else if (!wjy.id_card || !isIdCard(wjy.id_card)) {
          this.$message.warning("请输入正确的身份证号");
          return false;
        } else if (!wjy.account || !isPhone(wjy.account)) {
          this.$message.warning("请输入正确的万金油账号");
          return false;
        } else {
          return true;
        }
      } else {
        if (!wjy.name) {
          this.$message.warning("请输入企业名称");
          return false;
        } else if (!wjy.account) {
          this.$message.warning("请输入万金油账户");
          return false;
        } else {
          return true;
        }
      }
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.cleanForm("personal");
    },
    // 回显渲染tableData
    renderTable(data) {
      let tData = _.cloneDeep(data);
      if (tData.length > 0) {
        tData.map(ele => {
          ele.bank_display = "";
          ele.bank_branch_name = "";
          ele.bank_card = "";
          ele.card_number = ""; // 加油卡号
          ele.account = ""; // 万金油账号
          if (ele.hasOwnProperty("bank_cards") && ele.bank_cards.length > 0) {
            ele.bank_cards.map(bank => {
              if (bank.default) {
                ele.bank_display = bank.bank_display;
                ele.bank_branch_name = bank.bank_branch_name;
                ele.bank_card = bank.bank_card;
              }
            });
          }
          if (ele.hasOwnProperty("oil_cards") && ele.oil_cards.length > 0) {
            ele.oil_cards.map(oilCard => {
              if (oilCard.default) {
                ele.card_number = oilCard.card_number;
              }
            });
          }
          if (
            ele.hasOwnProperty("wjy_settlement_accounts") &&
            ele.wjy_settlement_accounts.length > 0
          ) {
            ele.wjy_settlement_accounts.map(wjy => {
              if (wjy.default) {
                ele.account = wjy.account;
              }
            });
          }
        });
        this.tableData = [...tData, ...this.tableData];
      }
    },
    // 设置默认关联结算人
    setDefSettler(row, index) {
      this.tableData.map(ele => {
        ele.default = false;
      });
      this.tableData[index].default = true;
    },
    // 取消关联
    cancelRelated(row, index) {
      this.tableData.splice(index, 1);
      if (this.tableData.length > 0) {
        let status = this.tableData.find(ele => {
          return ele.default === true;
        });
        if (!status) {
          this.tableData[0].default = true;
        }
      }
    },
    // 创建关联结算人 获取 id
    async submitSettler(loading, params) {
      return new Promise(resolve => {
        $post(api.settlementAccount, params)
          .then(data => {
            loading(false);
            this.$message.success("创建成功");
            let status = false;
            if (this.tableData.length <= 0) {
              status = true;
            }
            this.renderTable([
              { id: data.settlementAccountId, default: status, ...params }
            ]);
            resolve(true);
          })
          .catch(() => {
            loading(false);
            resolve(false);
          });
      });
    },
    // 创建关联结算人
    clickSureBtn(loading) {
      let params = _.cloneDeep(this.settlerForm);
      if (params.type === "personal") {
        this.$refs.settlerForm1.validate(async valid => {
          if (valid) {
            if (
              _.compact(_.values(params.bank_cards[0])).length === 0 &&
              _.compact(_.values(params.wjy_settlement_accounts[0])).length ===
                1 &&
              _.isEmpty(params.oil_cards[0])
            ) {
              this.$message.warning(
                "银行卡、加油卡、万金油三项至少填写其中一项"
              );
              return;
            } else {
              if (_.compact(_.values(params.bank_cards[0])).length > 0) {
                let {
                  key: bank_id,
                  value: bank_display
                } = params.bank_cards[0].bank_id;
                delete params.bank_cards[0].bank_id;
                params.bank_cards[0].bank_id = bank_id;
                params.bank_cards[0].bank_display = bank_display;
                params.bank_cards[0].default = true;
                if (!this.validatorBank()) return;
              } else {
                params.bank_cards = [];
              }
              if (
                _.compact(_.values(params.wjy_settlement_accounts[0])).length >
                1
              ) {
                params.wjy_settlement_accounts[0].default = true;
                if (!this.validatorWjy()) return;
              } else {
                params.wjy_settlement_accounts = [];
              }
            }
            if (!_.isEmpty(params.oil_cards[0])) {
              params.oil_cards[0].id = params.oil_cards[0].key;
              params.oil_cards[0].card_number = params.oil_cards[0].value;
              params.oil_cards[0].default = true;
              delete params.oil_cards[0].key;
              delete params.oil_cards[0].value;
            } else {
              params.oil_cards = [];
            }
            let status = await this.submitSettler(loading, params);
            if (status) {
              this.resetForm("settlerForm1");
              this.settlerDialog = false;
            }
          }
        });
      } else {
        this.$refs.settlerForm2.validate(async valid => {
          if (valid) {
            params.oil_cards = [];
            if (
              _.compact(_.values(params.bank_cards[0])).length === 0 &&
              _.compact(_.values(params.wjy_settlement_accounts[0])).length ===
                1
            ) {
              this.$message.warning("银行卡、万金油两项至少填写其中一项");
              return;
            } else {
              if (_.compact(_.values(params.bank_cards[0])).length > 0) {
                let {
                  key: bank_id,
                  value: bank_display
                } = params.bank_cards[0].bank_id;
                delete params.bank_cards[0].bank_id;
                params.bank_cards[0].bank_id = bank_id;
                params.bank_cards[0].bank_display = bank_display;
                params.bank_cards[0].default = true;
                if (!this.validatorBank()) return;
              } else {
                params.bank_cards = [];
              }
              if (
                _.compact(_.values(params.wjy_settlement_accounts[0])).length >
                1
              ) {
                params.wjy_settlement_accounts[0].default = true;
                if (!this.validatorWjy()) return;
              } else {
                params.wjy_settlement_accounts = [];
              }
            }

            let status = await this.submitSettler(loading, params);
            if (status) {
              this.resetForm("settlerForm2");
              this.settlerDialog = false;
            }
          } else {
            return false;
          }
        });
      }
    },
    linkReckoner() {
      this.dialogReckoner=true
      this.selectReckoner = this.tableData.map(item => {
        return {
          id: item.id,
          name: item.name
        }
      })
    },
    // 关联结算人
    getSelectReckoner(val) {
      val.forEach((item, index) => {
        if (this.tableData.length > 0) {
          item.default = false
        } else {
          if (index === 0) {
            item.default = true
          } else {
            item.default = false
          }
        }
      })
      this.tableData = val.concat(this.tableData);
    }
  }
};
</script>
<style lang="scss" scoped>
.settler-form {
  width: 100%;
  &/deep/ .el-row {
    width: 100%;
  }
}
</style>
