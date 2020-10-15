<template>
  <div></div>
</template>

<script>
export default {
  name: "three",
  data() {
    return {}
  },
  created() {
    let str = window.location.toString().substring(window.location.toString().indexOf("?"))
    window.parent.window.setCook(str)
    window.parent.document.getElementById("cook").value=str
    // this.$store.commit('loginModule/updateCook', str)
  },
  methods: {
  }
}
</script>