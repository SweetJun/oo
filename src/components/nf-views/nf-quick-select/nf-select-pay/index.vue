<template>
  <div>
    <!-- 添加费用 -->
    <nf-dialog
      class="nf-dialog"
      title="设置支付方式"
      :dialog-visible.sync="dialogPay"
      width="600px"
      @close="dialogClose"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <el-checkbox-group v-model="selectData">
          <el-checkbox
            v-for="(item, index) in data"
            :key="index"
            :label="item.key">
            {{item.value}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </nf-dialog>
  </div>
</template>
<script>
export default {
  name: 'nfSelectPay',
  props: {
    dialogPay: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    // 选择项
    selectData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    // 确认添加费用
    clickSureBtn() {
      this.dialogPay = false
      // 更新父组件支付方式
      this.$emit('update-paytype', this.selectData)
      this.$emit('update:dialogPay', false)
    },
    // 弹框关闭事件
    dialogClose() {
      this.dialogPay = false
      this.$emit('update:dialogPay', false)
    }
  }
}
</script>
