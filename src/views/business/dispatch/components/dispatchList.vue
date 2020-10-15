<template>
  <div class="dispatch-container" v-loading="loading">
    <div class="no-list-notice" v-if="dispatchList.length === 0">
      暂无商品车，请先 <el-button type="primary" @click="addVehicleClick('1')">添加商品车</el-button>
    </div>
    <div class="dispatch-list" v-else>
      <template v-if="dispatchType === 'heavy'">
        <el-card class="item" v-for="(item, index) in dispatchList" :key="index">
          <div slot="header" class="item-header">
            <div class="item-left">
              <span class="from">{{item.from_display}}</span>
              <span class="icon">
                <img src="@/assets/images/view/arrow.png" alt="">
                <p>{{item.mileage}}km</p>
              </span>
              <span class="to">{{item.to_display}}</span>
              <span class="type">{{carryType(item)}}</span>
              <el-button
                type="primary"
                @click="addVehicleClick('2', item)"
                v-if="(editingDispatch && item.acl.can_edit) || !editingDispatch">
                编辑商品车
              </el-button>
              <span class="number">累计：{{item.vehicles.length}} 台</span>
            </div>
            <div class="btn-box">
              <el-button
                type="primary"
                @click="editDispatch(item)"
                v-if="(editingDispatch && item.acl.can_edit) || !editingDispatch">
                编辑调令
              </el-button>
              <el-button
                v-if="(dispatchList.length > 1 && editingDispatch && item.acl.can_edit) || (dispatchList.length > 1 && !editingDispatch)"
                type="danger"
                @click="deleteDispatch(index)">
                删除调令
              </el-button>
            </div>
          </div>
          <div class="item-container">
            <div class="no-vehicle" v-if="item.vehicles.length === 0">
              暂无商品车
            </div>
            <div class="vehicle-list" v-else>
              <div class="vehicle-item" v-for="(vehicle, _index) in item.vehicles" :key="_index">
                <p class="place">{{vehicle.from_display}}-{{vehicle.to_display}}</p>
                <p class="brand">{{vehicle.vehicle_display}}·{{vehicle.vin | carEncryption}}</p>
                <el-checkbox
                  v-model="vehicle.transfer"
                  v-if="(editingDispatch && item.acl.can_edit) || !editingDispatch">
                  中转
                </el-checkbox>
                <el-button
                  v-if="(editingDispatch && item.acl.can_edit) || !editingDispatch"
                  class="delete"
                  type="text danger"
                  @click="deleteVehicle(item.vehicles, _index)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </template>
      <template v-else>
        <el-card class="item" v-for="(item, index) in dispatchList" :key="index">
          <div slot="header" class="item-header">
            <div class="item-left">
              <span class="from">{{item.from_display}}</span>
              <span class="icon">
                <img src="@/assets/images/view/arrow.png" alt="">
                <p>{{item.mileage}}km</p>
              </span>
              <span class="to">{{item.to_display}}</span>
              <span class="type">{{carryType(item)}}</span>
            </div>
            <div class="btn-box">
              <el-button type="primary" @click="editDispatch(item)">编辑调令</el-button>
              <el-button v-if="dispatchList.length > 1" type="danger" @click="deleteDispatch(index)">删除调令</el-button>
            </div>
          </div>
          <div class="item-desc">
            <div></div>
            <span v-if="true">本段调令费用所属：本段空驶调令的费用将计入下一个重驶调度单</span>
            <span v-else>本段调令费用所属：{{item.number}} 调度单</span>
            ，如需修改，<el-button type="text" @click="selectOtherDispatch(item)">请选择其它调度单</el-button>
          </div>
        </el-card>
      </template>
    </div>
    <!-- 新建、编辑调令 -->
    <add-dispatch
      v-if="dialogDispatch"
      :dialog-dispatch.sync="dialogDispatch"
      :data="editData"
      :is-editing="isEditing"
      @sure-click="sureClick">
    </add-dispatch>
    <!-- 选择商品车 -->
    <select-vehicle
      v-if="dialogVehicle"
      :item-click="itemClick"
      :dialog-vehicle.sync="dialogVehicle"
      :select-data="selectData"
      :able-select-data="ableSelectData"
      @select-data="getSelectData">
    </select-vehicle>
    <!-- 选择调度单 -->
    <nf-select-dispatch
      :dialog-select-dispatch.sync="dialogSelectDispatch"
      @select-change="getSelectDiapatch">
    </nf-select-dispatch>
  </div>
</template>

<script>
import addDispatch from './addDispatch'
import selectVehicle from './selectVehicle'
export default {
  props: {
    dispatchType: {
      type: String,
      default: 'heavy'
    }
  },
  components: {
    addDispatch,
    selectVehicle
  },
  data() {
    return {
      dialogVehicle: false,
      dialogDispatch: false,
      dialogSelectDispatch: false,
      itemClick: false,
      isEditing: false,
      editingDispatch: false,
      loading: false,
      editData: {},
      selectData: [],
      ableSelectData: [], // 是否有可继续发运的车
      dispatchList: [],
      cost_incorporate: 0
    }
  },
  methods: {
    carryType(item) {
      if (item.carry_type) {
        return item.carry_type === 'heavy' ? '重驶' : '空驶'
      } else if(item.vehicles && item.vehicles.length > 0) {
        return '重驶'
      } else {
        return '空驶'
      }
    },
    selectOtherDispatch(item) {
      this.dialogSelectDispatch = true
      this.currentDispatch = item
    },
    // 获取选择的调度单
    getSelectDiapatch(val) {
      this.cost_incorporate = val.id
      this.$set(this.currentDispatch, 'number', val.number)
    },
    // 新建调令
    addDispatch(type) {
      this.dialogDispatch = true
      this.isEditing = false
      this.editData = {
        carry_type: type
      }
    },
    // 编辑调令
    editDispatch(item) {
      this.dialogDispatch = true
      this.isEditing = true
      this.editData = item
      this.currentDispatch = item
      this.ableSelectData = []
    },
    // 确认添加或者编辑调令
    sureClick(val) {
      if (this.isEditing) {
        this.currentDispatch.from = val.from.key
        this.currentDispatch.from_display = val.from.value
        this.currentDispatch.to = val.to.key
        this.currentDispatch.to_display = val.to.value
        this.currentDispatch.carry_type = val.carry_type
        this.currentDispatch.mileage = val.mileage
        this.checkTransfer(this.currentDispatch.vehicles)
      } else {
        this.dispatchList.push({
          from: val.from.key,
          from_display: val.from.value,
          to: val.to.key,
          to_display: val.to.value,
          carry_type: val.carry_type,
          mileage: val.mileage,
          vehicles: []
        })
      }
    },
    // 判断商品车目的地和调令目的地是否一样，判定中转
    checkTransfer(vehicles = [], to_id) {
      to_id = to_id ? to_id : this.currentDispatch.to
      vehicles.forEach(item => {
        if (item.to === to_id) {
          this.$set(item, 'transfer', false)
        } else {
          this.$set(item, 'transfer', true)
        }
      })
    },
    // 判断其余调令列表中可中转的车在其他调令中是否存在不中转，
    // 如果存在，这条不添加到ableSeletcData，否则添加到ableSeletcData
    hasNoTransferForCar(residueList) {
      let ableSelectData = [] // 可继续发运的商品车
      let allVehicles = [] // 所有的商品车
      let allNoTransferVehicles = [] // 所有的不中转商品车
      residueList.forEach(item => {
        if (item.vehicles) {
          item.vehicles.forEach(vehicle => {
            allVehicles.push(vehicle)
            if (!vehicle.transfer) {
              allNoTransferVehicles.push(vehicle)
            }
          })
        }
      })
      allVehicles = _.uniqBy(allVehicles, 'id') // 去重
      allNoTransferVehicles = _.uniqBy(allNoTransferVehicles, 'id') // 去重
      allVehicles.forEach(vehicle => {
        let isInNoTransfer = false
        allNoTransferVehicles.forEach(noTransfer => {
          if (vehicle.id === noTransfer.id) {
            isInNoTransfer = true
            return false
          }
        })
        // 如果当前车不存在于不中转的数组车里
        if (!isInNoTransfer) {
          ableSelectData.push(vehicle)
        }
      })
      //排除当前调令车辆，因为已有车辆必不会出现在可发运列表
      ableSelectData = _.pullAllBy(ableSelectData, this.currentDispatch.vehicles, 'id')
      this.ableSelectData = ableSelectData
    },
    // 点击添加/编辑商品车
    addVehicleClick(type, dispatch) {
      this.dialogVehicle = true
      if (type === '1') { // 添加
        this.itemClick = false
        this.selectData = []
      } else { // 编辑
        this.itemClick = true
        this.selectData = []
        this.currentDispatch = dispatch
        dispatch.vehicles.forEach(vehicle => {
          // 默认勾选的商品车
          this.selectData.push(vehicle)
        })
        this.hasNoTransferForCar(this.dispatchList)
      }
    },
    // 获取商品车数据
    getSelectData(params) {
      this.selectData = params.data
      if (params.itemClick) {
        let vehicles = [...params.data, ...params.ableData]
        this.$set(this.currentDispatch, 'vehicles', _.cloneDeep(vehicles))
        this.checkTransfer(this.currentDispatch.vehicles)
      } else {
        this.getDispatchList()
      }
    },
    // 根据商品车获取调令推荐路线
    getDispatchList() {
      let vehicles = this.selectData.map(item => {
        let id = item.id.split('_')[0]
        return id
      })
      this.loading = true
      $get(api.dispatchRecommendRoute, {vehicles: JSON.stringify(vehicles)}).then(res => {
        res.forEach(item => {
          // 判断行驶类型
          if (item.carry_type) {
            this.$set(item, 'carry_type', item.carry_type)
          } else if(item.vehicles && item.vehicles.length > 0) {
            this.$set(item, 'carry_type', 'heavy')
          } else {
            this.$set(item, 'carry_type', 'empty')
          }
          item.vehicles.forEach(vehicle => {
            vehicle.id = `${vehicle.id}_${vehicle.id}`
            this.selectData.forEach(select => {
              if (select.id === vehicle.id) {
                this.$set(vehicle, 'from', select.from)
                this.$set(vehicle, 'from_display', select.from_display)
                this.$set(vehicle, 'to', select.to)
                this.$set(vehicle, 'to_display', select.to_display)
                this.$set(vehicle, 'vehicle_display', select.vehicle_display)
                this.$set(vehicle, 'vin', select.vin)
                this.$set(vehicle, 'number', select.number)
                this.$set(vehicle, 'agency_display', select.agency_display || '')
                this.$set(vehicle, 'place_time_display', select.place_time_display || '')
                this.$set(vehicle, 'dealer_display', select.dealer_display || '')
              }
            })
          })
        });
        this.dispatchList = res
        this.loading = false
      })
    },
    // 删除调令
    deleteDispatch(index) {
      this.dispatchList.splice(index, 1)
    },
    // 删除商品车
    deleteVehicle(vehicles, index) {
      vehicles.splice(index, 1)
    }
  },
  created() {
    this.editingDispatch = this.$route.query.id ? true : false
  }
}
</script>

<style lang="scss" scoped>
  .dispatch-list{
    margin-bottom: 20px;
  }
  .no-list-notice{
    text-align: center;
    padding: 60px 0;
    font-size: 16px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.05);
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 20px;
    .el-button{
      margin-left: 5px;
    }
  }
  .no-vehicle{
    text-align: center;
    padding: 20px 0 30px 0;
    font-size: 20px;
  }
  .el-card.item{
    &+.item{
      margin-top: 20px;
    }
    /deep/.el-card__body{
      padding-bottom: 10px;
    }
  }
  .item-header{
    display: flex;
    justify-content: space-between;
    color: #303133;
    font-weight: 500;
    align-items: center;
  }
  .item-left{
    display: flex;
    align-items: center;
    .from, .to{
      font-size: 24px;
      flex-shrink: 0;
      max-width: 250px;
      word-break: break-all;
    }
    .icon{
      margin-left: 30px;
      margin-right: 30px;
      position: relative;
      height: 32px;
      min-width: 35px;
      text-align: center;
      img{
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      P{
        padding: 0;
        margin: 0;
        display: inline-block;
        margin-top: 14px;
      }
    }
    .el-button{
      margin-left: 30px;
      padding: 10px 12px;
    }
    .type{
      flex-shrink: 0;
      border-radius: 5px;
      background-color: rgba(0, 153, 102, 1);
      padding: 5px 10px;
      color: #fff;
      font-size: 14px;
      margin-left: 15px;
    }
    .number{
      margin-left: 30px;
      flex-shrink: 0;
    }
  }
  .btn-box{
    flex-shrink: 0;
    .el-button{
      padding: 10px 15px;
    }
  }
  .vehicle-item{
    display: inline-block;
    border: 1px solid $themeColor;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 10px 50px 10px 10px;
    position: relative;
    transition: all .3s;
    &:hover{
      box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);;
    }
    p{
      margin: 0;
    }
    .delete{
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
    .brand{
      margin-top: 10px;
    }
    .el-checkbox{
      margin-top: 6px;
    }
  }
</style>
