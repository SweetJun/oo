<template>
  <div>
    <div class="commands">
      <div class="no-expense" v-if="commands.length === 0">
        <p>请选择调度单</p>
      </div>
      <div v-else>
        <div class="command-item" v-for="(command, index) in commands" :key="index">
          <div class="content">
            <h4>{{command.from_display}} — {{command.to_display}}</h4>
            <span class="mileage">{{command.carry_type_display}} - {{command.mileage}}km</span>
          </div>
        </div>
        <div class="command-item">
          <div class="total-price">
            总运费:
            <el-input placeholder="请输入金额" type="number" v-model="totalPrice" @change="totalPriceChange">
              <template slot="append">元</template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @Description: 算总价模式
 * @Author: wjw
 * @Date: 2020-05-08 14:14:00
 */
export default {
  props: {
    storeModelName: {
      type: String,
      default: ''
    },
    commands: {
      type: Array,
      default: () => []
    },
    totalPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  methods: {
    totalPriceChange() {
      this.$emit('updateTotalPriceMoney', this.totalPrice)
    }
  }
};
</script>

<style lang="scss" scoped>
  .commands{
    margin-bottom: 20px;
  }
  .no-expense{
    text-align: center;
    font-size: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    background-color: #fff;
    padding: 20px 0;
  }
  .command-item{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    background-color: #fff;
    border-radius: 4px;
    padding: 20px;
    position: relative;
    display: flex;
    &+.command-item{
      margin-top: 20px;
    }
  }
  .content{
    display: flex;
    justify-content: space-between;
    h4{
      margin: 0;
      margin-right: 40px;
      font-size: 16px;
      height: 22px;
      line-height: 22px;
    }
    .mileage{
      background-color: rgb(255, 153, 0);
      border-radius: 5px;
      padding: 4px 5px;
      font-size: 13px;
      color: #fff;
    }

  }
  .total-price{
    vertical-align: middle;
    .el-input{
      margin-left: 20px;
      width: 200px;
    }
  }
</style>
