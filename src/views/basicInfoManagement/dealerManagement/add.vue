<template>
  <div>
    <nf-form-wrap title="经销商管理：" :on-save-btn-click="onSaveBtnClick">
      <el-form class="box_260" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
        <div class="clearfix">
          <el-form-item label="经销商名称：" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入经销商名称"></el-input>
          </el-form-item>
          <el-form-item label="经销商简称：" prop="brief_name">
            <el-input v-model="ruleForm.brief_name" placeholder="请输入经销商简称"></el-input>
          </el-form-item>
          <el-form-item label="经销商地址：" prop="region">
            <el-input v-model="ruleForm.region" placeholder="请点击设置通过地图选择详细位置" disabled></el-input>
            <el-button type="primary" style="margin-left:20px;" @click="setAddress">设置</el-button>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="联系电话：" prop="phone_no">
            <el-input v-model="ruleForm.phone_no" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="主营品牌：" prop="brand">
            <el-tag v-for="item in tags" :key="item" style="margin-right:20px;margin-bottom:20px;" closable
              @close="closeTag(item)" type="info">
              {{item}}
            </el-tag>
            <el-button
              style="margin-top: 0;"
              class="add-quickly-btn icon"
              type="primary"
              icon="el-icon-plus"
              @click="addBrands">
            </el-button>
          </el-form-item>
        </div>
        <div class="clearfix form-item-block" v-for="(item, index) in ruleForm.available_time" :key="index">
          <el-form-item label="交车时间：" prop="weekday">
            <el-select v-model="item.weekday" multiple placeholder="请选择交车时间（可多选）">
              <el-option label="周一" value="1"></el-option>
              <el-option label="周二" value="2"></el-option>
              <el-option label="周三" value="3"></el-option>
              <el-option label="周四" value="4"></el-option>
              <el-option label="周五" value="5"></el-option>
              <el-option label="周六" value="6"></el-option>
              <el-option label="周日" value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间：" prop="begin_time">
            <el-time-picker v-model="item.begin_time" format="HH:mm" value-format="HH:mm" placeholder="开始时间">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="end_time">
            <el-time-picker v-model="item.end_time" format="HH:mm" value-format="HH:mm" placeholder="结束时间">
            </el-time-picker>
          </el-form-item>
          <div class="item-btns">
            <el-button
              v-if="ruleForm.available_time.length > 1"
              type="danger" icon="el-icon-delete"
              @click="delAvailableTime(index)">
            </el-button>
            <el-button
              v-if="index === ruleForm.available_time.length - 1"
              type="primary" icon="el-icon-plus"
               @click="addAvailableTime">
            </el-button>
          </div>
        </div>
        <div class="clearfix" v-for="(item, index) in ruleForm.contacts" :key="index">
          <el-form-item label="交车联系人：" prop="交车联系人">
            <el-input v-model="item.name" placeholder="请输入交车联系人"></el-input>
          </el-form-item>
          <el-form-item label="联系人手机号：" prop="mobile">
            <el-input v-model="item.mobile" placeholder="请输入联系人手机号"></el-input>
          </el-form-item>
          <div class="item-btns">
            <el-button
              v-if="ruleForm.contacts.length > 1"
              type="danger" icon="el-icon-delete"
              @click="delContacts(index)">
            </el-button>
            <el-button
              v-if="index === ruleForm.contacts.length - 1"
              type="primary" icon="el-icon-plus"
               @click="addContacts">
            </el-button>
          </div>
        </div>
        <el-form-item label="门店照片：" prop="image">
          <nf-upload :url="uploadUrl" :file-preview-list="fileList" :upload-success="handleFileSuccess" :file-remove="handleFileRemove">
          </nf-upload>
        </el-form-item>
      </el-form>
    </nf-form-wrap>
    <nf-dialog title="设置详细地址：" :dialog-visible.sync="dialogVisible" v-if="dialogVisible" width="1300px" :click-sure-btn="clickSureBtn">
      <div class="content" slot="content">
        <p>地址：{{ruleForm.address}}</p>
        <div class="amap-container">
          <nf-select
            placeholder="请选择省"
            :disabled="!provinceEdit"
            :options="provinceList"
            :value.sync="ruleForm.province_id"
            @change="selectProvince">
          </nf-select>
          <nf-select
            placeholder="请选择市"
            :disabled="!cityEdit"
            :options="cityList"
            :value.sync="ruleForm.city_id"
            @change="selectCity">
          </nf-select>
          <nf-select
            placeholder="请选择区/县"
            :disabled="!districtEdit"
            :options="districtList"
            :value.sync="ruleForm.district_id"
            @change="selectArea">
          </nf-select>
          <el-amap-search-box ref="sear" class="search-box" :search-option="searchOption" :on-search-result="onSearchResult">
          </el-amap-search-box>
          <el-amap vid="amap" class="amap-demo" :center="mapCenter" :events="events" :zoom="10">
            <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker">
            </el-amap-marker>
          </el-amap>
        </div>
      </div>
    </nf-dialog>
    <nf-dialog title="添加品牌：" :dialog-visible.sync="dialogVisible1" width="400px" :click-sure-btn="clickSureBtn1">
      <div class="content" slot="content">
        <el-select style="width: 100%;" v-model="brands" multiple filterable size="medium" placeholder="请选择品牌">
          <el-option v-for="(item, index) in brandList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
export default {
  data() {
    let self = this;
    return {
      provinceEdit: true,
      cityEdit: true,
      districtEdit: true,
      provinceList: [],
      cityList: [],
      districtList: [],
      isEditing: false,
      dialogVisible: false,
      dialogVisible1: false,
      brandList: [],
      brands: [],
      tags: [],
      ruleForm: {
        name: '',
        region: '',
        brief_name: '',
        parent_id: '',
        province_id: '',
        city_id: '',
        district_id: '',
        province_name: '',
        city_name: '',
        district_name: '',
        address: '',
        phone_no: '',
        contacts: [{
          name: '',
          mobile: ''
        }],
        available_time: [{
          weekday: [],
          begin_time: '',
          end_time: ''
        }],
        brand: '',
        image: {
          uploaded: [],
          existing: []
        }
      },
      rules: {
        name: [
          { required: true, message: '请输入经销商名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度不能超过 50 个字符', trigger: 'blur' }
        ],
        brief_name: [
          { required: false, message: '请输入经销商简称', trigger: 'blur' },
          { min: 0, max: 20, message: '长度不能超过 20 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请设置经销商地址', trigger: 'blur' }
        ]
      },
      uploadUrl: api.fileUpload,
      fileList: [],
      markers: [
        [116.406829, 39.897094]
      ],
      searchOption: {
        city: '全国',
        citylimit: false
      },
      mapCenter: [116.406829, 39.897094],
      events: {
        click(e) {
          let { lng, lat } = e.lnglat
          self.markers = []
          self.markers.push([lng, lat])
          self.getAMapAddress(lng, lat)
        }
      }
    }
  },
  created() {
    this.edit_id = this.$route.query.id;
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      this.getDetail(this.edit_id)
    }
  },
  methods: {
    getDetail(id) {
      $get(`${api.dealerDetail}/${id}`).then(res => {
        res.region = res.address;
        res.images = JSON.parse(JSON.stringify(res.image));
        this.ruleForm = res;
        delete this.ruleForm.image;
        this.$set(this.ruleForm, 'image', {uploaded: [],existing: res.images});
        // 处理图片
        res.images.forEach(item => {
          this.fileList.push(`${api.dealer}/${this.edit_id}/image/${item}`)
        })
        // 如果没有返回联系人和交车时间
        if (res.contacts.length === 0) {
          res.contacts.push({
            name: '',
            mobile: ''
          })
        }
        if (res.available_time.length === 0) {
          res.available_time.push({
            weekday: [],
            begin_time: '',
            end_time: ''
          })
        }
        // 处理品牌
        res.brand.forEach(item => {
          this.brands.push(item.brand_id);
          this.tags.push(item.brand_name);
        })
      })
    },
    addBrands() {
      this.dialogVisible1 = true
      this.getBrands()
    },
    getBrands() {
      $get(api.searchVehicleBrand, {
        level: 0
      }).then(res => {
        this.brandList = res;
      })
    },
    // 选择完品牌确定
    clickSureBtn1() {
      let arr = [];
      this.brands.forEach(item => {
        arr.push(this.brandList.find(item1 => Number(item1.id) === Number(item)).name)
      })
      this.tags = arr;
      this.dialogVisible1 = false;
      this.ruleForm.brand = this.brands.join(',');
    },
    // 删除品牌
    closeTag(item) {
      this.brands.forEach((item1, index1) => {
        let id = this.brandList.filter(item2 => item2.name === item)[0].id;
        if(Number(item1) === Number(id)) {
          this.brands.splice(index1, 1);
          this.tags = this.tags.filter(item3 => item3 !== item);
        }
      })
    },
    // 选择完地址后确定
    clickSureBtn() {
      if (!this.ruleForm.province_id || !this.ruleForm.city_id || !this.ruleForm.district_id) {
        this.$message.warning('请完善省、市、区信息！')
        return
      }
      if (!this.ruleForm.address) {
        this.$message.warning('请在地图上标记位置信息！')
        return
      }
      if (this.ruleForm.province_id && this.ruleForm.city_id && this.ruleForm.district_id && this.ruleForm.address) {
        this.ruleForm.region = this.ruleForm.address;
        this.dialogVisible = false;
      }
    },
    // 设置地址
    async setAddress() {
      await this.getProvince()
      this.provinceEdit = true
      this.cityEdit = true
      this.districtEdit = true
      this.dialogVisible = true;
      setTimeout(() => {
        document.querySelector(".search-box input").setAttribute('placeholder', '请输入关键字搜索')
      },1000)
      if (!this.ruleForm.region) return

      this.ruleForm.address = this.ruleForm.region;
      this.getAMapLocation();
    },
    // 获取省
    async getProvince() {
      let apiUrl = `${api.searchItemOption}/level_region_province`
      this.provinceList = await $get(apiUrl)
    },
    // 获取市
    async getCity(provinceId, obj) {
      if (!provinceId) return
      if (!obj) {
        obj = _.find(this.provinceList, item => item.key === provinceId)
      }
      let params = {
        level_region_province: obj
      }
      let apiUrl = `${api.searchItemOption}/level_region_city`
      this.cityList = await $get(apiUrl, {condition: params})
    },
    // 获取区县
    async getCounty(cityId, obj) {
      if (!cityId) return
      if (!obj) {
        obj = _.find(this.cityList, item => item.key === cityId)
      }
      let params = {
        level_region_city: obj
      }
      let apiUrl = `${api.searchItemOption}/level_region_county`
      this.districtList = await $get(apiUrl, {condition: params})
    },
    // 选择省
    selectProvince(val) {
      this.cityList = [];
      this.districtList = [];
      this.getCity(this.ruleForm.province_id)
      this.ruleForm.parent_id = this.ruleForm.province_id
      this.ruleForm.province_name = _.find(this.provinceList, item => item.key === val).value
      this.$set(this.ruleForm, 'city_id', '')
      this.$set(this.ruleForm, 'district_id', '')
    },
    // 选择市
    selectCity(val) {
      this.districtList = [];
      this.getCounty(this.ruleForm.city_id)
      this.ruleForm.parent_id = this.ruleForm.city_id
      this.ruleForm.city_name = _.find(this.cityList, item => item.key === val).value
      this.$set(this.ruleForm, 'district_id', '')
    },
    // 选择区
    selectArea(val) {
      this.ruleForm.parent_id = this.ruleForm.district_id
      this.ruleForm.district_name = _.find(this.districtList, item => item.key === val).value
    },
    // 保存
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.brand = this.brands.join(',');
          let ruleForm = _.cloneDeep(this.ruleForm)
          if(ruleForm.available_time.length === 1) {
            if((ruleForm.available_time[0].begin_time === '' || ruleForm.available_time[0].begin_time === null) && (ruleForm.available_time[0].end_time === '' || ruleForm.available_time[0].end_time === null) && ruleForm.available_time[0].weekday.length === 0) {
              ruleForm.available_time = []
            }
          }
          loading(true);
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.dealer}/${this.edit_id}`
            $put(apiUrl, ruleForm).then(() => {
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false);
            })
          } else {
            $post(api.dealer, ruleForm).then(() => {
              this.$message.success('添加成功')
              this.$router.back()
            }).catch(() => {
              loading(false);
            })
          }
        } else {
          return false;
        }
      })
    },
    // 上传成功
    handleFileSuccess(response, file) {
      this.ruleForm.image.uploaded.push(response.file);
      this.fileList.push(file.url)
    },
    // 删除图片
    handleFileRemove(id) {
      _.pull(this.ruleForm.image.uploaded, id)
      _.pull(this.ruleForm.image.existing, id)
    },
    // 添加删除交车时间
    addAvailableTime() {
      this.ruleForm.available_time.push({
        weekday: [],
        begin_time: '',
        end_time: ''
      })
    },
    delAvailableTime(index) {
      this.ruleForm.available_time.splice(index, 1);
    },
    // 添加删除联系人
    addContacts() {
      this.ruleForm.contacts.push({
        name: '',
        mobile: ''
      })
    },
    delContacts(index) {
      this.ruleForm.contacts.splice(index, 1);
    },
    // 处理省市区数据，当地图返回名称跟对应下拉一样时，选中该值，disabled=true
    async dealAddress(addressComponent) {
      const charteredCities = ['北京市', '天津市', '上海市', '重庆市']
      let index = _.findIndex(charteredCities, item => item === addressComponent.province)
      if (index > -1) {
        addressComponent.city = addressComponent.province
        switch(index) {
          case 0:
            addressComponent.province = '北京'
            break
          case 1:
            addressComponent.province = '天津'
            break
          case 2:
            addressComponent.province = '上海'
            break
          case 3:
            addressComponent.province = '重庆'
            break
        }
      }
      const provinceIndex = _.findIndex(this.provinceList, item => item.value === addressComponent.province)
      if (provinceIndex > -1) {
        this.provinceEdit = false
        this.ruleForm.province_id = this.provinceList[provinceIndex].key
        await this.getCity(this.ruleForm.province_id);
        const cityIndex = _.findIndex(this.cityList, item => item.value === addressComponent.city)
        if (cityIndex > -1) {
          this.cityEdit = false
          this.ruleForm.city_id = this.cityList[cityIndex].key
          await this.getCounty(this.ruleForm.city_id)
          const districtIndex = _.findIndex(this.districtList, item => item.value === addressComponent.district)
          if (districtIndex > -1) {
            this.districtEdit = false
            this.ruleForm.district_id = this.districtList[districtIndex].key
          }
        }
      }


    },
    // 这里通过高德 SDK 获取地址信息
    getAMapAddress(lng, lat) {
      AMap.plugin('AMap.Geocoder', () => {
        let geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: 'all'
        });
        geocoder.getAddress([lng, lat], (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            if (result && result.regeocode) {
              this.dealAddress(result.regeocode.addressComponent)
              this.ruleForm.address = result.regeocode.formattedAddress
              this.$nextTick()
            }
          } else {
            this.$message.error(result)
          }
        });
      })
    },
    // 这里通过高德 SDK 获取地址对应经纬度
    getAMapLocation() {
      let self = this;
      AMap.plugin('AMap.Geocoder', () => {
        let geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: 'all'
        });
        geocoder.getLocation(this.ruleForm.address, function(status, result) {
          if (status === 'complete'&&result.geocodes.length) {
            let lnglat = result.geocodes[0].location;
            // 地图标点
            self.markers = []
            self.markers.push([lnglat.lng, lnglat.lat])
            self.mapCenter = [lnglat.lng, lnglat.lat]
            self.getAMapAddress(lnglat.lng, lnglat.lat)
          }else{
            self.$message.error('根据地址查询经纬度失败')
          }
        });
      })
    },
    // 搜索结果
    onSearchResult(pois) {
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        this.markers = []
        pois.forEach(poi => {
          let {
            lng,
            lat
          } = poi
          lngSum += lng
          latSum += lat
        });
        this.markers.push([pois[0].lng, pois[0].lat])
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        this.mapCenter = [center.lng, center.lat]
        this.getAMapAddress(center.lng, center.lat)
      }
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



  .map-address {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 16px;
  }

  .amap-container {
    border: 1px solid #ddd;
    border-radius: 4px;

    .el-select {
      margin-top: 10px;
      margin-left: 10px;
      width: 200px;
    }
    /deep/ .search-btn{
      display: none!important;
    }
  }

  .amap-demo {
    height: 350px;
  }

  .search-box {
    position: absolute;
    top: 10px;
    left: 640px;
    height: 38px;
  }

  .amap-page-container {
    position: relative;
  }
  .form-item-box{
    display: inline-block;
  }
  .item-btns{
    display: inline-block;
    margin-top: 27px;
    .el-button{
      padding: 8px 10px;
      font-size: 20px;
      font-weight: 600;
    }
  }
</style>
