<template>
  <div>
    <div class="reckoner">
      <p class="label">结算人信息：</p>
      <p class="label name-phone" v-if="defaultReckoner.name">
        <span>姓名：{{defaultReckoner.name}}</span>
        <span style="display: inline-block; margin-left: 40px;">手机号：{{defaultReckoner.mobile_phone}}</span>
      </p>
      <div class="reckoner-info">
        <div class="item" v-if="defaultReckoner.bank_cards.length > 0">
          <p>银行卡</p>
          <nf-select
            placeholder="请选择银行卡"
            :props="{key: 'id', value: 'bank_card'}"
            :options="defaultReckoner.bank_cards"
            :value.sync="formData.bank_id">
          </nf-select>
        </div>
        <div class="item" v-if="defaultReckoner.oil_cards.length > 0">
          <p>油卡</p>
          <nf-select
            placeholder="请选择油卡"
            :props="{key: 'id', value: 'card_number'}"
            :options="defaultReckoner.oil_cards"
            :value.sync="formData.oil_id">
          </nf-select>
        </div>
        <div class="item" v-if="defaultReckoner.wjy_settlement_accounts.length > 0">
          <p>万金油</p>
          <nf-select
            placeholder="请选择万金油"
            :props="{key: 'id', value: '_account'}"
            :options="defaultReckoner.wjy_settlement_accounts"
            :value.sync="formData.wjy_id">
          </nf-select>
        </div>
        <div class="select-other">
          <el-button type="primary" @click="selectOtherReckoner">选择其他结算人</el-button>
        </div>
        <div class="select-payway">
          <el-form :model="formData" ref="ruleForm" :rules="formRules" inline label-position="top">
            <el-form-item
              v-for="(item, index) in formData.payTypes"
              :key="index"
              :label="item.label"
              :prop="'payTypes.' + index + '.amount'"
              :rules="[
                {validator: $valid.isFloatNumber(true, '请输入金额'), trigger: 'blur'}
              ]">
              <el-input placeholder="请输入金额" v-model="item.amount">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" @click="editPayTypes">修改支付方式</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 选择结算人 -->
    <nf-select-reckoner
      :dialog-reckoner.sync="dialogReckoner"
      :beRelated="beRelated"
      :truckId="dispatch.truck"
      @select-change="getSelectReckoner">
    </nf-select-reckoner>
     <!-- 修改支付方式 -->
    <nf-select-pay
      :dialog-pay.sync="dialogPay"
      @update-paytype="updatePayType"
      :data="payTypes"
      :select-data="defaultPays">
    </nf-select-pay>
  </div>
</template>

<script>
/**
 * @Description: 结算人组件
 * @Author: wjw
 * @Date: 2020-04-26 15:14:18
 */
export default {
  props: {
    reckonerList: {
      type: Array,
      default: () => []
    },
    dispatch: {
      type: Object,
      default: () => {}
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogPay: false,
      dialogReckoner: false,
      beRelated: false,
      defaultReckoner: {},
      payTypes: [],
      defaultPays: [],
      formData: {
        bank_id: '',
        oil_id: '',
        wjy_id: '',
        settlement_account: '', // 结算人id
        payTypes: [
          {label: '银行卡转账', amount: ''}
        ]
      }
    }
  },
  methods: {
    //处理结算人default数据
    getReckonerDefault() {
      this.defaultReckoner.bank_cards.forEach(bankcard => {
        if (bankcard.default) {
          this.formData.bank_id = bankcard.id
        }
      })
      this.defaultReckoner.oil_cards.forEach(oilcard => {
        if (oilcard.default) {
          this.formData.oil_id = oilcard.id
        }
      })
      this.defaultReckoner.wjy_settlement_accounts.forEach(wjy => {
        if (wjy.default) {
          this.formData.wjy_id = wjy.id
        }
      })
    },
    // 默认支付方式
    setDefaultPayMethod() {
      if (this.defaultReckoner.bank_cards.length > 0) {
        this.formData.payTypes = [{
          id: 'bank_id',
          pay_method: 'bank_card',
          label: '银行转账',
          amount: ''
        }]
      } else if (this.defaultReckoner.oil_cards.length > 0) {
        this.formData.payTypes = [{
          id: 'oil_id',
          pay_method: 'oil_card',
          label: '油卡',
          amount: ''
        }]
      } else if (this.defaultReckoner.wjy_settlement_accounts.length > 0) {
        this.formData.payTypes = [{
          id: 'wjy_id',
          pay_method: 'wjy',
          label: '万金油',
          amount: ''
        }]
      }
    },
    // 选择其他结算人
    selectOtherReckoner() {
      this.dialogReckoner = true
      this.beRelated = true
    },
    // 获取选择的结算人信息
    getSelectReckoner(value) {
      // 关联结算人
      value.wjy_settlement_accounts.forEach(item => {
        let _account = `${item.name} (${item.account})`
        this.$set(item, '_account', _account)
      })
      this.defaultReckoner = value
      this.formData.settlement_account = this.defaultReckoner.id
      this.setDefaultPayMethod()
      this.getReckonerDefault()
    },
    // 选择支付方式
    editPayTypes() {
      this.dialogPay = true
      this.payTypes = []
      if (this.defaultReckoner.bank_cards.length > 0) {
        this.payTypes.push(
          {key: 'bank_card', value: '银行转账'}
        )
      }
      if (this.defaultReckoner.oil_cards.length > 0) {
        this.payTypes.push(
          {key: 'oil_card', value: '油卡'}
        )
      }
      if (this.defaultReckoner.wjy_settlement_accounts.length > 0) {
        this.payTypes.push(
          {key: 'wjy', value: '万金油'}
        )
      }
      this.payTypes.push(
        {key: 'default', value: '其他'}
      )
      this.defaultPays = this.formData.payTypes.map(item => item.pay_method)
    },
    // 更新支付方式
    updatePayType(val) {
      this.formData.payTypes = []
      val.forEach(item => {
        switch(item) {
          case 'bank_card':
            this.formData.payTypes.push({
              id: 'bank_id',
              pay_method: 'bank_card',
              label: '银行转账',
              amount: ''
            })
            break
          case 'oil_card':
            this.formData.payTypes.push({
              id: 'oil_id',
              pay_method: 'oil_card',
              label: '油卡',
              amount: ''
            })
            break
          case 'wjy':
            this.formData.payTypes.push({
              id: 'wjy_id',
              pay_method: 'wjy',
              label: '万金油',
              amount: ''
            })
            break
          case 'default':
            this.formData.payTypes.push({
              id: 'default_id',
              pay_method: 'default',
              label: '其他',
              amount: ''
            })
            break
        }
      })
    }
  },
  created() {
    this.reckonerList.forEach(reckoner => {
      if (reckoner.default) {
        reckoner.wjy_settlement_accounts.forEach(item => {
          let _account = `${item.name} (${item.account})`
          this.$set(item, '_account', _account)
        })
        this.defaultReckoner = reckoner
        return false
      }
    })
    if (!this.defaultReckoner.id) {
      this.defaultReckoner = this.reckonerList[0]
    }
    this.formData.settlement_account = this.defaultReckoner.id
    if (!this.isEditing) {
      this.setDefaultPayMethod()
      this.getReckonerDefault()
    }
  }
};
</script>

<style lang="scss" scoped>
  .reckoner{
    margin-top: 30px;
    .label{
      font-size: 18px;
      &.name-phone{
        font-size: 14px;
      }
    }
  }
  .reckoner-info{
    .item{
      display: inline-block;
      &+.item{
        margin-left: 20px;
      }
      p{
        margin-top: 0;
      }
    }
    .nf-select{
      width: 240px;
    }
  }
  .select-other{
    margin-top: 20px;
  }
  .select-payway{
    margin-top: 20px;
  }
</style>
