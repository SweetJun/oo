<template>
  <div>
    <nf-form-wrap title="添加费用" :on-save-btn-click="onSaveBtnClick" :is-loading="btnLoading">
      <el-form class="box_260" :model="ruleForm" ref="ruleForm" :rules="rules" label-position="top">
        <el-form-item label="添加方式" prop="settlement_from">
          <el-radio v-model="radio" label="1">按照整单添加</el-radio>
          <el-radio v-model="radio" label="2">按照单台车添加</el-radio>
        </el-form-item>
        <section class="section1" v-if="radio==='1'">
          <div class="box car clearfix">
            <div class="expenseBox" v-for="(item, index) in extra_expense" :key="index">
              <el-form-item
                :label="item.value">
                <el-input v-model="item.expense_number" placeholder="请输入金额"></el-input>
              </el-form-item>
              <el-radio v-for="(item1,index1) in extra_expense_obj.expense_type" :key="index1"
                v-model="item.expense_type" :label="item1.key">{{item1.value}}</el-radio>
              <p class="iconBox" @click="delEx(item.key)"><i class="el-icon-delete"></i></p>
            </div>
          </div>
          <el-button type="primary" @click="addEx">添加费用</el-button>
          <p class="sum">合计：{{sums}} 元</p>
        </section>
        <section class="section2" v-if="radio==='2'">
          <expenseCar v-if="radio==='2'" ref="expenseCar" :expenseCarData.sync='expenseCarData'></expenseCar>
        </section>
      </el-form>
      <nf-dialog title="添加费用" v-if="dialogVisible" :dialog-visible.sync="dialogVisible" :close-dialog="closeDialog"
        :click-sure-btn="clickSureBtn" width="780px">
        <div class="content clearfix dialogContent" slot="content">
          <div class="addEx">
            <div class="top">
              <el-input placeholder="请输入费用项名称搜索" suffix-icon="el-icon-search" v-model="input1"
                @input="searchEx(input1)">
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
    </nf-form-wrap>
  </div>
</template>

<script>
import {handleFloat} from '@/utils/utils'
import expenseCar from './components/expenseCar'
export default {
  data() {
    return {
      expenseCarData: {},
      radio: '1',
      edit_id: '',
      isEditing: false,
      input1: '',
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
  components: {
    expenseCar
  },
  computed: {
    sums() {
      let sum = 0
      this.extra_expense.forEach(item => {
        if(item.expense_type === "subsidy") {
          sum += Number(item.expense_number)
        }else {
          sum -= Number(item.expense_number)
        }
      })
      return sum.toFixed(2)
    }
  },
  created() {
    // 费用项全量下拉
    this.getExpenses()
    this.edit_id = this.$route.query.id;
    this.getDetail(this.edit_id)
  },
  watch: {
    radio(val) {
      if(val === '2') {
        this.excar()
      }
    },
    // 金额
    extra_expense: {
      handler(val) {
        val.forEach(item => {
          item.expense_number = handleFloat(item.expense_number)
        })
      },
      deep: true
    }
  },
  methods: {
    excar() {
      let expenseCarData = {extra_expense_obj: this.extra_expense_obj, vehicles: this.vehicles}
      this.$set(this, 'expenseCarData', expenseCarData)
    },
    // 获取详情
    getDetail(id) {
      let data_parts = ['vehicles', 'extra_expense']
      $get(`${api.order}/${id}`, {
        data_parts: JSON.stringify(data_parts)
      }).then(res => {
        this.extra_expense_obj = res.extra_expense;
        let clone_extra_expense = []
        res.extra_expense.items.forEach(item1 => {
          item1.expense_number = item1.expense_number / 100
          clone_extra_expense.push(item1)
        })
        clone_extra_expense.forEach(item => {
          this.$set(item, 'value', item.expense_item_display)
          this.$set(item, 'key', item.expense_item)
        })
        res.vehicles.forEach(item => {
          this.$set(item, 'extra_expense', []);
        })
        let arr = []
        for(let i in this.extra_expense_obj.vehicles) {
          arr.push(this.extra_expense_obj.vehicles[i])
        }
        if(arr.length > 0) {
          this.radio = '2'
          for(let i in this.extra_expense_obj.vehicles) {
            let ex = clone_extra_expense.find(item => item.order_vehicle === i)
            this.extra_expense_obj.vehicles[i]['extra_expense'] = ex
          }
          arr.forEach(item => {
            res.vehicles.forEach(item1 => {
              if(item.id === item1.id) {
                item1 = Object.assign({}, item1, item)
              }
            })
          })
        }else {
          this.extra_expense = []
          res.extra_expense.items.forEach(item1 => {
            this.extra_expense.push(item1)
          })
          this.extra_expense.forEach(item => {
            // item.expense_number = item.expense_number / 100
            this.$set(item, 'value', item.expense_item_display)
            this.$set(item, 'key', item.expense_item)
          })
        }
        this.vehicles = res.vehicles;
        this.expenseCarData = {extra_expense_obj: this.extra_expense_obj, vehicles: this.vehicles}
      })
    },
    // 保存
    onSaveBtnClick(loading) {
      let reg = /^(0|[1-9][0-9]*)+(\.[0-9]{1,2})?$/
      if(this.radio === '1') {
        let n = 0
        this.extra_expense.forEach(item => {
          if(!reg.test(item.expense_number) || item.expense_number<0) {
            n++
          }
        })
        if(n > 0) {
          this.$message.closeAll()
          this.$message.warning('金额请输入最多两位小数的正数')
          return
        }
      }else {
        let n = 0
        this.$refs.expenseCar.vehicles.forEach(item => {
          item.extra_expense.forEach(item1 => {
            if(!reg.test(item1.expense_number) || item1.expense_number<0) {
              n++
            }
          })
        })
        if(n > 0) {
          this.$message.closeAll()
          this.$message.warning('金额请输入最多两位小数的正数')
          return
        }
      }
      if(this.radio === '1') {
        this.extra_expense.forEach(item => {
          if(item.order_vehicle) {
            item.order_vehicle = 0
          }
        })
        let extra_expense = _.cloneDeep(this.extra_expense)
        extra_expense.forEach(item => {
          item.expense_number = item.expense_number * 100
        })
        loading(true)
        let url = `${api.order}/${this.edit_id}/extra_expense`
        $post(url, {extra_expense: extra_expense}).then(() => {
          this.$message.success('设置成功')
          this.$router.back()
        }).catch(() => {
          loading(false)
        })
      }else if(this.radio === '2') {
        let url = `${api.order}/${this.edit_id}/extra_expense`
        let data = []
        this.$refs.expenseCar.vehicles.forEach(item => {
          item.extra_expense.forEach(item1 => {
            item1.order_vehicle = item.id
            let item2 = _.cloneDeep(item1)
            item2.expense_number = item2.expense_number * 100
            data.push(item2)
          })
        })
        loading(true)
        $post(url, {extra_expense: data}).then(() => {
          this.$message.success('设置成功')
          this.$router.back()
        }).catch(() => {
          loading(false)
        })
      }
    },
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
    delEx(key) {
      this.extra_expense.forEach((item, index) => {
        if(key === item.key) {
          this.extra_expense.splice(index, 1)
        }
      })
    },
    // 打开弹框
    addEx() {
      this.tags = JSON.parse(JSON.stringify(this.extra_expense))
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
        this.$set(item, 'order_vehicle', 0)
        this.$set(item, 'expense_item', item.key)
        this.$set(item, 'expense_number', item.expense_number || '')
        this.$set(item, 'expense_type', item.expense_type || 'subsidy')
      })
      this.extra_expense = this.tags;
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

    .car {
      margin-bottom: 20px;

      .title {
        .sp_box {
          display: inline-block;
          margin-right: 20px;

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
