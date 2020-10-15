<template>
  <div>
    <div class="scene2">
      <el-form :model="formData" ref="formData" :rules="formDataRules" inline label-position="top">
        <el-form-item label="百分比" prop="percent">
          <el-input
            style="width: 210px;"
            class="percent"
            placeholder="请输入占借支总额的比率"
            v-model.number="formData.percent"
            @input="percentChange(formData.percent)">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-for="(pay, index) in formData.payMethods"
          :key="index"
          :label="pay.name"
          :prop="'payMethods.' + index + '.percent'"
          :rules="{
            required: true, message: '请输入0-100的数字', trigger: 'blur'
          }">
          <el-input class="percent" placeholder="请输入百分比" v-model.number="pay.percent">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="editPayTypes">修改支付方式</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    // 后台数据支持（下拉等）
    dataSupport: {
      type: Object,
      default: () => {}
    },
    // 占借支总额的比率
    percent: {
      type: [Number, String],
      default: ''
    },
    // 条件组
    payMethods: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {
        percent: '',
        payMethods: []
      },
      formDataRules: {
        percent: [{validator: this.$valid.isPercent(), trigger: 'blur'}]
      }
    }
  },
  methods: {
    // 百分比改变
    percentChange(val) {
      this.$emit('update-percent', val)
    },
    // 修改支付方式
    editPayTypes() {
      this.$emit('editPayTypes')
    }
  },
  mounted() {
    this.formData.payMethods = this.payMethods
    this.formData.percent = this.percent ? this.percent : ''
  },
  watch: {
    payMethods: {
      handler(newVal) {
        this.formData.payMethods = newVal
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .scene2{
    border-radius: 6px;
    box-shadow: 0px 1px 8px rgba(102, 102, 102, 0.35);
    padding: 15px;
    margin: 8px 5px;
    position: relative;
  }
  .el-form--inline .el-form-item{
    width: auto;
  }
  .percent{
    width: 145px;
    /deep/.el-input-group__append{
      padding: 0 5px;
    }
  }
</style>
