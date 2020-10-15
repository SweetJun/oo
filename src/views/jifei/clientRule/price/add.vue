<template>
  <div>
    <nf-form-wrap title="价格管理" :on-save-btn-click="onSaveBtnClick">
      <el-form :model="formData" ref="ruleForm" :rules="rules" inline label-position="top">
        <el-form-item label="起运地：" prop="from">
          <nf-select
            :disabled="isEditing"
            placeholder="请输入起运地"
            search-key="region_from"
            :options="options_f"
            :value.sync="formData.from">
          </nf-select>
        </el-form-item>
        <el-form-item label="目的地：" prop="to">
          <nf-select
            :disabled="isEditing"
            placeholder="请输入目的地"
            search-key="region_to"
            :options="options_t"
            :value.sync="formData.to">
          </nf-select>
        </el-form-item>
        <el-form-item label="选择品牌：" prop="brandObj">
          <nf-select
            :disabled="isEditing"
            placeholder="请选择品牌"
            value-key="key"
            :options="options_brand"
            :value.sync="formData.brandObj"
            @change="brandChange">
          </nf-select>
        </el-form-item>
        <el-form-item label="选择车型：" prop="vehicle">
          <nf-select
            :disabled="isEditing"
            placeholder="请选择车型"
            :options="options_vehicle"
            :value.sync="formData.vehicle">
          </nf-select>
        </el-form-item>
        <div class="price-table">
          <el-table
            :data="formData.client_rule_specifics"
            border
            style="width: 100%"
            v-loading="tableLoading">
            <el-table-column type="index" label="序号" width="55"></el-table-column>
            <el-table-column min-width="100">
              <template slot="header">
                <span class="required">*</span>结算方式
              </template>
              <template slot-scope="scope">
                <el-form-item :prop="'client_rule_specifics.' + scope.$index + '.calculate_mode'">
                  <el-select v-model="scope.row.calculate_mode" :disabled="scope.row.disabled">
                    <el-option label="单价*台数" value="price_number"></el-option>
                    <el-option label="单价*台数*里程数" value="price_number_mileage"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column min-width="100">
              <template slot="header">
                <span class="required">*</span> 单价
              </template>
              <template slot-scope="scope">
                <el-form-item
                  :prop="'client_rule_specifics.' + scope.$index + '.price'"
                  :rules="[
                    { required: true, validator: $valid.isFloatNumber(true), trigger: 'blur' }
                  ]">
                  <el-input v-model="scope.row.price" placeholder="请输入单价"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="里程数" min-width="100">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'client_rule_specifics.' + scope.$index + '.mileage'"
                  :rules="scope.row.calculate_mode === 'price_number' ? [] : [
                    { required: true, validator: $valid.isFloatNumber(true)}
                  ]">
                  <el-input
                    v-model="scope.row.mileage"
                    :disabled="scope.row.calculate_mode === 'price_number'"
                    placeholder="请输入里程"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column min-width="140">
              <template slot="header">
                <span class="required">*</span> 有效期
              </template>
              <template slot-scope="scope">
                <el-form-item
                  :prop="'client_rule_specifics.' + scope.$index + '.dateRange'"
                  :rules="[
                    { required: true, message: '请选择有效期', trigger: 'change' }
                  ]">
                  <el-date-picker
                    v-model="scope.row.dateRange"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="请选择开始日期"
                    end-placeholder="请选择结束日期">
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="80" label="操作">
              <template slot-scope="scope">
                <el-button type="text danger" @click="delTableRow(scope.$index)"> 删除 </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="add-time_btn">
            <el-button type="primary" @click="addTimeRange">添加时间段</el-button>
          </div>
        </div>
      </el-form>
    </nf-form-wrap>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEditing: false,
      tableLoading: false,
      options_f: [],
      options_t: [],
      options_brand: [],
      options_vehicle: [],
      type: '',
      formData: {
        from: '',
        to: '',
        brandObj: '',
        brand: '',
        vehicle: '',
        client_rule_specifics: [
          {
            calculate_mode: 'price_number',
            price: '',
            mileage: '',
            dateRange: [] // 有效期
          }
        ]
      },
      rules: {
        from: [{ required: true, message: '请选择起运地', trigger: 'change' }],
        to: [{ required: true, message: '请选择目的地', trigger: 'change' }],
        brandObj: [{ required: true, message: '请选择商品车品牌', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 商品车品牌下拉
    getBrandOptions() {
      let url = `${api.searchItemOption}/vehicle_brand_level_two`
      $get(url).then(res => {
        this.options_brand = res
      })
    },
    // 选择品牌
    brandChange() {
      this.formData.vehicle = ''
      this.getVehicleOptions()
    },
    // 车型品牌下拉
    getVehicleOptions() {
      let url = `${api.searchItemOption}/vehicle`
      let params = {
        vehicle_brand_level_two: this.formData.brandObj
      }
      $get(url, { condition: params }).then(res => {
        this.options_vehicle = res
      })
    },
    // 添加时间段
    addTimeRange() {
      this.formData.client_rule_specifics.push({
        calculate_mode: 'price_number',
        price: '',
        mileage: '',
        dateRange: [], // 有效期
        disabled: false
      })
    },
    // 删除时间段
    delTableRow(index) {
      if (this.formData.client_rule_specifics.length === 1) {
        this.$message.warning('至少保留一项！')
        return
      }
      this.confirm('删除后，该有效期对应的运单收入将会更新为0元，请谨慎删除！', '删除确认').then(() => {
        this.formData.client_rule_specifics.splice(index, 1)
      }).catch(() => {})
    },
    // 获取详情
    getDetail(id) {
      $get(`${api.clientRule}/${id}`).then(res => {
        this.formData.from = res.from
        this.formData.to = res.to
        this.options_f.push({
          key: res.from,
          value: res.from_display
        })
        this.options_t.push({
          key: res.to,
          value: res.to_display
        })
        let brandObj = {
          key: res.brand,
          value: res.brand_display
        }
        this.formData.brandObj = brandObj
        this.options_brand.push(brandObj)
        this.options_vehicle.push({
          key: res.vehicle,
          value: res.vehicle_display
        })
        this.formData.vehicle = res.vehicle ? res.vehicle : ''
        if (res.client_rule_specifics.length > 0) {
          res.client_rule_specifics.forEach(item => {
            item.mileage = item.mileage === 0 ? '' : item.mileage
            this.$set(item, 'dateRange', [item.effect_start_time, item.effect_end_time])
            this.$set(item, 'disabled', true)
          })
        } else {
          res.client_rule_specifics = [{
            calculate_mode: 'price_number',
            price: '',
            mileage: '',
            dateRange: [], // 有效期
            disabled: false
          }]
        }
        this.formData.client_rule_specifics = res.client_rule_specifics
        this.getVehicleOptions()
      })
    },
    // 保存
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let client_rule_specifics = _.cloneDeep(this.formData.client_rule_specifics)
          client_rule_specifics.forEach(item => {
            item.price = Number(item.price)
            item.mileage = Number(item.mileage)
            item.effect_start_time = item.dateRange[0] || ''
            item.effect_end_time = item.dateRange[1] || ''
            delete item.dateRange
          })
          let params = {
            set_id: this.set_id,
            type: this.type,
            from: this.formData.from,
            to: this.formData.to,
            brand: this.formData.brandObj.key,
            vehicle: this.formData.vehicle ? this.formData.vehicle : 0,
            client_rule_specifics: client_rule_specifics
          }
          loading(true)
          if (this.isEditing) { // 判断 编辑 和 新增
            this.confirm('该时间段内的运单将重新计算产值收入，请谨慎修改！', '运单产值更新提示').then(() => {
              let apiUrl = `${api.clientRule}/${this.edit_id}`
              $put(apiUrl, params).then(() => {
                loading(false)
                this.$message.success('编辑成功')
                this.$router.back()
              }).catch(() => {
                loading(false)
              })
            }).catch(() => {})
          } else {
            $post(api.clientRule, params).then(() => {
              loading(false)
              this.$message.success('添加成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          }
        } else {
          return false
        }
      })
    },
    setDefaultData() {
      const query = this.$route.query
      this.formData.from = JSON.parse(query.from)[0].key
      this.formData.to = JSON.parse(query.to)[0].key
      this.formData.brandObj = JSON.parse(query.brand)

      this.getVehicleOptions()
      this.options_f = JSON.parse(query.from)
      this.options_t = JSON.parse(query.to)
      this.formData.vehicle = Number(query.vehicle)
    }
  },
  created() {
    this.getBrandOptions()
    const query = this.$route.query
    this.set_id = query.set_id
    this.type = query.type // 是结算还是暂估
    this.isEditing = query.id ? true : false
    this.edit_id = query.id
    this.has_id = query.has_id
    if (this.isEditing) {
      this.getDetail(this.edit_id)
    } else if (query.has_id) {
      this.setDefaultData()
    }
  }
}

</script>

<style lang="scss" scoped>
  .price-table /deep/{
    td{
      padding: 0;
      .cell{
        padding: 20px 5px;
      }
    }
    .el-form-item{
      margin: 0;
    }
    .el-form-item,
    .el-date-editor--daterange.el-input__inner{
      width: 100%;
    }
  }
  .add-time_btn{
    margin-top: 20px;
  }
</style>
