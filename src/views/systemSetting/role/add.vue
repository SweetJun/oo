<template>
  <div>
    <nf-form-wrap title="角色管理" :on-save-btn-click="onSaveBtnClick">
      <el-form :model="formData" ref="ruleForm" :rules="formRules" label-position="top" inline>
        <div>
          <el-form-item label="角色名称：" prop="name">
            <el-input v-model="formData.name" placeholder="请输入角色名称"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="角色描述：" style="width: 530px;">
            <el-input type="textarea" :rows="4" maxlength="200" show-word-limit placeholder="请输入角色描述"
              v-model="formData.description">
            </el-input>
          </el-form-item>
        </div>
        <div>
          <el-input class="ipt" clearable v-model="keywords" placeholder="输入关键字搜索权限"></el-input>
          <el-button type="primary" @click="search(keywords)">搜索</el-button>
          <el-tabs type="card" ref="elTabs" style="margin-top:20px;">
            <el-tab-pane v-for="(item, index) in groups" :key="index">
              <span slot="label">{{item.value}}<el-badge v-if="item.num>0" :value="item.num" class="item"></el-badge></span>
              <section class="box-card" v-for="(item1, index1) in item.children" :key="index1" style="margin-top:20px;">
                <div class="clearfix"
                  style="height:48px;background:rgba(250,251,252,1);border-left:3px solid rgba(64,158,255,1);text-indent:20px;">
                  <span
                    style="font-weight: bold;float:left;display:inline-block;height:48px;line-height:48px;">{{item1.value}}</span>
                  <el-checkbox class="sall" style="float: left; margin-left:20px;height:48px;line-height:48px;"
                    type="text" v-model="item1.is_checked" @change="selectAll(item1)">全选</el-checkbox>
                </div>
                <!-- 没二级菜单 最后一级-->
                <div class="clearfix" v-if="item1.privileges">
                  <div v-for="(item2, index2) in item1.privileges"  :key="index2"
                    :class="[{'active': item2.isactive}, 'item2', 'checkDom']">
                    <el-checkbox v-model="item2.is_checked" @change="selectItem(item1)">{{item2.value}}
                    </el-checkbox>
                  </div>
                </div>
                <!-- 有二级菜单 -->
                <div class="clearfix" v-if="item1.children">
                  <div v-for="(item2, index2) in item1.children" :key="index2" class="item2">
                    <p
                      style="margin:20px 0 0;font-weight: bold;display:inline-block;height:27px;line-height:27px;text-indent:20px;">
                      {{item2.value}}</p>
                    <!-- 最后一级 -->
                    <div class="clearfix" v-if="item2.privileges">
                      <div v-for="(item3, index3) in item2.privileges" :key="index3" :class="[{'active': item2.isactive}, 'item2', 'checkDom']">
                        <el-checkbox :class="{active : item3.isactive}" v-model="item3.is_checked"
                          @change="selectItem(item1)">{{item3.value}}
                        </el-checkbox>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </el-tab-pane>
          </el-tabs>
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
      groups: [],
      keywords: '',
      formData: {
        name: '',
        description: '',
        privilege: []
      },
      formRules: {
        'name': [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    // 获取所有权限
    getPrivilegesCandidate() {
      $get(api.privilegesCandidate, {}).then(res => {
        this.groups = res;
        this.groups.forEach(item => {
          item.children.forEach(item1 => {
            if (item1.children) {
              item1.children.forEach(item2 => {
                item2.privileges.forEach(item3 => {
                  this.$set(item3, 'isactive', false);
                })
              })
            } else if (item1.privileges) {
              item1.privileges.forEach(item2 => {
                this.$set(item2, 'isactive', false);
              })
            }
          })
        })
      })
    },
    // 搜索
    htmls(item1, item2, keywords) {
      if (keywords === '') {
        return item2.value
      } else if (item2.value.indexOf(keywords) !== -1) {
        return item2.value
      } else {
        return item2.value
      }
    },
    // 全选
    selectAll(data) {
      this.groups.forEach(item => {
        item.children.forEach(item1 => {
          if (item1.key === data.key) {
            // 找到对应
            if (item1.children) {
              item1.children.forEach(item2 => {
                item2.privileges.forEach(item3 => {
                  this.$set(item3, 'is_checked', data.is_checked);
                })
              })
            } else if (item1.privileges) {
              item1.privileges.forEach(item2 => {
                this.$set(item2, 'is_checked', data.is_checked);
              })
            }
          }
        })
      })
    },
    // 单个选
    selectItem(data) {
      this.groups.forEach(item => {
        item.children.forEach(item1 => {
          if (item1.key === data.key) {
            // 找到对应的item1
            if (item1.children) {
              item1.children.forEach(item2 => {
                if (item2.privileges.every(item3 => item3.is_checked)) {
                  this.$set(item1, 'is_checked', true);
                } else {
                  this.$set(item1, 'is_checked', false);
                }
              })
            } else if (item1.privileges) {
              if (item1.privileges.every(item2 => item2.is_checked)) {
                this.$set(item1, 'is_checked', true);
              } else {
                this.$set(item1, 'is_checked', false);
              }
            }
          }
        })
      })
    },
    // 权限搜索
    search(val) {
      this.groups.forEach(item => {
        let n = 0;
        item.children.forEach(item1 => {
          if (item1.children) {
            item1.children.forEach(item2 => {
              item2.privileges.forEach(item3 => {
                if (item3.value.indexOf(val) !== -1) {
                  item3.isactive = true;
                  n++;
                } else {
                  item3.isactive = false;
                }
              })
            })
          } else if (item1.privileges) {
            item1.privileges.forEach(item2 => {
              if (item2.value.indexOf(val) !== -1) {
                item2.isactive = true;
                n++;
              } else {
                item2.isactive = false;
              }
            })
          }
        })
        this.$set(item, 'num', n);
      })
    },
    // 编辑时获取详情信息
    getDetail(id) {
      $get(`${api.role}/${id}`).then(res => {
        this.formData.name = res.name;
        this.formData.description = res.description;
        this.$set(this.formData, 'privilege', []);
        this.groups = res.privileges;
        this.groups.forEach(item => {
          item.children.forEach(item1 => {
            if (item1.children) {
              item1.children.forEach(item2 => {
                item2.privileges.forEach(item3 => {
                  this.$set(item3, 'isactive', false);
                  if (item3.is_checked) {
                    this.selectItem(item1);
                  }
                })
              })
            } else if (item1.privileges) {
              item1.privileges.forEach(item2 => {
                this.$set(item2, 'isactive', false);
                if (item2.is_checked) {
                  this.selectItem(item1);
                }
              })
            }
          })
        })
      })
    },
    // 保存提交
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.formData.privilege = [];
          this.groups.forEach(item => {
            item.children.forEach(item1 => {
              if (item1.children) {
                item1.children.forEach(item2 => {
                  item2.privileges.forEach(item3 => {
                    if (item3.is_checked) this.formData.privilege.push(item3.key);
                  })
                })
              } else if (item1.privileges) {
                item1.privileges.forEach(item2 => {
                  if (item2.is_checked) this.formData.privilege.push(item2.key);
                })
              }
            })
          })
          loading(true)
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.role}/${this.edit_id}`
            $put(apiUrl, this.formData).then(() => {
              loading(false)
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.role, this.formData).then(() => {
              loading(false)
              this.$message.success('添加成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          }
        } else {
          return false;
        }
      })
    }
  },
  created() {
    this.edit_id = this.$route.query.id
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      // 获取详情
      this.getDetail(this.edit_id)
    } else {
      this.getPrivilegesCandidate()
    }
  }
}

</script>

<style lang="scss" scoped>
  .card-type {
    margin-bottom: 20px;

    &>label {
      margin-right: 10px;
    }
  }

  .item-btns {
    display: inline-block;
    margin-top: 35px;

    .el-button {
      padding: 5px 10px;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .checkDom {
    float: left;
    margin-left: 20px;
    margin-top: 20px;
  }

  .sall {
    /deep/ .el-checkbox__label {
      display: inline;
    }
  }

  .ipt {
    width: 260px;
    margin-right: 20px;
  }

  .active {
    /deep/ .el-checkbox__label {
      background-color: rgb(254, 237, 188);
    }
  }

</style>
