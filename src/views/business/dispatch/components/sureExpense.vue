<template>
  <nf-dialog
    title="确认费用"
    :dialog-visible.sync="dialogExpense"
    width="1000px"
    @close="dialogClose"
    :click-sure-btn="clickSureBtn">
    <div class="nf-dialog-content" slot="content">
      <el-form :model="formData" ref="formData" inline label-position="top">
        <div class="table-container">
          <el-table
            :data="formData.data"
            max-height="500"
            v-loading="tableLoading">
            <el-table-column label="出发地" prop="from_display" min-width="100"></el-table-column>
            <el-table-column label="目的地" prop="to_display" min-width="100"></el-table-column>
            <el-table-column label="商品车台数" prop="vehicles_number" min-width="80"></el-table-column>
            <el-table-column label="计费策略" min-width="140">
              <template slot-scope="{row}">
                <nf-select
                  placeholder="请选择计费策略"
                  :options="row.ruleList"
                  :props="{key: 'id', value: 'name'}"
                  :clearable="false"
                  :value.sync="row.rule_id"
                  @change="ruleChanged(row)">
                </nf-select>
              </template>
            </el-table-column>
            <el-table-column min-width="120">
              <template slot="header">
                <span class="required">*</span> 费用
              </template>
              <template slot-scope="scope">
                <el-form-item
                  :prop="'data.' + scope.$index + '.total_price'"
                  :rules="[
                    { required: true, validator: $valid.isFloatNumber(true, '请输入金额'), trigger: 'blur' }
                  ]">
                  <el-input v-model="scope.row.total_price" :disabled="!canEditPrice" placeholder="请输入金额"/>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
          <div class="sum-expense">
            合计费用: {{totalMoney | toFixedMonty | toThousandFilter}} 元
          </div>
        </div>
      </el-form>
    </div>
  </nf-dialog>
</template>

<script>
/**
 * @Description: 添加调令
 * @Author: wjw
 * @Date: 2020-04-13 19:18:33
 */
export default {
  props: {
    dialogExpense: {
      type: Boolean,
      default: false
    },
    expenseData: {
      type: Array,
      default: () => []
    },
    dispatchData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      canEditPrice: true,
      formData: {
        data: []
      }
    }
  },
  computed: {
    totalMoney() {
      let totalPrice = 0
      this.formData.data.forEach(item => {
        totalPrice += Number(item.total_price)
      })
      return totalPrice
    }
  },
  methods: {
    getRuleList() {
      let postParams = {
        dispatch: {
          transport_type: this.dispatchData.transport_type,
          truck: this.dispatchData.truck
        },
        commands: this.expenseData.map(item => {
          return {
            from: item.from,
            to: item.to,
            carry_type: item.carry_type,
            vehicles: item.vehicles.map(vehicle => Number(vehicle.id.split('_')[0]))
          }
        })
      }
      $post(api.expenseRuleMatchingTotalPrice, postParams).then(res => {
        this.canEditPrice = res.can_edit_total_expense
        let commands = res.data
        this.formData.data.forEach(dispatch => {
          let key = `${dispatch.from}${dispatch.to}`
          let command = commands.find(item => key === item.command_key)
          if (command) {
            dispatch.ruleList = command.ruleList
            if (dispatch.ruleList.length > 0) {
              dispatch.rule_id = dispatch.ruleList[0].id
              dispatch.total_price = this.moneyCentToYuan(dispatch.ruleList[0].total_price)
            }
          }
        })
      })
    },
    ruleChanged(row) {
      let rule = row.ruleList.find(item => row.rule_id === item.id)
      if (rule) {
        row.total_price = this.moneyCentToYuan(rule.total_price)
      }
    },
    clickSureBtn() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          // 保存完费用
          let data = {
            money: this.totalMoney,
            commands: this.expenseData
          }
          this.$emit('expense-save', data)
        } else {
          return false
        }
      })
    },
    dialogClose() {
      this.dialogExpense = false
      this.$emit('update:dialogExpense', false)
    }
  },
  watch: {
    dialogExpense(val) {
      if (!val) return
      this.$nextTick(() => {
        this.formData.data = this.expenseData
        this.$refs['formData'].clearValidate()
        this.getRuleList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-container /deep/{
    td{
      padding: 0;
      .cell{
        padding: 20px 10px;
      }
    }
    .el-form-item{
      width: 100%;
      margin: 0;
    }
  }
  .sum-expense{
    font-size: 20px;
    margin-top: 20px;
    text-align: right;
  }
</style>
