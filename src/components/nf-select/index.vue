<template>
  <el-select
    class="nf-select"
    v-bind="$attrs"
    v-on="$listeners"
    v-model="value"
    :value-key="valueKey ? valueKey : false"
    :filterable="!!searchKey || filterable"
    :clearable="clearable"
    :multiple="multiple"
    :remote="!!searchKey"
    collapse-tags
    reserve-keyword
    :loading="loading"
    :remote-method="remoteMethod"
    @change="changeEvent"
    :placeholder="placeholder">
    <el-option
      v-for="option in options"
      :key="option[props.key]"
      :label="option[props.value]"
      :value="valueKey ? option : option[props.key]">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'nfSelect',
  props: {
    // 占位符
    placeholder: {
      type: String,
      default: ''
    },
    // 如果设置了该属性，绑定值为对象
    valueKey: {
      type: String,
      default: ''
    },
    // 搜索内容的key，如果设置了该属性，会启用远程搜索
    searchKey: {
      type: String,
      default: ''
    },
    // 是否可搜索
    filterable: {
      type: Boolean,
      default: true
    },
    // 是否可清除
    clearable: {
      type: Boolean,
      default: true
    },
    // 是否可多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 下拉数据
    options: {
      tyep: Array,
      default: () => []
    },
    // 绑定值
    value: {
      type: Object,
      default: () => {}
    },
    // 选中的值(name)
    selectValue: {
      tyep: String,
      default: ''
    },
    // 选中的key(id)
    selectKey: {
      type: String,
      default: ''
    },
    // 默认key，value，如果是id name，传入props="{key: 'id', value: 'name'}"
    props: {
      type: Object,
      default: () => {
        return {
          key: 'key',
          value: 'value'
        }
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    // 远程搜索
    remoteMethod(query) {
      if (query.trim() !== '') {
        this.loading = true
        let url = `${api.searchItemAutocomplete}/${this.searchKey}`
        $get(url, { keyword: query }).then(res => {
          this.loading = false
          this.options = res
        })
      } else {
        this.options = []
      }
    },
    // 选中值改变
    changeEvent(val) {
      this.$emit('update:value', val)
    }
  }
}
</script>
