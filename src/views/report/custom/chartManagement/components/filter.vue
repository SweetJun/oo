<template>
  <div class="filter-conditions" v-if="filterData.length > 0">
    <el-form
      :inline="true"
      ref="formData"
      :label-width="searchLabelWidth">
      <template v-for="(item, index) in filterData">
        <template v-if="item.type === 'complex'">
          <el-form-item
            class="complex"
            v-for="(autocomplete, $index) in item.children"
            :key="$index"
            :label="$index === 0 ? item.name + '：' : ''">
            <el-select
              class="search-item"
              :key="index"
              value-key="key"
              v-model="formData[autocomplete.id]"
              clearable
              filterable
              @change="((value)=>{cascaderHandleChange(value, item.children, $index)})"
              :loading="loading"
              :placeholder="autocomplete.hint">
              <el-option
                v-for="option in autocomplete.options"
                :key="option.key"
                :label="option.value"
                :value="option">
              </el-option>
            </el-select>
          </el-form-item>
        </template>

        <el-form-item v-else :label="item.name + '：'"  :key="index">
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 'text'"
            class="search-item"
            v-model="formData[item.id]"
            clearable
            :placeholder="item.hint">
          </el-input>
          <!-- 下拉选择框 -->
          <el-select
            v-else-if="item.type === 'select'"
            class="search-item"
            value-key="key"
            v-model="formData[item.id]"
            clearable
            filterable
            :placeholder="item.hint">
            <el-option
              v-for="(option, _index) in item.options"
              :key="_index"
              :label="option.value"
              :value="option">
            </el-option>
          </el-select>
          <!-- 远程搜索选择框 -->
          <el-select
            v-else-if="item.type === 'auto_complete'"
            class="search-item"
            value-key="key"
            v-model="formData[item.id]"
            clearable
            filterable
            remote
            :remote-method="(query)=>{remoteMethod(query, item)}"
            :loading="loading"
            :placeholder="item.hint">
            <el-option
              v-for="(option, _index) in item.options"
              :key="_index"
              :label="option.value"
              :value="option">
            </el-option>
          </el-select>
          <!-- 日期选择 -->
          <el-date-picker
            v-else-if="item.type === 'date'"
            class="search-item"
            v-model="formData[item.id]"
            type="date"
            :placeholder="'请选择' + item.hint"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
          <!-- 日期选择范围 -->
          <el-date-picker
            v-else-if="item.type === 'date_range'"
            class="search-item"
            v-model="formData[item.id]"
            type="daterange"
            :start-placeholder="item.hint || ''"
            :end-placeholder="item.hint || ''"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
/**
 * @Description: 自定义报表管理 过滤条件
 * @Author: wjw
 * @Date: 2020-08-02 10:18:31
 */
import { transfromForBackend, filterOutType } from '@/utils/transformSearchData'
export default {
  props: {
    // 搜索项数据
    filterData: {
      type: Array,
      default: () => []
    },
    // 搜索项label宽度
    searchLabelWidth: {
      type: String,
      default: '100px'
    },
    // 是否是切换，是的话，置空
    isSwitch: {
      type: Number,
      default: 0
    },
    // 数据源
    lastSource: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      formData: {},
      cloneData: {}
    }
  },
  watch: {
    isSwitch(val) {
      if(val) {
        // 切换数据源来的
        this.formData = {}
      }
    }
  },
  methods: {
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
    getCondition() {
      // 这的formData非常奇怪，是个[aaa:1,bbb:2]，导致后边出问题
      let obj = {}
      for(let i in this.formData) {
        obj[i] = this.formData[i]
      }
      let condition = _.cloneDeep(obj)
      let filterCondition = transfromForBackend(condition)
      filterCondition = filterOutType(filterCondition)
      return filterCondition.condition
    }
  }
};
</script>

<style lang="scss" scoped>
  .filter-conditions{
    padding: 10px 10px 0 10px;
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 4px;
    background-color: #fff;
    .el-form--inline .el-form-item{
      width: auto;
      &.complex{
        margin-bottom: 0;
        .search-item{
          margin-right: 80px;
          margin-bottom: 10px;
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
</style>
