<template>
  <div>
    <nf-form-wrap title="地区管理" :on-save-btn-click="onSaveBtnClick" class="region-form">
      <el-form :model="formData" ref="ruleForm" :rules="formRules" label-position="top">
        <div class="item-inline">
          <p class="item-block"><span>*</span> 所属地区：</p>
          <el-form-item prop="province">
            <nf-select
              placeholder="请选择省"
              :disabled="isEditing"
              :options="provinceList"
              :value.sync="formData.province"
              @change="selectProvince">
            </nf-select>
          </el-form-item>
          <el-form-item prop="city">
            <nf-select
              placeholder="请选择市"
              :disabled="isEditing"
              :options="cityList"
              :value.sync="formData.city"
              @change="selectCity">
            </nf-select>
          </el-form-item>
          <el-form-item prop="area">
            <nf-select
              placeholder="请选择区/县"
              :disabled="isEditing"
              :options="areaList"
              :value.sync="formData.area">
            </nf-select>
          </el-form-item>
        </div>
        <el-form-item class="custom-width" label="地区名称：" prop="name">
          <el-input :disabled="isEditing" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="选择所在地理位置：" prop="address">
          <h4 class="map-address">位置：{{ formData.address }}</h4>
        </el-form-item>
      </el-form>
      <div class="amap-container">
        <el-amap-search-box
          class="search-box"
          :search-option="searchOption"
          :on-search-result="onSearchResult">
        </el-amap-search-box>
        <el-amap
          vid="amap"
          class="amap-demo"
          :center="mapCenter"
          :events="events"
          :zoom="10" >
          <el-amap-marker
            v-for="(marker, index) in markers"
            :key="index"
            :position="marker">
          </el-amap-marker>
        </el-amap>
      </div>
    </nf-form-wrap>
  </div>
</template>

<script>
export default {
  data() {
    let self = this
    return {
      isEditing: false,
      edit_id: '',
      formData: {
        province: '',
        city: '',
        area: '',
        name: '',
        address: '',
        parent_id: 0,
        latitude: '',
        longitude: ''
      },
      formRules: {
        province: [{ required: true, message: '省份不能缺失', trigger: 'change' }],
        name: [{ required: true, message: '请输入地区名称', trigger: 'blur' }],
        address: [{ required: true, message: '请选择具体地理位置', trigger: 'blur' }]
      },
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
          self.formData.latitude = lat
          self.formData.longitude = lng
        }
      },
      provinceList: [],
      cityList: [],
      areaList: []
    }
  },
  methods: {
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
      this.areaList = await $get(apiUrl, {condition: params})
    },
    // 选择省
    selectProvince() {
      this.getCity(this.formData.province)
      this.formData.city = ''
      this.formData.area = ''
    },
    // 选择市
    selectCity() {
      this.getCounty(this.formData.city)
      this.formData.area = ''
    },
    // 这里通过高德 SDK 获取地址信息
    getAMapAddress(lng, lat) {
      AMap.plugin('AMap.Geocoder', () => {
        let geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: 'all'
        });
        geocoder.getAddress([lng ,lat], (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            if (result && result.regeocode) {
              this.formData.address = result.regeocode.formattedAddress
              this.$nextTick()
              this.mapCenter = [lng, lat]
              this.markers = [[lng, lat]]
            }
          } else {
            this.$message.error('获取地图位置失败')
          }
        });
      })
    },
    // 编辑时获取详情信息
    getRegionDetail(id) {
      $get(`${api.region}/${id}`).then(res => {
        let longitude = Number(res.longitude)
        let latitude = Number(res.latitude)
        let levelData = res.levelData
        this.formData = {
          province: levelData.province.id,
          city: levelData.city.id,
          area: levelData.county.id,
          name: res.name,
          address: '',
          parent_id: res.parent_id,
          latitude: latitude,
          longitude: longitude
        }
        this.getAMapAddress(longitude, latitude)

        this.getCity(levelData.province.id, {key: levelData.province.id, value: levelData.province.name})
        this.getCounty(levelData.city.id, {key: levelData.city.id, value: levelData.city.name})
      })
    },
    // 搜索结果
    onSearchResult(pois) {
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        this.markers = []
        pois.forEach(poi => {
          let {lng, lat} = poi
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
        this.formData.latitude = center.lat
        this.formData.longitude = center.lng
      }
    },
    // 保存提交
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true)
          // 这里判断是避免当删除市区时，parent_id为空
          if (this.formData.area) {
            this.formData.parent_id = this.formData.area
          } else if (this.formData.city) {
            this.formData.parent_id = this.formData.city
          } else {
            this.formData.parent_id = this.formData.province
          }
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.region}/${this.edit_id}`
            $put(apiUrl, this.formData).then(() =>{
              loading(false)
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.region, this.formData).then(() =>{
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
    this.getProvince()
    this.edit_id = this.$route.query.id
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      // 获取详情
      this.getRegionDetail(this.edit_id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .custom-width{
    width: 442px;
  }
  .item-block{
    color: #606266;
    span{
      color: #f56c6c;
    }
  }
  .item-inline{
    .el-form-item{
      display: inline-block;
      width: 140px;
      &+.el-form-item{
        margin-left: 10px;
      }
    }
  }
  .map-address{
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 16px;
  }
  .region-form /deep/{
    .el-card__body{
      display: flex;
    }
    .el-form{
      width: 500px;
    }
    .amap-container{
      flex: 1;
    }
  }
  .amap-container{
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
  }
  .amap-demo {
    height: 350px;
  }
  .search-box {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .amap-page-container {
    position: relative;
  }
</style>
