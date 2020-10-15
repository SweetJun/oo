<template>
  <el-tree
    v-bind="$attrs"
    v-on="$listeners"
    ref="tree"
    :data="data"
    :node-key="nodeKey"
    :props="defaultProps">
  </el-tree>
</template>
<script>
export default {
  name: 'NfTree',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'child',
          label: 'name'
        }
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
  .el-tree /deep/{
    .el-tree-node__expand-icon{
      font-size: 20px;
    }
    .el-tree-node__content{
      height: 35px;
    }
  }
</style>
