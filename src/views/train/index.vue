<template>
  <div class="app-container" v-loading="loading">
    <div class="filter-container">
      <el-form label-width="60px" inline>
            <el-form-item label="关键字">
              <el-input
                style="width: 100%"
                v-model="queryParam.title"
                placeholder="请输入关键字"
                clearable
              />
            </el-form-item>
            <el-form-item label="期数">
              <el-select
                style="width: 100%"
                v-model="queryParam.number"
                clearable
                placeholder="请选择期数"
              >
                <el-option :value="1" label="第一期培训" />
                <el-option :value="2" label="第二期培训" />
                <el-option :value="3" label="第三期培训" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                style="width: 100%"
                v-model="queryParam.status"
                clearable
                placeholder="请选择状态"
              >
                <el-option :value="1" label="启用" />
                <el-option :value="2" label="禁用" />
              </el-select>
            </el-form-item>
            <el-button type="primary" @click="handleSearch"> 搜索 </el-button>
            <el-button @click="handleRefresh"> 重置 </el-button>
            <el-button class="fr" type="primary" @click="handleCreate()">
              新增
            </el-button>
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
      <el-table-column prop="content" label="选项" align="center">
        <template slot-scope="record">
          <div v-for="item in record.row.content" :key="item.val">
            {{ item.val }}: {{ item.text }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="answer" label="答案" align="center" />
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="record">
          <el-switch
            v-model="record.row.status"
            :active-value="1"
            :inactive-value="2"
            @change="disOrEnableRecord(record.row)"
          />
        </template>
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
        <el-form-item label="期数" prop="number">
          <el-select
            style="width: 100%"
            v-model="formFieldsData.number"
            clearable
            placeholder="请选择期数"
          >
            <el-option :value="1" label="第一期培训" />
            <el-option :value="2" label="第二期培训" />
            <el-option :value="3" label="第三期培训" />
          </el-select>
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
            message: '内容不能为空',
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
      optionsConfig: ["A", "B", "C", "D", "E", "F", "G", "H"],
      imageAction: process.env.VUE_APP_BASE_API + "/upload/image",
      defaultQueryParam: ["number"],
      queryParam: {
        title: "",
        status: "",
        number: "",
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
        number: "",
      },
      // 表单验证
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        img: [{ required: true, message: "请上传封面图", trigger: "blur" }],
        content: [{ required: true, message: "请输入选项", trigger: "blur" }],
        answer: [{ required: true, message: "请输入答案", trigger: "blur" }],
        points: [{ required: true, message: "请输入积分", trigger: "blur" }],
        number: [{ required: true, message: "请选择期数", trigger: "blur" }],
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
    beforeSubmit() {
      this.formFieldsData.content.map((v) => {
        v.val = v.val.toUpperCase();
        return v;
      });
      console.log(this.formFieldsData.content);
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