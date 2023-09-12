<template>
  <div class="p-16" v-loading="tableLoading">
    <div class="datel-list-container" v-if="!isShowNapRut">
      <div class="flex-between-center">
        <el-select v-model="timer" @change="onTimeChange">
          <el-option
            :key="index"
            :value="item.value"
            :label="item.text"
            v-for="(item, index) in options"
          >
            {{ item.text }}
          </el-option>
        </el-select>
        <div style="display: inline-block; margin-left: 20px">
          <small class="date-label">{{ $t("Setting.Since") }}</small>
          <el-date-picker v-model="startDate" type="date" format="dd-MM-yyyy">
          </el-date-picker>
        </div>
        <div style="display: inline-block; margin-left: 20px">
          <small class="date-label">{{ $t("Setting.ToDate") }}</small>
          <el-date-picker v-model="endDate" type="date" format="dd-MM-yyyy">
          </el-date-picker>
        </div>
        <el-button
          style="margin-left: 20px"
          @click="filterFromToDate"
          type="primary"
          :disabled="!startDate || !endDate"
        >
          {{ $t("User.Search") }}
        </el-button>
        <div style="margin-top: 20px">{{ $t("common.total") }}</div>
        <el-row>
          <el-col :span="12">
            <p>
              {{ $t("common.TotalBet") }}: ${{ this.formatPrice(betTotal, 2) }}
            </p>
            <p style="color: rgb(25 146 246)">
              {{ $t("common.TotalWin") }}: ${{ this.formatPrice(betWin, 2) }}
            </p>
          </el-col>
          <el-col :span="12">
            <p style="color: #f00">
              {{ $t("User.TotalThua") }}: ${{ this.formatPrice(betLose, 2) }}
            </p>
            <p style="color: #7167e8">
              {{ $t("User.Characters") }}: ${{
                this.formatPrice(betWin - betLose, 2)
              }}
            </p>
          </el-col>
        </el-row>
      </div>
      <div id="loading-corners-f17" class="vs-con-loading__container">
        <el-table :loading="tableLoading" :data="products">
          <el-table-column
            :label="$t('Login.Account')"
            prop="email"
            align="center"
          />
          <el-table-column :label="$t('common.TotalBet')" align="center">
            <template slot-scope="record">
              {{ formatPrice(record.row.tongDatCuoc, 2) }}
            </template>
          </el-table-column>

          <el-table-column :label="$t('User.TotalYing')" align="center">
            <template slot-scope="record">
              <div style="color: rgb(25 146 246)">
                ${{ formatPrice(record.row.tongWin, 2) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('User.TotalThua')" align="center">
            <template slot-scope="record">
              <div style="color: #f00">
                ${{ formatPrice(record.row.tongThua, 2) }}
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="$t('User.profit')" align="center">
            <template slot-scope="record">
              <div style="color: #7167e8">
                ${{ formatPrice(record.row.tongWin - record.row.tongThua, 2) }}
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="$t('User.TotalCharge')" align="center">
            <template slot-scope="record">
              ${{ formatPrice(tongNap(record.row.napRut), 2) }}
              <el-button icon="eye" @click="showNap(record.row)">
                {{ $t("common.See") }}
              </el-button>
            </template>
          </el-table-column>

          <el-table-column :label="$t('User.TotalWithdrawal')" align="center">
            <template slot-scope="record">
              ${{ formatPrice(tongRut(record.row.napRut), 2) }}
              <el-button icon="eye" @click="showRut(record.row)">
                {{ $t("common.See") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else>
      <div class="mb-4">
        <el-button @click="isShowNapRut = false" type="primary">
          {{ $t("common.Back") }}
        </el-button>
      </div>
      <F17NapTable :tableData="napRutData" :tableType="tableType" />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";

import F17NapTable from "./F17NapTable.vue";

export default {
  components: {
    F17NapTable,
  },
  data() {
    return {
      tableType: "nap",
      napRutData: [],
      timer: "all",
      isShowNapRut: false,
      timeSelected: "all",
      startDate: "",
      endDate: "",
      options: [
        { value: "all", text: this.$t("Index.all") },
        { value: "hom-nay", text: this.$t("Index.today") },
        { value: "hom-qua", text: this.$t("Index.yesterday") },
        { value: "tuan-nay", text: this.$t("Index.lastweek") },
        { value: "tuan-truoc", text: this.$t("Index.lastweek") },
        { value: "thang-nay", text: this.$t("Index.ThisMonth") },
        { value: "thang-truoc", text: this.$t("Index.lastmonth") },
      ],

      productsFake: [],
      itemsPerPage: 10,
      tableLoading: true,
    };
  },
  computed: {
    ...mapGetters(["email"]),
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx;
      }
      return 0;
    },
    products() {
      return this.productsFake;
    },

    betTotal() {
      return this.products.reduce((prev, curr) => {
        return parseFloat(curr.tongDatCuoc) + prev;
      }, 0);
    },

    betWin() {
      return this.products.reduce((prev, curr) => {
        return parseFloat(curr.tongWin) + prev;
      }, 0);
    },

    betLose() {
      return this.products.reduce((prev, curr) => {
        return parseFloat(curr.tongThua) + prev;
      }, 0);
    },

    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.productsFake.length;
    },
  },
  methods: {
    tongNap(napRut) {
      return napRut?.reduce((prev, curr) => {
        return curr.type_key === "nt" ? parseFloat(curr.amount) + prev : 0;
      }, 0);
    },
    tongRut(napRut) {
      return napRut?.reduce((prev, curr) => {
        return curr.type_key === "rt" ? parseFloat(curr.amount) + prev : 0;
      }, 0);
    },
    calNapRutTotal(tr, type) {
      // type: nt rt
      if (void 0 === tr.napRut) return;
      let total = tr.napRut.reduce((prev, curr) => {
        return curr.type_key === type ? parseFloat(curr.amount) + prev : prev;
      }, 0);
      return total;
    },
    showNap(tr) {
      this.napRutData = tr.napRut.filter((item) => {
        return item.type_key == "nt";
      });
      this.tableType = "nap";
      this.isShowNapRut = true;
    },
    showRut(tr) {
      this.napRutData = tr.napRut.filter((item) => {
        return item.type_key == "rt";
      });
      this.tableType = "rut";
      this.isShowNapRut = true;
    },
    onTimeChange(e) {
      let timQuery = e !== "all" ? `&f=${e}` : "";
      this.reloadList(timQuery);
    },

    filterFromToDate() {
      let from = moment(this.startDate).format("YYYY-MM-DD");
      let to = moment(this.endDate).format("YYYY-MM-DD");
      let timeQuery = `&from=${from}&to=${to}`;
      this.reloadList(timeQuery);
    },

    formatPrice(value, minimum) {
      var formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: minimum,
      });
      return formatter.format(parseFloat(value));
    },

    reloadList(time) {
      this.tableLoading = true;
      let f = void 0 !== time ? time : "";
      this.$http
        .get(`/history/thongKeGetListF1F7?email=${this.email}${f}`)
        .then((res) => {
          if (res.code === 10000) {
            this.productsFake = res.data;
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
  },
  created() {
    this.reloadList();
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
.p-16 {
  padding: 16px;
  background: #fff;
  .date-label {
    margin-right: 10px;
  }
}
</style>