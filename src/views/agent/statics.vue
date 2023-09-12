<template>
  <div class="agent-container" v-loading="loading">
    <el-select v-model="type" @change="changeDT()">
      <el-option
        v-for="v in timeOptions"
        :key="v.code"
        :value="v.code"
        :label="$t('Index.' + v.label)"
      />
    </el-select>
    <div style="margin-top: 10px">
      <small class="date-label">{{ $t("Setting.Since") }}</small>
      <el-date-picker v-model="startDate"></el-date-picker>
      <small class="date-label" style="margin-left: 10px">
        {{ $t("Setting.ToDate") }}
      </small>
      <el-date-picker name="end-date" v-model="endDate"></el-date-picker>
      <el-button
        @click="filterFromToDate"
        style="margin-left: 10px"
        :disabled="!startDate || !endDate"
      >
        {{ $t("Setting.Find") }}
      </el-button>
    </div>

    <el-row style="margin-top: 20px; line-height: 2">
      <el-col :span="5">
        {{ $t("Setting.LoadingSystem") }} USDT:<br />
        <span class="font-bold"> ${{ formatPrice(dataGet.bet, 4) }} </span>
      </el-col>
      <el-col :span="5">
        {{ $t("User.TotalCharge") }}:
        <br />
        <span class="font-bold"> $ {{ formatPrice(dataGet.deposit, 4) }} </span>
      </el-col>
      <el-col :span="5">
        {{ $t("User.TotalWithdrawal") }}:<br />
        <span class="font-bold">
          ${{ formatPrice(dataGet.withDrawal, 4) }}
        </span>
      </el-col>
      <el-col :span="5">
        {{ $t("Index.AddUser") }}:<br />
        <span class="font-bold">
          {{ dataGet.member || 0 }}
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      loading: false,
      startDate: "",
      endDate: "",
      type: "today",
      timeOptions: [
        {
          label: "today",
          code: "today",
        },
        {
          label: "lastweek",
          code: "week",
        },
        {
          label: "lastmonth",
          code: "month",
        },
      ],
      dataGet: {},
    };
  },
  methods: {
    filterFromToDate() {
      let from = moment(this.startDate).format("YYYY-MM-DD");
      let to = moment(this.endDate).format("YYYY-MM-DD");
      let timeQuery = {
        sday: from,
        eday: to,
      };
      this.changeDT(timeQuery);
    },
    formatPrice(value, minimum) {
      if (void 0 === value) value = 0;
      var formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: minimum,
      });
      return formatter.format(value);
    },
    changeDT(timeQuery) {
      this.loading = true;
      this.$http
        .get("admin/get_agent_data", {
          params: timeQuery
            ? timeQuery
            : {
                type: this.type,
              },
        })
        .then((res) => {
          if (res.code === 10000) {
            this.dataGet = res.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.changeDT();
  },
};
</script>

<style lang="scss" scoped>
.agent-container {
  background: #fff;
  padding: 10px;
  .date-label {
    margin-right: 10px;
  }
}
</style>