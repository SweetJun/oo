<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :selection="false"
      :show-table-operation="false"
      :table-operation="tableOperation"
    ></nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: "carrierBillModule",
      tableOperation: {
        width: 110,
        fixed: "right",
        buttonGroups: []
      }
    };
  },
  methods: {}
};
</script>
