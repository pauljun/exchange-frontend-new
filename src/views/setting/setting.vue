<template>
  <div id="list-tool-setting" class="data-list-container">
    <el-form label-width="160px" label-position="left">
      <el-row :gutter="50">
        <el-col :span="6">
          <h4>[{{ $t("Setting.SetMinWithdraw") }}]:</h4>
          <el-form-item :label="`${$t('Setting.MinDeposit')} USDT`">
            <el-input type="number" v-model="settingJson.min_d_usdt" />
          </el-form-item>
          <el-form-item :label="`${$t('Setting.MinWithdraw')} USDT`">
            <el-input type="number" v-model="settingJson.min_w_usdt" />
          </el-form-item>
          <el-form-item :label="`${$t('Setting.InternalWithdrawalFee')}`">
            <el-input type="number" v-model="settingJson.fee_w_usdt_nb" />
          </el-form-item>
          <el-form-item :label="`${$t('Setting.BscWithdrawalFee')}`">
            <el-input type="number" v-model="settingJson.fee_w_usdt_BEP20" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <h4>[{{ $t("Setting.SetUpWallet") }}]:</h4>
          <el-form-item :label="$t('Setting.DefaultWalletUses')">
            <el-radio v-model="settingJson.default_wallet_sys" label="usdt">
              {{ $t("Setting.Wallet") }} USDT
            </el-radio>
            <el-radio v-model="settingJson.default_wallet_sys" label="vnd">
              {{ $t("Setting.Wallet") }} VNĐ
            </el-radio>
          </el-form-item>
          <p style="line-height: 1.5; margin: -20px 0 10px">
            {{ $t("Setting.DefaultWalletUsesP") }}
          </p>
          <el-form-item :label="$t('Setting.ShowPaymentWallet')">
            <el-checkbox
              v-model="settingJson.show_wallet_usdt"
              @change="changeWallet('usdt', $event)"
            >
              {{ $t("Setting.Wallet") }} USDT
            </el-checkbox>
            <div class="absolute" style="top: 5px; right: 0">
              <IconCrypto
                style="width: 20px"
                coinname="USDT"
                color="color"
                format="svg"
              />
            </div>
            <div style="position: relative">
              <el-checkbox
                v-model="settingJson.show_wallet_vnd"
                @change="changeWallet('vnd', $event)"
              >
                {{ $t("Setting.Wallet") }} VNĐ
              </el-checkbox>
              <div class="absolute" style="top: 5px; right: 0">
                <img
                  width="20"
                  :src="require('@/assets/images/sky/vnd-mini.svg')"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item label-width="0" v-if="settingJson.show_wallet_vnd">
            <div>
              <el-input
                type="textarea"
                rows="5"
                label-placeholder="Thông tin ngân hàng"
                v-model="settingJson.bankInfo"
              />
            </div>
            <p>{{ $t("Setting.NoteWalletDW") }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <h4>
            [{{ $t("Setting.SetQuoteUsdCoins") }}]:
            <i>( {{ $t("Setting.DefaultAutoUpdate") }} )</i>
          </h4>
          <el-form-item :label="$t('Setting.AutoUpdateSeconds')">
            <el-input type="number" v-model="settingJson.timeLoopUpdateQuote" />
          </el-form-item>
          <p style="line-height: 1.5; margin: -20px 0 10px">
            {{ $t("Setting.NoteTimeSeconds") }}
          </p>
          <el-form-item label-width="0">
            <el-switch
              v-model="checkOnOffAutoQuote"
              :active-text="$t('Setting.TurnOn')"
              :inactive-text="$t('Setting.TurnOff')"
              active-value="on"
              inactive-value="off"
              @change="checkOnOffAutoQuote = !checkOnOffAutoQuote"
            >
            </el-switch>
            <p>{{ $t("Setting.NoteEnableDisable") }}</p>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-button type="primary" @click="clickSubmitSetting">
      {{ $t("Setting.Update") }}
    </el-button>
  </div>
</template>

<script>
import config from "@/config";

export default {
  components: {},
  data() {
    return {
      cnSv: 0,
      checkOnOffAutoQuote: true,
      radioBC: "payeer",
      settingJson: {
        min_d_paypal: 5,
        min_d_btc: 0.001,
        min_d_eth: 0.02,
        min_d_usdt: 5,

        min_w_paypal: 5,
        min_w_btc: 0.001,
        min_w_eth: 0.02,
        min_w_usdt: 5,

        fee_w_paypal_nb: 0, // phí rút về tài khoản trong hệ thống
        fee_w_paypal_acc: 2, // phí rút về tài khoản trong paypal

        fee_w_btc_nb: 0, // phí rút về tài khoản BTC trong hệ thống
        fee_w_btc_acc: 0.0003, // phí rút về tài khoản BTC sàn

        fee_w_eth_nb: 0, // phí rút về tài khoản ETH sàn
        fee_w_eth_ERC20: 0.001, // phí rút về tài khoản ETH sàn

        fee_w_usdt_nb: 0, // phí rút về tài khoản USDT trong hệ thống
        fee_w_usdt_BEP20: 1, // phí rút về tài khoản USDT trong hệ thống
        fee_w_usdt_ERC20: 2, // phí rút về tài khoản USDT sàn

        default_wallet_sys: "usdt",
        default_netw_pay: "tn",

        show_wallet_paypal: true,
        show_wallet_btc: false,
        show_wallet_eth: false,
        show_wallet_usdt: false,
        show_wallet_vnd: false,

        timeLoopUpdateQuote: 30, // thời gian mỗi giây cập nhập giá USD sấp sĩ coin
        quote_USD_USDT: 1,
        quote_USD_BTC: 1,
        quote_USD_ETH: 1,
        quote_USD_PAYPAL: 1,
        quote_USD_VND: 1,

        ADDRESS_ETH_USDT: "",
        PRIVATE_KEY_ADDRESS_ETH_USDT: "",
        ADDRESS_ETH_TRANSACTION: "",
        PRIVATE_KEY_ETH_TRANSACTION: "",

        maintenance: false, // bảo trì
        is_active_champion: false, //Bật tắt giải đấu
        is_active_lucky_draw: false, // bặt tắt rút thăm

        support: {
          telegram: "",
          zalo: "",
          mail: "",
        },
      },
      active2fa: false,
      code_2fa: "",
    };
  },
  computed: {
    activeNTB() {
      if (this.settingJson.teleChatIDBet == "") {
        return false;
      } else {
        return true;
      }
    },
    activeNTF() {
      if (
        this.settingJson.teleChatID == "" ||
        this.settingJson.teleToken == ""
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    toggle2fa() {
      this.active2fa = !this.active2fa;
    },

    formatPrice(value, minimum) {
      var formatter = new Intl.NumberFormat("en-US", {
        //style: 'currency',
        //currency: '',
        minimumFractionDigits: minimum,
      });
      return formatter.format(value);
    },

    changeActiveBaoTri(event) {
      let o = event.target.checked;
      this.settingJson.maintenance = o;
    },

    changeWallet(val, checked) {
      switch (val) {
        case "usdt":
          this.settingJson.show_wallet_usdt = checked;
          break;
        case "btc":
          this.settingJson.show_wallet_btc = checked;
          break;
        case "eth":
          this.settingJson.show_wallet_eth = checked;
          break;
        case "paypal":
          this.settingJson.show_wallet_paypal = checked;
          break;
        case "vnd":
          this.settingJson.show_wallet_vnd = checked;
          break;
      }
    },

    async clickSubmitSetting() {
      const check = await this.$store.dispatch("check2fa");
      if (!check) {
        return;
      }
      let obj = {
        qUSDT: this.settingJson.quote_USD_USDT,
        qETH: this.settingJson.quote_USD_ETH,
        qBTC: this.settingJson.quote_USD_BTC,
        qPaypal: this.settingJson.quote_USD_PAYPAL,
        qVND: this.settingJson.quote_USD_VND,

        tCUseSys: this.settingJson.default_wallet_sys.toLowerCase(),

        mDBTC: this.settingJson.min_d_btc,
        mDETH: this.settingJson.min_d_eth,
        mDUSDT: this.settingJson.min_d_usdt,
        mDPaypal: this.settingJson.min_d_paypal,

        mWBTC: this.settingJson.min_w_btc,
        mWETH: this.settingJson.min_w_eth,
        mWUSDT: this.settingJson.min_w_usdt,
        mWPaypal: this.settingJson.min_w_paypal,

        iAWPaypal: this.settingJson.show_wallet_paypal,
        iAWETH: this.settingJson.show_wallet_eth,
        iAWUSDT: this.settingJson.show_wallet_usdt,
        iAWBTC: this.settingJson.show_wallet_btc,
        iAWVND: this.settingJson.show_wallet_vnd,
        bankInfo: this.settingJson.bankInfo,

        fDPaypalNB: this.settingJson.fee_w_paypal_nb,
        fDPaypalAcc: this.settingJson.fee_w_paypal_acc,
        fDBTCNB: this.settingJson.fee_w_btc_nb,
        fDBTCAcc: this.settingJson.fee_w_btc_acc,
        fDETHNB: this.settingJson.fee_w_eth_nb,
        fDETHERC20: this.settingJson.fee_w_eth_ERC20,
        fDUSDTNB: this.settingJson.fee_w_usdt_nb,
        fDUSDTBEP20: this.settingJson.fee_w_usdt_BEP20,
        fDUSDTERC20: this.settingJson.fee_w_eth_ERC20,

        ADDRESS_ETH_USDT: this.settingJson.ADDRESS_ETH_USDT,
        PRIVATE_KEY_ADDRESS_ETH_USDT:
          this.settingJson.PRIVATE_KEY_ADDRESS_ETH_USDT,
        ADDRESS_ETH_TRANSACTION: this.settingJson.ADDRESS_ETH_TRANSACTION,
        PRIVATE_KEY_ETH_TRANSACTION:
          this.settingJson.PRIVATE_KEY_ETH_TRANSACTION,
        IS_TEST_SMART_CHAIN:
          this.settingJson.default_netw_pay == "tn" ? true : false,

        timeLoopQuote: this.settingJson.timeLoopUpdateQuote,
        autoQuote: this.settingJson.checkOnOffAutoQuote,

        maintenance: this.settingJson.maintenance,

        isActiveluckyDraw: this.settingJson.is_active_lucky_draw,
        isActiveChampion: this.settingJson.is_active_champion,

        support: this.settingJson.support,
      };

      this.sendMessage({ type: "setDataSys", data: obj });
    },

    sendMessage(message) {
      this.connection.send(JSON.stringify(message));
      return this.$vs.notify({
        text: "Đã cập nhật hệ thống",
        color: "success",
        position: "top-right",
        iconPack: "feather",
        icon: "icon-message-square",
      });
    },

    connectSever() {
      var _this = this;
      this.connection = new WebSocket(config.BASE_URL_SOCKET_SYS);
      this.connection.onopen = function () {
        console.log(
          "Successfully connected to the echo websocket server systems..."
        );
      };

      this.connection.onclose = function () {
        if (_this.cnSv == 0) {
          _this.$vs.notify({
            text: "Không kết nối được tới máy chủ. Sẽ kết nối lại sau 5 giây",
            color: "danger",
            position: "top-right",
            iconPack: "feather",
            icon: "icon-message-square",
          });
        } else {
          _this.$vs.notify({
            text: "Đang kết nối lại lần " + _this.cnSv,
            color: "danger",
            position: "top-right",
            iconPack: "feather",
            icon: "icon-message-square",
          });
        }

        if (_this.cnSv == 6) {
          _this.$vs.notify({
            text: "Kết nối thất bại. Vui lòng kiểm tra và bật lại máy chủ",
            color: "danger",
            position: "top-right",
            iconPack: "feather",
            icon: "icon-message-square",
          });
        }
        if (_this.cnSv <= 5) {
          setTimeout(() => {
            _this.connectSever();
            _this.cnSv++;
          }, 5000);
        }
      };

      this.connection.onmessage = function (event) {
        let data = JSON.parse(event.data);
        let dl = data.data;

        if (data.type === "getDataSys") {
          _this.settingJson.min_d_paypal = dl.minDepositPaypal;
          _this.settingJson.min_d_btc = dl.minDepositBTC;
          _this.settingJson.min_d_eth = dl.minDepositETH;
          _this.settingJson.min_d_usdt = dl.minDepositUSDT;

          _this.settingJson.min_w_paypal = dl.minWithdrawalPaypal;
          _this.settingJson.min_w_btc = dl.minWithdrawalBTC;
          _this.settingJson.min_w_eth = dl.minWithdrawalETH;
          _this.settingJson.min_w_usdt = dl.minWithdrawalUSDT;

          _this.settingJson.fee_w_paypal_nb = dl.feeRutPaypalNoiBo; // phí rút về tài khoản trong hệ thống
          _this.settingJson.fee_w_paypal_acc = dl.feeRutPaypalAcc; // phí rút về tài khoản trong paypal

          _this.settingJson.fee_w_btc_nb = dl.feeRutBTCNoiBo; // phí rút về tài khoản BTC trong hệ thống
          _this.settingJson.fee_w_btc_acc = dl.feeRutBTCAcc; // phí rút về tài khoản BTC sàn

          _this.settingJson.fee_w_eth_nb = dl.feeRutETHNoiBo; // phí rút về tài khoản ETH sàn
          _this.settingJson.fee_w_eth_ERC20 = dl.feeRutETHERC20; // phí rút về tài khoản ETH sàn

          _this.settingJson.fee_w_usdt_nb = dl.feeRutUSDTNoiBo; // phí rút về tài khoản USDT trong hệ thống
          _this.settingJson.fee_w_usdt_BEP20 = dl.feeRutUSDTBEP20; // phí rút về tài khoản USDT trong hệ thống
          _this.settingJson.fee_w_eth_ERC20 = dl.feeRutUSDTERC20; // phí rút về tài khoản USDT sàn

          _this.settingJson.default_wallet_sys =
            dl.typeCurrUseSys.toLowerCase();

          _this.settingJson.show_wallet_paypal = dl.isActiveWalletPaypal;
          _this.settingJson.show_wallet_vnd = dl.isActiveWalletVND;
          _this.settingJson.bankInfo = dl.bankInfo;
          _this.settingJson.show_wallet_btc = dl.isActiveWalletBTC;
          _this.settingJson.show_wallet_eth = dl.isActiveWalletETH;
          _this.settingJson.show_wallet_usdt = dl.isActiveWalletUSDT;

          _this.settingJson.timeLoopUpdateQuote = dl.timeLoop;
          _this.checkOnOffAutoQuote = dl.autoQuoteSet;

          _this.settingJson.quote_USD_BTC = dl.quotePriceBTC;
          _this.settingJson.quote_USD_ETH = dl.quotePriceETH;
          _this.settingJson.quote_USD_USDT = dl.quotePriceUSDT;
          _this.settingJson.quote_USD_PAYPAL = dl.quotePricePAYPAL;
          _this.settingJson.quote_USD_VND = dl.quotePriceVND;

          _this.settingJson.ADDRESS_ETH_USDT = dl.ADDRESS_ETH_USDT;
          _this.settingJson.PRIVATE_KEY_ADDRESS_ETH_USDT =
            dl.PRIVATE_KEY_ADDRESS_ETH_USDT;
          _this.settingJson.ADDRESS_ETH_TRANSACTION =
            dl.ADDRESS_ETH_TRANSACTION;
          _this.settingJson.PRIVATE_KEY_ETH_TRANSACTION =
            dl.PRIVATE_KEY_ETH_TRANSACTION;
          _this.settingJson.default_netw_pay =
            dl.IS_TEST_SMART_CHAIN == true ? "tn" : "ct";

          _this.settingJson.maintenance = dl.maintenance;

          _this.settingJson.is_active_champion = dl.isActiveChampion;
          _this.settingJson.is_active_lucky_draw = dl.isActiveluckyDraw;

          _this.settingJson.support =
            void 0 !== dl.support ? dl.support : _this.settingJson.support;
        }
      };
    },
  },
  created() {},
  mounted() {
    this.isMounted = true;
    this.connectSever();
  },
};
</script>

<style lang="scss">
.data-list-container {
  padding: 1rem;
  h4 {
    font-size: 16px;
    margin-bottom: 10px;
  }
}
</style>

<style lang="scss" scoped>
.google-authen-2fa-scroll {
  max-height: calc(100vh - 100px);
  overflow: hidden;
}
</style>