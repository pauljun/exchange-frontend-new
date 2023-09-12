<template>
  <div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('messages')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{ $t("Index.Status") }}
              <div style="color: #999; font-size: 12px; margin-top: 5px">
                {{ $t("Index.today") }}
              </div>
            </div>
            <div style="color: green">
              <br />
              {{ $t("Index.Online") }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t("Index.Subscribers") }}</div>
            <count-to
              :start-val="0"
              :end-val="dataGet.nNDK"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t("Index.Verified") }}</div>
            <count-to
              :start-val="0"
              :end-val="dataGet.nNDXM"
              :duration="3200"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="shopping" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t("Index.Agency") }}</div>
            <count-to
              :start-val="0"
              :end-val="dataGet.nDL"
              :duration="3600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="40" class="panel-group">
      <!-- <el-col :xs="24" :sm="12" :lg="12" class="card-panel-col">
        <div class="card-panel">
          <el-select v-model="isCheckShowDT">
            <el-option
              v-for="v in timeOptions"
              :key="v"
              :value="v"
              :label="$t('Index.' + v)"
            />
          </el-select>
        </div>
      </el-col> -->
      <el-col :xs="24" :sm="12" :lg="12" class="card-panel-col">
        <div class="card-panel">
          <h2>{{ $t("Index.RemainingUserBalance") }}</h2>
          <el-row class="bc-item">
            <el-col :span="12">
              {{ $t("Index.Balance") }} Paypal:
              <div>${{ formatPrice(dataGet.tsTNPAYPAL, 2) }}</div>
            </el-col>
            <el-col :span="12">
              {{ $t("Index.Balance") }} BTC:
              <div>${{ formatPrice(dataGet.tsTNBTC, 6) }}</div>
            </el-col>
            <el-col :span="12">
              {{ $t("Index.Balance") }} ETH:
              <div>${{ formatPrice(dataGet.tsTNETH, 4) }}</div>
            </el-col>
            <el-col :span="12">
              {{ $t("Index.Balance") }} USDT:
              <div>${{ formatPrice(dataGet.tsTNUSD, 2) }}</div>
            </el-col>
            <el-col :span="12">
              {{ $t("Index.Balance") }} VN:
              <div>${{ formatPrice(dataGet.tsTNVN, 0) }}</div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12" class="card-panel-col">
        <div class="card-panel">
          <h2>{{ $t("Setting.ErrorSystem") }} USD</h2>
          <el-row class="bc-item">
            <el-col :span="12">
              {{ $t("Index.TotalAccout") }}:
              <div>${{ formatPrice(dataGet.tsLose, 4) }}</div>
            </el-col>
            <el-col :span="12">
              {{ $t("Index.TotalTradingPlatform") }}:
              <div>${{ formatPrice(dataGet.tsWin, 4) }}</div>
            </el-col>
            <el-col :span="12">
              {{ $t("Index.TotalTransactionCommission") }}:
              <div>${{ formatPrice(dataGet.tsHHong, 4) }}</div>
            </el-col>
            <el-col :span="12">
              {{ $t("Setting.ErrorSystem") }} USD:
              <div>
                ${{
                  formatPrice(
                    dataGet.tsLose - dataGet.tsWin - dataGet.tsHHong,
                    4
                  )
                }}
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  components: {
    CountTo,
  },
  data() {
    return {
      isCheckShowDT: "all",
      timeOptions: ["all", "today", "lastweek", "lastmonth", "threelastmonth"],
      dataGet: {},
    };
  },
  mounted() {
    this.$http.get("/admin/users_analytics").then((res) => {
      if (res.code === 10000) {
        this.dataGet = res.data;
      }
    });
  },
  methods: {
    formatPrice(value, minimum) {
      if (void 0 === value) value = 0;
      var formatter = new Intl.NumberFormat("en-US", {
        //style: 'currency',
        //currency: '',
        minimumFractionDigits: minimum,
      });
      return formatter.format(value);
    },
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  margin: 0;
  font-weight: normal;
  border-left: 4px solid #1890ff;
  padding-left: 10px;
  margin-bottom: 10px;
}
.panel-group {
  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    cursor: pointer;
    font-size: 12px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      padding: 6px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
  .bc-item {
    line-height: 28px;
    font-size: 16px;
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
