<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      :store-model-name="storeModelName"
      :selection="false"
      :table-operation="tableOperation">
    </nf-table-page>
    <manager
      v-if="dialogRole"
      :dialog-role.sync="dialogRole"
      :store-model-name="storeModelName"
      :current-id="currentId"
      :select-roles="defaultRoles"
      @handle-click-sure="handleClickSure">
    </manager>
    <detail
      :store-model-name="storeModelName"
      :current-id="currentId"
      :dialog-detail.sync="dialogDetail">
      </detail>
  </div>
</template>

<script>
import manager from './components/manager'
import detail from './components/detail'
export default {
  components: {
    manager,
    detail
  },
  data() {
    return {
      storeModelName: 'userManagerModule',
      tableOperation: {
        width: 165,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '设置角色',
              isShow: scope.row.acl.can_edit,
              click: (scope) => {
                this.settingFun(scope.row);
              }
            }
          },
          scope => {
            return {
              name: '数据权限',
              isShow: scope.row.acl.can_edit_data_privilege,
              click: (scope) => {
                this.dataPrivilege(scope.row);
              }
            }
          }
        ]
      },
      dialogRole: false,
      dialogDetail: false,
      currentId: false,
      defaultRoles: []
    }
  },
  methods: {
    // 设置角色
    settingFun(row) {
      this.currentId = row.id
      this.defaultRoles = row.role_list
      this.dialogRole = true
    },
    // 数据权限
    dataPrivilege(row) {
      this.currentId = row.id
      this.dialogDetail = true
    }
  }
}
</script>
