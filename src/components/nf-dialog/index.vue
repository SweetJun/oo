<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="title"
    v-el-drag-dialog
    :append-to-body="appendToBody"
    :close-on-click-modal="closeOnClickModal"
    :visible.sync="dialogVisible"
    :center="isCenter"
    @close="dialogClose"
    :width="width">
    <!-- 自定义内容 -->
    <slot name="content" />

    <span v-if="!customFooterBtns" slot="footer">
      <el-button size="medium" @click="dialogVisible = false">{{cancelBtnText}}</el-button>
      <el-button
        v-if="clickSureBtn"
        size="medium"
        type="primary"
        :disabled="disabled"
        :loading="saveBtnLoading"
        @click="dialogSureClick">
        {{saveBtnText}}
      </el-button>
    </span>
    <!-- 显示自定义底部 -->
    <slot v-else name="footer" />
  </el-dialog>
</template>

<script>
/**
 * @Description: el-dialog 二次封装
 * @Author: wjw
 * @Date: 2020-01-08 12:00:08
 */
export default {
  name: 'NfDialog',
  props: {
    // 是否插入到body
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 是否居中
    isCenter: {
      type: Boolean,
      default: false
    },
    // 是否显示弹框
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: '提示'
    },
    // 弹框宽度
    width: {
      type: String,
      default: '500px'
    },
    // 点击遮罩隐藏
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    // 自定义底部按钮
    customFooterBtns: {
      type: Boolean,
      default: false
    },
    // 按钮点击事件回调
    clickSureBtn: {
      type: [Function, Boolean],
      default: false
    },
    // 按钮点击事件回调
    closeDialog: {
      type: [Function, Boolean],
      default: false
    },
    // 是否可点击
    disabled: {
      type: Boolean,
      default: false
    },
    // 确认按钮文字
    saveBtnText: {
      type: String,
      default: '确 认'
    },
    // 关闭按钮文字
    cancelBtnText: {
      type: String,
      default: '取 消'
    }
  },
  data() {
    return {
      saveBtnLoading: false
    }
  },
  methods: {
    // 确定事件
    dialogSureClick() {
      if (this.clickSureBtn) {
        this.clickSureBtn((loading = false)=>{
          this.saveBtnLoading = loading
        })
      }
    },
    // 弹框关闭事件
    dialogClose() {
      // 关闭弹框回调（嵌套有用）
      if (this.closeDialog) {
        this.closeDialog()
      } else {
        this.saveBtnLoading = false
        this.$emit('update:dialogVisible', false)
      }
    }
  }
}
</script>
