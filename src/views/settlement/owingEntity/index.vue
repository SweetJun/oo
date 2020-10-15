<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :selection="false"
      :table-operation="tableOperation">
      <template v-for="(item) in tableHeadListSlotName" :slot="item.slotName" slot-scope="{row}">
        <div :key="item.slotName" v-if="row">
          <span :class="[Number(row[item.slotName])>0 ? 'active' : 'inActive' ]">{{row[item.slotName]}}</span>
        </div>
      </template>
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'owingEntityModule',
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '查看详情',
              isShow: scope.row && this.roles.owing_entity_deduct_list,
              click: ({row})=> {
                this.goNextPage('/settlement/owingEntity/detail', {id: row.id})
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    // 筛选出带slot插槽的数据
    tableHeadListSlotName() {
      return this.$store.state[this.storeModelName].tableHeadList.filter(
        item => item.slotName
      );
    },
    roles() {
      return this.$store.state[this.storeModelName].roles
    }
  },
  created() {
    this.payType = this.$store.state[this.storeModelName].params.pay_state
  }
}
</script>
<style lang="scss" scoped>
  .active{
    color: red;
  }
  .inActive{
    color: green;
  }
</style>
