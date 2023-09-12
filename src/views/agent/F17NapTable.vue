<template>
  <div id="list-history-deposit" class="data-list-container">
    <div class="flex-between-center">
      <div style="margin-top: 20px">
        {{
          tableType === "nap"
            ? $t("Agent.MoneyTotalNap")
            : $t("Agent.MoneyTotalRut")
        }}
      </div>
      <p style="color: rgb(25 146 246)">
        {{
          tableType == "nap" ? $t("Agent.TotalCharge") : $t("Agent.TotalDraw")
        }}: ${{ this.formatPrice(tongNap, 2) }}
      </p>
    </div>

    <div id="loading-corners-nap" class="vs-con-loading__container">
      <el-table :data="products">
        <el-table-column :label="$t('Login.Account')">
          <template slot-scope="record">
            {{ record.row.from_u }}<br />{{ $t("history.desc") }}:
            {{ record.row.type }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('history.type')">
          <template slot-scope="record">
            <p class="de-name font-medium truncate">
              <span>
                <img width="20" :src="typeMoney(record.row.currency).i" />
                {{ typeMoney(record.row.currency).t }}
              </span>
            </p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('history.AmountMoney')" align="center">
          <template slot-scope="record">
            {{ getAmountDecimal(record.row.currency, record.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('history.note')"
          prop="note"
          align="center"
        />
        <el-table-column :label="$t('User.Status')" align="center">
          <template slot-scope="record">
            <el-tag type="warning" v-if="record.row.status === 0">
              {{ $t("common.failed") }}
            </el-tag>
            <el-tag v-else type="success">
              {{ $t("common.success") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('history.created_at')"
          prop="created_at"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    email: { type: String },
    tableData: { type: Array, default: () => [] },
    tableType: { type: String },
  },
  data() {
    return {};
  },
  computed: {
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx;
      }
      return 0;
    },
    products() {
      return this.tableData;
    },

    tongNap() {
      return this.products.reduce((prev, curr) => {
        return curr.status === 1 ? parseFloat(curr.amount) + prev : 0 + prev;
      }, 0);
    },
  },
  methods: {
    onTimeChange(e) {
      let timQuery = e !== "all" ? `f=${e}` : "";
      this.reloadList(timQuery);
    },

    getIconType(type) {
      let cur = type?.toUpperCase();
      return cur;
    },

    typeMoney(currency) {
      switch (currency.toUpperCase()) {
        case "BTC":
        case "ETH":
        case "USDT":
          return {
            t: this.$t("Setting.System"),
            i: require("@/assets/images/sky/paypal-mini.png"),
          };
        case "VND":
          return {
            t: this.$t("history.bank") + "VND",
            i: require("@/assets/images/sky/vnd-mini.svg"),
          };

        default:
          return {
            t: currency.toUpperCase(),
            i: require("@/assets/images/sky/paypal-mini.png"),
          };
      }
    },
    formatPrice(value, minimum) {
      if (void 0 === value) value = 0;
      var formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: minimum,
      });

      return formatter.format(value);
    },

    getAmountDecimal(type, value) {
      let cur = "$";
      let coin = type.toUpperCase();
      let minimum = 2;
      if (coin == "BTC") minimum = 6;

      if (coin == "ETH") minimum = 4;

      if (coin == "USDT") minimum = 2;

      if (coin == "VN") minimum = 0;

      var formatter = new Intl.NumberFormat("en-US", {
        //style: 'currency',
        //currency: '',
        minimumFractionDigits: minimum,
      });

      return cur + formatter.format(value);
    },

    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
  },
  created() {},

  mounted() {},

  watch: {},
};
</script>

<style lang="scss">
#list-history-deposit {
  .vs-con-table {
    /*
      Below media-queries is fix for responsiveness of action buttons
      Note: If you change action buttons or layout of this page, Please remove below style
    */
    @media (max-width: 689px) {
      .vs-table--search {
        margin-left: 0;
        max-width: unset;
        width: 100%;

        .vs-table--search-input {
          width: 100%;
        }
      }
    }

    @media (max-width: 461px) {
      .items-per-page-handler {
        display: none;
      }
    }

    @media (max-width: 341px) {
      .data-list-btn-container {
        width: 100%;

        .dd-actions,
        .btn-add-new {
          width: 100%;
          margin-right: 0 !important;
        }
      }
    }

    .product-name {
      max-width: 23rem;
    }

    .vs-table--header {
      display: flex;
      flex-wrap: wrap;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      > span {
        display: flex;
        flex-grow: 1;
      }

      .vs-table--search {
        padding-top: 0;

        .vs-table--search-input {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;

          & + i {
            left: 1rem;
          }

          &:focus + i {
            left: 1rem;
          }
        }
      }
    }

    .vs-table {
      border-collapse: separate;
      border-spacing: 0 1.3rem;
      padding: 0 1rem;

      tr {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
        td {
          padding: 20px;
          &:first-child {
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
          }
          &:last-child {
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
        }
        td.td-check {
          padding: 20px !important;
        }
      }
    }

    .vs-table--thead {
      th {
        padding-top: 0;
        padding-bottom: 0;

        .vs-table-text {
          text-transform: uppercase;
          font-weight: 600;
        }
      }
      th.td-check {
        padding: 0 15px !important;
      }
      tr {
        background: none;
        box-shadow: none;
      }
    }

    .vs-table--pagination {
      justify-content: center;
    }
  }
}
</style>
