<template>
  <div class="app-container" v-loading="loading">
    <div class="filter-container">
      <el-row>
        <el-col :span="12">
          <div class="his-wrapper">
            <span class="mr-4" style="color: #ffb0b0">
              {{ $t("history.TotalDeposit") }}:
              <b>{{ formatPrice(info.dtUSD, 2) }} USDT</b>
            </span>
            <span class="mr-4" style="color: #ffb0b0">
              {{ $t("history.TotalWithdrawal") }}:
              <b>{{ formatPrice(info.dtBNB, 10) }} BNB</b>
            </span>
            <span class="mr-4" style="color: #ffb0b0">
              {{ $t("history.cost") }}:
              <b>{{ formatPrice(info.feeBNB, 10) }} BNB</b>
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="his-wrapper">
            <span class="mr-4" style="color: #ffa500">
              {{ $t("history.ReceivedTotal") }}:
              <b>{{ formatPrice(info.dtUSD, 2) }} USDT</b>
            </span>
            <span class="mr-4" style="color: #ffa500">
              {{ $t("history.TotalBnb") }}:
              <b>{{ formatPrice(info.dtBNB, 10) }} BNB</b>
            </span>
            <span class="mr-4" style="color: #ffa500">
              {{ $t("history.cost") }}:
              <b>{{ formatPrice(info.feeBNB, 10) }} BNB</b>
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form label-width="80px" :inline="true">
            <el-form-item :label="$t('common.keyword')">
              <el-input style="width: 100%" v-model="queryParam.email" />
            </el-form-item>
            <el-button
              type="primary"
              @click="handleSearch"
              icon="el-icon-search"
            >
              {{ $t("User.Search") }}
            </el-button>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table
      ref="multipleTable"
      :data="data"
      tooltip-effect="dark"
      style="width: 100%"
      border
      fit
      @selection-change="handleSelectMulti"
    >
      <el-table-column
        prop="email"
        :label="$t('Menu.Account')"
        align="center"
        width="280px"
      >
        <template slot-scope="record">
          {{ $t("history.from") }}: {{ record.row.from_u }}<br />{{
            $t("history.to")
          }}: {{ record.row.to_u }} <br />
          {{ $t("history.desc") }}:
          {{ record.row.type }}
        </template>
      </el-table-column>
      <el-table-column
        prop="account"
        :label="$t('history.AmountMoney')"
        align="center"
      >
        <template slot-scope="record">
          {{ getAmountDecimal(record.row.currency, record.row.amount) }}
        </template>
      </el-table-column>
      <el-table-column prop="note" :label="$t('history.note')" align="center">
        <template slot-scope="record">
          <div v-if="record.row.currency === 'vnd'">
            <div v-for="(v, i) in formatNote(record.row.bank)" :key="i">
              {{ $t(`history.${v.label}`) }}:{{ v.value }}
            </div>
          </div>
          <div v-else>
            {{ record.row.note }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        :label="$t('history.created_at')"
        align="center"
      />
      <el-table-column prop="status" :label="$t('User.Status')" align="center">
        <template slot-scope="record">
          <el-tag type="primary" effect="dark" v-if="record.row.status == 0">
            {{ $t("history.Processing") }}
          </el-tag>
          <el-tag type="success" effect="dark" v-if="record.row.status == 1">
            {{ $t("history.complete") }}
          </el-tag>
          <el-tag type="danger" effect="dark" v-if="record.row.status == -1">
            {{ $t("history.refuse") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operate')" align="center">
        <template slot-scope="record">
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(record.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-container"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginate.current"
      hide-on-single-page
      :page-sizes="paginate.sizes"
      :page-size="paginate.limit"
      :layout="paginate.layout"
      :total="paginate.total"
    />
  </div>
</template>
<script>
import formOperate from "@/layout/mixin/formOperate";

export default {
  mixins: [formOperate],
  data() {
    return {
      formName: "domain_record",
      defaultQueryParam: ["type"],
      queryParam: {
        email: "",
        type: "Trade",
      },
      info: {
        dtUSD: 0,
        dtBNB: 0,
        feeBNB: 0,
      },

      url: "/history/trade",
    };
  },
  computed: {
    bankInfo() {
      return this.formatNote(this.formFieldsData.bank);
    },
  },
  mounted() {
    this.$http.get("/history/trade_count?type=rt").then((res) => {
      this.info = res;
    });
    /** 提现 */
    this.$http.get("/history/trade_count?type=rt").then((res) => {
      this.info = res;
    });
  },
  methods: {
    formatNote(bank) {
      const noteArr = bank.split("|");
      const arr = ["bank", "Branch", "Account", "AccountHolder"];
      return arr.map((v, i) => {
        return {
          label: v,
          value: noteArr[i],
        };
      });
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
  },
};
</script>

<style lang="scss">
.his-wrapper {
  padding: 10px 0;
  text-align: left;
  margin-bottom: 10px;
}
h5 {
  margin: 0;
  padding: 0;
}
.mr-4 {
  margin-left: 30px;
}
.p-6 {
  line-height: 32px;
  font-size: 16px;
}
</style>