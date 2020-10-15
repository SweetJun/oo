const check = {
  methods: {
    // 初始化数据，增加 checked 属性
    recursiveCheck(row = {}, checked) {
      this.$set(row, 'checked', checked)
      if (row.vehicles) {
        // 如果子级，父级添加 indeterminate 属性，用于半选
        this.$set(row, 'indeterminate', checked)
        row.vehicles.forEach(child => {
          // 如果子级存在可选的，设置父级可选属性
          if (child.transportable) {
            this.$set(row, 'transportable', true)
          }
          this.$set(child, 'checked', checked)
        })
      }
    },
    //切换选中状态
    toggleCheckedStatus(arr = [], checked) {
      arr.forEach(item => {
        if (item.transportable) {
          item.checked = checked
          if (item.vehicles) {
            item.indeterminate = false
            this.toggleCheckedStatus(item.vehicles, checked);
          }
        }

      })
    },
    //是否所有的都被选中
    isAllChecked(arr = []) {
      arr.forEach(item => {
        // 是否所有都被选中
        if (!item.checked) {
          this.checkedAll = false;
        }
        // 是否存在选中的
        if (item.checked) {
          this.hasChecked = true;
        }
        if (item.vehicles) {
          this.isAllChecked(item.vehicles);
        }
      });
    },
    //当前row存在子级，要验证子级是否全选
    rowAllChecked(arr = []) {
      arr.forEach(item => {
        // 是否所有都被选中
        if (!item.checked) {
          this.childCheckedAll = false
        }
        // 是否存在选中的
        if (item.checked) {
          this.childHasChecked = true
        }
      })
    },
    // 根据子节点id获取上一父级节点
    findParentNode(arr, id) {
      let result;
      if (!arr) return
      for (let j = 0; j < arr.length; j++) {
        if (arr[j].id === id) {
          result = arr[j]
          return result
        }
      }
      for (let j = 0; j < arr.length; j++) {
        if (arr[j].vehicles) {
          for (let i = 0; i < arr[j].vehicles.length; i++) {
            let item = arr[j].vehicles[i]
            if (item.id === id) {
              result = arr[j];
              //找到id相等的则返回父id
              return result;
            } else if (item.vehicles) {
              //如果有子集，则把子集作为参数重新执行本方法
              result = this.findParentNode(item, id);
              if (result) {
                return result;
              }
            }
          }
        }
      }
      return result;
    },
    // 根据子级获取父级并设置父级check状态
    toggleParentByChild(id) {
      // 如果点击的子级，就该子级的父级勾选状态
      this.childCheckedAll = true
      this.childHasChecked = false
      // 根据子级id找到父级，判断父级是否全选
      let parentRow = this.findParentNode(this.tableData, id)
      this.rowAllChecked(parentRow.vehicles)
      if (this.childCheckedAll) { // 全选
        parentRow.checked = true
        parentRow.indeterminate = false
      } else if (!this.childCheckedAll && this.childHasChecked) { // 半选
        parentRow.indeterminate = true
      } else if (!this.childCheckedAll && !this.childHasChecked) { // 不选
        parentRow.checked = false
        parentRow.indeterminate = false
      }
    },
    // 更新表头选中状态
    toggleTableHeaderCheck() {
      //判断整个表格是否全选中，更新表头check状态
      this.checkedAll = true //重置为true，防止上次已经是false的状态
      this.hasChecked = false // 是否有选中的
      this.isAllChecked(this.tableData)
      if (this.checkedAll) { // 全选
        this.isCheckAll = true
        this.indeterminate = false
      } else if (!this.checkedAll && this.hasChecked) { // 半选
        this.indeterminate = true
      } else if (!this.checkedAll && !this.hasChecked) { // 不选
        this.isCheckAll = false
        this.indeterminate = false
      }
    }
  }
}

export default check
