<template>
  <div id="app">
      <router-view />
  </div>
</template>

<script>
import { debounce } from 'throttle-debounce'
export default {
  name: 'App',
  methods: {
    resizeFun() {
      let baseWidth = 1000
      let clientWidth = document.documentElement.clientWidth;
      this.$store.commit('layout/updateCollapse', clientWidth < baseWidth ? true : false)
    }
  },
  mounted () {
    const script = document.createElement('script')
    script.src = 'https://s9.cnzz.com/z_stat.php?id=1278913633&web_id=1278913633'
    script.language = 'JavaScript'
    document.body.appendChild(script)
  },
  created() {
    this.$vlf.getItem('theme').then(val => {
      if (val) {
        document.body.classList.add(val)
        return
      }
      document.body.classList.remove('custom-theme')
    })
    this.debounceResize = debounce(300, this.resizeFun)
    // 视图发生变化更新高度
    window.addEventListener('resize', this.debounceResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.debounceResize)
  },
  watch: {
    '$route'() {
      if (window._czc) {
        let location = window.location
        let contentUrl = location.pathname + location.hash
        let refererUrl = '/'
        window._czc.push(['_trackPageview', contentUrl, refererUrl])
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  #app {
    height: 100%;
  }

</style>
