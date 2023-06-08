<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :showCancel="false"
      @close="dialogConfig.show = false"
    >
      <div class="comment-list">
        <div class="comment-item" v-for="item in commentList">
          <div class="p-comment-item">
            <Avatar :userId="item.userId" :width="40"></Avatar>
            <div class="comment-info">
              <a
                :href="globalInfo.webDomain + 'user/' + item.userId"
                target="_blank"
                class="a-link"
              >
                {{ item.nickName }}
              </a>
              <div v-html="item.content" class="comment-content"></div>
              <div v-if="item.imgPath">
                <CommentImage
                  :src="item.imgPath.replace('.', '_.')"
                  :imageList="[globalInfo.imageUrl + item.imgPath]"
                ></CommentImage>
              </div>
              <div class="post-info">
                发布：{{ item.postTime }}&nbsp;&nbsp;{{ item.userIPaddress }}&nbsp;&nbsp;赞：{{
                  item.goodCount
                }}
              </div>
              <div v-if="item.children">
                <div class="s-comment-item" v-for="sub in item.children">
                  <Avatar :userId="sub.userId" :width="40"></Avatar>
                  <div class="comment-info">
                    <a
                      :href="globalInfo.webDomain + 'user/' + sub.userId"
                      target="_blank"
                      class="a-link"
                    >
                      {{ sub.nickName }}
                    </a>
                    <span v-if="sub.replyUserId">
                      回复：
                      <a
                        :href="globalInfo.webDomain + 'user/' + sub.replyUserId"
                        target="_blank"
                        class="a-link"
                      >
                        {{ sub.replyUserId }}
                      </a>
                    </span>
                    <div v-html="sub.content" class="comment-content"></div>
                    <div v-if="sub.imgPath">
                      <CommentImage
                        :src="sub.imgPath.replace('.', '_.')"
                        :imageList="[globalInfo.imageUrl + sub.imgPath]"
                      ></CommentImage>
                    </div>
                    <div class="post-info">
                      发布：{{ sub.postTime }}&nbsp;&nbsp;{{ sub.userIPaddress }}&nbsp;&nbsp;赞：{{
                        sub.goodCount
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="commentList.length == 0">暂无评论</div>
    </Dialog>
  </div>
</template>

<script setup>
import CommentImage from './CommentImage.vue'
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
const { proxy } = getCurrentInstance()

const dialogConfig = reactive({
  show: false,
  title: '查看评论',
  buttons: [
    {
      text: '关闭',
      type: 'primary',
      click: (e) => {
        dialogConfig.show = false
      },
    },
  ],
})

const api = {
  loadComment: '/forum/loadComment4Article',
}

const commentList = ref([])
const show = async (articleId) => {
  dialogConfig.show = true
  let result = await proxy.Request({
    url: api.loadComment,
    params: {
      articleId: articleId,
    },
  })
  if (!result) {
    return
  }
  commentList.value = result.data
}
defineExpose({ show })
</script>

<style lang="scss">
.comment-list {
  .comment-item {
    margin-top: 10px;
    border-bottom: 1px solid #ddd;
    padding: 10px 0px;
    .p-comment-item {
      display: flex;
    }
    .content-info {
      margin-left: 5px;
    }
    .comment-content {
      margin: 5px 0px;
    }
    .post-info {
      font-size: 12px;
      color: rgb(135, 130, 130);
    }
    .s-comment-item {
      display: flex;
      margin-top: 10px;
    }
  }
}
</style>
