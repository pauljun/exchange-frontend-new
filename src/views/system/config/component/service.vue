<template>
  <div class="app-container">
    <el-form ref="form" :model="form">
      <el-divider content-position="left"
        ><h3>
          阿里 OSS 配置 (<a
            href="https://help.aliyun.com/product/31815.html"
            target="_blank"
            >请认真阅读 OSS 相关配置</a
          >)
        </h3></el-divider
      >
      <el-form-item label="prefix" :label-width="200" style="width: 600px">
        <el-input
          v-model="form.prefix"
          placeholder="prefix"
          autocomplete="off"
          clearable
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Basic",
  data() {
    return {
      form: {},
    };
  },
};
</script>