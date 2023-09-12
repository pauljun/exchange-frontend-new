<template>
  <div class="app-container" v-loading="loading">
    <div class="filter-container">
      <el-form label-width="80px">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label-width="40px" :label="$t('User.Email')">
              <el-input v-model="queryParam.email" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :label="$t('User.Status')">
              <el-select style="width: 100%" v-model="queryParam.active">
                <el-option :value="1" :label="$t('User.On')" />
                <el-option :value="2" :label="$t('User.Off')" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="handleSearch">
              {{ $t("User.Search") }}
            </el-button>
            <el-button @click="handleRefresh">
              {{ $t("User.Reset") }}
            </el-button>
          </el-col>
          <el-col :span="13">
            <el-button class="fr" type="primary" @click="handleCreate()">
              {{ $t("User.Add") }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      :data="data"
      style="width: 100%"
      @selection-change="handleSelectMulti"
    >
      <el-table-column
        prop="email"
        width="180px"
        :label="$t('User.Email')"
        align="center"
      />
      <el-table-column
        :label="$t('User.UsdtAddress')"
        prop="address_USDT"
        align="center"
      />
      <el-table-column :label="$t('User.BalanceTotal')" align="center">
        <el-table-column
          :label="$t('User.TotalGame')"
          prop="pricePlay"
          align="center"
          width="120px"
        >
          <template slot-scope="record">
            <el-link type="warning">${{ record.row.pricePlay }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('User.TotalYing')"
          prop="priceWin"
          align="center"
          width="120px"
        >
          <template slot-scope="record">
            <el-link type="success">${{ record.row.priceWin }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('User.TotalThua')"
          prop="priceLose"
          align="center"
          width="120px"
        >
          <template slot-scope="record">
            <el-link type="danger">${{ record.row.priceLose }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          align="center"
          :label="$t('User.Characters')"
        >
          <template slot-scope="record">
            <el-link type="success">
              ${{ record.row.priceWin - record.row.priceLose }}
            </el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        :label="$t('User.Balance')"
        prop="offer_account"
        width="120px"
        align="center"
      >
      </el-table-column>
      <el-table-column width="200px" :label="$t('User.Wallet')" align="center">
        <template slot-scope="record">
          <div class="tb-wallet">
            <div>
              <img src="../../assets/images/sky/ic_vnd.png" />
              ${{ record.row.money_vn }}
            </div>
            <div>
              <img
                src="https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/svg/color/btc.svg"
              />
              ${{ record.row.money_btc }}
            </div>
            <div>
              <img
                src="https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/svg/color/eth.svg"
              />
              ${{ record.row.money_eth }}
            </div>
            <div>
              <img
                src="https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/svg/color/usdt.svg"
              />
              ${{ record.row.money_usdt }}
            </div>
            <div>
              <img src="../../assets/images/sky/ic_vnd.png" />
              ${{ record.row.money_paypal }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="active"
        width="120px"
        :label="$t('User.Status')"
        align="center"
      >
        <template slot-scope="record">
          <el-switch
            v-model="record.row.active"
            :active-value="1"
            :inactive-value="2"
            @change="disOrEnableRecord(record.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('common.operate')"
        align="center"
        width="180px"
      >
        <template slot-scope="job">
          <el-button
            v-if="queryParam.vip_user"
            icon="el-icon-paperclip"
            @click="addMoney(job.row)"
          />
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleUpdate(job.row)"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(job.row.id)"
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
    <!----------------------------------- 部门 ---------------------------------------------->
    <el-dialog
      :title="$t('User.' + title)"
      :visible.sync="formVisible"
      width="560px"
      :close-on-click-modal="false"
      @close="handleCancel"
    >
      <el-form
        :ref="formName"
        label-width="100px"
        :model="formFieldsData"
        :rules="rules"
      >
        <el-form-item :label="$t('User.Email')" prop="email">
          <el-input v-model="formFieldsData.email" />
        </el-form-item>
        <el-form-item :label="$t('User.NickName')" prop="nick_name">
          <el-input v-model="formFieldsData.nick_name" />
        </el-form-item>
        <el-form-item :label="$t('User.first_name')" prop="first_name">
          <el-input v-model="formFieldsData.first_name" />
        </el-form-item>
        <el-form-item :label="$t('User.last_name')" prop="last_name">
          <el-input v-model="formFieldsData.last_name" />
        </el-form-item>
        <el-form-item :label="$t('Login.Password')" prop="password">
          <el-input
            type="password"
            autocomplete="off"
            v-model="formFieldsData.password"
          />
        </el-form-item>
        <el-form-item :label="$t('User.Role')" prop="roles">
          <el-checkbox-group v-model="formFieldsData.roles">
            <el-checkbox v-for="v in roles" :key="v.id" :label="v.id">
              {{ v.role_name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          v-if="formFieldsData.roles.includes(14)"
          :label="$t('User.level_vip')"
          prop="level_vip"
        >
          <el-select v-model="formFieldsData.level_vip">
            <el-option
              v-for="v in category_level"
              :value="v.value"
              :label="`${$t('User.level_vip')}${v.value}`"
              :key="v.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('User.Status')" prop="active">
          <el-radio-group v-model="formFieldsData.active">
            <el-radio :label="1">{{ $t("User.On") }}</el-radio>
            <el-radio :label="2">{{ $t("User.Off") }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">{{ $t("common.cancel") }}</el-button>
        <el-button type="primary" :loading="sureLoading" @click="handleSubmit">
          {{ $t("common.sure") }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('User.addMoneyTitle')"
      :visible.sync="formVisibleMoney"
      width="560px"
      :close-on-click-modal="false"
      @close="formVisibleMoney = false"
    >
      <div style="margin-bottom: 20px">{{ formFieldsData.email }}</div>
      <el-form :ref="formName" :model="formFieldsData" :rules="rules">
        <el-form-item :label="$t('User.Wallet') + 'BTC'" prop="money_btc">
          <el-input v-model="formFieldsData.money_btc">
            <template slot="prepend">$</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('User.Wallet') + 'ETH'" prop="money_eth">
          <el-input v-model="formFieldsData.money_eth">
            <template slot="prepend">$</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('User.Wallet') + 'USDT'" prop="money_usdt">
          <el-input v-model="formFieldsData.money_usdt">
            <template slot="prepend">$</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('User.Wallet') + 'VN'" prop="money_vn">
          <el-input v-model="formFieldsData.money_vn">
            <template slot="prepend">$</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisibleMoney = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button type="primary" :loading="sureLoading" @click="submit">
          {{ $t("common.sure") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import formOperate from "@/layout/mixin/formOperate";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

export default {
  mixins: [formOperate],
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      formName: "domain_record",
      defaultQueryParam: ["vip_user"],
      queryParam: {
        active: "",
        email: "",
        vip_user: this.$route.path === "/account/list-agency-account" ? 1 : "",
      },
      roles: [],
      category_level: [
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
      ],
      url: "/users",
      formVisibleMoney: false,
      formVisible: false,
      formFieldsData: {
        email: "",
        nick_name: "",
        first_name: "",
        last_name: "",
        password: "",
        active: 1,
        roles: [],
      },
      // 表单验证
      rules: {
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        nick_name: [
          { required: true, message: "请上传封面图", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.$http.get("/roles").then((res) => {
      this.roles = res.data;
    });
  },
  methods: {
    beforeSubmit() {
      if (this.formFieldsData.roles.includes(14)) {
        this.formFieldsData.vip_user = 1;
      }
    },
    onCreated(editor) {
      this.editor = Object.seal(editor);
    },
    addMoney(value) {
      this.formFieldsData = { ...value };
      this.$nextTick(() => {
        this.formVisibleMoney = true;
      });
    },
    disOrEnableRecord(record) {
      this.$http
        .put(this.url + "/" + record.id, {
          active: record.active,
        })
        .then((response) => {
          this.$message.success(response.message);
        });
    },
    submit() {
      const obj = {
        id: this.formFieldsData.id,
        nick_name: this.formFieldsData.nick_name,
        email: this.formFieldsData.email,
        type: 1, // 1: marketing, 0: member
        money_paypal: 0,
        money_btc: this.formFieldsData.money_btc,
        money_eth: this.formFieldsData.money_eth,
        money_usdt: this.formFieldsData.money_usdt,
        money_vn: this.formFieldsData.money_vn,
      };
      this.sureLoading = true;
      this.$http
        .put(`/users/${obj.id}`, {
          ...obj,
        })
        .then((res) => {
          if (res.code === 10000) {
            this.$message.success(res.message);
            this.resetFormFields();
            this.handleRefresh();
            this.formVisibleMoney = false;
          } else {
            this.$message.error(res.message);
          }
          this.sureLoading = false;
        });
    },
  },
};
</script>

<style lang="scss">
.icon-logo {
  max-width: 80px;
  max-height: 48px;
}

.tb-wallet {
  text-align: left;
  padding-left: 20px;
  img {
    width: 20px;
    vertical-align: middle;
  }
}
</style>