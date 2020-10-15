<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :selection="false"
      :batch-options="batchOptions"
      :table-operation="tableOperation">
      <!-- 根据tableHeadList slotName字端 动态插入 插槽 -->
      <template
        v-for="(item) in tableHeadListSlotName"
        :slot="item.slotName"
        slot-scope="{row}">
        <div :key="item.slotName" v-if="row">
          <span
            class="td-click-span"
            :class="[
              {'lose': item.slotName === 'miss'},
              {'red': item.slotName === 'estimate_expired' || item.slotName === 'contract_expired'},
              {'warning': item.slotName === 'estimate_expiring' || item.slotName === 'contract_expiring'}
            ]"
            @click="spanClick(item.slotName, row)">
            {{row[item.prop]}}
          </span>
        </div>
      </template>
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'clientRuleModule',
      tableOperation: {
        width: 105,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '价格管理',
              type: 'primary',
              isShow: scope.row.acl.can_view_client_rule_list,
              click: (scope) => {
                this.toPrice(scope.row);
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
      return this.$store.state[this.storeModelName].tableHeadList.filter(item => item.slotName)
    }
  },
  methods: {
    // 点击表格中的下划线文字
    spanClick(slotName, row) {
      let path = ''
      let query = {
        set_id: row.id,
        name: row.related_display,
        estimate: row.estimate,
        contract: row.contract
      }
      if (slotName === 'miss') {
        path = '/clientrule/missingprice'
      } else {
        path = '/clientrule/price'
      }
      if (slotName === 'estimate_expired' || slotName === 'estimate_expiring') {
        query.type = 'estimate'
      } else if (slotName === 'contract_expired' || slotName === 'contract_expiring') {
        query.type = 'contract'
      }
      if (slotName === 'estimate_expired' || slotName === 'contract_expired') {
        query.expire = 'expired'
        query.estimate = row.estimate_expired
        query.contract = row.contract_expired
      } else if (slotName === 'estimate_expiring' || slotName === 'contract_expiring') {
        query.expire = 'expiring'
        query.estimate = row.estimate_expiring
        query.contract = row.contract_expiring
      }
      this.$router.push({
        path: path,
        query: query
      })
    },
    // 价格管理
    toPrice(row) {
      let query = {
        set_id: row.id,
        name: row.related_display,
        type: 'contract',
        estimate: row.estimate,
        contract: row.contract
      }
      this.$router.push({
        path: '/clientrule/price',
        query: query
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .td-click-span{
    cursor: pointer;
    text-decoration: underline;
    &.lose{
      color: #ff0000;
    }
    &.red{
      color: #cc0000;
      font-weight: 700;
    }
    &.warning{
      color: #ff9900;
    }
  }
</style>
