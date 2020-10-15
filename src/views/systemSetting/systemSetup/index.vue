<template>
  <div>
    <nf-form-wrap title="系统设置" :on-save-btn-click="onSaveBtnClick">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane
          v-for="(tab, index) in settingData"
          :key="index"
          :label="tab.group_display_name"
          :name="tab.group">
          <ul class="transport-type">
            <li class="type-item" v-for="(item, $index) in tab.items" :key="$index">
              <div class="item-container">
                <div class="item-name">{{item.display_name}}</div>
                <div class="item-content">
                  <el-radio-group v-model="item.value" v-if="item.type === 'bool' || item.type === 'single_select'">
                    <el-radio
                      v-for="(option, _index) in item.options"
                      :key="_index"
                      :label="transformVal(item.type, option)">
                      {{option.value}}
                    </el-radio>
                  </el-radio-group>
                  <el-input
                    v-if="item.type === 'text'"
                    :placeholder="'请输入单据前缀'"
                    v-model="item.value"
                    clearable>
                  </el-input>
                </div>
              </div>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </nf-form-wrap>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',
      settingData: []
    }
  },
  methods: {
    // 将字符串'true'/'false' => true/false
    transformVal(type, option) {
      if (type === 'bool') {
        return option.key === 'true' ? true : false
      }
      return option.key
    },
    // 获取系统设置
    getSystemSetting() {
      $post(api.systemSettingGet).then(res => {
        this.settingData = res
        if (res.length > 0) {
          this.activeName = res[0].group
        }
      })
    },
    // 保存提交
    onSaveBtnClick(loading) {
      loading(true)
      let params = []
      this.settingData.forEach(group => {
        if (group.items && group.items.length > 0) {
          group.items.forEach(item => {
            params.push({
              name: item.name,
              value: item.value
            })
          })
        }
      })
      $post(api.systemSettingSet, {setting: params}).then(() => {
        loading(false)
        this.$message.success('设置成功')
      }).catch(() => {
        loading(false)
      })
    }
  },
  created() {
    this.getSystemSetting()
  }
}
</script>

<style lang="scss" scoped>
  .transport-type{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .type-item{
    width: 100%;
    padding: 10px 0px;
    border-bottom: 1px solid #EBEEF5;
    .item-container{
      display: flex;
      border-left: 3px solid #409eff;
      padding: 5px 5px 5px 12px;
      align-items: center;
    }
    .item-name{
      float: left;
      min-width: 240px;
    }
    .item-content{
      margin-left: 20px;
      min-width: 280px;
    }
  }
</style>
