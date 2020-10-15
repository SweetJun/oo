<template>
  <div>
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :selection="false"
      :batch-options="batchOptions"
      :table-operation="tableOperation">
      <div class="table-top-left" slot="top-btn-left">
        {{providerName}}
      </div>
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'providerRuleMissingPriceModule',
      tableOperation: {
        width: 80,
        fixed: 'right',
        buttonGroups: [
          () => {
            return {
              name: '添加',
              type: 'primary',
              isShow: true,
              click: (scope) => {
                this.addFun(scope.row);
              }
            }
          }
        ]
      },
      providerName: ''
    }
  },
  computed: {
    // 筛选出带slot插槽的数据
    tableHeadListSlotName() {
      return this.$store.state[this.storeModelName].tableHeadList.filter(item => item.slotName)
    }
  },
  methods: {
    addFun(row) {
      this.$router.push({
        path: '/providerule/price/add',
        query: {
          id: row.rule_id > 0 ? row.rule_id : '',
          has_id: 1, // 用于标识是缺失价格进入的
          set_id: row.set_id,
          type: 'estimate',
          from: JSON.stringify([{key: row.from, value: row.from_display}]),
          to: JSON.stringify([{key: row.to, value: row.to_display}]),
          brand: JSON.stringify({key: row.brand, value: row.brand_display}),
          vehicle: row.vehicle
        }
      })
    }
  },
  created() {
    const query = this.$route.query
    this.providerName = query.name
    let params = {
      set_id: query.set_id
    }
    this.$store.commit(`${this.storeModelName}/updateParams`, params)
  }
}
</script>

<style lang="scss" scoped>
  .table-top-left{
    font-weight: 500;
    font-size: 24px;
  }
</style>
