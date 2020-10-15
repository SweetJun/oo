<template>
  <div class="authorise-page">
    <el-card>
      <div slot="header" class="header">
        <span>万金油电子油卡</span>
        <el-button type="text" @click="goAuthorise">管理授权</el-button>
      </div>
      <div class="content">
        全国2000+加油网络；电子加油卡代替实体卡，提升企业管理效率，降低用油成本。
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    goAuthorise() {
      this.goNextPage('/authorise/wjy', {id: 1})
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-card /deep/{
    width: 400px;
    .el-card__header{
      padding: 15px 20px;
    }
    .el-card__body{
      height: 80px;
    }
    .content{
      line-height: 1.5;
      color: #999999;
    }
  }
  .header{
    display: flex;
    justify-content: space-between;
    span{
      font-size: 14px;
      font-weight: 600;
      line-height: 22px;
    }
    .el-button{
      padding: 3px 0;
    }
  }
</style>
