<template>
  <div class="top-panel">
    <el-form :model="searchFormData" label-width="50px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="昵称" prop="nickNameFuzzy">
            <el-input
              placeholder="请输入昵称"
              v-model="searchFormData.nickNameFuzzy"
              clearable
              @keyup.enter.native="loadDataList"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="性别" prop="sex">
            <el-select
              v-model="searchFormData.sex"
              clearable
              placeholder="请选择性别"
              :style="{ width: '100%' }"
            >
              <el-option :value="1" label="男"></el-option>
              <el-option :value="0" label="女"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="searchFormData.status"
              clearable
              placeholder="请选择状态"
              :style="{ width: '100%' }"
            >
              <el-option :value="1" label="正常"></el-option>
              <el-option :value="0" label="禁用"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="5" :style="{ 'padding-left': '10px' }">
          <el-button type="primary" @click="loadDataList">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <Table
    :columns="columns"
    :showPagination="true"
    :dataSource="tableData"
    :fetch="loadDataList"
    :options="tableOptions"
  >
    <!--封面-->
    <template #avatar="{ index, row }">
      <Avatar :userId="row.userId"></Avatar>
    </template>
    <template #nickName="{ index, row }">
      {{ row.nickName }}
      <span v-if="row.sex">({{ row.sex == 0 ? "女" : "男" }})</span>
    </template>
    <!--登录信息-->
    <template #loginInfo="{ index, row }">
      <div>最后登录时间：{{ row.lastLoginTime }}</div>
      <div>最后登录IP：{{ row.lastLoginIp }}</div>
      <div>最后登录地点：{{ row.lastLoginIpAddress }}</div>
    </template>
    <!--类型-->
    <template #integral="{ index, row }">
      <div>总积分：{{ row.totalIntegral }}</div>
      <div>当前积分：{{ row.currentIntegral }}</div>
    </template>

    <!--状态-->
    <template #status="{ index, row }">
      <span v-if="row.status == 1" :style="{ color: 'green' }">正常</span>
      <span v-else :style="{ color: 'red' }">禁用</span>
    </template>
    <template #op="{ index, row }">
      <div class="op" v-if="row.status != -1">
        <el-dropdown trigger="click">
          <span class="iconfont icon-more"> </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="updateUserStatus(row)">{{
                row.status == 1 ? "禁用" : "启用"
              }}</el-dropdown-item>
              <el-dropdown-item @click="sendMessage(row)"
                >发送系统消息</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
  </Table>
  <SendMessage ref="sendMessageRef" @reload="loadDataList"></SendMessage>
</template>

<script setup>
import SendMessage from "./SendMessage.vue";
import { getCurrentInstance, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/user/loadUserList",
  updateUserStatus: "/user/updateUserStatus",
};

//列表
const columns = [
  {
    label: "头像",
    prop: "avatar",
    width: 80,
    scopedSlots: "avatar",
  },
  {
    label: "昵称",
    prop: "nickName",
    width: 150,
    scopedSlots: "nickName",
  },
  {
    label: "邮箱",
    prop: "email",
    width: 180,
  },
  {
    label: "个人描述",
    prop: "personDescription",
  },
  {
    label: "加入时间",
    prop: "joinTime",
    width: 180,
  },
  {
    label: "登录信息",
    prop: "lastLoginTime",
    width: 260,
    scopedSlots: "loginInfo",
  },
  {
    label: "积分",
    prop: "totalIntegral",
    width: 150,
    scopedSlots: "integral",
  },
  {
    label: "状态",
    prop: "status",
    scopedSlots: "status",
    width: 60,
  },
  {
    label: "操作",
    prop: "op",
    width: 80,
    scopedSlots: "op",
  },
];
//搜索
const searchFormData = reactive({});
//列表
const tableData = ref({});
const tableOptions = {
  extHeight: 50,
};

const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };

  Object.assign(params, searchFormData);
  let result = await proxy.Request({
    url: api.loadDataList,
    params,
  });
  if (!result) {
    return;
  }
  tableData.value = result.data;
};

//禁用用户
const updateUserStatus = (data) => {
  const title = data.status == 1 ? "禁用" : "启用";
  proxy.Confirm(`你确定要${title}用户${data.nickName}`, async () => {
    let result = await proxy.Request({
      url: api.updateUserStatus,
      params: {
        userId: data.userId,
        status: data.status == 1 ? 0 : 1,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
  });
};

const sendMessageRef = ref();
const sendMessage = (row) => {
  sendMessageRef.value.sendMessage(row);
};
</script>

<style lang="scss">
.op {
  cursor: pointer;
}
</style>