<template>
  <div>
    <nf-dialog
      :title="isEditing ? '编辑调令' : '添加调令'"
      :dialog-visible.sync="dialogDispatch"
      width="600px"
      @close="dialogClose"
      :disabled="!formData.mileage"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <el-form :model="formData" :rules="rules" ref="formData" inline label-position="top">
          <el-form-item prop="from">
            <nf-select
              placeholder="请选择出发地"
              value-key="key"
              search-key="region_no_province_from"
              :options="fromList"
              :value.sync="formData.from"
              @change="getMileage">
            </nf-select>
          </el-form-item>
          <el-form-item prop="to">
            <nf-select
              placeholder="请选择目的地"
              value-key="key"
              search-key="region_no_province_to"
              :options="toList"
              :value.sync="formData.to"
              @change="getMileage">
            </nf-select>
          </el-form-item>
          <el-form-item label="调令类型：" prop="carry_type" required>
            <el-radio-group v-model="formData.carry_type" @change="getMileage" :disabled="isEditing">
              <el-radio label="heavy">重驶</el-radio>
              <el-radio label="empty">空驶</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="mileage-item" label="内部里程：" prop="mileage" required>
            <span class="placeholder" v-if="noMileage">{{roles['mileage_add'] ? '暂无内部里程，请添加' : '暂无内部里程，请联系管理员'}}</span>
            <span v-else>{{formData.mileage}}KM</span>
          </el-form-item>
          <el-button
            v-if="roles['mileage_add']"
            class="add-quickly-btn icon"
            style="margin-right: 10px;"
            type="primary"
            icon="el-icon-plus"
            @click="addMileage">
          </el-button>
        </el-form>
      </div>
    </nf-dialog>
    <!-- 快捷添加内部里程 -->
    <nf-quick-mileage
      :dialog-mileage.sync="dialogMileage"
      :from-mileage="fromMileage"
      :to-mileage="toMileage"
      @success="addSuccess">
    </nf-quick-mileage>
  </div>
</template>

<script>
/**
 * @Description: 添加调令
 * @Author: wjw
 * @Date: 2020-04-13 19:18:33
 */
export default {
  props: {
    dialogDispatch: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      dialogMileage: false,
      fromList: [],
      toList: [],
      fromMileage: [],
      toMileage: [],
      privileges: [
        'mileage_add'
      ],
      roles: {
        mileage_add: false
      },
      formData: {
        from: '',
        to: '',
        carry_type: 'heavy',
        mileage: 0
      },
      rules: {
        from: [{ required: true, message: '请选择出发地', trigger: 'blur'}],
        to: [{ required: true, message: '请选择目的地', trigger: 'blur'}]
      }
    }
  },
  computed: {
    noMileage() {
      return Number(this.formData.mileage) > 0 ? false : true
    }
  },
  methods: {
    // 根据出发地目的地获取里程
    getMileage() {
      if (this.formData.from && this.formData.to) {
        let url = `${api.getDistance}/${this.formData.from.key}/${this.formData.to.key}/${this.formData.carry_type}`
        $get(url).then(res => {
          this.formData.mileage = res.distance
        })
      }
    },
    // 快捷添加内部里程
    addMileage() {
      this.dialogMileage = true
      if (_.isObject(this.formData.from)) {
        this.fromMileage = [this.formData.from]
      }
      if (_.isObject(this.formData.to)) {
        this.toMileage = [this.formData.to]
      }
    },
    // 快捷添加里程成功回调
    addSuccess() {
      this.getMileage()
    },
    // 确认添加或者编辑调令
    clickSureBtn(loading) {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          loading(false)
          this.dialogClose()
          this.$emit('sure-click', this.formData)
        } else {
          return false;
        }
      })
    },
    // 弹框关闭事件
    dialogClose() {
      this.dialogDispatch = false
      this.$emit('update:dialogDispatch', false)
    },
    // 权限检测
    getPrivileges() {
      this.checkPrivileges(this.privileges).then(res => {
        this.roles = res ? res : {}
      })
    }
  },
  created() {
    this.getPrivileges()
    if (this.isEditing) {
      const data = this.data
      let fromObj = {key: data.from, value: data.from_display}
      let toObj = {key: data.to, value: data.to_display}
      this.fromList = [fromObj]
      this.toList = [toObj]
      this.formData = {
        from: fromObj,
        to: toObj,
        carry_type: data.carry_type ? data.carry_type : 'heavy',
        mileage: data.mileage
      }
    } else {
      this.formData.carry_type = this.data.carry_type
    }
  }
}
</script>

<style lang="scss" scoped>
  .mileage-item{
    width: 208px;
    position: relative;
    .el-tooltip__popper{
      position: absolute;
      left: 84px;
      top: -35px;
      width: 192px;
      &::after{
        content: " ";
        border-width: 6px;
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        left: -12px;
        top: 12px;
        border-color: transparent;
        border-right-color: #303133;
        border-style: solid;
      }
    }
  }
  .placeholder{
    color: #ccc;
  }
</style>
