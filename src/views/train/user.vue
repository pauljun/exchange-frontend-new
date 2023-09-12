<template>
  <div class="app-container" v-loading="loading">
    <div class="filter-container">
      <el-form label-width="60px">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="关键字">
              <el-input
                style="width: 100%"
                v-model="queryParam.title"
                placeholder="请输入关键字"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="handleSearch"> 搜索 </el-button>
            <el-button @click="handleRefresh"> 重置 </el-button>
          </el-col>
        </el-row>
      </el-form>
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
      <el-table-column type="index" width="55" align="center" />
      <el-table-column prop="title" label="标题" align="center" />
      <el-table-column prop="answers" label="答案和试题" align="center">
      </el-table-column>
      <el-table-column prop="score" label="考试分数" align="center">
      </el-table-column>
      <el-table-column prop="points" label="积分" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="job">
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
      :title="title"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      @close="handleCancel"
      width="560px"
    >
      <el-form
        :ref="formName"
        label-width="70px"
        :model="formFieldsData"
        :rules="rules"
      >
        <!-- <el-form-item label="题库类型">
          <el-select v-model="type">
            <el-option :value="1" :label="1">选择题</el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="formFieldsData.title"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item label="选项" prop="content">
          <i
            v-if="formFieldsData.content.length <= 5"
            class="el-icon-circle-plus-outline"
            @click="addDomain"
          ></i>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in formFieldsData.content"
          :label="optionsConfig[index]"
          :key="domain.key"
          :prop="'content.' + index + '.val'"
          :rules="{
            required: true,
            message: '域名不能为空',
            trigger: 'blur',
          }"
        >
          <el-row>
            <el-col :span="16">
              <el-input v-model="domain.text"></el-input>
            </el-col>
            <el-col :span="8">
              <i
                class="el-icon-remove-outline"
                v-if="index === formFieldsData.content.length - 1"
                @click.prevent="removeDomain(domain)"
              ></i>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input
            v-model="formFieldsData.answer"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item label="积分" prop="points">
          <el-input
            v-model="formFieldsData.points"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formFieldsData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import formOperate from "@/layout/mixin/formOperate";
import { mapGetters } from "vuex";
import { VueEditor } from "vue2-editor";

export default {
  mixins: [formOperate],
  components: { VueEditor },
  data() {
    return {
      formName: "domain_record",
      optionsConfig: ["a", "b", "c", "d", "e", "f", "g", "h"],
      imageAction: process.env.VUE_APP_BASE_API + "/upload/image",
      queryParam: {
        title: "",
        status: "",
      },
      type: 1,
      url: this.$route.fullPath,
      formVisible: false,
      formFieldsData: {
        status: 1,
        title: "",
        content: [],
        points: "",
        answer: "",
      },
      // 表单验证
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        img: [{ required: true, message: "请上传封面图", trigger: "blur" }],
        content: [{ required: true, message: "请输入选项", trigger: "blur" }],
        answer: [{ required: true, message: "请输入答案", trigger: "blur" }],
        points: [{ required: true, message: "请输入积分", trigger: "blur" }],
      },
    };
  },
  created() {
    this.url = this.$route.fullPath;
  },
  computed: {
    ...mapGetters(["token"]),
    headers() {
      return {
        authorization: "Bearer " + this.token,
      };
    },
  },
  methods: {
    addDomain() {
      this.formFieldsData.content.push({
        text: "",
        val: this.optionsConfig[this.formFieldsData.content.length],
      });
    },
    removeDomain(item) {
      var index = this.formFieldsData.content.indexOf(item);
      if (index !== -1) {
        this.formFieldsData.content.splice(index, 1);
      }
    },
    disOrEnableRecord(record) {
      this.$http
        .put(this.url + "/" + record.id, {
          status: record.status,
        })
        .then((response) => {
          this.$message.success(response.message);
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.el-icon-circle-plus-outline {
  font-size: 20px;
  vertical-align: middle;
  cursor: pointer;
}
.el-icon-remove-outline {
  font-size: 20px;
  margin-left: 20px;
  color: red;
  cursor: pointer;
}
</style>