<template>
  <div>
    <div class="top-panel">
      <el-button type="primary" @click="showEdit('add', 0)">新增板块</el-button>
    </div>
    <el-row :style="{ 'margin-top': '10px' }">
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>一级板块</span>
            </div>
          </template>
          <Table
            :columns="columns"
            :showPagination="false"
            :dataSource="tableData"
            :fetch="loadDataList"
            ref="dataTabelRef"
            :options="tableOptions"
            @rowClick="rowClick"
          >
            <!-- 封面 -->
            <template #cover="{ index, row }">
              <Cover :cover="row.cover"></Cover>
            </template>
            <!-- 板块信息 -->
            <template #boardInfo="{ index, row }">
              <div>板块名称：{{ row.boardName }}</div>
              <div>发帖权限：{{ postTypeMap[row.postType] }}</div>
            </template>
            <!-- 操作 -->
            <template #op="{ index, row }">
              <div class="op">
                <a href="javascript:void(0)" class="a-link" @click="showEdit('update', 0, row)"
                  >修改</a
                >
                <el-divider direction="vertical"></el-divider>
                <a href="javascript:void(0)" class="a-link" @click="del(row)">删除</a>
                <el-divider direction="vertical"></el-divider>
                <a
                  href="javascript:void(0)"
                  :class="[index == 0 ? 'not-allow' : 'a-link']"
                  @click="changeSort(index, 'up', 1)"
                  >上移</a
                >
                <el-divider direction="vertical"></el-divider>
                <a
                  href="javascript:void(0)"
                  :class="[index == tableData.list.length - 1 ? 'not-allow' : 'a-link']"
                  @click="changeSort(index, 'down', 1)"
                  >下移</a
                >
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>二级板块</span>
              <a href="javascript:void(0)" class="a-link" @click="showEdit('add', 1)"
                >新增二级板块</a
              >
            </div>
          </template>
          <Table
            :columns="columns"
            :showPagination="false"
            :dataSource="tableChildData"
            :options="tableOptions"
          >
            <!-- 封面 -->
            <template #cover="{ index, row }">
              <Cover :cover="row.cover"></Cover>
            </template>
            <!-- 板块信息 -->
            <template #boardInfo="{ index, row }">
              <div>板块名称：{{ row.boardName }}</div>
              <div>发帖权限：{{ postTypeMap[row.postType] }}</div>
            </template>
            <!-- 操作 -->
            <template #op="{ index, row }">
              <div class="op">
                <a href="javascript:void(0)" class="a-link" @click="showEdit('update', 1, row)"
                  >修改</a
                >
                <el-divider direction="vertical"></el-divider>
                <a href="javascript:void(0)" class="a-link" @click="del(row)">删除</a>
                <el-divider direction="vertical"></el-divider>
                <a
                  href="javascript:void(0)"
                  :class="[index == 0 ? 'not-allow' : 'a-link']"
                  @click="changeSort(index, 'up', 1)"
                  >上移</a
                >
                <el-divider direction="vertical"></el-divider>
                <a
                  href="javascript:void(0)"
                  :class="[index == tableChildData.list.length - 1 ? 'not-allow' : 'a-link']"
                  @click="changeSort(index, 'down', 1)"
                  >下移</a
                >
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
    </el-row>
    <!-- 新增修改弹窗 -->
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="550px"
      @close="dialogConfig.show = false"
    >
      <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="80px">
        <el-form-item label="一级板块" prop="boardName" v-if="formData.boardType == 1">
          {{ formData.pBoardName }}
        </el-form-item>
        <el-form-item label="板块名称" prop="boardName">
          <el-input placeholder="请输入名称" v-model="formData.boardName"></el-input>
        </el-form-item>
        <el-form-item label="发帖权限" prop="postType">
          <el-radio-group v-model="formData.postType">
            <el-radio :label="1">{{ postTypeMap[1] }}</el-radio>
            <el-radio :label="0">{{ postTypeMap[0] }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item label="简介" prop="boardDesc">
          <el-input
            v-model="formData.boardDesc"
            type="textarea"
            placeholder="请输入简介"
            :autosize="{ minRows: 4, maxRows: 4 }"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
const { proxy } = getCurrentInstance()
const api = {
  loadBoard: '/board/loadBoard',
  saveBoard: '/board/saveBoard',
  delBoard: '/board/delBoard',
  changeBoardSort: '/board/changeBoardSort',
}

const postTypeMap = {
  0: '只允许管理员发帖',
  1: '任何人可以发帖',
}

const columns = [
  {
    label: '封面',
    prop: 'cover',
    width: 80,
    scopedSlots: 'cover',
  },
  {
    label: '板块信息',
    prop: 'boardName',
    width: 210,
    scopedSlots: 'boardInfo',
  },
  {
    label: '简介',
    prop: 'boardDesc',
  },
  {
    label: '操作',
    prop: 'op',
    width: 190,
    scopedSlots: 'op',
  },
]

const tableData = ref({})
const tableOptions = {
  extHeight: 100,
}
// table对象
const dataTabelRef = ref()
// 二级板块
const tableChildData = ref({})
// 设置当前选中的板块
const currentBoard = ref(null)
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
  })
  if (!result) {
    return
  }
  tableData.value.list = result.data
  if (currentBoard.value == null && result.data.length > 0) {
    rowClick(result.data[0])
  } else {
    currentBoard.value = result.data.find((item) => {
      return (item.boardId = currentBoard.value.boardId)
    })
    rowClick(currentBoard.value)
  }
  nextTick(() => {
    dataTabelRef.value.setCurrentRow('boardId', currentBoard.value.boardId)
  })
}

const rowClick = (row) => {
  currentBoard.value = row
  tableChildData.value.list = row.children
}
const dialogConfig = reactive({
  show: false,
  title: '板块修改',
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: () => {
        submitForm()
      },
    },
  ],
})
const formData = ref({})
const formDataRef = ref()
const rules = {
  boardName: [{ required: true, message: '请输入板块名称' }],
  postType: [{ required: true, message: '请选择发帖权限' }],
}
// 弹框展示
const showEdit = (opType, boardType, data) => {
  dialogConfig.show = true
  nextTick(() => {
    formDataRef.value.resetFields()
    if (opType == 'add') {
      dialogConfig.title = boardType == 0 ? '新增板块' : '新增二级板块'
      formData.value = {}
    } else if (opType == 'update') {
      dialogConfig.title = boardType == 0 ? '修改板块' : '修改二级板块'
      formData.value = JSON.parse(JSON.stringify(data))
      if (formData.value.cover) {
        formData.value.cover = {
          imageUrl: formData.value.cover,
        }
      }
    }
    formData.value.boardType = boardType
    if (boardType == 1) {
      formData.value.pBoardName = currentBoard.value.boardName
      formData.value.pBoardId = currentBoard.value.boardId
    } else {
      formData.value.pBoardId = 0
    }
  })
}
const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, formData.value)
    delete params.children

    //封面不是文件类型，值为空，不更新
    if (!(params.cover instanceof File)) {
      delete params.cover
    }
    console.log(params)
    let result = await proxy.Request({
      url: api.saveBoard,
      params,
    })
    if (!result) {
      return
    }
    dialogConfig.show = false
    proxy.Message.success('保存成功')
    loadDataList()
  })
}
//删除
const del = (data) => {
  proxy.Confirm(`你确定要删除${data.boardName}`, async () => {
    let result = await proxy.Request({
      url: api.delBoard,
      params: {
        boardId: data.boardId,
      },
    })
    if (!result) {
      return
    }
    //如果删除当前选中的，清除选中
    if (currentBoard.value.boardId == data.boardId) {
      currentBoard.value = null
    }
    loadDataList()
  })
}

//修改排序
const changeSort = async (index, type, borderType) => {
  let dataList = tableData.list
  if (borderType == 1) {
    dataList = tableChildData.list
  }
  if ((type === 'down' && index === dataList.length - 1) || (type === 'up' && index === 0)) {
    return
  }
  let temp = dataList[index]
  let number = type == 'down' ? 1 : -1
  dataList.splice(index, 1)
  dataList.splice(index + number, 0, temp)

  let borderIdList = []
  dataList.forEach((element) => {
    borderIdList.push(element.boardId)
  })

  let result = await proxy.Request({
    url: api.changeBoardSort,
    params: {
      boardIds: borderIdList.join(','),
    },
  })

  if (!result) {
    return
  }
  proxy.Message.success('重新排序成功')
  loadDataList()
}
</script>

<style lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .a-link {
    font-size: 14px;
  }
}
</style>
