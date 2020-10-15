<template>
  <div class="base-info">
    <div class="block">
      <div class="item">
        <span class="name">所属调度单号</span>
        <span class="content" :title="data.number">{{data.number}}</span>
      </div>
      <div class="item">
        <span class="name">承运类型</span>
        <span class="content">{{data.transport_type_display}}</span>
      </div>
      <div class="item">
        <span class="name">承运方</span>
        <span class="content">{{data.transport_unit_display}}</span>
      </div>
    </div>
    <div class="block" v-if="state !=='dispatch_deliver_vehicle'">
      <div class="item">
        <span class="name">出发地</span>
        <span class="content">{{data.from_display}}</span>
      </div>
      <div class="item">
        <span class="name">目的地</span>
        <span class="content">{{data.to_display}}</span>
      </div>
      <div class="item">
        <span class="name">里程(km)</span>
        <span class="content">{{data.mileage}}</span>
      </div>
    </div>
    <div class="block">
      <div class="item">
        <span class="name">驾驶员姓名</span>
        <span class="content">{{data.truck_driver_name}}</span>
      </div>
      <div class="item">
        <span class="name">驾驶员手机号</span>
        <span class="content">{{data.truck_driver_mobile}}</span>
      </div>
      <div class="item">
        <span class="name">车牌号</span>
        <span class="content">{{data.truck_tractor_number}}</span>
      </div>
    </div>
    <div class="block">
      <div class="item">
        <span class="name">行驶类型</span>
        <span class="content">{{data.carry_type_display}}</span>
      </div>
      <div class="item">
        <span class="name">派车时间</span>
        <span class="content" :title="data.truck_assign_time_display">{{data.truck_assign_time_display}}</span>
      </div>
      <div class="item">
        <span class="name" v-if="isShowCount">承运台数</span>
        <span class="content" v-if="isShowCount">{{data.vehicle_count}}</span>
        <span class="name" v-if="!isShowCount"></span>
        <span class="content" v-if="!isShowCount"></span>
      </div>
    </div>
  </div>
</template>

<script>
// 弹框的基础信息展示模块
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    state: {
      type: String,
      default: ''
    },
    isShowCount: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .base-info{
    border-top: $border;
    border-left: $border;
  }
  .block{
    display: flex;
  }
  .item{
    flex: 1;
    display: flex;
    text-align: left;
    .name{
      flex: .9;
      font-weight: 600;
      padding: 8px 4px;
      background-color: rgb(242, 242, 242);
      border-right: $border;
      border-bottom: $border;
    }
    .content{
      flex: 1.1;
      padding: 8px 5px;
      @include ellipsis;
      border-right: $border;
      border-bottom: $border;
    }
  }
</style>
