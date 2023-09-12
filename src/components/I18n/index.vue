<template>
  <el-dropdown class="i18n-wrap" @command="updateLocale">
    <span class="i18n-wrap-txt">
      <img :src="i18n_locale_img" :alt="$i18n.locale" />
      <span class="hidden sm:block ml-2">
        {{ getCurrentLocaleData.lang }}
      </span>
    </span>
    <el-dropdown-menu>
      <el-dropdown-item @click="updateLocale('vi')" command="vi">
        <img class="i18-icon" src="@/assets/images/flags/vi.png" alt="vi" />
        &nbsp;Tiếng Việt
      </el-dropdown-item>
      <el-dropdown-item @click="updateLocale('en')" command="en">
        <img class="i18-icon" src="@/assets/images/flags/en.png" alt="en" />
        &nbsp;English
      </el-dropdown-item>
      <!-- <el-dropdown-item @click="updateLocale('fr')" command="fr">
        <img class="i18-icon" src="@/assets/images/flags/fr.png" alt="fr" />
        &nbsp;French
      </el-dropdown-item>
      <el-dropdown-item @click="updateLocale('de')" command="de">
        <img class="i18-icon" src="@/assets/images/flags/de.png" alt="de" />
        &nbsp;German</el-dropdown-item
      >
      <el-dropdown-item @click="updateLocale('pt')" command="pt">
        <img class="i18-icon" src="@/assets/images/flags/pt.png" alt="pt" />
        &nbsp;Portuguese
      </el-dropdown-item> -->
      <el-dropdown-item @click="updateLocale('cn')" command="cn">
        <img class="i18-icon" src="@/assets/images/flags/cn.png" alt="cn" />
        &nbsp;繁体中文
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import vi from "element-ui/lib/locale/lang/vi";
import cn from "element-ui/lib/locale/lang/zh-TW";
import en from "element-ui/lib/locale/lang/en";
import pt from "element-ui/lib/locale/lang/pt";
import fr from "element-ui/lib/locale/lang/fr";
import de from "element-ui/lib/locale/lang/de";
import ElLocale from "element-ui/lib/locale";

export default {
  computed: {
    i18n_locale_img() {
      return require(`@/assets/images/flags/${this.$i18n.locale}.png`);
    },
    getCurrentLocaleData() {
      const locale = this.$i18n.locale;
      if (locale == "vi") {
        ElLocale.use(vi);
        return { flag: "vi", lang: "Tiếng Việt" };
      } else if (locale == "en") {
        ElLocale.use(en);
        return { flag: "us", lang: "English" };
      } else if (locale == "pt") {
        ElLocale.use(pt);
        return { flag: "br", lang: "Portuguese" };
      } else if (locale == "fr") {
        ElLocale.use(fr);
        return { flag: "fr", lang: "French" };
      } else if (locale == "de") {
        ElLocale.use(de);
        return { flag: "de", lang: "German" };
      } else if (locale == "cn") {
        ElLocale.use(cn);
        return { flag: "cn", lang: "繁体中文" };
      }
    },
  },
  methods: {
    updateLocale(locale) {
      this.$i18n.locale = locale;
      localStorage.setItem("locale", locale);
    },
  },
};
</script>

<style lang="scss" scoped>
.i18n-wrap {
  .i18n-wrap-txt {
    display: flex;
    align-items: center;
    justify-items: center;
  }
  img {
    width: 24px;
    margin-right: 5px;
  }
}
.i18-icon {
  width: 24px;
  vertical-align: middle;
  padding: 5px 0;
}
</style>