<template>
  <div class="nf-upload">
    <ul class="el-upload-list el-upload-list--picture-card" v-viewer v-if="listType === 'picture-card'">
      <li
        class="el-upload-list__item"
        v-for="(img, index) in filePreviewList"
        :key="index">
        <el-image  class="image" :src="img"  fit="fill" style="width: 100%" />
        <span class="item-delete">
          <i class="el-icon-circle-close" @click="handleRemove(index, img)"></i>
        </span>
      </li>
    </ul>
    <el-upload
      :action="url"
      :disabled="disabled"
      :show-file-list="false"
      :on-success="addEventOnSuccess"
      :on-error="addEventOnError"
      :headers="headers"
      :accept="accept"
      :list-type="listType"
      :on-progress="addOnProgress"
      :before-upload="beforeFileUpload"
      :multiple="multiple">
      <i v-if="listType === 'picture-card'" class="el-icon-plus"></i>
      <slot v-else name="content" />
    </el-upload>
    <div class="el-loading-mask is-fullscreen" v-if="percentageVal != 0 && percentageVal != 100 && showProgress">
      <div class="el-loading-spinner">
          <nf-progress :percentage="percentageVal"></nf-progress>
      </div>
    </div>
  </div>
</template>
<script>
let loading;
import { getToken } from '@/utils/auth'
export default {
  name: 'NfUpload',
  props: {
    // 上传地址
    url: {
      type: String,
      default: ''
    },
    // 图片列表
    filePreviewList: {
      type: Array,
      default: () => []
    },
    // disabled
    disabled: {
      type: Boolean,
      default: false
    },
    // 允许上传的文件类型
    accept: {
      type: String,
      default: 'image/png, image/jpg, image/jpeg'
    },
    // 文件列表的类型
    listType: {
      type: String,
      default: 'picture-card'
    },
    // 是否允许上传多个
    multiple: {
      type: Boolean,
      default: true
    },
    // 上传成功回调
    uploadSuccess: {
      type: [Boolean, Function],
      default: false
    },
    fileRemove: {
      type: [Boolean, Function],
      default: false
    },
    // 文件上传成功的提示文字
    successMsg: {
      type: String,
      default: ''
    },
    // 文件上传之前
    beforeUpload: {
      type: [Boolean, Function],
      default: false
    },
    // 是否显示进度条
    showProgress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      headers: {
        'X-TOKEN': getToken()
      },
      percentageVal: 0,
      localUrl: []
    };
  },
  methods: {
    // 文件上传之前钩子
    beforeFileUpload(file) {
      // var within10 = false
      // within10 = file.size / 1024 / 1024 < 10;
      // if (!within10) {
      //   this.$message.error('上传文件大小不能超过 10MB!');
      //   return false;
      // }
      if (this.beforeUpload) {
        return this.beforeUpload(file);
      } else {
        return true;
      }
    },
    // 开始上传 (event, file, fileList)
    addOnProgress(event) {
      this.percentageVal = 0
      if (this.showProgress) {
        const percentageVal = Math.floor(event.percent);
        // 防止上传完接口还没有返回成功值，所以此处给定percentageVal的最大值为99，成功的钩子中再置为100
        this.percentageVal = percentageVal === 100 ? 99 : percentageVal
      } else {
        loading = this.$loading({
          lock: true,
          text: '文件上传中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      }
    },
    // 上传成功
    async addEventOnSuccess(response, file, fileList) {
      if (response.status.code === 0) {
        if (this.uploadSuccess) {
          this.localUrl.push({
            id: response.data.file,
            name: file.url
          })
          this.uploadSuccess(response.data, file, fileList)
        }
      } else {
        this.$message.error(response.message || '上传失败')
      }
      if (this.showProgress) {
        this.percentageVal = 100
        return
      }
      loading.close()
    },
    // 上传失败
    addEventOnError() {
      this.$message.error('上传失败')
      if (this.showProgress) {
        this.percentageVal = 0
        return
      }
      loading.close()
    },
    // 删除图片
    handleRemove(index, img) {
      let id = '';
      if(img.indexOf('blob') !== -1) {
        this.localUrl.forEach(item => {
          if(item.name === img) {
            id = item.id
          }
        })
      }else if(img.indexOf('?') !== -1) {
        let str = img.split('?')[0];
        id = str.substring(img.lastIndexOf('/') + 1, img.length);
      }else {
        id = img.substring(img.lastIndexOf('/') + 1, img.length);
      }
      this.filePreviewList.splice(index, 1)
      if (this.fileRemove) {
        this.fileRemove(Number(id))
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .nf-upload{
    &>div{
      display: inline-block;
    }
    .el-upload-list--picture-card{
      float: left;
    }
  }
  .el-upload-list__item{
    overflow: inherit;
    position: relative;
    &:hover{
      .item-delete{
        display: block;
      }
    }
    .item-delete{
      position: absolute;
      top: -12px;
      right: -12px;
      z-index: 10;
      line-height: 1;
      padding: 5px;
      display: none;
      .el-icon-circle-close{
        font-size: 25px;
        cursor: pointer;
        background-color: #fff;
        border-radius: 50%;
      }
    }
  }
  .el-loading-mask{
    background-color: rgba(0, 0, 0, 0.6);
  }
  .el-loading-spinner{
    width: 800px;
    left: 50%;
    transform: translateX(-50%);
  }

</style>
