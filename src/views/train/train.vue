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
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态">
              <el-select
                style="width: 100%"
                v-model="queryParam.status"
                placeholder="请选择状态"
              >
                <el-option :value="1" label="启用" />
                <el-option :value="2" label="禁用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="handleSearch"> 搜索 </el-button>
            <el-button @click="handleRefresh"> 重置 </el-button>
          </el-col>
          <el-col :span="13">
            <el-button class="fr" type="primary" @click="handleCreate()">
              新增
            </el-button>
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
      <el-table-column prop="points" label="积分" align="center" />
      <el-table-column prop="type" label="是否考试" align="center">
        <template slot-scope="record">
          <span>{{ record.row.type === 1 ? "考试" : "不考试" }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="problem_ids" label="关联问题" align="center" /> -->
      <!-- <el-table-column prop="class_ids" label="关联课程" align="center" /> -->
      <el-table-column prop="score" label="合格分数" align="center" />
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
      <el-table-column prop="created_at" label="创建时间" align="center" />
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
      width="560px"
      :close-on-click-modal="false"
      @close="handleCancel"
    >
      <el-form
        :ref="formName"
        label-width="80px"
        :model="formFieldsData"
        :rules="rules"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="formFieldsData.title" />
        </el-form-item>
        <el-form-item label="积分" prop="points">
          <el-input v-model="formFieldsData.points" />
        </el-form-item>
        <el-form-item label="是否考试" prop="type">
          <el-select style="width: 100%" v-model="formFieldsData.type">
            <el-option :value="1" label="考试" />
            <el-option :value="2" label="不考试" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联课程" prop="class_ids">
          <el-select
            filterable
            multiple
            style="width: 100%"
            v-model="formFieldsData.class_ids"
          >
            <el-option
              v-for="v in classList"
              :key="v.id"
              :value="v.id"
              :label="v.title"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联问题" prop="problem_ids">
          <el-select
            filterable
            multiple
            style="width: 100%"
            v-model="formFieldsData.problem_ids"
          >
            <el-option
              v-for="v in problemList"
              :key="v.id"
              :value="v.id"
              :label="v.title"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formFieldsData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="合格分数" prop="score">
          <el-input v-model="formFieldsData.score" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="formFieldsData.sort" />
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
      imageAction: process.env.VUE_APP_BASE_API + "/upload/image",
      queryParam: {
        title: "",
        status: "",
      },
      url: "/train/index",
      formVisible: false,
      cateList: [],
      formFieldsData: {
        status: 1,
        title: "",
        points: "",
        img: "",
        type: "",
        score: "",
        sort: "",
        class_ids: [],
        problem_ids: [],
      },
      problemList: [],
      classList: [],
      // 表单验证
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        points: [{ required: true, message: "请输入积分", trigger: "blur" }],
        type: [{ required: true, message: "请选择是否考试", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters(["token"]),
    headers() {
      return {
        authorization: "Bearer " + this.token,
      };
    },
  },
  created() {
    this.$http.get("/train/problem?limit=1000").then((res) => {
      if (res.code === 10000) {
        this.problemList = res.data;
      }
    });
    this.$http.get("/train/class?limit=1000").then((res) => {
      if (res.code === 10000) {
        this.classList = res.data;
      }
    });
  },
  methods: {
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
</style>