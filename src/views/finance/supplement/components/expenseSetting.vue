<template>
  <div>
    <nf-dialog
      :title="title"
      :dialog-visible.sync="dialogExpense"
      width="780px"
      @close="dialogClose"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <p class="expense-money">{{expense.item_name}}：{{expense.item_total_price}}元 <el-checkbox v-model="expense.as_borrowing">当做借支</el-checkbox></p>
        <el-form
          :model="expense.pay_methods"
          ref="ruleForm"
          inline
          label-position="top">
          <el-form-item
            v-for="(value, key, index) in expense.pay_methods"
            :key="index"
            :label="payMethods[key]"
            :prop="key"
            :rules="[
              {validator: $valid.isFloatNumber(false, '请输入金额'), trigger: 'blur'}
            ]">
            <el-input placeholder="请输入金额" v-model="expense.pay_methods[key]">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
/**
 * @Description: 费用项有关的支付方式及金额设置
 * @Author: wjw
 * @Date: 2020-04-26 15:24:12
 */
export default {
  props: {
    dialogExpense: {
      type: Boolean,
      default: false
    },
    // 费用项的支付方式
    expense: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      title: '费用项设置',
      payMethods: {
        bank_card: '银行转账',
        oil_card: '加油卡',
        wjy: '万金油',
        default: '其他'
      }
    }
  },
  methods: {
    // 确认选择
    clickSureBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.dialogClose()
          this.expense.item_total_price = 0
          _.forIn(this.expense.pay_methods, (value) => {
            this.expense.item_total_price += Number(value)
          })
          this.expense.item_total_price = Number(Number(this.expense.item_total_price).toFixed(2))
          this.$emit('set-success', this.expense)
        } else {
          return false
        }
      })

    },
    // 弹框关闭事件
    dialogClose() {
      this.dialogExpense = false
      this.$emit('update:dialogExpense', false)
    }
  },
  watch: {
    dialogExpense(val) {
      if (!val) return
      this.title = this.expense.item_name + '设置'
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form-item{
    width: 175px;
  }
  .expense-money{
    font-size: 20px;
  }
</style>
