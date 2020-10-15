<template>
  <el-dialog
    class="nf-edit-table"
    :append-to-body="true"
    :visible.sync="isEditTable"
    :close-on-click-modal="false"
    :before-close="handleClose"
    width="500px">
    <div slot="title" class="title" >
      <el-row type="flex" align="middle">
        <el-row>自定义列</el-row>
        <el-switch
          v-model="firstFixed"
          active-text="固定首列">
        </el-switch>
      </el-row>
    </div>
    <div class="content">
      <draggable
        v-model="tableHeadListCopyData"
        class="list-group"
        tag="ul">
        <transition-group type="transition" name="flip-list">
          <li
            v-for="item in tableHeadListCopyData"
            :key="item.label"
            class="list-group-item">
            <el-row type="flex" class="flex-item">
              <el-col :span="14" class="name">
                <el-checkbox
                  v-model="item.checked"
                  :true-label="1"
                  :false-label="0">
                  {{ item.label }}
                </el-checkbox>
              </el-col>
              <el-col :span="10" class="table-width">
                <span> 宽度 </span>
                <el-input v-model="item.width" size="mini"/>
                <span> px </span>
              </el-col>
            </el-row>
          </li>
        </transition-group>
      </draggable>
    </div>
    <div slot="footer" class="dialog-footer">
      <span class="explain">勾选需要显示的列，拖动列名进行排序。</span>
      <div>
        <el-button size="small" @click="handleClose" >
          取 消
        </el-button>
        <el-button type="primary" size="small" @click="handleSaveBtnClick">
          保 存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import draggable from 'vuedraggable';
export default {
  name: 'NfEditTable',
  components: {
    draggable
  },
  props: {
    // 显示隐藏弹出框
    isEditTable: {
      type: Boolean,
      default: false
    },
    // 表头list数据 列表的tableHeadList
    tableHeadList: {
      type: Array,
      required: true,
      default: () => []
    },
    // vuex Model 名称
    storeModelName: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      firstFixed: false,
      // 拷贝数据 避免污染父亲传过来的数据
      tableHeadListCopyData: _.cloneDeep(this.tableHeadList)
    };
  },
  watch: {
    // tableHeadList发生改变 重新拷贝对象进行负值 否则对象是引用关系 再次编辑表头 改动数据会影响到父对象
    tableHeadList(newValue) {
      this.tableHeadListCopyData = _.cloneDeep(newValue)
    },
    isEditTable(newValue) {
      if (newValue) {
        this.getVlfFixed()
      }
    }
  },
  methods: {
    // 关闭更新状态
    handleClose() {
      this.isEditTable = false
      this.$emit('update:isEditTable', false)
    },
    getVlfFixed() {
      const editTableHeaderByRow = this.$store.state[this.storeModelName].editTableHeaderByRow
      const currentRow = this.$store.state[this.storeModelName].currentRow
      this.vlfName = this.storeModelName
      if (editTableHeaderByRow) {
        this.vlfName = `${this.storeModelName}_${currentRow.id}`
      }
      this.$vlf.getItem(this.vlfName).then(val => {
        if (val) {
          this.firstFixed = val.fixed
        } else {
          this.firstFixed = false
        }
        this.$store.commit('pageData/updateColumnFixed', this.firstFixed)
      })
    },
    // 保存
    handleSaveBtnClick() {
      let tableConfig = {
        headers: this.tableHeadListCopyData,
        fixed: this.firstFixed
      }
      // 存储本地
      this.$vlf.setItem(this.vlfName, tableConfig).then(() => {
        this.$store.commit(
          `${this.storeModelName}/updateEditTableList`,
          this.tableHeadListCopyData
        )
        this.$store.commit('pageData/updateColumnFixed', this.firstFixed)
        this.$emit('update:isEditTable', false)
      })
    }
  },
  created() {
    this.getVlfFixed()
  }
};
</script>
<style lang="scss" scoped>
.el-switch{
  margin-left: 30px;
}
.dialog-footer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  .explain {
    font-size: 12px;
    color: #999999d1;
  }
}
.nf-edit-table {
  /deep/.el-dialog__body {
    padding-top: 10px;
    padding-bottom: 0;
  }
  /deep/.el-dialog__footer {
    padding-bottom: 10px;
  }
  .flex-item {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
    .name{
      display: flex;
      align-items: center;
      box-align: center;
      padding-left: 10px;
    }
  }
  .table-width {
    display: flex;
    justify-content: flex-end;
    padding-right: 10px;
    align-items: center;
  }
  /deep/.el-input {
    width: 40px;
    margin: 0 10px;
    input {
      border: 0;
      text-align: center;
      padding: 0 4px;
      box-sizing: border-box;
      &:hover {
        border: 1px solid #eee;
      }
    }
  }
  .content {
    max-height: 50vh;
    overflow: auto;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }

  .no-move {
    transition: transform 0s;
  }

  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }

  .list-group {
    min-height: 20px;
    list-style-type: none;
    padding-left: 0;
  }

  .list-group-item {
    cursor: move;
  }

  .list-group-item i {
    cursor: pointer;
  }
}
</style>


