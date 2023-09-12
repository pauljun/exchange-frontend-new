<template>
  <div class="login">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h2 class="title">
          <img src="../../assets/logo.png" />
          <div class="login-i18n">
            <I18n />
          </div>
        </h2>
      </div>
      <el-form-item prop="email">
        <span class="svg-container" style="font-size: 16px">
          {{ $t("Login.Account") }}
        </span>
        <el-input
          ref="email"
          v-model="loginForm.email"
          prefix-icon="el-icon-user"
          size="large"
          name="email"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <span class="svg-container" style="font-size: 16px">
            {{ $t("Login.Password") }}
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            show-password
            size="large"
            :type="passwordType"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        size="large"
        @click.native.prevent="handleLogin"
      >
        {{ $t("Login.Login") }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import I18n from "@/components/I18n";
export default {
  name: "Login",
  components: {
    I18n,
  },
  data() {
    return {
      loginForm: {
        // email: "arres@gmail.com",
        // password: "jk5821560",
        email: "",
        password: "",
      },
      loginRules: {
        email: [{ required: true, trigger: "blur" }],
        password: [{ required: true, trigger: "blur" }],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.email === "") {
      this.$refs.email.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery,
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss">
.login {
  background: url(../../assets/login/bg.jpg) no-repeat;
  background-size: cover;
  height: 100%;
  .login-form {
    width: 450px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: url(../../assets/login/bg2.png) no-repeat;
    background-size: cover;
    color: #fff;
    padding: 30px 60px 50px;
    .el-button {
      width: 100%;
      margin-top: 10px;
    }
    .el-input__inner {
      background: transparent;
      color: #fff;
    }
  }
  h2 {
    img {
      width: 60%;
    }
  }
  .login-i18n {
    position: absolute;
    z-index: 2;
    right: 20px;
    top: 30px;
    .i18n-wrap-txt {
      color: #fff;
    }
  }
}
</style>