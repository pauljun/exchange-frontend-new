<template>
  <div class="app-container" v-loading="loading">
    <div class="filter-container">
      <el-form label-width="60px" :inline="true">
        <el-form-item label="关键字">
          <el-input style="width: 100%" v-model="queryParam.title" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select style="width: 100%" v-model="queryParam.status">
            <el-option :value="1" label="启用" />
            <el-option :value="2" label="禁用" />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="handleSearch" icon="el-icon-search">
          搜索
        </el-button>
        <el-button @click="handleRefresh" icon="el-icon-refresh">
          重置
        </el-button>
        <el-button
          icon="el-icon-plus"
          class="fr"
          type="primary"
          @click="handleCreate()"
        >
          新增
        </el-button>
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
      <el-table-column prop="title" sortable label="标题" align="center" />
      <el-table-column prop="readtime" label="学习时长" align="center" />
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
      <el-table-column prop="sort" label="排序" sortable align="center" />
      <el-table-column
        prop="created_at"
        sortable
        label="创建时间"
        align="center"
      />
      <el-table-column prop="views" label="浏览量" align="center" />
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="job">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleUpdate(job.row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(job.row.id)"
          >
            删除
          </el-button>
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
      top="50px"
      :title="title"
      :visible.sync="formVisible"
      width="960px"
      :close-on-click-modal="false"
      @close="handleCancel"
    >
      <el-form
        :ref="formName"
        label-width="100px"
        :model="formFieldsData"
        :rules="rules"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="formFieldsData.title" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
            />
            <Editor
              style="height: 400px; overflow-y: hidden"
              v-model="formFieldsData.content"
              :defaultConfig="editorConfig"
              @onCreated="onCreated"
            />
          </div>
        </el-form-item>
        <el-form-item label="积分" prop="points">
          <el-input v-model="formFieldsData.points" />
        </el-form-item>
        <el-form-item label="学习时长" prop="readtime">
          <el-input v-model="formFieldsData.readtime" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formFieldsData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
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
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { getToken } from "@/utils/auth";

export default {
  mixins: [formOperate],
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      toolbarConfig: {},
      defaultQueryParam: ["number"],
      editorConfig: {
        placeholder: "请输入内容...",
        MENU_CONF: {
          uploadImage: {
            server: process.env.VUE_APP_BASE_API + "/upload/image",
            fieldName: "file",
            headers: {
              authorization: "Bearer " + getToken(),
            },
            customInsert(res, insertFn) {
              insertFn(res.data, "", "");
            },
          },
          uploadVideo: {
            server: process.env.VUE_APP_BASE_API + "/upload/file",
            fieldName: "file",
            headers: {
              authorization: "Bearer " + getToken(),
            },
            customInsert(res, insertFn) {
              insertFn(res.data, "");
            },
          },
        },
      },
      formName: "domain_record",
      imageAction: process.env.VUE_APP_BASE_API + "/upload/image",
      queryParam: {
        title: "",
        status: "",
        number: this.$route.path.split("/")[3],
      },
      url: "/train/develop",
      formVisible: false,
      formFieldsData: {
        status: 1,
        title: "",
        content: "",
        sort: "",
        points: "",
        readtime: 60,
        number: this.$route.path.split("/")[3],
      },
      // 表单验证
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor);
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
  max-width: 120px;
  max-height: 120px;
  display: block;
}
</style>