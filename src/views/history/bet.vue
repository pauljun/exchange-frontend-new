<template>
  <div class="app-container" v-loading="loading">
    <div class="filter-container">
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
      fit
      @selection-change="handleSelectMulti"
    >
      <el-table-column width="200px" :label="$t('Menu.Account')" align="center">
        <template slot-scope="record">
          <div>{{ $t("Login.Account") }}: {{ record.row.email }}</div>
          <div>ID: {{ record.row.id_account }}</div>
          <div v-if="record.row.type_account">Live Account</div>
          <div v-else>Demo Account</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('history.type')" align="center">
        <template slot-scope="record">
          {{ record.row.currency }}<br />
          <span
            style="text-decoration: underline; color: #84f98d"
            v-if="record.row.marketing"
          >
            {{ $t("history.Marketing") }}
          </span>
          <span v-else>{{ $t("history.normal") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        :label="$t('history.Purchase') + '/' + $t('history.Sale')"
        align="center"
      >
        <template slot-scope="record">
          <el-tag v-if="record.row.buy_sell === 'buy'" type="success">
            {{ $t("history.Purchase") }}
          </el-tag>
          <el-tag v-else type="danger"> {{ $t("history.Sale") }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="account"
        :label="$t('history.TzAccount')"
        align="center"
      >
        <template slot-scope="record">
          <el-tag>
            {{ getAmountDecimal("vn", record.row.amount_bet) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('history.win') + '/' + $t('history.low')"
        align="center"
      >
        <template slot-scope="record">
          <span
            style="
              color: #fb9494;
              font-weight: bold;
              text-shadow: 0px 0px 1px #f00;
            "
          >
            {{
              `${
                record.row.amount_win != 0
                  ? "+" + record.row.amount_win
                  : "-" + record.row.amount_lose
              }`
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('history.result')" align="center">
        <template slot-scope="record">
          <el-tag
            effect="dark"
            v-if="record.row.amount_win != 0"
            type="success"
          >
            {{ $t("history.win") }}
          </el-tag>
          <el-tag effect="dark" v-else type="danger">
            {{ $t("history.low") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        :label="$t('history.created_at')"
        align="center"
      />
      <el-table-column label="Open / Close" align="center">
        <template slot-scope="record">
          <div>
            {{ `${record.row.open} -> ${record.row.close}` }}
          </div>
          <div>{{ $t("history.session") }}: {{ record.row.session }}</div>
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
      queryParam: {
        email: "",
      },
      url: "/history/bet",
    };
  },
  methods: {
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
