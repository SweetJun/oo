<template>
  <div>
    <nf-form-wrap title="公司油价管理" :on-save-btn-click="onSaveBtnClick" :is-loading="btnLoading">
      <el-form class="box_260" :model="ruleForm" ref="ruleForm" label-position="top" :rules="rules">
        <div class="clearfix line">
          <el-form-item label="适用分组" prop="name">
            <el-select :disabled="ruleForm.effect === '2'" v-model="ruleForm.truck_group_ids" multiple filterable
              placeholder="请选择适用分组">
              <el-option v-for="(item, index) in groupList" :key="index" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="clearfix line addr">
          <el-form-item label="适用路线" prop="from_region_id">
            <el-select v-model="ruleForm.from_region_id" filterable clearable remote reserve-keyword placeholder="请选择出发地"
              :remote-method="remoteMethod1" :loading="loading" :disabled="isEditing" v-if="!ruleForm.is_unlimit">
              <el-option v-for="item in options_f" :key="item.id" :label="item.names" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" " prop="to_region_name">
            <el-select v-model="ruleForm.to_region_id" filterable clearable remote reserve-keyword placeholder="请选择目的地"
              :remote-method="remoteMethod2" :loading="loading" :disabled="isEditing" v-if="!ruleForm.is_unlimit">
              <el-option v-for="item in options_t" :key="item.id" :label="item.names" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <p class="islimit">
          <el-checkbox :disabled="isEditing" v-model="ruleForm.is_unlimit">不限路线</el-checkbox>
        </p>
        <div class="clearfix line">
          <el-form-item label="公司油价" prop="price">
            <el-input v-model="ruleForm.price" placeholder="请输入公司油价">
              <template slot="append">元/升</template>
            </el-input>
          </el-form-item>
        </div>
        <div class="clearfix line" v-if="this.isEditing">
          <el-form-item label="生效时间" required>
            <el-radio v-model="ruleForm.effect" label="1">立即生效</el-radio>
            <el-radio v-model="ruleForm.effect" label="2">定时生效</el-radio>
            <el-date-picker type="datetime" v-if="ruleForm.effect === '2'" v-model="ruleForm.time"
              format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择生效时间">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="clearfix line steps" v-if="this.isEditing">
          <div class="css_line">
            <div :class="{ 'css_dot': index===0, 'css_dot1': index===1 }" v-for="(item, index) in price_history"
              :key="index">
              <p class="dot"><span></span></p>
              <p class="price" style="font-weight:bold;color:rgb(102,102,102)">{{item.price}}元/升</p>
              <p class="time">{{item.effect_time}}</p>
            </div>
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
      loading: false,
      options_f: [],
      options_t: [],
      groupList: [],
      levels: ['province', 'city'],
      ruleForm: {
        truck_group_ids: [],
        from_region_id: '',
        to_region_id: '',
        from_region_name: '',
        to_region_name: '',
        is_unlimit: false,
        price: '',
        time: '',
        effect: '1',
        price_history: []
      },
      rules: {
        price: [{ required: true, validator: this.$valid.isFloatNumber(true, '油价不能为空'), trigger: 'blur' }]
      },
      price_history: [],
      sessionTruck_group: []
    }
  },
  computed: {
    effect() {
      return this.ruleForm.effect
    }
  },
  watch: {
    effect(val) {
      if (val === '2') {
        this.$set(this.ruleForm, 'truck_group_ids', this.sessionTruck_group);
      }
    }
  },
  created() {
    this.getTruckGroupList()
    this.edit_id = this.$route.query.id;
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      // 获取详情
      this.getDetail(this.edit_id)
    }
  },
  methods: {
    // 获取运力分组
    getTruckGroupList() {
      $get(api.truckGroupOptions).then(res => {
        this.groupList = res
      })
    },
    // 模糊查询地址
    async remoteMethod1(query) {
      let levels = []
      if (this.ruleForm.to_region_id) {
        levels = [this.options_t[0].level]
      } else if (!this.ruleForm.to_region_id) {
        levels = ['province', 'city']
      }
      if (query !== '') {
        this.loading = true;
        let res = await $get(api.region_search, {
          name: query + '',
          base: 1,
          is_delete: 0,
          levels: levels
        });
        res.data.forEach(item => {
          item.names = item.level_name + ' ' + item.name;
        })
        this.options_f = res.data;
        this.loading = false;
      } else {
        this.options_f = [];
      }
    },
    // 模糊查询地址
    async remoteMethod2(query) {
      let levels = []
      if (this.ruleForm.from_region_id) {
        levels = [this.options_f[0].level]
      } else if (!this.ruleForm.from_region_id) {
        levels = ['province', 'city']
      }
      if (query !== '') {
        this.loading = true;
        let res = await $get(api.region_search, {
          name: query + '',
          base: 1,
          is_delete: 0,
          levels: levels
        });
        res.data.forEach(item => {
          item.names = item.level_name + ' ' + item.name;
        })
        this.options_t = res.data;
        this.loading = false;
      } else {
        this.options_t = [];
      }
    },
    getDetail(id) {
      $get(`${api.oil_line}/${id}`).then(res => {
        res.oil_line.truck_group_ids = res.oil_line.truck_group.map(item => item.id);
        // 地址
        this.options_f.push({
          id: res.oil_line.from_region_id,
          names: res.oil_line.from_region_name
        });
        this.options_t.push({
          id: res.oil_line.to_region_id,
          names: res.oil_line.to_region_name
        });
        // 时间
        if (!res.oil_line.time) {
          this.price_history = [res.oil_line.price_history[0]];
        } else if (res.oil_line.price_history.length >= 2) {
          this.price_history = res.oil_line.price_history.slice(0, 2).reverse();
        } else if (res.oil_line.price_history.length < 2) {
          this.price_history = res.oil_line.price_history;
        }
        this.sessionTruck_group = JSON.parse(JSON.stringify(res.oil_line.truck_group_ids));
        this.ruleForm = res.oil_line;
        if (res.oil_line.time) {
          this.$set(this.ruleForm, 'effect', '2');
        } else {
          this.$set(this.ruleForm, 'effect', '1');
        }
      })
    },
    // 保存
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (Number(this.ruleForm.effect) === 1) {
            this.ruleForm.time = '';
          }
          if (this.ruleForm.is_unlimit) {
            this.ruleForm.from_region_id = 0;
            this.ruleForm.to_region_id = 0;
          }
          loading(true)
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.oil_line}/${this.edit_id}`
            $put(apiUrl, this.ruleForm).then(() => {
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              if (this.ruleForm.is_unlimit) {
                this.ruleForm.from_region_id = '';
                this.ruleForm.to_region_id = '';
              }
              loading(false)
            })
          } else {
            $post(api.oil_line, this.ruleForm).then(() => {
              this.$message.success('添加成功')
              this.$router.back()
            }).catch(() => {
              if (this.ruleForm.is_unlimit) {
                this.ruleForm.from_region_id = '';
                this.ruleForm.to_region_id = '';
              }
              loading(false)
            })
          }
        } else {
          return false;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .box_260 {
    /deep/ .el-form-item__label {
      height: 20px;
      line-height: 20px;
      padding: 0 0 7px !important;
      box-sizing: content-box;
    }

    /deep/ .el-input {
      width: 260px;
    }
  }

  .clearfix {
    .el-form-item {
      float: left;
      margin-right: 20px;
    }
  }

  .time {
    font-size: 12px;
  }

  .steps {
    margin-top: 40px;
    height: 100px;
  }

  .css_line {
    position: relative;
    z-index: 3;
    height: 0;
    border: .5px solid rgb(231, 231, 231);
    width: 480px;
    color: rgb(102, 102, 102);

    .css_dot {
      position: absolute;
      text-align: center;
      width: 100px;
      top: -25px;

      .dot {
        span {
          display: inline-block;
          width: 20px;
          height: 20px;
          background-color: rgb(88, 158, 248);
          border-radius: 50%;
        }
      }
    }

    .css_dot1 {
      position: absolute;
      text-align: center;
      width: 100px;
      top: -25px;
      left: 250px;
      z-index: 3;

      .dot {
        span {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgb(88, 158, 248);
          box-sizing: border-box;
          border-radius: 50%;
          background-color: #fff;
        }
      }
    }
  }

  .addr {
    .el-form-item{
      margin-bottom: 0!important;
    }
  }
  .islimit{
    margin: 7px 0 20px 0;
  }

</style>
