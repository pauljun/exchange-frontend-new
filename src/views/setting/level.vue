<template>
  <el-form
    ref="dynamicValidateForm"
    v-loading="loading"
    label-width="100px"
    class="level-setting"
  >
    <el-form-item>
      <el-button @click="addItem">{{ $t("Setting.AddLevel") }}</el-button>
    </el-form-item>
    <el-form-item
      v-for="(item, index) in items"
      :label="'%' + $t('User.level_vip') + String(index + 1)"
      :key="item.id"
    >
      <el-input v-model="item.value" type="number">
        <el-button
          slot="append"
          icon="el-icon-delete"
          @click.prevent="removeItem(item.id)"
        ></el-button>
      </el-input>
      <div>$ 10 = {{ (10 / 100) * item.value }}</div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('dynamicValidateForm')">
        {{ $t("Setting.Agree") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      loading: true,
      items: [],
    };
  },
  mounted() {
    this.$http
      .get("/admin/getRateCommission")
      .then((res) => {
        if (res.code === 10000) {
          this.items = res.data;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    submitForm() {
      this.loading = true;
      this.$http
        .post("/admin/saveRateCommission", this.items)
        .then((res) => {
          if (res.code === 10000) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeItem(id) {
      this.items = this.items.filter((v) => v.id !== id);
    },
    addItem() {
      this.items.push({
        value: "",
        id: Date.now(),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.level-setting {
  background: #fff;
  max-width: 560px;
  padding: 20px;
  margin: 20px auto;
}
</style>