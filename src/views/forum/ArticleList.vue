<template>
  <div>
    <div class="top-panel">
      <el-form :model="searchFormData" label-width="50px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="标题" prop="titleFuzzy">
              <el-input
                placeholder="请输入标题"
                v-model="searchFormData.titleFuzzy"
                clearable
                @keyup.native="loadDataList"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="昵称" prop="nickNameFuzzy">
              <el-input
                placeholder="请输入昵称"
                v-model="searchFormData.nickNameFuzzy"
                clearable
                @keyup.native="loadDataList"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="板块" prop="sex">
              <el-cascader
                placeholder="请选择板块"
                :options="boardList"
                :props="boardProps"
                clearable
                v-model="searchFormData.boardIds"
                :style="{ width: '100%' }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="附件" prop="sex">
              <el-select
                v-model="searchFormData.attachmentType"
                clearable
                placeholder="请选择"
                :style="{ width: '100%' }"
              >
                <el-option :value="1" label="有附件"></el-option>
                <el-option :value="0" label="无附件"></el-option>
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
                <el-option :value="-1" label="已删除"></el-option>
                <el-option :value="0" label="待审核"></el-option>
                <el-option :value="1" label="已审核"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="置顶" prop="topType">
              <el-select
                v-model="searchFormData.topType"
                clearable
                placeholder="请选择"
                :style="{ width: '100%' }"
              >
                <el-option :value="0" label="未置顶"></el-option>
                <el-option :value="1" label="已置顶"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :style="{ 'padding-left': '10px' }">
            <el-button-group>
              <el-button type="primary" @click="loadDataList">搜索</el-button>
              <el-button type="success" @click="auditBatch" :disabled="selectBatchList.length == 0"
                >批量审批</el-button
              >
              <el-button type="danger" @click="delBatch" :disabled="selectBatchList.length == 0"
                >批量删除</el-button
              >
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-list">
      <Table
        ref="tableRef"
        :columns="columns"
        :dataSource="tabelData"
        :fetch="loadDataList"
        :options="tableOptions"
        @rowSelected="setRowSelected"
      >
        <!-- 用户信息 -->
        <template #userInfo="{ index, row }">
          <div class="user-info">
            <Avatar :userId="row.userId" :width="50"></Avatar>
            <div class="name-info">
              <a
                :href="`${globalInfo.webDomain}user/${row.userId}`"
                target="_blank"
                class="a-link"
                >{{ row.nickName }}</a
              >
              <div>{{ row.userIpAddress }}</div>
            </div>
          </div>
        </template>
        <!--封面-->
        <template #cover="{ index, row }">
          <Cover :cover="row.cover"></Cover>
        </template>
        <!--标题-->
        <template #titleInfo="{ index, row }">
          <a
            class="a-link"
            target="_blank"
            tag="a"
            :href="proxy.globalInfo.webDomain + 'post/' + row.articleId"
            >{{ row.title }}</a
          >
        </template>
        <!--板块-->
        <template #boardInfo="{ index, row }">
          <div>
            <span>{{ row.pBoardName }}</span>
            <span v-if="row.boardName">/{{ row.boardName }}</span>
          </div>
        </template>
        <!--互动信息-->
        <template #interactionInfo="{ index, row }">
          <div>阅读：{{ row.readCount }}</div>
          <div>点赞：{{ row.goodCount }}</div>
          <div>
            评论：<span>{{ row.commentCount }}</span>
            <span
              class="a-link"
              :style="{ 'margin-left': '5px' }"
              @click="showComment(row.articleId)"
              v-if="row.commentCount"
              >查看</span
            >
          </div>
        </template>
        <!--附件信息-->
        <template #attachmentInfo="{ index, row }">
          <div v-if="row.attachmentType == 0">无附件</div>
          <div v-if="row.attachmentType == 1">
            <span @click="showAttachment(row.nickName, row.articleId)" class="a-link"
              >查看附件</span
            >
          </div>
        </template>
        <!--状态-->
        <template #statusInfo="{ index, row }">
          <span v-if="row.status == -1" :style="{ color: 'red' }">已删除</span>
          <span v-if="row.status == 0" :style="{ color: 'red' }">待审核</span>
          <span v-if="row.status == 1" :style="{ color: 'green' }">已审核</span>
          <div v-if="row.topType == 1" :style="{ color: 'green' }">已置顶</div>
          <div v-if="row.topType == 0" :style="{ color: 'green' }">未置顶</div>
        </template>
        <!--操作信息-->
        <template #op="{ index, row }">
          <div class="op" v-if="row.status != -1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"> </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="updateBoard(row)">修改板块</el-dropdown-item>
                  <el-dropdown-item
                    @click="topArticle(row)"
                    v-if="row.topType == 1 && row.status == 1"
                    >取消置顶</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="topArticle(row)"
                    v-if="row.topType == 0 && row.status == 1"
                    >置顶</el-dropdown-item
                  >
                  <el-dropdown-item @click="delArticle(row)">删除</el-dropdown-item>
                  <el-dropdown-item @click="audit(row)" v-if="row.status == 0"
                    >审核</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
    <ArticleBoard ref="articleBoardRef" @reload="loadDataList"></ArticleBoard>
    <ArticleAttachment ref="attachmenttRef"></ArticleAttachment>
    <ArticleComment ref="commentRef"></ArticleComment>
  </div>
</template>

<script setup>
import ArticleComment from './ArticleComment.vue';
import ArticleAttachment from './ArticleAttachment.vue';
import ArticleBoard from './ArticleBoard.vue';
import { ref, reactive, getCurrentInstance ,toRaw} from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const api = {
  loadDataList: '/forum/loadArticle',
  loadBoard: '/board/loadBoard',
  delArticle: '/forum/delArticle',
  topArticle: '/forum/topArticle',
  auditArticle: '/forum/auditArticle',
}
//列表
const columns = [
  {
    label: '用户信息',
    prop: 'avatar',
    width: 200,
    scopedSlots: 'userInfo',
  },
  {
    label: '封面',
    width: 100,
    prop: 'cover',
    scopedSlots: 'cover',
  },
  {
    label: '标题',
    scopedSlots: 'titleInfo',
  },
  {
    label: '板块',
    width: 200,
    scopedSlots: 'boardInfo',
  },
  {
    label: '互动信息',
    width: 150,
    scopedSlots: 'interactionInfo',
  },
  {
    label: '是否有附件',
    prop: 'attachment',
    width: 100,
    scopedSlots: 'attachmentInfo',
  },
  {
    label: '状态信息',
    prop: 'status',
    width: 100,
    scopedSlots: 'statusInfo',
  },
  {
    label: '发布时间',
    prop: 'postTime',
    width: 180,
  },
  {
    label: '操作',
    prop: 'op',
    width: 80,
    scopedSlots: 'op',
  },
]
//搜索
const searchFormData = reactive({})
const tabelData = ref({})
const tableOptions = {
  extHeight: 100,
  selectType: 'checkbox',
}
const loadDataList = async () => {
  let params = {
    pageNo: tabelData.value.pageNo,
    pageSize: tabelData.value.pageSize
  }
  Object.assign(params, searchFormData);
  params.boardIds = toRaw(params.boardIds) || [];
  if (params.boardIds.length == 1) {
    params.pBoardId = params.boardIds[0];
  } else if (params.boardIds.length == 2) {
    params.pBoardId = params.boardIds[0];
    params.boardId = params.boardIds[1];
  }
  delete params.boardIds;
  let result = await proxy.Request({
    url: api.loadDataList,
    params,
  })
  if (!result) {
    return
  }
  tabelData.value = result.data
}
//获取板块
const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: 'boardId',
  label: 'boardName',
}
const boardList = ref([])
const loadBoardList = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
  })
  if (!result) {
    return
  }
  boardList.value = result.data
}
loadBoardList()

//修改板块
const articleBoardRef = ref()
const updateBoard = (row) => {
  articleBoardRef.value.updateBoard(row)
}

//查看附件
const attachmenttRef = ref()
const showAttachment = (nickName, articleId) => {
  attachmenttRef.value.show(nickName, articleId)
}
//查看评论
const commentRef = ref()
const showComment = (articleId) => {
  commentRef.value.show(articleId)
}

//审核
const audit = (data) => {
  proxy.Confirm(`你确定要审核【${data.title}】吗？`, async () => {
    let result = await proxy.Request({
      url: api.auditArticle,
      params: {
        articleIds: data.articleId,
      },
    })
    if (!result) {
      return
    }
    loadDataList()
  })
}

//删除
const delArticle = (data) => {
  proxy.Confirm(`你确定要删除【${data.title}】`, async () => {
    let result = await proxy.Request({
      url: api.delArticle,
      params: {
        articleIds: data.articleId,
      },
    })
    if (!result) {
      return
    }
    loadDataList()
  })
}

//置顶
const topArticle = (data) => {
  const opName = data.topType == 0 ? '设为置顶' : '取消置顶'
  proxy.Confirm(`你确定要将【${data.title}】 ${opName}`, async () => {
    let result = await proxy.Request({
      url: api.topArticle,
      params: {
        topType: data.topType == 0 ? 1 : 0,
        articleId: data.articleId,
      },
    })
    if (!result) {
      return
    }
    loadDataList()
  })
}
// 批量选择
const selectBatchList = ref([])
const setRowSelected = (rows) => {
  selectBatchList.value = []
  rows.forEach((element) => {
    selectBatchList.value.push(element.articleId)
  })
  console.log(selectBatchList.value)
}

const tableRef = ref()
//批量审核
const auditBatch = (data) => {
  proxy.Confirm(`你确定要批量审核吗？`, async () => {
    let result = await proxy.Request({
      url: api.auditArticle,
      params: {
        articleIds: selectBatchList.value.join(','),
      },
    })
    if (!result) {
      return
    }
    tableRef.value.clearSelection()
    loadDataList()
  })
}

//批量删除
const delBatch = (data) => {
  proxy.Confirm(`你确定要批量删除吗？`, async () => {
    let result = await proxy.Request({
      url: api.delArticle,
      params: {
        articleIds: selectBatchList.value.join(','),
      },
    })
    if (!result) {
      return
    }
    tableRef.value.clearSelection()
    loadDataList()
  })
}
</script>

<style lang="scss" scoped>

.data-list {
  .user-info {
    display: flex;
    align-items: center;
    .name-info {
      margin-left: 5px;
      font-size: 13px;
    }
  }
  .op {
    .iconfont {
      cursor: pointer;
    }
  }
}
</style>
