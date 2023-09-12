<template>
  <div class="edit-money-container">
    <el-form ref="form">
      <el-form-item prop="nickName" :label="$t('User.NickName')">
        <el-input v-model="nickName" />
      </el-form-item>
      <el-form-item
        prop="amountUSDT"
        :label="`${$t('history.AmountMoney')} USDT`"
      >
        <el-input type="number" v-model="amountUSDT" />
      </el-form-item>
      <el-form-item
        prop="amountBTC"
        :label="`${$t('history.AmountMoney')} BTC`"
      >
        <el-input type="number" v-model="amountBTC" />
      </el-form-item>
      <el-form-item
        prop="amountETH"
        :label="`${$t('history.AmountMoney')} ETH`"
      >
        <el-input type="number" v-model="amountETH" />
      </el-form-item>
      <el-form-item
        prop="amountPAYPAL"
        :label="`${$t('history.AmountMoney')} PAYPAL`"
      >
        <el-input type="number" v-model="amountPAYPAL" />
      </el-form-item>
      <el-form-item
        prop="amountVND"
        :label="`${$t('history.AmountMoney')} VNĐ`"
      >
        <el-input type="number" v-model="amountVND" />
      </el-form-item>
      <el-button type="primary" @click.prevent="addMoney">
        {{ $t("Setting.Deduction") }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nickName: "",
      amountUSDT: 0,
      amountBTC: 0,
      amountETH: 0,
      amountPAYPAL: 0,
      amountVND: 0,
    };
  },
  methods: {
    async addMoney() {
      if (!this.nickName) {
        return this.$notify({
          message: "Biệt danh không được rỗng!",
          type: "error",
        });
      }
      let obj = {
        email: this.nickName,
        aUSDT: this.amountUSDT,
        aBTC: this.amountBTC,
        aETH: this.amountETH,
        aPAYPAL: this.amountPAYPAL,
        aVND: this.amountVND,
      };

      this.$http
        .post("/user/addMoney", {
          ...obj,
        })
        .then(() => {
          this.amountUSDT = 0;
          this.amountBTC = 0;
          this.amountETH = 0;
          this.amountPAYPAL = 0;
          this.amountVND = 0;
          this.$notify({
            message: `Trừ tiền cho tài khoản ${this.nickName} thành công.`,
            type: "success",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-money-container {
  max-width: 560px;
  background: #fff;
  padding: 20px;
  margin: 20px auto;
}
</style>