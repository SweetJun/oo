<template>
  <div>
    <div class="car car_box" v-for="(item,index) in vehicles" :key="index">
      <div class="title">
        <p class="sp_box">
          <span class="sp1">车型：</span>
          <span class="sp2">{{item.vehicle_display}}</span>
        </p>
        <p class="sp_box">
          <span class="sp1">车架号：</span>
          <span class="sp2">{{item.vin}}</span>
        </p>
      </div>
      <div class="box car clearfix">
        <div class="expenseBox" v-for="(item1, index1) in item.extra_expense" :key="index1">
          <el-form-item :label="item1.value" prop="expense_number">
            <el-input v-model="item1.expense_number" placeholder="请输入金额"></el-input>
          </el-form-item>
          <el-radio v-for="(item2,index2) in extra_expense_obj.expense_type" :key="index2" v-model="item1.expense_type"
            :label="item2.key">{{item2.value}}</el-radio>
          <p class="iconBox" @click="delEx(item, item1.key)"><i class="el-icon-delete"></i></p>
        </div>
      </div>
      <el-button type="primary" @click="addEx(item)">添加费用</el-button>
    </div>
    <p class="sum">合计：{{sums}} 元</p>
    <nf-dialog title="添加费用" v-if="dialogVisible" :dialog-visible.sync="dialogVisible" :close-dialog="closeDialog"
      :click-sure-btn="clickSureBtn" width="780px">
      <div class="content clearfix dialogContent" slot="content">
        <div class="addEx">
          <div class="top">
            <el-input placeholder="请输入费用项名称搜索" suffix-icon="el-icon-search" v-model="input1" @input="searchEx(input1)">
            </el-input>
          </div>
          <div class="bottom">
            <li v-for="(item, index) in available_expense_list" :key="index">
              <el-checkbox v-model="item.isChecked" @change="changeCheckBox(item)">{{item.value}}</el-checkbox>
              <p>{{item.value}}<i v-if="item.isChecked" slot="suffix" class="el-input__icon el-icon-check"></i></p>
            </li>
          </div>
        </div>
        <div class="addEx">
          <div class="top">
            已选择 <span style="color:#0079FE;">{{tags.length}}</span> 个费用项
          </div>
          <div class="bottom">
            <el-tag :key="item.key" v-for="(item, index) in tags" closable :disable-transitions="false"
              @close="handleCloseTags(item.key, index)">
              {{item.value}}
            </el-tag>
          </div>
        </div>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
import {handleFloat} from '@/utils/utils'
export default {
  data() {
    return {
      radio: '1',
      edit_id: '',
      isEditing: false,
      input1: '',
      v_id: '',
      available_expense_list: [],
      clone_ex_list: [],
      sum: '',
      tags: [],
      extra_expense_obj: {},
      extra_expense: [],
      vehicles: [],
      dialogVisible: false, // 自定义结算地址
      ruleForm: {

      }
    }
  },
  props: {
    expenseCarData: {}
  },
  watch: {
    expenseCarData(val) {
      if (val.extra_expense_obj) {
        this.vehicles = val.vehicles
        this.extra_expense_obj = val.extra_expense_obj
        // this.extra_expense = val.extra_expense
      }
    },
    // 处理金额格式
    // 金额
    vehicles: {
      handler(val) {
        val.forEach(item => {
          item.extra_expense.forEach(item1 => {
            item1.expense_number = handleFloat(item1.expense_number)
          })
        })
      },
      deep: true
    }
  },
  mounted() {
    this.vehicles = this.expenseCarData.vehicles
    this.extra_expense_obj = this.expenseCarData.extra_expense_obj
    // this.extra_expense = this.expenseCarData.extra_expense
    this.vehicles.forEach(item => {
      item.extra_expense = []
      this.extra_expense_obj.items.filter(item1 => item1.order_vehicle === item.id).forEach(item2 => {
        item.extra_expense.push(item2)
      })
    })
  },
  components: {},
  computed: {
    sums() {
      let sum = 0
      this.vehicles.forEach(item0 => {
        item0.extra_expense.forEach(item => {
          if(item.expense_type === "subsidy") {
            sum += Number(item.expense_number)
          }else {
            sum -= Number(item.expense_number)
          }
        })
      })
      return sum.toFixed(2)
    }
  },
  created() {
    // 费用项全量下拉
    this.getExpenses()
  },
  methods: {
    // 获取所有费用项
    getExpenses() {
      let url = `${api.searchItemOption}/available_expense`
      $get(url).then(res => {
        res.forEach(item => {
          this.$set(item, 'isChecked', false)
        })
        this.available_expense_list = res;
        this.clone_ex_list = JSON.parse(JSON.stringify(res))
      })
    },
    // 删除费用项
    delEx(item, key) {
      item.extra_expense.forEach((item1, index) => {
        if (key === item1.key) {
          item.extra_expense.splice(index, 1)
        }
      })
    },
    // 打开弹框
    addEx(item) {
      this.tags = JSON.parse(JSON.stringify(item.extra_expense))
      item.extra_expense.forEach(item1 => {
        item1.order_vehicle = item.id
      })
      this.v_id = item.id
      this.maptags()
      this.dialogVisible = true
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
    },
    // 添加费用确定
    clickSureBtn() {
      this.tags.forEach(item => {
        this.$set(item, 'order_vehicle', item.id)
        this.$set(item, 'expense_item', item.key)
        this.$set(item, 'expense_number', item.expense_number || '')
        this.$set(item, 'expense_type', item.expense_type || 'subsidy')
      })
      this.vehicles.find(item => item.id === this.v_id).extra_expense = _.cloneDeep(this.tags)
      this.closeDialog()
    },
    // 关闭tags
    handleCloseTags(key, index) {
      this.available_expense_list.forEach((item) => {
        if (item.key === key) {
          item.isChecked = false
        }
      })
      this.tags.splice(index, 1)
    },
    // 选择
    changeCheckBox(item) {
      if (item.isChecked) {
        this.tags.push(item)
      } else {
        this.tags = this.tags.filter(item1 => item1.key !== item.key)
      }
    },
    // 选中对应
    maptags() {
      this.available_expense_list.forEach((item1) => {
        item1.isChecked = false
      })
      // 以tags为准
      this.tags.forEach((item) => {
        this.available_expense_list.forEach((item1) => {
          if (item.key === item1.key) {
            item1.isChecked = true
          }
        })
      })
    },
    // 搜索
    searchEx(val) {
      if (val) {
        this.available_expense_list = this.clone_ex_list.filter(item => item.value.indexOf(val) !== -1)
      } else {
        this.available_expense_list = this.clone_ex_list
      }
      this.maptags()
    }
  }
}

</script>

<style lang="scss" scoped>
  p {
    margin: 0;
    padding: 0;
  }

  .box_260 {
    /deep/ .el-form-item__label {
      height: 20px;
      line-height: 20px;
      padding: 0 0 7px !important;
      box-sizing: content-box;
    }

    /deep/ .el-input {
      width: 200px;
    }

    .el-form-item {
      margin-bottom: 7px;
    }

    .sum {
      font-size: 18px;
      font-weight: 600;
      margin-top: 20px;
    }

    .car_box {
      margin-bottom: 40px !important;
    }

    .car {
      margin-bottom: 20px;

      .title {
        .sp_box {
          display: inline-block;
          margin-right: 40px;

          .sp1 {
            display: block;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(120, 127, 149, 1);
            margin-bottom: 7px;
          }

          .sp2 {
            display: block;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(32, 44, 85, 1);
          }
        }
      }

      .expenseBox {
        float: left;
        width: 260px;
        padding: 10px;
        margin-top: 20px;
        margin-right: 20px;
        border: 1px solid gray;
        box-shadow: 4px 4px 8px 0px rgba(237, 242, 251, 1);
        border-radius: 8px;
        border: 1px solid rgba(231, 235, 241, 1);
        position: relative;

        .iconBox {
          cursor: pointer;
          width: 50px;
          height: 111px;
          text-align: center;
          line-height: 111px;
          position: absolute;
          right: 0;
          top: 0;
          background-color: rgba(242, 242, 242, 1);
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;

          .el-icon-delete {
            font-size: 20px;
            color: #FF6600;
          }
        }
      }
    }
  }

  .dialogContent {
    .addEx {
      width: 50%;
      height: 270px;
      box-sizing: border-box;
      float: left;

      .top {
        height: 40px;
        line-height: 40px;
        margin-bottom: 20px;
      }

      .bottom {
        height: 210px;
        overflow-y: scroll;

        li {
          list-style: none;
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid lightgray;
          position: relative;

          p {
            width: 100%;
            position: absolute;
            pointer-events: none;
            background-color: #fff;
            z-index: 2;

            i {
              font-size: 18px;
              font-weight: 900;
              color: rgb(0, 121, 254);
              position: absolute;
              right: 20px;
            }
          }

          .el-checkbox {
            width: 100%;
            position: absolute;
            z-index: 1;
          }
        }
      }
    }

    .addEx:nth-of-type(1) {
      border-right: 1px solid lightgray;

      .top {
        margin-right: 20px;
      }
    }

    .addEx:nth-of-type(2) {
      .top {
        margin-left: 20px;
        font-weight: 600;
      }

      .bottom {
        padding: 0 20px;

        .el-tag {
          margin-right: 10px;
          margin-bottom: 10px;
          float: left;
        }
      }
    }
  }

</style>
