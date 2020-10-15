<template>
  <div class="nf-top-search" v-if="searchData.length > 0">
    <el-form
      :inline="true"
      ref="formData"
      :label-width="searchLabelWidth">
      <template v-for="(item, index) in customSearchData">
        <template v-if="item.type === 'complex'">
          <el-form-item
            class="complex"
            v-for="(autocomplete, $index) in item.children"
            :key="$index">
            <div class="item-float-label">
              <label
                class="label"
                :class="{'active': autocomplete.isFocus || formData[autocomplete.id]}">
                {{autocomplete.hint}}
              </label>
              <el-select
                :popper-append-to-body="false"
                class="search-item"
                :key="index"
                value-key="key"
                v-model="formData[autocomplete.id]"
                clearable
                filterable
                :loading="loading"
                placeholder=""
                @focus="focus(autocomplete)"
                @blur="blur(autocomplete)"
                @clear="clear(autocomplete)"
                @change="((value)=>{cascaderHandleChange(value, item.children, $index)})">
                <el-option
                  v-for="option in autocomplete.options"
                  :key="option.key"
                  :label="option.value"
                  :value="option">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
        </template>

        <el-form-item v-else :key="index">
          <!-- 输入框 -->
          <div class="item-float-label" v-if="item.type !== 'date_range'">
            <label class="label" :class="{'active': item.isFocus || formData[item.id]}">{{item.hint}}</label>
            <el-input
              v-if="item.type === 'text'"
              class="search-item"
              :id="item.id"
              v-model="formData[item.id]"
              @focus="focus(item)"
              @blur="blur(item)"
              @input="input(item)"
              @clear="clear(item)"
              clearable>
            </el-input>
            <!-- 下拉选择框 -->
            <el-select
              :popper-append-to-body="false"
              v-else-if="item.type === 'select'"
              class="search-item"
              :id="item.id"
              value-key="key"
              v-model="formData[item.id]"
              clearable
              filterable
              placeholder=""
              @focus="focus(item)"
              @blur="blur(item)"
              @clear="clear(item)">
              <el-option
                v-for="(option, _index) in item.options"
                :key="_index"
                :label="option.value"
                :value="option">
              </el-option>
            </el-select>

            <!-- 远程搜索选择框 -->
            <el-select
              :popper-append-to-body="false"
              v-else-if="item.type === 'auto_complete'"
              class="search-item"
              :id="item.id"
              value-key="key"
              v-model="formData[item.id]"
              clearable
              filterable
              remote
              placeholder=""
              :remote-method="(query)=>{remoteMethod(query, item)}"
              :loading="loading"
              @focus="focus(item)"
              @blur="blur(item)"
              @clear="clear(item)">
              <el-option
                v-for="(option, _index) in item.options"
                :key="_index"
                :label="option.value"
                :value="option">
              </el-option>
            </el-select>

            <!-- 日期选择 -->
            <el-date-picker
              :append-to-body="false"
              v-else-if="item.type === 'date'"
              class="search-item"
              :id="item.id"
              v-model="formData[item.id]"
              type="date"
              placeholder=""
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @focus="focus(item)"
              @blur="blur(item)">
            </el-date-picker>
          </div>

          <!-- 日期选择范围 -->
          <div class="item-float-label date-range" v-if="item.type === 'date_range'">
            <label class="label start" :class="{'active': item.isFocus || formData[item.id]}">{{item.hint}}</label>
            <label class="label end" :class="{'active': item.isFocus || formData[item.id]}">{{item.hint}}</label>
            <el-date-picker
              :append-to-body="false"
              class="search-item"
              :id="item.id"
              v-model="formData[item.id]"
              type="daterange"
              start-placeholder=""
              end-placeholder=""
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @focus="focus(item)"
              @blur="blur(item)"
              @change="change(item)">
            </el-date-picker>
          </div>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="handleSearch">查询</el-button>
        <el-button class="set-search" icon="el-icon-setting" @click="customSearchClick"></el-button>
      </el-form-item>
    </el-form>
    <nf-dialog
      title="自定义筛选"
      :append-to-body="true"
      :dialog-visible.sync="dialogCustomSearch"
      width="656px"
      :disabled="checkData.length === 0"
      :click-sure-btn="customSearchSave"
      :before-close="handleClose">
      <div class="nf-dialog-content" slot="content">
        <p class="check-text">已选 <span>{{checkData.length}}</span> 项</p>
        <el-checkbox-group v-model="checkData" :max="10">
          <el-checkbox
            v-for="(item, index) in searchData"
            :key="index"
            :label="item.id">
            {{item.name}}
          </el-checkbox>
        </el-checkbox-group>
        <p class="notice">注意：至少选择一个筛选项，最多选择10个筛选项；</p>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
/**
 * @Description: 列表搜索项组件
 * @Author: wjw
 * @Date: 2020-01-14 14:58:31
 */
import { transfromForFrontend } from '@/utils/transformSearchData'
export default {
  name: "NfTopSearch",
  props: {
    // store模块 名称
    storeModelName: {
      type: String,
      default: ''
    },
    // 搜索项label宽度
    searchLabelWidth: {
      type: String,
      default: '90px'
    },
    // 按钮点击事件回调
    searchClick: {
      type: [Function, Boolean],
      default: false
    },
    // 按钮loading，请求是否完成，防止需要拼接数据的地方发生重复
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    searchData() {
      const searchData = this.$store.state[this.storeModelName].searchData
      if (searchData && searchData.length > 0) {
        this.getVlfSearch()
      }
      return this.$store.state[this.storeModelName].searchData || []
    }
  },
  data() {
    return {
      loading: false,
      dialogCustomSearch: false,
      checkData: [],
      customSearchData: [],
      formData: {}
    }
  },
  methods: {
    focus(item) {
      if (item.isFocus) return
      this.$set(item, 'isFocus', true)
    },
    blur(item) {
      // 兼容下拉选择时，失去焦点label抖动问题
      setTimeout(() => {
        if (this.formData[item.id]) return
        this.$set(item, 'isFocus', false)
      })
    },
    input(item) {
      this.$set(item, 'isFocus', true)
    },
    clear(item) {
      this.$set(item, 'isFocus', true)
      document.getElementById(item.id).focus()
    },
    change(item) {
      if (this.formData[item.id]) {
        this.$set(item, 'isFocus', true)
        return
      }
      this.$set(item, 'isFocus', false)
    },
    // 级联复合搜索
    cascaderHandleChange(value, children, index) {
      if (index + 1 === children.length) return // 排除随后一项
      // 如果清空前一项，后面选项置空
      if (!value) {
        for (let i = index + 1; i < children.length; i++) {
          this.formData[children[i].id] = ''
          children[i].options = []
        }
        return
      }
      let url = `${api.searchItemOption}/${children[index + 1].id}`
      let key = children[index].id
      let param = {}
      param[key] = value
      $get(url, { condition: param }).then(res => {
        children[index + 1].options = res
      })
    },
    // 远程搜索
    remoteMethod(query, item) {
      if (query.trim() !== '') {
        this.loading = true
        let url = `${api.searchItemAutocomplete}/${item.id}`
        $get(url, { keyword: query}).then(res => {
          this.loading = false
          this.$set(item, 'options', res ? res : [])
        })
      } else {
        this.$set(item, 'options', [])
      }
    },
    // 点击搜索
    handleSearch() {
      if (this.searchClick) {
        //TODO:  searchData 保存，实现搜索内容记忆功能
        let result = _.cloneDeep(this.formData)
        _.forIn(result, (val, key) => {
          if (!val) {
            result = _.omit(result, key);
          }
        })
        this.searchClick(result)
      }
    },
    customSearchClick() {
      this.dialogCustomSearch = true
      this.checkData = []
      _.forEach(this.customSearchData, (item) => {
        let data = _.find(this.searchData, { id: item.id })
        if (data.id) {
          this.checkData.push(data.id)
        }
      })
    },
    getVlfSearch() {
      this.editTableHeaderByRow = this.$store.state[this.storeModelName].editTableHeaderByRow
      const currentRow = this.$store.state[this.storeModelName].currentRow
      this.vlfName = this.storeModelName
      if (this.editTableHeaderByRow) {
        this.vlfName = `${this.storeModelName}_${currentRow.id}`
      }
      this.$vlf.getItem(`${this.vlfName}_search`).then(val => {
        if (_.isArray(val) && val.length > 0) {
          this.customSearchData = val
        } else {
          // 默认显示10个
          this.customSearchData = _.take(this.searchData, 10)
        }
      })
    },
    customSearchSave() {
      // 存储本地
      let result = []
      _.forEach(this.searchData, (item) => {
        let _index = _.findIndex(this.checkData, checkId => item.id === checkId)
        if (_index > -1) {
          result.push(item)
        }
      })
      let customData = _.cloneDeep(this.customSearchData)
      this.$vlf.setItem(`${this.vlfName}_search`, result).then(() => {
        this.customSearchData = result
        this.dialogCustomSearch = false

        // 只清空被去掉的搜索项
        _.forEach(customData, (old) => {
          let index = _.findIndex(this.customSearchData, item => item.id === old.id)
          if (index === -1) {
            this.$set(this.formData, old.id, '')
          }
        })
        let searchParams = {
          page: 1,
          condition: this.formData
        }
        this.$store.commit(`${this.storeModelName}/updateParams`, searchParams)
        if (this.editTableHeaderByRow) {
          this.$store.dispatch(`${this.storeModelName}/getTableData`)
        } else {
          this.$store.dispatch('pageData/getTableData', this.storeModelName)
        }
      })
    },
    handleClose() {
      this.dialogCustomSearch = false
    }
  },
  created() {
    let condition = this.$store.state[this.storeModelName].params.condition
    // 从store取出搜索数据后，要还原回搜索组件绑定的格式
    let formData1 = transfromForFrontend(condition)
    this.formData = _.cloneDeep(formData1)
    // 选中的保留了，还要保留下拉的选项，不然会导致切换两次路由，选框内会没有显示，但是值还在0828
    for(let i in this.formData) {
      this.searchData.forEach(item => {
        if(item.type === 'auto_complete') {
          // 现在只有auto_complete的会有问题
          if(item.id === i) {
            this.$set(item, 'options', [this.formData[i]])
          }
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
  .nf-top-search{
    padding: 10px 10px 0 10px;
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .el-form--inline .el-form-item{
      width: auto;
      &.complex{
        margin-bottom: 0;
        .search-item{
          margin-right: 80px;
          &:last-child{
            margin-right: 0;
          }
        }
      }
    }
    .search-item{
      width: 260px;
    }
  }
  .el-form{
    box-sizing: border-box;
    width: 100%;
  }
.item-float-label{
  display: inline-block;
  position: relative;
  height: 40px;
  &.date-range > .label{
    left: 45px;
  }
  & > .label{
    line-height: 1;
    font-size: 13px;
    position: absolute;
    left: 17px;
    z-index: 1;
    color: rgba(178, 178, 178, 0.8);
    top: 50%;
    padding: 0;
    transform: translateY(-50%);
    background-color: #fff;
    transition: .2s ease all;
    perspective: none;
    backface-visibility: hidden;
    pointer-events: none;
    &.active{
      line-height: 1;
      z-index: 1;
      top: -1px;
      left: 8px;
      padding: 0 4px;
      color: rgba(96, 98, 102, .8);
      font-size: 12px;
    }
    &.end{
      left: 160px;
      &.active{
        line-height: 1;
        z-index: 1;
        top: -1px;
        left: 8px;
        padding: 0 4px;
        color: rgba(96, 98, 102, .8);
        font-size: 12px;
      }
    }
  }
}
.check-text{
  margin-top: -15px;
  margin-bottom: 20px;
  span{
    color: $themeColor;
    font-size: 16px;
  }
}
.el-checkbox{
  margin-bottom: 15px;
  &/deep/ {
    .el-checkbox__label{
      word-break: break-all;
      max-width: 100px;
      min-width: 100px;
      white-space: normal;
      vertical-align: middle;
    }
  }
}
.notice{
  color: #F56C6C;
  font-size: 12px;
  position: absolute;
  bottom: 20px;
}
.set-search{
  padding: 12px 13px;
}
</style>
