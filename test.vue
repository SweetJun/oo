<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      @cell-dblclick="cellDblclick"
      :store-model-name="storeModelName"
      add-btn-link="/home"
      import-url="/home"
      export-url="/home"
      :selectable="selectableFun"
      :batch-options="batchOptions"
      :index="true"
      :showDropdownGroups="true"
      :table-operation="tableOperation">
      <!-- 根据tableHeadList slotName字端 动态插入 插槽 -->
      <template
        v-for="(item) in tableHeadListSlotName"
        :slot="item.slotName"
        slot-scope="{row}">
        <div :key="item.slotName" v-if="row">
          <span
            v-if="item.prop === 'name'"
            style="color: blue; cursor: pointer;"
            @click="handleCellClick(row)">
            {{row[item.prop]}}
          </span>
          <span v-else>{{row[item.prop]}}</span>
        </div>
      </template>
    </nf-table-page>

    <!-- 右键菜单 -->
    <div class="item" v-if="false">
      <nf-contextmenu :show-contextmenu.sync="showContextmenu">
        <ul slot="content">
          <li>11111</li>
          <li>22222</li>
          <li>33333</li>
        </ul>
      </nf-contextmenu>
      <el-tag @contextmenu.native.prevent="contextmenuClick">右键菜单</el-tag><br>
    </div>

    <!-- 可拖动dialog -->
    <div class="item" v-if="false">
      <el-button type="primary" @click="openDialog">打开dialog</el-button><br>
        <nf-dialog
          title="这是一个可拖动的标题"
          :dialog-visible.sync="dialogVisible"
          :click-sure-btn="clickSureBtn">
          <div class="content" slot="content">
            这里是dialog自定义内容
          </div>
        </nf-dialog>
    </div>
    <div v-if="false">
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
      placeholder <br>
    </div>
    <!-- 上传组件 -->
    <div class="item" v-if="false">
      <nf-upload
        :url="uploadUrl"
        :file-preview-list="fileList"
        :upload-success="handleFileSuccess">
      </nf-upload>
    </div>
    <!-- 进度条组件 -->
    <div class="item" v-if="false">
      <nf-progress></nf-progress>
    </div>
    <!-- 表单容器 -->
    <div class="item" v-if="false">
      <nf-form-wrap title="例：线路信息" :on-save-btn-click="onSaveBtnClick">
        这里是表单内容，当模块多的时候，可以把el-form标签放外层，嵌套多个 nf-form-wrap
      </nf-form-wrap>
    </div>
    <div class="item" v-if="true">
    </div>
  </div>
</template>

<script>
/**
 * @Description: 组件简单用法示例
 * @Author: wjw
 */
/* eslint-disable */
import { menuPosition } from '@/utils/utils'
export default {
  data() {
    return {
      checkList: [],
      uploadUrl: api.fileUpload,
      fileList: [
        'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        'http://placehold.it/150x150',
        'http://placehold.it/180x180',
        'http://placehold.it/150x150',
        'http://placehold.it/190x150'
      ],
      dialogVisible: false,
      showContextmenu: false,
      storeModelName: 'testModule',
      tableOperation: {
        width: 370,
        fixed: 'right',
        buttonGroups: [
          {
            name: '编辑',
            type: 'success',
            icon: 'el-icon-edit',
            click: (scope) => {
              this.editFun(scope.row);
            }
          },
          {
            name: '删除',
            type: 'danger',
            icon: 'el-icon-delete',
            click: (scope) => {
              this.delete(scope.row);
            }
          },
          // 根据字段判断按钮的显示状态
          scope => {
            let row = scope.row;
            if (row) {
              return {
                name: '权限按钮',
                type: 'warning',
                role: 'q',
                isShow: row.name === '渣渣智8',
                icon: 'el-icon-edit-share',
                click: ({row})=> {
                  this.$message.success(row.name)
                }
              }
            }
          }
        ],
        dropdownGroups: [
          {
            name: '查看详情',
            role: 'f', // 判断权限
            click: (scope) => {
              this.lookDetail(scope.row);
            }
          },
          {
            name: '生成账单',
            click: (scope) => {
              this.dealOrder(scope.row);
            }
          }
        ]
      },
      batchOptions: [
        {
          id: 1,
          label: '批量完成',
          url: 'xxxx'
        },
        {
          id: 2,
          label: '批量删除',
          url: 'xxxx'
        }
      ],
      searchData: [
        {
          name: '地区',
          id: 'area_id',
          type: 'text',
          placeholder: '地区',
        },
        {
          name: '驾驶员',
          id: 'driver_id',
          type: 'select',
          placeholder: '驾驶员名称',
          options: [
            {key: 1, value: '驾驶员1'},
            {key: 2, value: '驾驶员2'},
            {key: 3, value: '驾驶员3'},
            {key: 4, value: '驾驶员4'},
            {key: 5, value: '驾驶员5'}
          ]
        },
        {
          name: '车牌号',
          id: 'car_id',
          type: 'auto_complete',
          placeholder: '车牌号',
          options: [
            {key: 1, value: '驾驶员1'},
            {key: 2, value: '驾驶员2'},
            {key: 3, value: '驾驶员3'},
            {key: 4, value: '驾驶员4'},
            {key: 5, value: '驾驶员5'}
          ]
        },
        {
          name: '所属地区',
          id: 'car_id',
          type: 'complex',
          placeholder: '所属地区',
          children: [
            {
              id: 'level_region_province',
              name: '',
              type: 'select',
              options: [
                {key: 1, value: '河南省'},
                {key: 2, value: '湖南省'}
              ]
            },
            {
              id: 'level_region_city',
              name: '',
              type: 'select',
              options: [
                {key: 1, value: '洛阳市'},
                {key: 2, value: '周口市'}
              ]
            },
            {
              id: 'level_region_county',
              name: '',
              type: 'select',
              options: [
                {key: 1, value: '栾川县'},
                {key: 2, value: '商水县'}
              ]
            }
          ]
        },
        {
          name: '创建时间',
          id: 'create_date',
          type: 'date',
          date_type: 'date',
          placeholder: '创建时间'
        },
        {
          name: '创建时间',
          id: 'create_date',
          type: 'date',
          date_type: 'daterange',
          start_placeholder: '下单时间',
          end_placeholder: '下单时间'
        }
      ]
    };
  },
  computed: {
    // 找出带插槽的数据Item, 没有不用写（以及slot）
    // tableHeadListSlotName() {
    //   return this.$store.state[this.storeModelName].tableHeadList.filter(item => item.slotName)
    // }
  },
  methods: {
    html(index) {
      return index + 1
    },
    // 点击提交按钮
    onSaveBtnClick(loading) {
      loading(true)
      setTimeout(() => {
        loading(false)
      }, 1500)
    },
    // el-table  selectable 方法
    selectableFun(row) {
      // console.log(this.$refs.nfTable.batchVal.id) // 批量操作类型
      return row.id === 2 ? false : true
    },
    // 上传成功
    handleFileSuccess(file) {

    },
    // 打开dialog
    openDialog() {
      this.dialogVisible = true
    },
    // 点击确定
    clickSureBtn(loading) {
      loading(true)
      this.$message.success('点击了确定')
      setTimeout(() => {
        loading(false)
        this.dialogVisible = false
      }, 1500)
    },
    // 右键菜单
    contextmenuClick(e) {
      this.showContextmenu = true
      this.$nextTick(() => {
        menuPosition(e, 'nf-contextmenu')
      })
    },
    // cell 双击
    cellDblclick(row, column, cell) {
      console.log(row);
      console.log(column);
      console.log(cell);

    },
    // 点击cell触发
    handleCellClick(row) {
      this.$message.info(row.name);
    },
    // 编辑
    editFun(row) {
      console.log(row);
      this.$message.success('点击了编辑');
    },
    // 删除
    delete(row) {
      console.log(row);
      this.$message.error('点击了删除');
    },
    // 查看详情
    lookDetail(row) {
      console.log(row);
      this.$message.success('查看详情');
    },
    // 生成账单
    dealOrder(row) {
      console.log(row);
      this.$message.success('生成账单');
    }
  },
  created() {
    console.log(api.fileUpload);

    // this.alert('这是alert弹框').then(() => {
    //   console.log('点击了确定');
    // }).catch(() => {
    //   console.log('点击了取消');
    // })
  }
};
</script>

<style lang="scss" scoped>
  .item{
    margin-bottom: 20px;
  }
</style>
