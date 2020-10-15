<template>
    <transition name="fade" mode="out-in">
      <div ref="contextmenu" class="nf-contextmenu" id="nf-contextmenu" v-if="showContextmenu">
        <slot name="content" />
      </div>
    </transition>

</template>

<script>
//    <nf-contextmenu :show-contextmenu.sync="showContextmenu">
//       <ul slot="content">
//         <li>11111</li>
//         <li>22222</li>
//         <li>33333</li>
//       </ul>
//     </nf-contextmenu>
//     <el-tag style="margin-left: 220px" @contextmenu.native.prevent="contextmenuClick">右键菜单</el-tag>
/**
 * @Description: 右键菜单容器组件
 * @Author: wjw
 * @Date: 2020-01-07 18:33:53
 */
export default {
  name: 'NfContextmenu',
  props: {
    showContextmenu: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    slideClick(e) {
      // 当弹框不包含被点击的元素时，关闭弹框
      if (this.$refs.contextmenu) {
        if (!(this.$refs.contextmenu.contains(e.target))) {
          this.$emit('update:showContextmenu', false)
        }
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.slideClick)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.slideClick)
  }
}
</script>

<style lang="scss" scoped>
  .nf-contextmenu{
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    position: fixed;
    min-width: 100px;
    z-index: 100;
    border-radius: 5px;
    background-color: #fff;
    box-sizing: border-box;
  }
</style>
