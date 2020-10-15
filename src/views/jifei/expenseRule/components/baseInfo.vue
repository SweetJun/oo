<template>
  <nf-form-wrap :show-footer="false">
    <el-form :model="formData" ref="ruleForm" :rules="rules" inline label-position="top">
      <el-form-item label="策略名称：" prop="name">
        <el-input v-model="formData.name" clearable placeholder="请输入策略名称" />
      </el-form-item>
      <el-form-item label="适用承运类型：" prop="transport_type">
        <nf-select
          placeholder="请选择承运类型"
          :options="transport_type_list"
          :value.sync="formData.transport_type"
          @change="transportTypeChange">
        </nf-select>
      </el-form-item>
      <el-form-item label="适用场景：" prop="scene" required>
        <el-radio-group v-model="formData.scene" @change="sceneChanged" :disabled="$route.query.id">
          <el-radio label="total_price">算总价</el-radio>
          <el-radio label="borrow">算借支</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="collapse">
        <el-form-item label="适用行驶类型：" prop="carry_type">
          <el-select v-model="formData.carry_type" placeholder="不限">
            <el-option label="不限" value="no_limit"></el-option>
            <el-option label="重驶" value="heavy"></el-option>
            <el-option label="空驶" value="empty"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用运力分组(可多选)：" prop="truck_group">
          <el-select
            v-model="formData.truck_group"
            clearable
            filterable
            multiple
            remote
            collapse-tags
            reserve-keyword
            :remote-method="(query)=>{remoteMethod(query, 'truck_group')}"
            :loading="loading"
            placeholder="不限">
            <el-option
              v-for="(option, _index) in options['truck_group']"
              :key="_index"
              :label="option.value"
              :value="option.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用驾驶员分组(可多选)：" prop="driver_group">
          <el-select
            v-model="formData.driver_group"
            clearable
            filterable
            multiple
            remote
            collapse-tags
            reserve-keyword
            :remote-method="(query)=>{remoteMethod(query, 'driver_group')}"
            :loading="loading"
            placeholder="不限">
            <el-option
              v-for="(option, _index) in options['driver_group']"
              :key="_index"
              :label="option.value"
              :value="option.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出发地：" prop="from">
          <el-select
            v-model="formData.from"
            clearable
            filterable
            remote
            :remote-method="(query)=>{remoteMethod(query, 'region_from')}"
            :loading="loading"
            placeholder="不限">
            <el-option
              v-for="(option, _index) in options['region_from']"
              :key="_index"
              :label="option.value"
              :value="option.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目的地：" prop="to">
          <el-select
            v-model="formData.to"
            clearable
            filterable
            remote
            :remote-method="(query)=>{remoteMethod(query, 'region_to')}"
            :loading="loading"
            placeholder="不限">
            <el-option
              v-for="(option, _index) in options['region_to']"
              :key="_index"
              :label="option.value"
              :value="option.key">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </nf-form-wrap>
</template>

<script>
export default {
  props: {
    htmlData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      // 下拉数据
      options: {
        driver_group: [], // 驾驶员分组
        truck_group: [], // 运力分组
        region_from: '', // 出发地
        region_to: '' // 目的地
      },
      transport_type_list: [],
      formData: {
        name: '',
        transport_type: '',
        scene: '',
        carry_type: 'no_limit',
        truck_group: [],
        driver_group: [],
        from: '',
        to: ''
      },
      rules: {
        name: [{ required: true, message: '请输入策略名称', trigger: 'blur' }],
        transport_type: [{ required: true, message: '请选择承运类型', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 获取承运类型
    getTransportType() {
      let url = `${api.searchItemOption}/transport_type_name`
      $get(url).then(res => {
        this.transport_type_list = res
      })
    },
    transportTypeChange() {
      $get(`${api.transportType}/${this.formData.transport_type}`).then(res => {
        this.$emit('expenseCalculationPoint', res.expense_calculation_point)
      })
    },
    // 更换适用场景
    sceneChanged(val) {
      this.$emit('scene', val)
    },
    // 远程搜索
    remoteMethod(query, key) {
      if (query.trim() !== '') {
        this.loading = true
        let selections = []
        if (_.isArray(this.formData[key])) {
          this.formData[key].forEach(item => {
            let obj = _.find(this.cloneOptions, v => v.key === item )
            if (obj) {
              selections.push(obj)
            }
          })
        }
        let url = `${api.searchItemAutocomplete}/${key}`
        $get(url, { keyword: query}).then(res => {
          this.loading = false
          this.options[key] = _.uniqBy(selections.concat(res), 'key')
          this.cloneOptions = _.cloneDeep(this.options[key])
        })
      } else {
        this.options[key] = []
      }
    }
  },
  created() {
    this.getTransportType()
  }
}
</script>
