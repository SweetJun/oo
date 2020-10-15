<template>
  <div>
    <!-- 按钮 -->
    <div class="clearfix">
      <el-button class="float-left" type="primary" @click="add">添加商品车</el-button>
      <p class="float-left current">当前商品车：<span style="color:#FF6600">{{tableData.length}}</span> 台</p>
    </div>
    <!-- 商品车列表 -->
    <ul class="ul">
      <li class="clearfix" v-for="(item, index) in tableData" :key="index">
        <el-row style="height:100%">
          <el-col :span="3" class="imgCol">
            <div class="imgBox" :style="{backgroundImage:'url(/api/vehicle/' + item.vehicle + '/image)'}"></div>
          </el-col>
          <el-col :span="5">
            <section>
              <span>车型</span>
              <p>{{item.vehicle_display|| '无'}}</p>
            </section>
            <section>
              <span>车架号</span>
              <p>{{item.vin|| '无'}}</p>
            </section>
          </el-col>
          <el-col :span="5">
            <section>
              <span>经销商</span>
              <p>{{item.dealer_display|| '无'}}</p>
            </section>
            <section>
              <span>结算台数</span>
              <p>{{item.settlement_count|| 1}}</p>
            </section>
          </el-col>
          <el-col :span="5">
            <section>
              <span>提车库区</span>
              <p>{{item.fetch_warehouse_display|| '无'}}</p>
            </section>
            <section>
              <span>装车库区</span>
              <p>{{item.load_warehouse_display || '无'}}</p>
            </section>
          </el-col>
          <el-col :span="5">
            <section>
              <span>装车地址</span>
              <p>{{item.load_warehouse_address || '无'}}</p>
            </section>
          </el-col>
          <el-col class="iconCol" :span="1">
            <p v-if="item.acl.can_edit" @click="edit(item, index)"><i class="el-icon-edit"></i></p>
            <p v-if="item.acl.can_delete" @click="del(item, index)"><i class="el-icon-delete"></i></p>
          </el-col>
        </el-row>
      </li>
    </ul>
    <!-- 弹框 -->
    <nf-dialog :title="title" v-if="dialogVisible" :dialog-visible.sync="dialogVisible" :click-sure-btn="clickSureBtn"
      :close-dialog="closeDialog" :width="'580px'">
      <div class="content clearfix" slot="content">
        <el-form class="box_260" :model="formData" ref="formData" :rules="rules" label-position="top" inline>
          <el-form-item label="品牌：" prop="brand">
            <el-select v-model="formData.brand" filterable placeholder="请选择品牌" @change="changeBrand(formData.brand)">
              <el-option v-for="(item, index) in vehicle_brand_level_two_list" :key="index" :label="item.value"
                :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车型：" prop="vehicle">
            <el-select v-model="formData.vehicle_obj" @change="changeVehicle(formData.vehicle_obj)" value-key="key"
              filterable placeholder="请选择车型">
              <el-option v-for="item in vehicle_list" :key="item.key" :label="item.value" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车架号(VIN)：" prop="vin">
            <el-input v-model="formData.vin" placeholder="请输入车架号(VIN)"></el-input>
          </el-form-item>
          <el-form-item label="经销商：" prop="dealer">
            <nf-auto-select :placeholder="'经销商'" :optionsKey="'dealer_name'" :propOptions.sync="dealer_list"
              :propObj.sync="formData.dealer_obj" :propKey.sync="formData.dealer"
              :propValue.sync="formData.dealer_display"></nf-auto-select>
          </el-form-item>
          <el-form-item v-show="!isDown" label="" prop="add_count">
            <el-radio v-model="formData.is_settlement_count" :label="1" :disabled="title === '编辑商品车'">添加多台</el-radio>
            <el-radio v-model="formData.is_settlement_count" :label="2">结算台数</el-radio>
            <!-- 结算台数 -->
            <el-input v-if="formData.is_settlement_count===2" placeholder="请输入台数" type="number"
              v-model="formData.settlement_count"></el-input>
              <!-- 添加台数 -->
            <el-input v-if="formData.is_settlement_count===1" placeholder="请输入台数" type="number"
              :disabled="title === '编辑商品车'" v-model="formData.add_count"></el-input>
          </el-form-item>
          <el-form-item v-show="!isDown" label="" prop="direct_price">
            <el-checkbox v-model="formData.is_special">特殊发运</el-checkbox>
            <el-input v-model="formData.direct_price" :disabled="!formData.is_special"
              :placeholder="[formData.is_special ? '请输入发运金额' : '特殊发运可输入发运金额']"></el-input>
          </el-form-item>
          <el-form-item v-show="!isDown" label="提车库区：" prop="fetch_warehouse">
            <nf-auto-select :placeholder="'提车库区'" :optionsKey="'vehicle_warehouse_name'"
              :propOptions.sync="fetch_warehouse_list" :propObj.sync="formData.fetch_warehouse_obj"
              :propKey.sync="formData.fetch_warehouse" :propValue.sync="formData.fetch_warehouse_display">
            </nf-auto-select>
          </el-form-item>
          <el-form-item v-show="!isDown" label="装车库区：" prop="load_warehouse">
            <nf-auto-select :placeholder="'装车库区'" :optionsKey="'vehicle_warehouse_name'"
              :propOptions.sync="load_warehouse_list" :propObj.sync="formData.load_warehouse_obj"
              :propKey.sync="formData.load_warehouse" :propValue.sync="formData.load_warehouse_display">
            </nf-auto-select>
          </el-form-item>
        </el-form>
        <footer @click="isDown=!isDown">
          <i :class="[isDown ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></i>
          {{isDown ? '展开' : '收起'}}
        </footer>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      rowIndex: '', // 编辑用，编辑其实是删除后又在这个位置添加
      rowId: '', // 编辑用
      dialogVisible: false,
      isDown: true, // 展开收起
      vehicle_list: [], // 车型下拉
      load_warehouse_list: [], // 装车库区下拉
      fetch_warehouse_list: [], //提车库区下拉
      dealer_list: [], //经销商下拉
      formData: {
        brand: '',
        vehicle: '',
        vehicle_obj: {},
        add_count: 1,
        settlement_count: 1,
        is_settlement_count: 1,
        vin: '',
        dealer_obj: {},
        dealer: '',
        dealer_display: '',
        fetch_warehouse_obj: {},
        fetch_warehouse: '',
        fetch_warehouse_display: '',
        load_warehouse_obj: {},
        load_warehouse: '',
        load_warehouse_display: '',
        load_warehouse_address: '',
        is_special: false,
        direct_price: '',
        acl: {
          can_edit: true,
          can_delete: true
        }
      },
      rules: {
        brand: [{
          required: true,
          message: '请选择品牌',
          trigger: 'change'
        }],
        vehicle: [{
          required: true,
          message: '请选择车型',
          trigger: 'change'
        }],
        dealer: [{
          required: true,
          message: '请选择经销商',
          trigger: 'change'
        }],
        direct_price: [{
          required: false,
          validator: this.$valid.isFloatNumber(false),
          trigger: 'blur'
        }]
      }
    }
  },
  props: {
    // 商品车列表
    tableData: {
      type: Array,
      default: () => []
    },
    // 品牌，在父组件请求的
    vehicle_brand_level_two_list: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    'formData.brand': {
      handler: function (val) {
        if (val) {
          let a = this.vehicle_brand_level_two_list.find(item => item.key === val)
          this.getVehicle({
            key: a.key,
            value: a.value
          })
        }
      }
    },
    'formData.is_settlement_count': {
      handler(val) {
        if (val) {
          // 每次切换都把结算台数置1，不管勾选没勾选结算台数，都会传值
          if(this.title !== '编辑商品车') {
            this.formData.settlement_count = 1
          }
        }
      }
    }
  },
  methods: {
    // 改变品牌
    changeBrand(val) {
      if (val) {
        this.$set(this.formData, 'vehicle_obj', {})
        this.$set(this.formData, 'vehicle', '')
        let a = this.vehicle_brand_level_two_list.find(item => item.key === val)
        this.getVehicle({
          key: a.key,
          value: a.value
        })
      }
    },
    // 获取车型
    getVehicle(item) {
      let url = `${api.searchItemOption}/vehicle`
      $get(url, {
        condition: {
          'vehicle_brand_level_two': item
        }
      }).then(res => {
        this.vehicle_list = res
        if(this.formData.vehicle) {
          this.$set(this.formData,'vehicle_obj', {
            key: this.formData.vehicle,
            value: this.formData.vehicle_display
          })
        }
      })
    },
    // 选择 改变车型
    changeVehicle(obj) {
      this.formData.vehicle = obj.key
      this.formData.vehicle_display = obj.value
    },
    // 添加
    add() {
      this.title = '添加商品车'
      this.dialogVisible = true
    },
    // 编辑
    edit(item, index) {
      this.title = '编辑商品车'
      this.rowIndex = index
      if (item.id) {
        this.rowId = item.id
      }
      // 添加多台和结算台数
      if (item.settlement_count > 1) {
        item.is_settlement_count = 2
        item.add_count = 1
      } else {
        item.is_settlement_count = 1
        item.add_count = 1
      }
      this.formData = _.cloneDeep(item)
      this.formData.fetch_warehouse_obj = item.fetch_warehouse ? {
        key: item.fetch_warehouse,
        value: item.fetch_warehouse_display
      } : {}
      this.fetch_warehouse_list = item.fetch_warehouse ? [{
        key: item.fetch_warehouse,
        value: item.fetch_warehouse_display
      }] : []
      this.formData.load_warehouse_obj = item.load_warehouse ? {
        key: this.formData.load_warehouse,
        value: this.formData.load_warehouse_display
      } : {}
      this.load_warehouse_list = item.load_warehouse ? [{
        key: this.formData.load_warehouse,
        value: this.formData.load_warehouse_display
      }] : []
      this.formData.dealer_obj = item.dealer ? {
        key: this.formData.dealer,
        value: this.formData.dealer_display
      } : {}
      this.dealer_list = item.dealer ? [{
        key: this.formData.dealer,
        value: this.formData.dealer_display
      }] : []
      // 特殊发运
      if (this.formData.direct_price > 0) {
        this.formData.is_special = true
      }
      this.dialogVisible = true
    },
    // 关闭弹框
    closeDialog() {
      this.formData = {
        id: '',
        brand: '',
        vehicle: '',
        add_count: 1,
        settlement_count: 1,
        is_settlement_count: 1,
        vin: '',
        dealer_obj: {},
        dealer: '',
        dealer_display: '',
        fetch_warehouse_obj: {},
        fetch_warehouse: '',
        fetch_warehouse_display: '',
        load_warehouse_obj: {},
        load_warehouse: '',
        load_warehouse_display: '',
        is_special: false,
        direct_price: '',
        acl: {
          can_edit: true,
          can_delete: true
        }
      }
      this.title = ''
      this.rowIndex = ''
      this.rowId = ''
      this.dialogVisible = false
    },
    // 弹框确定
    clickSureBtn() {
      this.$refs['formData'].validate(async (valid) => {
        if (valid) {
          // 请求装车库的地址
          if (this.formData.load_warehouse) {
            let url = `${api.vehicleWarehouse}/${this.formData.load_warehouse}`
            let data = await $get(url)
            this.formData.load_warehouse_address = data.address
          } else {
            this.formData.load_warehouse_address = '无'
          }
          if (this.title === '添加商品车') {
            if (this.formData.is_settlement_count === 1 && this.formData.add_count) {
              if(this.formData.add_count > 10) {
                this.$message.closeAll()
                this.$message.warning('最多可添加10台')
                return
              }
              // 添加多台
              for (let i = 0; i < this.formData.add_count; i++) {
                if (i > 0) {
                  // 车架号不复制
                  this.formData.vin = ''
                }
                this.tableData.push(_.cloneDeep(this.formData))
              }
            } else {
              this.tableData.push(_.cloneDeep(this.formData))
            }
          } else {
            // 编辑其实是删除再在这个位置添加
            this.tableData.splice(this.rowIndex, 1, _.cloneDeep(this.formData))
          }
          this.closeDialog()
        } else {
          return false;
        }
      });
    },
    // 删除
    del(item, index) {
      this.tableData.splice(index, 1)
    }
  }
}

</script>

<style lang="scss" scoped>
  p {
    margin: 0;
    padding: 0;
  }

  .current {
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    font-weight: 700;
    margin-left: 20px;
  }

  footer {
    position: absolute;
    bottom: 20px;
    font-size: 18px;
    cursor: pointer;
  }

  .box_260 {
    .el-form-item {
      margin-right: 20px;
    }

    .el-form-item:nth-of-type(2n) {
      margin-right: 0;
    }
  }

  .ul {
    padding: 0;
    margin: 20px 0 0 0;

    li {
      list-style: none;
      height: 100px;
      box-shadow: 4px 4px 8px 0px rgba(237, 242, 251, 1);
      border-radius: 8px;
      border: 1px solid rgba(231, 235, 241, 1);
      margin-bottom: 20px;

      .el-row {
        border-radius: 8px;
      }

      .el-row,
      .el-col {
        height: 100%;
      }

      .imgCol {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        border-right: 1px solid rgba(231, 235, 241, 1);
      }

      .el-col {
        .imgBox {
          width: 150px;
          height: 100%;
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
          background-size: contain;
          background-repeat: no-repeat;
          margin: 0 auto;
        }

        section {
          height: 50px;
          box-sizing: border-box;
          padding-left: 20px;

          p {
            height: 25px;
            line-height: 25px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(32, 44, 85, 1);
            margin: 0;
            padding: 0;
          }

          span {
            height: 25px;
            line-height: 25px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(120, 127, 149, 1);
          }
        }
      }

      .iconCol {
        p:nth-of-type(1) {
          border-bottom: 1px solid white;
          box-sizing: border-box;

          i {
            color: #409EFF;
          }
        }

        p:nth-of-type(2) {
          i {
            color: #f56c6c;
          }
        }

        p {
          cursor: pointer;
          width: 50px;
          height: 50px;
          text-align: center;
          line-height: 50px;
          background-color: rgba(242, 242, 242, 1);
          float: right;
          &:hover {
            background-color: rgba(242, 242, 242, .8);
            i{
              opacity: .6;
            }
          }
          i {
            font-size: 20px;
          }
        }
      }
    }
  }

</style>
