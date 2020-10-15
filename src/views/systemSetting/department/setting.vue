<template>
  <div>
    <nf-form-wrap title="部门设置" :on-save-btn-click="onSaveBtnClick">
      <el-form
        :model="formData"
        ref="ruleForm"
        :rules="ruleForm"
        inline
        label-position="top">
        <div>
          <el-form-item label="部门名称：" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item v-if="department_id !== 1" label="设置上级部门：" prop="parent_id">
            <span class="department-name">{{currentPreDepartment.name}}</span>
            <el-button class="edit-department" type="text" @click="handleDepartment">修改</el-button>
          </el-form-item>
          <el-form-item label="部门类型：" prop="agency">
            <el-checkbox v-model="formData.agency">办事处</el-checkbox>
          </el-form-item>
        </div>
        <el-form-item label="部门主管：" prop="admin" style="width: 700px;">
          <el-transfer
            v-model="formData.admin"
            filterable
            filter-placeholder="请输入姓名"
            :props="{key: 'id', label: 'name'}"
            :titles="['待选列表', '已选列表']"
            :data="usersList">
          </el-transfer>
        </el-form-item>
        <div>
          <el-form-item label="选择办事处范围：" prop="address" style="width: 1000px;">
            <p class="item-notice">注：<span>点击右上角菜单栏矩形，拖拽选择办事处范围，右键单击矩形边框可删除当前范围</span></p>
            <div class="map-container">
              <div class="searchResultBox">
                <input type="text" id="suggestId" autocomplete="off" placeholder="请输入关键字搜索" class="el-input__inner">
                <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
              </div>
              <baidu-map
                v-if="getDetailFinished"
                class="baidu-map"
                :center="center"
                :zoom="zoom"
                @ready="bmapInit">
            </baidu-map>
            </div>

          </el-form-item>
        </div>
      </el-form>
    </nf-form-wrap>
    <!-- 选择部门 -->
    <nf-dialog
      title="选择部门"
      :dialog-visible.sync="dialogDepartment"
      width="800px"
      :disabled="!selectData.id"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content flex" slot="content">
        <div class="left">
          <span class="span-title">请选择部门</span>
          <nf-tree
            ref="nfTree"
            v-loading="loading"
            :data="treeData"
            highlight-current
            :expand-on-click-node="false"
            :default-expanded-keys="defaultExpandedKeys"
            @node-click="nodeSelectClick">
          </nf-tree>
        </div>
        <div class="right">
          <span class="span-title">已选择的部门</span>
          <div class="departments">
            <el-tag v-if="selectData.name" closable @close="handleClose">{{selectData.name}}</el-tag>
          </div>
        </div>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: 'lDv014zLPIZPPPhpxUareg5AmtvIfvlj'
})
let myValue;
export default {
  data() {
    return {
      loading: false,
      dialogDepartment: false,
      formData: {
        id: '',
        name: '',
        parent_id: '',
        agency: false,
        admin: []
      },
      ruleForm: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
        parent_id: [{ required: true, message: '请选择上级部门', trigger: 'blur' }]
      },
      treeData: [],
      usersList: [],
      selectData: {id: '', name: ''},
      currentPreDepartment: {id: '', name: ''},
      defaultExpandedKeys: [],
      getDetailFinished: false,
      center: { lng: 116.307852, lat: 40.057031 }, //经纬度
      zoom: 13, //地图展示级别
      range: [],
      allArr: []
    }
  },
  methods: {
    //判断2个数组是否相等
    ArrayIsEqual(arr1, arr2) {
      if (arr1 === arr2) {
        //如果2个数组对应的指针相同，那么肯定相等，同时也对比一下类型
        return true;
      } else if (arr1.length !== arr2.length) {
        return false;
      } else {
        //长度相同
        for (let i in arr1) {
          //循环遍历对比每个位置的元素
          if (arr1[i] !== arr2[i]) {
            //只要出现一次不相等，那么2个数组就不相等
            return false;
          }
        } //for循环完成，没有出现不相等的情况，那么2个数组相等
        return true;
      }
    },
    // 根据地址划线
    initDataFun(BMap) {
      let newlng = 116.404;
      let newlat = 39.915;
      if (this.range.length > 0) {
        let rangeAllArr = this.range;
        let arr = [];
        for (let i = 0; i < rangeAllArr.length; i++) {
          let item = rangeAllArr[i]
          let rangeArr = [
            {lng: Number(item.bottom_right_lng), lat: Number(item.bottom_right_lat)},
            {lng: Number(item.bottom_left_lng), lat: Number(item.bottom_left_lat)},
            {lng: Number(item.top_left_lng), lat: Number(item.top_left_lat)},
            {lng: Number(item.top_right_lng), lat: Number(item.top_right_lat)}
          ];
          //默认定位
          newlng = (Number(rangeArr[0].lng) + Number(rangeArr[1].lng)) / 2;
          newlat = (Number(rangeArr[0].lat) + Number(rangeArr[2].lat)) / 2;
          //默认定位end
          //把第一个点放进去，不然不闭合
          rangeArr.push(rangeArr[0]);
          let pointsArr = [];
          for (let j in rangeArr) {
            pointsArr.push(new BMap.Point(rangeArr[j].lng, rangeArr[j].lat));
          }
          //编辑获取坐标并画线
          let polyline = new BMap.Polyline(pointsArr, {
            strokeColor: 'blue', //设置颜色
            strokeWeight: 8, //宽度
            strokeOpacity: 0.5 //透明度
          });
          arr.push({
            polyline: polyline,
            rarr: rangeArr
          });
          this.map.addOverlay(polyline);
          this.map.centerAndZoom(new BMap.Point(newlng, newlat), 13); // 初始化地图,设置中心点坐标和地图级别
        }
        arr.forEach(item => {
          let polylineMenu = new BMap.ContextMenu();
          polylineMenu.addItem(
            new BMap.MenuItem('删除范围', () => {
              let this_arr = item.rarr;
              this.map.removeOverlay(item.polyline);
              for (let j in this.allArr) {
                let del_item = this.allArr[j]
                let delArr = [
                  {lng: Number(del_item.bottom_right_lng), lat: Number(del_item.bottom_right_lat)},
                  {lng: Number(del_item.bottom_left_lng), lat: Number(del_item.bottom_left_lat)},
                  {lng: Number(del_item.top_left_lng), lat: Number(del_item.top_left_lat)},
                  {lng: Number(del_item.top_right_lng), lat: Number(del_item.top_right_lat)}
                ];
                if (JSON.stringify(delArr) === JSON.stringify(this_arr)) {
                  this.allArr.splice(j, 1);
                }
              }
            })
          );
          item.polyline.addContextMenu(polylineMenu);
        });
      }
    },
    // 地图初始化
    bmapInit({ BMap, map }) {
      this.map = map;
      this.map.enableScrollWheelZoom();
      // 动态引用cdn资源
      let script2 = document.createElement('script');
      script2.type = 'text/javascript';
      script2.src =
        '//api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js';
      document.body.appendChild(script2);
      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href =
        '//api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css';
      document.body.appendChild(link);
      setTimeout(() => {
        this.initDataFun(BMap)
        let styleOptions = {
          strokeColor: 'red', //边线颜色。
          fillColor: '', //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 8, //边线的宽度，以像素为单位。
          strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
          fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
          strokeStyle: 'solid' //边线的样式，solid或dashed。
        };
        // 实例化鼠标绘制工具
        let drawingManager = new BMapLib.DrawingManager(map, {
          isOpen: false, //是否开启绘制模式
          enableDrawingTool: true, //是否显示工具栏
          enableCalculate: false,
          drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            drawingModes: [BMAP_DRAWING_RECTANGLE]
          },
          circleOptions: styleOptions, //圆的样式
          polygonOptions: styleOptions, //多边形的样式
          rectangleOptions: styleOptions //矩形的样式
        });
        //建立一个自动完成的对象
        let ac = new BMap.Autocomplete(
          {'input': 'suggestId' ,'location': map });
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener('overlaycomplete', this.overlaycomplete);
        ac.addEventListener('onhighlight', this.onhighlight);
        ac.addEventListener('onconfirm', this.onconfirm);
      }, 1500);
    },
    // 获取绘制结果
    overlaycomplete(e) {
      let overlays = [];
      overlays.push(e.overlay);
      //Array<Point> 返回多边型的点数组
      let path = e.overlay.getPath();
      let arr = {
        bottom_right_lng: path[0].lng,
        bottom_right_lat: path[0].lat,
        bottom_left_lng: path[1].lng,
        bottom_left_lat: path[1].lat,
        top_left_lng: path[2].lng,
        top_left_lat: path[2].lat,
        top_right_lng: path[3].lng,
        top_right_lat: path[3].lat
      };
      this.allArr.push(arr);
      let _this = this;
      for (let i = 0; i < overlays.length; i++) {
        (function(i) {
          let oi = overlays[i];
          let polylineMenu1 = new BMap.ContextMenu();
          polylineMenu1.addItem(
            new BMap.MenuItem('删除折线', () => {
              let pt = oi.getPath();
              let a = {
                top_left_lng: pt[0].lng,
                top_left_lat: pt[0].lat,
                top_right_lng: pt[1].lng,
                top_right_lat: pt[1].lat,
                bottom_left_lng: pt[2].lng,
                bottom_left_lat: pt[2].lat,
                bottom_right_lng: pt[3].lng,
                bottom_right_lat: pt[3].lat
              }
              _this.map.removeOverlay(oi);
              for (let j in _this.allArr) {
                if (JSON.stringify(_this.allArr[j]) === JSON.stringify(a)) {
                  _this.allArr.splice(j, 1);
                }
              }
            })
          );
          overlays[i].addContextMenu(polylineMenu1);
        })(i);
      }
    },
    // 地图搜索结果鼠标放在下拉列表上的事件
    onhighlight(e) {
      let str = '';
      let _value = e.fromitem.value;
      let value = '';
      if (e.fromitem.index > -1) {
        value =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
      }
      str = `FromItem<br />index = ${e.fromitem.index} <br />value = ${value}`
      value = '';
      if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
      }
      str += `<br />ToItem<br />index = ${e.toitem.index}<br />value = ${value}`
      document.getElementById('searchResultPanel').innerHTML = str;
    },
    // 地图搜索结果鼠标点击下拉列表后的事件
    onconfirm(e) {
      let _value = e.item.value;
      myValue =
        _value.province +
        _value.city +
        _value.district +
        _value.street +
        _value.business;
      document.getElementById('searchResultPanel').innerHTML = `onconfirm<br />index =  ${e.item.index} <br />myValue =  ${myValue}`;
      this.setPlace();
    },
    // 搜索结果标点
    setPlace() {
      let _this = this
      _this.map.clearOverlays(); //清除地图上所有覆盖物
      function myFun() {
        let pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
        _this.map.centerAndZoom(pp, 18);
        _this.map.addOverlay(new BMap.Marker(pp)); //添加标注
      }
      let local = new BMap.LocalSearch(_this.map, {
        //智能搜索
        onSearchComplete: myFun
      });
      local.search(myValue);
      // this.areaChanged(myValue)
    },
    // 获取部门树数据
    getDepartmentTree() {
      this.loading = true
      $get(api.departments).then(res => {
        this.treeData = res
        this.loading = false
        if (this.formData.parent_id) {
          this.$nextTick(() => {
            this.defaultExpandedKeys = [this.formData.parent_id]
            this.$refs.nfTree.$refs.tree.setCurrentKey(this.formData.parent_id)
          })
        }
      })
    },
    // 获取部门下的成员
    getUsersByDepartment() {
      let _params = {
        pager: {
          page: 1,
          per_page: 500
        },
        includeChildren: 0
      }
      $get(`${api.departmentUsers}/${this.department_id}`, _params).then(res => {
        this.usersList = res.data
      })
    },
    // 点击选择部门
    handleDepartment() {
      this.selectData = {
        id: this.currentPreDepartment.id,
        name: this.currentPreDepartment.name
      }
      this.dialogDepartment = true
      this.getDepartmentTree()
    },
    // 点击菜单选择部门
    nodeSelectClick(data) {
      this.selectData = data
    },
    // 删除部门
    handleClose() {
      this.selectData = {
        id: '',
        name: ''
      }
    },
    // 选择部门确认
    clickSureBtn() {
      this.formData.parent_id = this.selectData.id
      this.dialogDepartment = false
      this.currentPreDepartment = {
        id: this.selectData.id,
        name: this.selectData.name
      }
    },
    // 设置时获取详情信息
    getDetail(id) {
      $get(`${api.department}/${id}`).then(res => {
        this.formData.parent_id = res.parent_id === 0 ? '' : res.parent_id
        this.formData.name = res.name
        this.formData.agency = res.agency
        this.formData.admin = res.admin
        this.formData.parent_display = res.parent_display
        this.currentPreDepartment = {
          id: this.formData.parent_id,
          name: this.formData.parent_display
        }
        this.range = res.sign_area
        this.allArr = this.range.map(item => {
          delete item.inc_id;
          delete item.department_id;
          return item;
        });
        this.getDetailFinished = true
      })
    },
    // 保存提交
    onSaveBtnClick(loading) {
      loading(false)
      this.formData.sign_area = this.allArr
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true)
          // 根部门 parent_id = 0
          if (this.department_id === 1) {
            this.formData.parent_id = 0
          }
          let apiUrl = `${api.department}/${this.department_id}`
          $put(apiUrl, this.formData).then(() =>{
            loading(false)
            this.$message.success('设置成功')
            this.$router.back()
          }).catch(() => {
            loading(false)
          })
        } else {
          return false
        }
      })
    }
  },
  created() {
    this.department_id = Number(this.$route.query.id)
    this.formData.id = this.department_id
    // 获取详情
    this.getUsersByDepartment()
    this.getDetail(this.department_id)
  }
}
</script>

<style lang="scss" scoped>
  .department-name{
    display: inline-block;
    padding-left: 10px;
    margin-right: 15px;
  }
  .el-transfer /deep/{
    .el-input{
      width: auto;
    }
    .el-transfer-panel{
      width: 240px;
    }
  }
  .item-notice{
    line-height: 1;
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #000;
    margin-bottom: 20px;
    span{
      font-size: 14px;
      font-weight: 100;
      color: red;
    }
  }
  .map-container{
    position: relative;
    overflow: hidden;
  }
  .baidu-map /deep/{
    width: 100%;
    height: 500px;
    .anchorBL{
      display: none;
    }
  }
  .searchResultBox{
    position: absolute;
    z-index: 2;
    padding: 15px;
    top: 0;
    left: 0px;
    background-color: rgba(242, 242, 242, 1);
    box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.3);
  }
  .el-input__inner{
    width: 400px;
  }
</style>
