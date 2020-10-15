<template>
  <el-select
    v-model="value"
    value-key="key"
    filterable
    clearable
    remote
    reserve-keyword
    :placeholder="'请选择' + placeholder"
    :remote-method="remoteMethod"
    :loading="loading">
    <el-option
      v-for="item in options"
      :key="item.key"
      :label="item.value"
      :value="item">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'nfAutoSelect',
  data() {
    return {
      loading: false,
      options: this.propOptions,
      value: this.propObj
    }
  },
  props: {
    // 占位符
    placeholder: {
      type: String,
      default: 'a'
    },
    // key
    optionsKey: {
      type: String,
      default: ''
    },
    // 下拉数据
    propOptions: {
      tyep: Array,
      default: () => []
    },
    // 默认的值(name)
    propValue: {
      tyep: String,
      default: ''
    },
    // 默认值的key(id)
    propKey: {
      type: String,
      default: ''
    },
    // 默认值（绑定的对象）
    propObj: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    value(val) {
      this.$emit('update:propObj', val)
      this.$emit('update:propValue', val.value)
      this.$emit('update:propKey', val.key)
    },
    propOptions(val) {
      this.$set(this, 'options', val)
    },
    propObj(val) {
      if (val) {
        this.$set(this, 'value', val)
      }
    }
  },
  methods: {
    remoteMethod(query) {
      if (query.trim() !== '') {
        this.loading = true
        let url = `${api.searchItemAutocomplete}/${this.optionsKey}`
        $get(url, {
          keyword: query
        }).then(res => {
          this.loading = false
          this.options = res
        })
      } else {
        this.options = []
      }
    }
  }
}

</script>
