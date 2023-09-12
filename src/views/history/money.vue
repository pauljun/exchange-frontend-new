<template>
  <div class="app-container" v-loading="loading">
    <div class="filter-container">
      <div>
        <p>
          <span class="mr-4" style="color: #00ffad">
            {{ $t("history.TotalAmountAdded") }}USDT:
            <b>{{ formatPrice(info.tUSD, 2) }}</b>
          </span>
          <span class="mr-4" style="color: #00ffad">
            {{ $t("history.TotalAmountAdded") }}BTC:
            <b>{{ formatPrice(info.tBTC, 2) }}</b>
          </span>
          <span class="mr-4" style="color: #00ffad">
            {{ $t("history.TotalAmountAdded") }}ETH:
            <b>{{ formatPrice(info.tETH, 2) }}</b>
          </span>
          <span class="mr-4" style="color: #00ffad">
            {{ $t("history.TotalAmountAdded") }}PAYPAL:
            <b>{{ formatPrice(info.tPAYPAL, 2) }}</b>
          </span>
          <span class="mr-4" style="color: #00ffad">
            {{ $t("history.TotalAmountAdded") }}VN:
            <b>{{ formatPrice(info.tVN, 2) }} </b>
          </span>
        </p>
      </div>
      <el-row>
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
      :empty-text="$t('common.empty')"
      fit
      @selection-change="handleSelectMulti"
    >
      <el-table-column :label="$t('Menu.Account')" align="center">
        <template slot-scope="record">
          <div>
            {{ record.row.email }}<br />
            {{ $t("User.NickName") }}:
            {{ record.row.nick_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('history.type')" align="center">
        <template slot-scope="record">
          <span
            style="text-decoration: underline; color: #84f98d"
            v-if="record.row.type"
          >
            {{ $t("history.Marketing") }}
          </span>
          <span v-else>{{ $t("history.normal") }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('history.AmountMoney')" align="center">
        <template slot-scope="record">
          <div>
            <div>USDT: {{ formatPrice(record.row.price_USDT, 2) }}</div>
            <div>ETH: {{ formatPrice(record.row.price_ETH, 4) }}</div>
            <div>Paypal: {{ formatPrice(tr.price_PAYPAL, 2) }}</div>
            <div>BTC: {{ formatPrice(record.row.price_BTC, 6) }}</div>
            <div>VN: {{ formatPrice(record.row.price_VN, 0) }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        :label="$t('history.created_at')"
        align="center"
      />
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
      queryParam: {
        email: "",
      },
      info: {},
      url: "/history/exchange",
    };
  },
  mounted() {
    this.$http.get("/history/add_money_count").then((res) => {
      if (res.code === 10000) {
        this.info = res.data;
      }
    });
  },
  methods: {
    formatPrice(value, minimum) {
      if (void 0 === value) value = 0;
      var formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: minimum,
      });
      return formatter.format(value);
    },
  },
};
</script>

<style lang="scss">
.mr-4 {
  margin-right: 20px;
}
</style>