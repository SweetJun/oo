<template>
  <div v-loading="supportFinish">
    <!-- 基础信息 -->
    <base-info
      ref="baseInfo"
      @scene="getScene"
      @expenseCalculationPoint="expenseCalculationPoint">
    </base-info>
    <!-- 费用项 -->
    <expense-item
      ref="expenseItem"
      :scene="scene"
      :expense-calculation-point="expense_calculation_point"
      :data-support="dataSupport"
      @save-click="saveHandleClick">
    </expense-item>
  </div>
</template>

<script>
import baseInfo from './components/baseInfo'
import expenseItem from './components/expenseItem'
export default {
  components: {
    baseInfo,
    expenseItem
  },
  data() {
    return {
      expense_calculation_point: '',
      scene: '',
      supportFinish: false,
      dataSupport: {},
      condition_fields: {},
      pay_methods: {}
    }
  },
  methods: {
    // 获取场景
    getScene(scene) {
      this.$refs['expenseItem'].specifics.expense_items = []
      this.scene = scene
    },
    // 获取场景
    expenseCalculationPoint(val) {
      this.expense_calculation_point = val
    },
    // 获取数据支持
    getExpenseRuleSupport() {
      this.supportFinish = true
      $get(api.expenseRuleSupport).then(res => {
        this.dataSupport = res
        res.condition_fields.forEach(item => {
          if (item.operator_type === 'include') {
            this.condition_fields[item.key] = item.value_source_config.type
          } else {
            this.condition_fields[item.key] = item.operator_type
          }
        })
        res.pay_methods.forEach(item => {
          this.pay_methods[item.key] = item.value
        })
        this.supportFinish = false
        if (this.isEditing) {
          // 获取详情
          this.supportFinish = true
          this.getDetail(this.edit_id)
        }
      })
    },
    // 获取详情
    getDetail(id) {
      $get(`${api.expenseRule}/${id}`).then(res => {
        this.scene = res.scene
        this.supportFinish = false
        // 基础信息赋值
        this.$refs['baseInfo'].options.transport_type_name = [{
          key: res.transport_type,
          value: res.transport_type_display
        }]
        this.$refs['baseInfo'].options.truck_group = res.truck_group_display
        this.$refs['baseInfo'].options.driver_group = res.driver_group_display
        // 处理 返回 0 的情况
        if (res.from !== 0) {
          this.$refs['baseInfo'].options.region_from = [{
            key: res.from,
            value: res.from_display
          }]
        }
        if (res.to !== 0) {
          this.$refs['baseInfo'].options.region_to = [{
            key: res.to,
            value: res.to_display
          }]
        }
        this.$refs['baseInfo'].formData = {
          name: res.name,
          transport_type: res.transport_type,
          calculate_mode: res.calculate_mode,
          carry_type: res.carry_type,
          scene: res.scene,
          truck_group: res.truck_group_display.map(item => item.key),
          driver_group: res.driver_group_display.map(item => item.key),
          from: res.from === 0 ? '' : res.from,
          to: res.to === 0 ? '' : res.to
        }
        // 费用项赋值
        res.specifics.expense_items.forEach(expense_item => {
          // 匹配费用项名称
          this.$set(expense_item, 'item_name', res.item_name[expense_item.item_id])
          if (res.scene === 'borrow' && res.calculate_mode === 'percent') {
            expense_item.pay_methods.forEach(pay => {
              // 匹配支付方式名称
              this.$set(pay, 'name', this.pay_methods[pay.method])
            })
          }
          if (expense_item.condition_groups) {
            expense_item.condition_groups.forEach(item => {
              if(item.price) {
                this.$set(item, 'price', this.moneyCentToYuan(item.price))
              }
              if (item.pay_methods) {
                item.pay_methods.forEach(pay => {
                  // 匹配支付方式名称
                  this.$set(pay, 'name', this.pay_methods[pay.method])
                })
              }
              if (item.condition) {
                item.condition.forEach(condie => {
                  // // 匹配高级条件下拉
                  this.$set(condie, 'operator_type', this.condition_fields[condie.field])
                  if (condie.field === 'dispatching_agency') {
                    this.$set(condie, 'options', this.dataSupport.condition_fields_search_item_select['agency'])
                  } else if (condie.field === 'vehicle_type') {
                    this.$set(condie, 'options', this.dataSupport.condition_fields_search_item_select['vehicle_type'])
                  } else {
                    let options = []
                    for(let key in res.field_value[condie.field]) {
                      options.push({
                        key: Number(key),
                        value: res.field_value[condie.field][key]
                      })
                    }
                    this.$set(condie, 'options', options)
                  }
                })
              }
            })
          }
        })
        if (res.scene === 'borrow') {
          this.$refs['expenseItem'].computeType = res.calculate_mode
        }
        this.$refs['expenseItem'].activeTabName = res.specifics.expense_items[0].item_id
        this.$refs['expenseItem'].specifics = res.specifics
      })
    },
    // 保存
    saveHandleClick(loading) {
      let specifics = _.cloneDeep(this.$refs['expenseItem'].specifics)
      // 验证，当选择了高级条件后，包含条件不能为空
      for (let i = 0; i < specifics.expense_items.length; i++) {
        let expense_item = specifics.expense_items[i]
        if (expense_item.condition_groups) {
          for (let j = 0; j < expense_item.condition_groups.length; j++) {
            let group = expense_item.condition_groups[j]
            if (group.condition) {
              for (let k = 0; k < group.condition.length; k++) {
                let condie = group.condition[k]
                if (condie.field) {
                  if (Array.isArray(condie.value)) {
                    if (condie.value.length === 0) {
                      this.$message.warning('包含条件请检查不能为空，请完善！')
                      return false
                    }
                  } else {
                    if (!condie.value) {
                      this.$message.warning('包含条件请检查不能为空，请完善！')
                      return false
                    }
                  }
                }
              }
            }
          }
        }
      }
      // 验证结束

      let baseInfo = _.cloneDeep(this.$refs['baseInfo'].formData)
      let payType = baseInfo.scene === 'borrow' && this.$refs['expenseItem'].computeType === 'percent'
      if (!payType) {
        // 当计算方式为 油价时，删除价格和计算单位字段
        specifics.expense_items.forEach(expense_item => {
          expense_item.condition_groups.forEach(item => {
            if (expense_item.formula === 'oil_expense') {
              this.$delete(item, 'price')
              this.$delete(item, 'unit')
            }else {
              this.$set(item, 'price', this.moneyYuanToCent(item.price))
            }
          })
        })
      }
      // 入参
      let postData = {
        ...baseInfo,
        calculate_mode: this.$refs['expenseItem'].computeType,
        specifics: specifics
      }
      // TODO: 先验证子组件表单
      this.$refs['baseInfo'].$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true)
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.expenseRule}/${this.edit_id}`
            $put(apiUrl, postData).then(() => {
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.expenseRule, postData).then(() => {
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
    this.getExpenseRuleSupport()
    this.edit_id = this.$route.query.id;
    this.isEditing = this.edit_id ? true : false
  }
}
</script>
