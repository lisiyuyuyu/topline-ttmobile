<template>
  <!-- 弹出框 -->
  <van-dialog
    class="mydialog"
    :value="value"
    :show-cancel-button="false"
    :show-confirm-button="false"
  >
    <van-cell-group v-if="isShow === false">
      <van-cell title="">
        <template slot="right-icon">
          <van-icon title="" name="cross" @click="$emit('input', false)" />
        </template>
      </van-cell>
      <van-cell icon="smile-o" title="隐藏此文章" @click="hideArticle" />
      <van-cell
        icon="smile-o"
        @click="isShow = true"
        title="举报此文章"
        is-link
      />
      <van-cell icon="smile-o" title="拉黑此作者" @click="blackList" />
    </van-cell-group>
    <van-cell-group v-if="isShow === true">
      <van-cell @click="isShow = false">
        <template slot="icon">
          <van-icon name="arrow-left" />
        </template>
      </van-cell>
      <!-- 举报的类型 -->
      <van-cell
        @click="reports(item.id)"
        v-for="(item, index) in type"
        :key="index"
        icon="location-o"
        :title="item.name"
      />
    </van-cell-group>
  </van-dialog>
</template>

<script>
// 导入请求路由的接口
import { apiReportArticle, apiNotLikeArticle } from '@/api/article'
// 导入拉黑接口
import { apiBlackList } from '@/api/user'
export default {
  props: ['value', 'currentArticle', 'articleList'],
  data () {
    return {
      // 举报类型
      type: [
        { id: 0, name: '其他问题' },
        { id: 1, name: '标题夸张' },
        { id: 2, name: '低俗色情' },
        { id: 3, name: '错别字多' },
        { id: 4, name: '旧闻重复' },
        { id: 5, name: '广告软文' },
        { id: 6, name: '内容不实' },
        { id: 7, name: '涉嫌违法犯罪' },
        { id: 8, name: '侵权' }
      ],
      // 是否显示举报类型
      isShow: false
    }
  },
  methods: {
    // 隐藏文章
    async hideArticle () {
      // 将当前文章从数据源中删除
      this.articleList.forEach((item, index) => {
        // 判断：当前的文章的 id 与数据源中 对应的数据匹配时 才需要删除
        if (item.art_id === this.currentArticle.art_id) {
          // 将文件删除
          this.articleList.splice(index, 1)
        }
      })
      // 关闭当前面板
      this.$emit('input', false)
      // 提示隐藏成功
      this.$toast.success('隐藏成功')
      // 判断用户是否登录
      let user = this.$store.state.user
      if (user) {
        let res = await apiNotLikeArticle(this.$http, {
          url: `/article/dislikes/${this.currentArticle.art_id}`,
          method: 'DELETE'
        })
        console.log(res)
      }
    },
    // 举报文章
    async reports (type) {
      // ----------------------------------------
      console.log(this.currentArticle)
      console.log(type)
      // 得到要举报的文章
      // 将文章信息提交到服务器
      let res = await apiReportArticle(this.$http, {
        target: this.currentArticle.art_id, // 要举报的文章 id
        type: type
      })
      console.log(res)
      // 回退到更多操作选项
      this.isShow = false
      // 关闭面板
      this.$emit('input', false)
      // 告诉用户举报成功
      this.$toast('举报成功')
    },
    // 加入黑名单
    async blackList () {
      // 得到被拉黑的作者 id
      let authorId = this.currentArticle.aut_id
      // 提交到服务器
      let res = await apiBlackList(this.$http, authorId)
      console.log(res)
      this.$emit('input', false)
      this.$toast.success('拉黑成功')
    }
  }
}
</script>

<style>
.mydialog {
  padding-bottom: 20px;
}
</style>
