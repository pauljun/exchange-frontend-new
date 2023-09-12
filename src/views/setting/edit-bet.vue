<template>
  <div class="edit-bet-wrapper">
    <el-row :gutter="30">
      <el-col :span="12">
        <p>
          {{ $t("Bet.p15") }}:
          <span class="mr-4" style="color: #d65b00; font-weight: bold">
            {{ countDown }}s
          </span>
          {{ $t("Bet.p14") }}:
          <el-link :type="typeOder == 'Mở' ? 'success' : 'danger'">
            {{ typeOder }}
          </el-link>
        </p>
        <p>
          {{ $t("common.TotalBet") }} {{ $t("Bet.p13") }}:
          <el-link type="danger"> $ {{ price_buy }} </el-link>
          {{ $t("common.TotalBet") }} {{ $t("Bet.p12") }}:
          <el-link type="danger"> $ {{ price_sell }} </el-link>
        </p>
        <p>
          {{ $t("Bet.p11") }}:
          <el-link type="danger"> $ {{ price_total_mkt }} </el-link> <br />
          {{ $t("Bet.p10") }}
          <el-link type="danger"> $ {{ price_total }} </el-link>
        </p>
        <el-button @click="reloadAmTien" type="danger">
          {{ $t("Bet.p9") }}
        </el-button>
        <br />
        <b>
          {{ $t("Bet.p1") }}
        </b>
        <div>
          <b>
            {{
              $t("Bet.p2", {
                value: AMOUNTBECAU_MIN,
              })
            }}
          </b>
          <div>
            <el-input type="number" v-model="AMOUNTBECAU_MIN" />
          </div>
          <div>
            <el-button @click="sbAmountBeCauMin" type="success">
              {{ $t("Setting.Agree") }}
            </el-button>
          </div>
          <b>
            {{
              $t("Bet.p3", {
                value: AMOUNTBECAU_MAX,
              })
            }}
          </b>
          <div>
            <el-input type="number" color="success" v-model="AMOUNTBECAU_MAX" />
          </div>
          <div>
            <el-button @click="sbAmountBeCauMax" type="success">
              {{ $t("Setting.Agree") }}
            </el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <p>{{ $t("Bet.p8") }}:</p>
        <p>
          <span>( {{ $t("Bet.p4") }} )</span>
          <b> {{ $t("Bet.p5") }}: </b>
          {{ $t("Bet.p6") }}
        </p>
        <p>
          <span> {{ $t("Bet.p7") }} </span>
        </p>
        <ul>
          <li>
            <el-radio v-model="radioBC" label="buy" @change="changeMode('buy')">
              {{ $t("history.Purchase") }}
            </el-radio>
            <el-radio
              v-model="radioBC"
              label="sell"
              @change="changeMode('sell')"
            >
              {{ $t("history.Sale") }}
            </el-radio>
            <el-radio v-model="radioBC" label="off" @change="changeMode('off')">
              {{ $t("Setting.TurnOff") }}
            </el-radio>
            <br />
            <span>
              <b> {{ $t("Bet.p5") }}: </b>
              {{ $t("Bet.p18") }} <br />
              {{ $t("Bet.p19") }}
            </span>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <el-col :span="12">
        <p>{{ $t("history.Marketing") }}</p>
        <p>
          {{ $t("Bet.p20") }}: <span>$ {{ price_buy_mkt }} </span><br />
          {{ $t("Bet.p21") }}:
          <el-link type="danger">$ {{ price_sell_mkt }}</el-link>
        </p>
        <table class="tbv">
          <tr>
            <th>{{ $t("User.Email") }}</th>
            <th>{{ $t("history.type") }}</th>
            <th>{{ $t("history.Purchase") }}/{{ $t("history.Sale") }}</th>
            <th>{{ $t("history.TzAccount") }}</th>
          </tr>
          <tr :data="tr" :key="indextr" v-for="(tr, indextr) in productsFake">
            <template v-if="tr.mkt == 1">
              <td>{{ tr.e }}</td>
              <td>
                <p>{{ tr.sv }}</p>
              </td>
              <td>
                <p v-if="tr.bet == 'buy'">
                  <el-link type="success">{{ $t("history.Purchase") }}</el-link>
                </p>
                <p v-else>
                  <el-link type="danger">{{ $t("history.Sale") }}</el-link>
                </p>
              </td>
              <td>
                <p class="bet-amount">
                  <font class="ml-2" color="#006c27">
                    {{ formatPrice(tr.amount, 2) }}
                  </font>
                </p>
              </td>
            </template>
          </tr>
        </table>
      </el-col>
      <el-col :span="12">
        <p>{{ $t("Bet.p22") }}</p>
        <p>
          {{ $t("Bet.p23") }}: <span>$ {{ price_play_buy }}</span>
          <br />
          {{ $t("Bet.p24") }}:
          <el-link type="danger">$ {{ price_play_sell }}</el-link>
        </p>
        <table class="tbv">
          <tr>
            <th>{{ $t("User.Email") }}</th>
            <th>{{ $t("history.type") }}</th>
            <th>{{ $t("history.Purchase") }}/{{ $t("history.Sale") }}</th>
            <th>{{ $t("history.TzAccount") }}</th>
          </tr>
          <tr :data="tr" :key="indextr" v-for="(tr, indextr) in productsFake">
            <template v-if="tr.mkt == 0">
              <td>{{ tr.e }}</td>
              <td>
                <p class="bet-type">{{ tr.sv }}</p>
              </td>
              <td>
                <p class="bet-buy_sell" v-if="tr.bet == 'buy'">
                  <el-link type="success">{{ $t("history.Purchase") }}</el-link>
                </p>
                <p class="bet-buy_sell" v-else>
                  <el-link type="danger">{{ $t("history.Sale") }}</el-link>
                </p>
              </td>
              <td>
                <p class="bet-amount">
                  <span style="color: #006c27">
                    {{ formatPrice(tr.amount, 2) }}
                  </span>
                </p>
              </td>
            </template>
          </tr>
        </table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import config from "@/config";

export default {
  components: {},
  data() {
    return {
      AMOUNTBECAU_MIN: -30,
      AMOUNTBECAU_MAX: 400,
      PriceBOT: 0,
      checkOnOffBOT: true,
      checkOnOffAnGian: false,
      checkOnOffBOTGoTien: false,
      radioBC: "",
      productsFake: [],
      itemsPerPage: 10,
      isMounted: false,

      countDown: 0,
      typeOder: "Mở",

      price_buy: 0,
      price_sell: 0,
      price_buy_mkt: 0,
      price_sell_mkt: 0,
      price_total_mkt: 0,
      price_total: 0,

      price_play_buy: 0,
      price_play_sell: 0,

      // active2fa: true,
      active2fa: false,
      code_2fa: "",
    };
  },
  computed: {
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx;
      }
      return 0;
    },
    products() {
      return this.productsFake;
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.productsFake.length;
    },
  },
  watch: {},
  methods: {
    sbAmountBeCauMin() {
      this.sendMessage({
        type: "editGL",
        data: {
          type: "WRITE_AMOUNT_NEGA_AMOUNT_BREAK_BRIDGE",
          AMOUNT: this.AMOUNTBECAU_MIN,
        },
      });
      return this.$notify({
        message: this.$t("Success.e1") + this.AMOUNTBECAU_MIN,
        type: "success",
      });
    },

    sbAmountBeCauMax() {
      this.sendMessage({
        type: "editGL",
        data: {
          type: "WRITE_AMOUNT_MAX_BREAK_BRIDGE",
          AMOUNT: this.AMOUNTBECAU_MAX,
        },
      });
      return this.$notify({
        message: this.$t("Success.e1") + this.AMOUNTBECAU_MAX,
        type: "success",
      });
    },

    changeBOTOnOff() {
      this.sendMessage({ type: "editGL", data: { type: "BOT" } });

      return this.$notify({
        message:
          this.$t("Success.e2") +
          this.$t(this.checkOnOffBOT ? "Setting.TurnOff" : "Setting.TurnOn"),
        type: "success",
      });
    },

    changeBetOnOff() {
      this.radioBC = "off";

      this.checkOnOffBOTGoTien = false;

      if (this.checkOnOffAnGian) {
        this.sendMessage({ type: "editGL", data: { type: "BTC_OFF" } });

        return this.$notify({
          message: this.$t("Success.e1") + this.$t("Setting.TurnOff"),
          type: "success",
        });
      } else {
        this.sendMessage({ type: "editGL", data: { type: "BTC_LESS" } });

        return this.$notify({
          message: this.$t("Success.e1") + this.$t("User.On"),
          type: "success",
        });
      }
    },

    reloadAmTien() {
      this.sendMessage({ type: "editGL", data: { type: "GO_TIEN_OFF" } });
    },

    changeMode(val) {
      this.checkOnOffAnGian = false;

      if (val == "buy") {
        this.sendMessage({ type: "editGL", data: { type: "BTC_BUY" } });
        val = this.$t("history.Purchase");
      }
      if (val == "sell") {
        this.sendMessage({ type: "editGL", data: { type: "BTC_SELL" } });
        val = this.$t("history.Sale");
      }
      if (val == "off") {
        this.sendMessage({ type: "editGL", data: { type: "BTC_OFF" } });
        val = this.$t("Setting.TurnOff");
      }

      return this.$notify({
        message: this.$t("Success.e1") + val,
        type: "success",
      });
    },

    formatPrice(value, minimum) {
      var formatter = new Intl.NumberFormat("en-US", {
        //style: 'currency',
        //currency: '',
        minimumFractionDigits: minimum,
      });
      return formatter.format(value);
    },

    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },

    sendMessage(message) {
      this.connection.send(JSON.stringify(message));
    },

    changeRadioGetSV(dl) {
      this.radioBC = "";

      if (dl.BTC.BUY) {
        this.radioBC = "buy";
      } else if (dl.BTC.SELL) {
        this.radioBC = "sell";
      } else if (!dl.BTC.BUY && !dl.BTC.SELL) {
        this.radioBC = "off";
      }

      if (dl.LESS_WIN) {
        this.checkOnOffAnGian = true;
      } else {
        this.checkOnOffAnGian = false;
      }

      if (dl.PRICE_FUND_ON_OFF) {
        this.checkOnOffBOTGoTien = true;
      } else {
        this.checkOnOffBOTGoTien = false;
      }

      if (dl.BOT) {
        this.checkOnOffBOT = true;
      } else {
        this.checkOnOffBOT = false;
      }
    },

    changeBOTGoTienOnOff() {
      this.checkOnOffAnGian = false;
      this.radioBC = "off";

      this.sendMessage({ type: "editGL", data: { type: "BOT_GO_TIEN" } });

      return this.$notify({
        message:
          this.$t("Success.e3") +
          this.$t(
            this.checkOnOffBOTGoTien ? "Setting.TurnOff" : "Setting.TurnOn"
          ),
        type: "success",
      });
    },

    sendInfoAdmin() {
      this.sendMessage({
        type: "accountDetail",
        data: { uid: "ADMIN_BO", email: "ad999999@gmail.com" },
      });
    },
  },
  created() {
    var _this = this;
    this.connection = new WebSocket(config.BASE_URL_SOCKET);

    this.connection.onopen = function () {
      _this.sendInfoAdmin();
      console.log("Successfully connected to the echo websocket server...");
    };

    this.connection.onmessage = function (event) {
      let data = JSON.parse(event.data);
      let dl = data.data;

      if (data.type === "allData") {
        _this.countDown = dl.candleClose;
        _this.typeOder = dl.type == "order" ? "Mở" : "Đóng";

        // reset lại số tiền = 0 khi thời gian = 0;
        if (dl.candleClose == 0) {
          _this.price_buy = 0;
          _this.price_sell = 0;
        }
      }

      if (data.type === "getTruck") {
        _this.changeRadioGetSV(dl);
        _this.AMOUNTBECAU_MIN = data.min_am_go;
        _this.AMOUNTBECAU_MAX = data.max_amount_be;
      }

      if (data.type === "truck") {
        _this.productsFake = dl;
        _this.price_buy = _this.formatPrice(data.price_buy, 2);
        _this.price_sell = _this.formatPrice(data.price_sell, 2);
        _this.price_buy_mkt = _this.formatPrice(data.mktBUY, 2);
        _this.price_sell_mkt = _this.formatPrice(data.mktSELL, 2);
        _this.price_total_mkt = _this.formatPrice(
          data.mktBUY + data.mktSELL,
          2
        );

        let tt =
          data.price_buy + data.price_sell - (data.mktBUY + data.mktSELL);

        _this.price_play_buy = _this.formatPrice(
          data.price_buy - data.mktBUY,
          2
        );
        _this.price_play_sell = _this.formatPrice(
          data.price_sell - data.mktSELL,
          2
        );
        _this.price_total = _this.formatPrice(tt, 2);
      }
    };
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>

<style lang="scss">
.edit-bet-wrapper {
  padding: 10px;
  background: #fff;
  line-height: 2;
  margin: 0 10px;
  .el-input {
    margin: 10px 0;
  }
  p {
    margin: 10px 0;
  }
  ul li {
    list-style: none;
  }
}
</style>
<style scoped>
.tbv {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  color: #000;
}

.tbv tr {
  background-color: #ffa11f;
}

.tbv td,
.tbv th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

.tbv tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
