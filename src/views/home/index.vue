<template>
  <div class="home">
    <van-nav-bar title="首页" fixed />
    <div class="mytabs">
      <van-tabs v-model="activeTab">
        <van-tab
          v-for="(item, index) in channelsList"
          :key="index"
          :title="item.name"
        >
          <!-- v-model：pull 的加载状态 true 正在加载 false 加载完毕 -->
          <van-pull-refresh v-model="item.pull" @refresh="onRefresh">
            <van-list
              v-model="item.up"
              :finished="item.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell
                class="mycell"
                v-for="(subitem, subindex) in item.articleList"
                :key="subindex"
                :title="subitem.title"
                title-class="mytitle"
              >
                <template slot="label">
                  <!-- 图片 -->
                  <van-grid
                    v-if="subitem.cover.type > 0"
                    :border="false"
                    :column-num="3"
                  >
                    <van-grid-item
                      v-for="(imgitem, imgindex) in subitem.cover.images"
                      :key="imgindex"
                    >
                      <van-image lazy-load :src="imgitem" />
                    </van-grid-item>
                  </van-grid>
                  <!-- 结构：作者，评论数，时间 -->
                  <div class="other">
                    <div class="other-left">
                      <span>{{ subitem.aut_name }}</span>
                      <span>{{ subitem.comm_count }} 评论</span>
                      <!-- 使用过滤器处理时间 -->
                      <span>{{ subitem.pubdate | relativetime }}</span>
                    </div>
                    <div class="other-right">
                      <van-icon
                        @click="openmore(subitem, item.articleList)"
                        name="cross"
                      />
                    </div>
                  </div>
                </template>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
      <!-- 添加一个小图标 -->
      <div class="tab-icon">
        <van-icon @click="openPop" name="wap-nav" />
      </div>
    </div>
    <channelpop
      v-model="show"
      :activeTab.sync="activeTab"
      :channelsList="channelsList"
    />
    <moredialog
      v-model="moreshow"
      :currentArticle="currenItem"
      :articleList="itemList"
    />
  </div>
</template>

<script>
// 导入请求频道的方法
import { apiGetChannelList } from '@/api/channle'
// 导入请求文章的方法
import { apiGetChannelArticle } from '@/api/article'
// 导入频道管理组件
import channelpop from '@/components/channlePop'
// 导入更多操作组件
import moredialog from '@/components/moredialog'
export default {
  data () {
    return {
      // 得到的频道数据
      channelsList: [],
      // 默认选中的频道下标
      activeTab: 0,
      // list中 finished
      finished: false,
      // list 中的 v-model
      loading: false,
      // 下拉刷新组件的状态
      isLoading: false,
      // 控制弹窗的显隐
      show: false,
      // 控制弹窗的显隐
      moreshow: false,
      // 当前操作的数据对象
      currenItem: {},
      // 当前显示的数据源
      itemList: []

    }
  },
  methods: {
    // 请求频道列表
    async getChannelList () {
      try {
        // 得到用户信息
        let user = this.$store.state.user
        // 判断用户是否登录：
        if (!user) {
          // 没有登录，需要判断是否存在 Localstorage 中存在数据
          let channles = JSON.parse(window.localStorage.getItem('channles'))
          if (channles) {
            // 直接赋值给 channlesList
            this.channelsList = channles
          } else {
            let res = await apiGetChannelList(this.$http, {
              url: '/user/channels',
              method: 'GET'
            })
            // 将返回的数据进行保存
            this.channelsList = res.channels
          }
        } else {
          // 没有数据：请求服务器
          let res = await apiGetChannelList(this.$http, {
            url: '/user/channels',
            method: 'GET'
          })
          // 将返回的数据进行保存
          this.channelsList = res.channels
        }
        // 动态向 channlesLIst 中添加额外的属性
        this.addProtoToChannles()
      } catch {
        this.$toast.fail('获取信息失败')
      }
    },
    addProtoToChannles () {
      this.channelsList.forEach(item => {
        // 下拉状态
        this.$set(item, 'pull', false)
        // 上拉的状态
        this.$set(item, 'up', false)
        // 数据完结的状态
        this.$set(item, 'finished', false)
        // 文章数据的集合
        this.$set(item, 'articleList', [])
        // 添加一个 timestampe
        this.$set(item, 'timestamp', 0)
      })
      console.log(this.channelsList)
    },
    // list中的 load事件
    async onLoad () {
      // 页面刷新时 会触发load事件
      let channel = this.channelsList[this.activeTab]
      console.log(channel)
      // 得到当前选中的频道的id
      let channelId = channel.id
      // 定义一个 timestamp
      let timestamp
      // 判断：是否第一次请求
      if (channel.timestamp === 0) {
        timestamp = Date.now()
      } else {
        timestamp = channel.timestamp
      }

      // 请求当前选中频道中的文章列表
      let res = await apiGetChannelArticle(this.$http2, {
        url: '/articles',
        method: 'GET',
        query: {
          channel_id: channelId, // 频道 id
          timestamp: timestamp, // 时间戳（相当于分页的标识）
          with_top: 0 // 不置顶 1：置顶消息
        }
      })
      // 保存到 channel 中
      channel.articleList = [...channel.articleList, ...res.results]
      // 保存timestamp
      channel.timestamp = res.pre_timestamp
      // 判断返回的数据是否为空
      if (res.pre_timestamp === null) {
        // 说明数据已经加载完成
        channel.finished = true
      }
      // 手动停止加载状态
      channel.up = false
    },
    // 下拉时刷新
    onRefresh () {
      // 得到当前选中的频道
      let channel = this.channelsList[this.activeTab]
      // 清除原来的数据
      channel.articleList = []
      // 将时间戳设置 0
      channel.timestamp = 0
      channel.finished = false
      channel.up = false
      // 手动获取数据
      this.onLoad()
      // 将加载状态重置为 false
      channel.pull = false
    },
    // 打开频道列表面板
    openPop () {
      this.show = true
    },
    // 打开更多操作
    openmore (subitem, itemList) {
      // 打开更多操作的面板
      this.moreshow = true
      // 得到当前文章
      // 得到当前显示的文章数据源
      this.currenItem = subitem
      this.itemList = itemList
    }
  },
  created () {
    this.getChannelList()
  },
  components: {
    channelpop,
    moredialog
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar.van-hairline--bottom {
  background: #3296fa;
  .van-nav-bar__title.van-ellipsis {
    color: #fff;
  }
}

.mytabs {
  position: relative;
  .tab-icon {
    position: fixed;
    top: 50px;
    right: 0;
    width: 10%;
    height: 44px;
    text-align: center;
    line-height: 44px;
    font-size: 26px;
  }
}

.home {
  margin-top: 100px;
  margin-bottom: 50px;
}

// 在组件之外修改组件内部的样式：起不到作用的
.home /deep/ .van-tabs__wrap {
  width: 90% !important;
  position: fixed;
  top: 50px;
  left: 0;
  z-index: 1000;
}
.mytitle {
  font-size: 16px;
  font-weight: 700;
}
.other {
  display: flex;
  justify-content: space-between;
  .other-left {
    span {
      margin: 0 10px;
      font-weight: 400;
    }
  }
}
</style>
