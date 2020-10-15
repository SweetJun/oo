<template>
  <div class="nf-form-wrap" :class="{'show-footer': showFooter}">
    <el-card>
      <div slot="header" v-if="title">
        <span>{{title}}</span>
        <slot name="card-header"></slot>
      </div>
      <slot></slot>
    </el-card>
    <!-- 如果没有重置按钮 和提交按钮 默认footer不显示 -->
    <footer class="form-btn-warp" v-if="showFooter" :class="[isCollapse ? 'collapsed' : '']">
      <el-button
        v-if="onSaveBtnClick"
        type="primary"
        :loading="isLoading"
        @click="handleSaveClick">
        {{ saveBtnText }}
      </el-button>
      <el-button
        v-if="onResetBtnClick"
        type="warning"
        @click="onResetBtnClick">
        {{ resetBtnText }}
      </el-button>
      <el-button
        @click="$router.back()">
        返 回
      </el-button>
      <slot name="foot-btn" />
    </footer>
  </div>
</template>
<script>
export default {
  name: 'NfFormWrap',
  props: {
    // 按钮点击事件回调
    onSaveBtnClick: {
      type: [Function, Boolean],
      default: false
    },
    // 重置按钮 如果有此方法则显示按钮
    onResetBtnClick: {
      type: [Function, Boolean],
      default: false
    },
    // 标题文字
    title: {
      type: String,
      default: ''
    },
    // 提交按钮文字
    saveBtnText: {
      type: String,
      default: '提 交'
    },
    // 重置文字按钮
    resetBtnText: {
      type: String,
      default: '重 置'
    },
    // 是否显示按钮组
    showFooter: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    isCollapse() {
      return this.$store.state.layout.isCollapse
    }
  },
  methods: {
    handleSaveClick() {
      if (this.onSaveBtnClick) {
        this.onSaveBtnClick((loading = true)=>{
          this.isLoading = loading
        })
      }
    }
  }
};
</script>
<style lang="scss" scoped >
.nf-form-wrap {
  position: relative;
  margin-bottom: 10px;
  &.show-footer{
    margin-bottom: 80px;
  }
  .el-card{
    box-shadow: 0 1px 12px 0 rgba(0,0,0,.05);
  }
}
.el-card /deep/{
  .el-card__header{
    font-size: 16px;
    color: #409eff;
    font-weight: 700;
  }
}
footer {
  width: 100%;
  padding: 20px;
  position: fixed;
  z-index: 4;
  bottom: 0;
  right: 0;
  background-color: #fff;
  left: 220px;
  transition: .3s ease-in-out;
  perspective: none;
  backface-visibility: hidden;
  box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.1);
  &.collapsed{
    left: 62px;
  }
  button {
    width: 100px;
    &+.el-button{
      margin-left: 15px;
    }
  }
}
</style>
