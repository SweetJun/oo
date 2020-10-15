<template>
  <div class="nf-infinite-scroll">
    <slot name="content" />
  </div>
</template>

<script>
/**
 * @Description: 滚动到底部加载（滚动条分页）
 * @Author: wjw
 * @Date: 2020-04-013 14:33:53
 */
import { debounce } from 'throttle-debounce'
export default {
  name: 'nfInfiniteScroll',
  props: {
    target: {
      type: String,
      default: ''
    },
    // 滚动到底部触发的方法
    infiniteScroll: {
      type: [Function, Boolean],
      default: false
    },
    // 节流时间
    infiniteScrollDelay: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {}
  },
  methods: {
    // 滚动到底部
    scrollToBottom() {
      const container = this.container
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
        if (this.infiniteScroll) {
          this.infiniteScroll()
        }
      }
    }
  },
  mounted() {
    this.container = document
    this.$nextTick(() => {
      let _target = '.nf-infinite-scroll'
      if (this.target !== '') {
        _target = `.nf-infinite-scroll ${this.target}`
      }
      let target = document.querySelector(_target)
      if (target) {
        this.container = target
      }
      this.debounceScroll= debounce(this.infiniteScrollDelay, this.scrollToBottom)
      this.container.addEventListener('scroll', this.debounceScroll)
    })
  },
  beforeDestroy() {
    this.container.removeEventListener('scroll', this.debounceScroll)
  }
}
</script>
