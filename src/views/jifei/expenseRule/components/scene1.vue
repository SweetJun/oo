<template>
  <div>
    <el-form :model="conditionGroups" ref="conditionGroups" :rules="formRules" label-position="top">
      <div class="condition-group clearfix" v-for="(conditionGroup, _index) in conditionGroups" :key="_index">
        <div class="left-pays">
          <!-- 常规计算 -->
          <el-form-item label="金额" prop="price" v-if="formula === 'normal'">
            <el-input class="price" placeholder="请输入金额" v-model="conditionGroup.price">
              <template slot="append">元</template>
            </el-input>
            <el-select class="unit" v-model="conditionGroup.unit">
              <el-option
                v-for="(item, index) in dataSupport.price_units"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 油价计算 -->
          <el-form-item label="金额" v-if="formula === 'oil_expense'">
            <span class="oil_expense">金额将通过油耗*油价*实际里程计算得出。</span>
          </el-form-item>
          <!-- 支付方式 -->
          <div class="percent-box">
            <el-form-item
              v-for="(pay, index) in conditionGroup.pay_methods"
              :key="index"
              :label="pay.name"
              prop="percent" >
              <el-input class="percent" placeholder="请输入百分比" v-model="pay.percent">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-button type="primary" @click="editPayTypes(_index)">修改支付方式</el-button>
          </div>
        </div>
        <div class="line"></div>
        <!-- 高级条件 -->
        <div class="right-groups">
          <div class="condition-item" v-for="(condie, $index) in conditionGroup.condition" :key="$index">
            <template>
              <span class="item-index">{{$index + 1}}</span>
              <el-form-item prop="field">
                <el-select class="unit" v-model="condie.field" @change="conditionChanged(condie, condie.field)">
                  <el-option
                    v-for="(item, index) in dataSupport.condition_fields"
                    :key="index"
                    :label="item.name"
                    :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="operator" prop="operator">
                <el-select class="unit" v-model="condie.operator">
                  <el-option
                    v-for="(item, index) in dataSupport.condition_operator_types[condie.operator_type === 'compare' ? 'compare' : 'include']"
                    :key="index"
                    :label="item.value"
                    :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="value" prop="value">
                <!-- 远程搜索选择框 -->
                <nf-select
                  v-if="condie.operator_type === 'select'"
                  class="search-item"
                  placeholder="条件包含的属性"
                  :multiple="true"
                  :options="condie.options"
                  :value.sync="condie.value">
                </nf-select>
                <nf-select
                  v-else-if="condie.operator_type === 'auto_complete'"
                  class="search-item"
                  placeholder="条件包含的属性"
                  :multiple="true"
                  :options="condie.options"
                  :search-key="autocompleteKey"
                  :value.sync="condie.value">
                </nf-select>
                <el-input v-else placeholder="条件包含的属性" type="number" v-model.number="condie.value"/>
              </el-form-item>
              <el-form-item>
                <el-button type="danger" plain icon="el-icon-delete" @click="delCondition(conditionGroup.condition, $index)">删除</el-button>
              </el-form-item>
            </template>
            <template v-if="$index !== conditionGroup.condition.length - 1">
              <p class="and">并且</p>
            </template>
          </div>
          <el-button class="condition-btn" type="primary" @click="addCondition(conditionGroup)">添加高级条件</el-button>
        </div>
        <el-button
          title="删除条件组"
          class="delete-item-group"
          type="danger"
          icon="el-icon-close"
          plain
          @click="deleteConditionGroup(_index)"/>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    dataSupport: {
      type: Object,
      default: () => {}
    },
    // 计算方式
    formula: {
      type: String,
      default: 'normal'
    },
    // 条件组
    conditionGroups: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      operator_type: '',
      autocompleteKey: 'dealer_name',
      formRules: {}
    }
  },
  methods: {
    // 添加高级条件
    addCondition(conditionGroup) {
      // 为空时后台没返回condition字段
      if (!conditionGroup.condition) {
        this.$set(conditionGroup, 'condition', [])
      }
      conditionGroup.condition.push({
        field: '',
        operator: '',
        value: '',
        options: []
      })
    },
    // 删除高级条件
    delCondition(condition, index) {
      condition.splice(index, 1)
    },
    // 删除条件组
    deleteConditionGroup(_index) {
      this.$emit('delete-group', _index)
    },
    // 选择高级条件
    conditionChanged(condie, val) {
      condie.value = ''
      this.dataSupport.condition_fields.forEach(item => {
        if (item.key === val) {
          this.operator_type = item.operator_type
          if (item.operator_type === 'include') {
            this.$set(condie, 'operator_type', item.value_source_config.type)
            // 找出数据支持中的商品车类型和办事处下拉数据
            this.$set(condie, 'options', this.dataSupport.condition_fields_search_item_select[item.value_source_config.id])
            this.autocompleteKey = item.value_source_config.id
          } else {
            this.$set(condie, 'operator_type', item.operator_type)
          }
          condie.operator = this.dataSupport.condition_operator_types[this.operator_type][0].key
          return
        }
      })
    },
    // 修改支付方式
    editPayTypes(_index) {
      this.$emit('editPayTypes', _index)
    }
  }
}
</script>

<style lang="scss" scoped>
  .condition-group{
    border-radius: 6px;
    box-shadow: 0px 1px 8px rgba(102, 102, 102, 0.35);
    padding: 15px;
    margin: 20px 5px;
    position: relative;
  }
  .left-pays{
    width: 40%;
    float: left;
    display: block;
    padding-right: 20px;
    box-sizing: border-box;
    .price{
      width: 180px;
    }
    .unit{
      width: 100px;
      margin-left: 10px;
    }
    .percent /deep/{
      width: 150px;
      .el-input-group__append{
        padding: 0 5px;
      }
    }
  }
  .percent-box, .right-groups{
    .el-form-item{
      display: inline-block;
      margin-right: 10px;
    }
  }
  .right-groups{
    display: inline-block;
    padding-left: 20px;
    box-sizing: border-box;
    width: 60%;
    position: relative;
  }
  .delete-item-group{
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0px;
    border: 0;
    padding: 0 10px;
    font-weight: 600;
    font-size: 22px;
  }
  .el-form{
    position: relative;
    &::after{
      content: '';
      display: table;
      clear: both;
    }
    .line{
      left: 40%;
      top: 15px;
      bottom: 15px;
      width: 1px;
      position: absolute;
      background-color: #dcdfe6;
    }
  }
  .condition-item{
    padding-right: 45px;
    .item-index{
      display: inline-block;
      border: 1px solid #606266;
      width: 20px;
      border-radius: 50%;
      text-align: center;
      margin-right: 20px;
      height: 20px;
      line-height: 20px;
    }
    .operator{
      width: 100px;
    }
    .value{
      width: 240px;
      .el-select{
        display: block;
      }
    }
    .and{
      color: #333;
      font-weight: 600;
      margin-top: 0;
      margin-left: 40px;
      margin-bottom: 22px;
    }
  }
  .condition-btn{
    margin-left: 42px;
  }
  .oil_expense{
    font-size: 16px;
    font-weight: 700;
  }
</style>
