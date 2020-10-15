<template>
  <div>
    <nf-form-wrap title="运单信息">
      <div class="order-info">
        <div>客户名称：<span>{{order.client_display}}</span></div>
        <div>运单号：<span>{{order.number}}</span></div>
        <div>录单时间：<span>{{order.create_time_display}}</span></div>
      </div>
    </nf-form-wrap>
    <div class="dispatches">
      <div
        class="dispatch-item"
        v-for="(dispatch, index) in dispatches"
        :key="index">
        <div class="info">
          <div>调度单号：{{dispatch.number}}</div>
          <div>驾驶员：{{dispatch.truck_driver_name}}</div>
          <div>手机号：{{dispatch.truck_driver_mobile}}</div>
        </div>
        <div class="vehicles">
          <el-table
            size="mini"
            :data="dispatch.vehicles"
            border>
            <el-table-column prop="from_display" label="起运地" min-width="80"/>
            <el-table-column prop="to_display" label="目的地" min-width="80"/>
            <el-table-column prop="brand_vehicle_display" label="品牌/车型" min-width="80"/>
            <el-table-column prop="vin" label="车架号" min-width="80"/>
            <el-table-column prop="dealer_display" label="经销商名称" min-width="80"/>
            <el-table-column prop="dealer_contact_display" label="经销商联系人" min-width="80"/>
          </el-table>
        </div>
        <div class="detail">
          <div class="block">
            <el-checkbox
              v-model="dispatch.reply.is_express"
              @change="expressChange(dispatch)">
              有快递费
            </el-checkbox>
            <el-input
              class="margin-left20"
              v-if="dispatch.reply.is_express"
              type="number"
              v-model.number="dispatch.reply.express_expense"
              placeholder="请输入快递费">
            </el-input>
            <el-radio-group
              class="margin-left20"
              v-if="dispatch.reply.is_express"
              v-model="dispatch.reply.express_charge">
              <el-radio label="driver">驾驶员承担</el-radio>
              <el-radio label="company">公司承担</el-radio>
            </el-radio-group>
          </div>
          <div class="block">
            <div class="item">
              <span class="label" style="width: 100px;display: inline-block;">回单时间：</span>
              <el-date-picker
                v-model="dispatch.reply.reply_time"
                type="date"
                placeholder="请选择回单时间"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </div>
            <div class="item">
              <span class="label">回单类型：</span>
              <nf-select
                placeholder="请选择回单类型"
                :options="replyTypeList"
                :value.sync="dispatch.reply.reply_type">
              </nf-select>
            </div>
          </div>
          <div class="block">
            <h4>运单照片：</h4>
            <nf-upload
              :url="uploadUrl"
              :file-preview-list="fileList[index]"
              :upload-success="(response, file) => handleFileSuccess(response, file, dispatch, index)"
              :file-remove="(id) => handleFileRemove(id, dispatch, index)">
            </nf-upload>
          </div>
          <div class="block" v-if="dispatch.supplement.order_number">
            <div class="item">
              <span>补单信息：</span>
              <span>{{dispatch.supplement.order_number}}</span>
            </div>
            <div class="item">
              <span>补单费用：</span>
              <span>{{dispatch.supplement.supplement_expense}}</span>
            </div>
            <el-button class="repair-btn" type="danger" size="small" @click="editRepairOrder(dispatch)">修改补单</el-button>
          </div>
          <div class="block" style="width: 400px">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入备注"
              maxlength="100"
              show-word-limit
              v-model="dispatch.reply.note">
            </el-input>
          </div>
          <div class="block submit">
            <el-button type="primary" :loading="btnLoading" @click="replyOrder(dispatch)">回单</el-button>
            <el-button type="danger" @click="repairOrder(dispatch)" v-if="!dispatch.supplement.order_number">补单</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 补单 -->
    <nf-dialog
      title="补单"
      :dialog-visible.sync="dialogVisible"
      width="580px"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content" v-loading="loading">
        <el-form :model="formData" :rules="formRules" inline ref="formData" label-position="top">
          <el-form-item label="新运单号：" prop="order_number">
            <el-input v-model="formData.order_number" placeholder="请输入新运单号"></el-input>
          </el-form-item>
          <el-form-item label="补单金额：" prop="supplement_expense">
            <el-input type="number" v-model.number="formData.supplement_expense" placeholder="请输入金额">
              <template slot="append">元</template>
            </el-input>
            <el-radio-group v-model="formData.supplement_charge">
              <el-radio label="driver">驾驶员承担</el-radio>
              <el-radio label="company">公司承担</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
// 运单回单
export default {
  data() {
    return {
      dialogVisible: false,
      btnLoading: false,
      order: {},
      dispatches: [],
      replyTypeList: [],
      fileList: [],
      uploadUrl: api.fileUpload,
      formData: {
        order_number: '',
        supplement_expense: '',
        supplement_charge: 'driver'
      },
      formRules: {
        order_number: [{ required: true, message: '请输入新运单号', trigger: 'blur' }],
        supplement_expense: [{validator: this.$valid.isFloatNumber(), trigger: 'blur'}]
      }
    }
  },
  methods: {
    // 获取回单类型
    getReplyType() {
      let url = `${api.searchItemOption}/order_type`
      $get(url).then(res => {
        this.replyTypeList = res
      })
    },
    // 获取回单信息
    getOrderDetail() {
      let url = `${api.order}/${this.id}/to/reply`
      $get(url).then(res => {
        this.order = res.order
        res.dispatches.forEach((item, index) => {
          // 车辆信息
          this.fileList.push([])

          if (item.vehicles) {
            item.vehicles.forEach(vehicle => {
              this.$set(vehicle, 'from_display', res.order.from_display)
              this.$set(vehicle, 'to_display', res.order.to_display)
              this.$set(vehicle, 'brand_vehicle_display', `${vehicle.brand_display} / ${vehicle.vehicle_display}`)
            })
          }
          // 运单信息 默认值
          if (Array.isArray(item.reply) && item.reply.length === 0) {
            item.reply = {
              is_express: false,
              express_expense: '',
              express_charge: 'driver',
              reply_time: moment().format("YYYY-MM-DD HH:mm:ss"),
              reply_type: 1,
              note: ''
            }
          }
          // 运单补单信息
          if (Array.isArray(item.images) && item.images.length === 0) {
            item.images = {
              existing: [],
              uploaded: []
            }
          } else {
            item.images.existing.forEach(imgId => {
              this.fileList[index].push(`${api.orderReply}/${this.id}/${item.id}/image/${imgId}?${item.reply.update_time}`)
            })
          }
        })
        this.dispatches = res.dispatches
      })
    },
    // 是否有快递费
    expressChange(dispatch) {
      if (!dispatch.reply.is_express) {
        dispatch.reply.express_expense = ''
        dispatch.reply.express_charge = 'driver'
      }
    },
    // 上传成功
    handleFileSuccess(response, file, dispatch, index) {
      dispatch.images.uploaded.push(response.file)
      this.fileList[index].push(file.url)
    },
    // 移除照片
    handleFileRemove(id, dispatch) {
      _.pull(dispatch.images.uploaded, id)
      _.pull(dispatch.images.existing, id)
    },
    // 点击补单
    repairOrder(row) {
      this.currentOrder = row
      this.dialogVisible = true
      this.formData = {
        order_number: '',
        supplement_expense: '',
        supplement_charge: 'driver'
      }
      this.$nextTick(() => {
        this.$refs['formData'].clearValidate()
      })
    },
    // 修改补单
    editRepairOrder(row) {
      this.currentOrder = row
      this.dialogVisible = true
      this.formData = {
        order_number: row.supplement.order_number,
        supplement_expense: row.supplement.supplement_expense,
        supplement_charge: row.supplement.supplement_charge
      }
    },
    // 确认补单
    clickSureBtn() {
      if (Array.isArray(this.currentOrder.supplement) && this.currentOrder.supplement.length === 0) {
        this.currentOrder.supplement = {}
        this.$set(this.currentOrder.supplement, 'order_number', this.formData.order_number)
        this.$set(this.currentOrder.supplement, 'supplement_expense', this.formData.supplement_expense)
        this.$set(this.currentOrder.supplement, 'supplement_charge', this.formData.supplement_charge)
      } else {
        this.currentOrder.supplement.order_number = this.formData.order_number
        this.currentOrder.supplement.supplement_expense = this.formData.supplement_expense
        this.currentOrder.supplement.supplement_charge = this.formData.supplement_charge
      }
      this.dialogVisible = false
    },
    // 点击回单
    replyOrder(dispatch) {
      let data = _.cloneDeep(dispatch)
      data.reply.express_expense = this.moneyYuanToCent(data.reply.express_expense)
      data.supplement.supplement_expense = this.moneyYuanToCent(data.supplement.supplement_expense)
      let params = {
        order: this.order.id,
        dispatch: data.id,
        reply: data.reply,
        supplement: data.supplement,
        images: data.images
      }
      this.btnLoading = true
      $post(api.orderReply, params).then(() => {
        this.$message.success(`${dispatch.number} 回单成功`)
        setTimeout(() => {
          this.btnLoading = false
        }, 1000)
      }).catch(() => {
        this.btnLoading = false
      })
    }
  },
  created() {
    this.getReplyType()
    this.id = this.$route.query.id
    this.getOrderDetail()
  }
}
</script>

<style lang="scss" scoped>
  .order-info{
    div{
      display: inline-block;
      margin-right: 50px;
      span{
        font-size: 18px;
      }
    }
  }
  .dispatch-item{
    background-color: #fff;
    box-shadow: 0 0px 12px 0 rgba(0, 0, 0, .1);
    border-radius: 4px;
    padding: 20px;
    &+.dispatch-item{
      margin-top: 10px;
    }
  }
  .info{
    margin-bottom: 15px;
    div{
      display: inline-block;
      margin-right: 40px;
      font-weight: 600;
    }
  }
  .detail {
    margin-top: 40px;
    .margin-left20{
      margin-left: 20px;
    }
  }
  .block{
    &+.block{
      margin-top: 20px;
    }
    .el-input{
      width: 180px;
    }
    .item{
      display: inline-block;
      &+.item{
        margin-left: 20px;
      }
    }
  }
  .submit{
    .el-button{
      width: 100px;
    }
  }
  .repair-btn{
    margin-left: 20px;
  }
  .nf-form-wrap.show-footer{
    margin-bottom: 10px;
  }
  .dispatches{
    margin-bottom: 80px;
  }
</style>
