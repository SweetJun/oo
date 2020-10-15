<template>
  <div>
    <div class="top">
      <div class="float">
        <p>姓名/企业名称：{{entityInfo.entity_name}}</p>
        <p>手机号：{{entityInfo.entity_mobile}}</p>
      </div>
      <div class="float">
        当前欠款： <span>{{moneyCentToYuan(entityInfo.owing_amount)}}元</span>
      </div>
    </div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :selection="false"
      :show-edit-table-header="false"
      :table-operation="tableOperation">
      <div slot="top-btn-left">
        <el-button type="primary" size="small" @click="back">返回</el-button>
      </div>
      <template v-for="(item) in tableHeadListSlotName" :slot="item.slotName" slot-scope="{row}">
        <div :key="item.slotName" v-if="item.slotName === 'owing_amount'">
          <span :class="[Number(row[item.slotName])>0 ? 'active' : 'inActive' ]">{{row[item.slotName]}}</span>
        </div>
        <div :key="item.slotName" v-if="item.slotName === 'status'">
          <span :class="[row.status==='未结清' ? 'active' : 'inActive' ]">{{row[item.slotName]}}</span>
        </div>
      </template>
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'owingDetailModule',
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '查看详情',
              isShow: scope.row.acl && scope.row.acl.can_show_detail,
              click: ({row})=> {
                this.goNextPage('/settlement/owingEntity/detailDetail', {id: row.id})
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
    // 基本信息
    entityInfo() {
      let entityInfo = this.$store.state[this.storeModelName].entityInfo
      return entityInfo
    }
  },
  created() {
    this.$store.commit(`${this.storeModelName}/updateId`, this.$route.query.id)
    this.$store.dispatch(`${this.storeModelName}/getInfo`)
  },
  methods: {
    // 返回
    back() {
      this.$router.back()
    },
    // 详情
    lookDetail(row) {
      this.$router.push({
        path: '/settlement/owingEntity/detail',
        query: {
          id: row.id
        }
      })
    }
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
  .top{
    width:100%;
    height:100px;
    background:white;
    margin-bottom:20px;
    border-radius:4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 0 20px;
  }
  .float{
    float: left;
    margin-right: 200px;
    font-size: 18px;
    font-weight: bold;
    span{
      font-size: 24px;
    }
  }
</style>
