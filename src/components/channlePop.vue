<template>
  <div>
    <van-popup
      :value="value"
      @input="$emit('input', false)"
      position="bottom"
      :style="{ height: '80%' }"
    >
      <!-- 标签 -->
      <div>
        <van-cell title-class="mytitle" title="我的频道">
          <template slot="default">
            <van-button
              v-if="iconshow === false"
              @click="iconshow = true"
              type="default"
              class="fonts"
              size="small"
              color="linear-gradient(to right, #4bb0ff, #6149f6)"
              round
              >编辑</van-button
            >
            <van-button
              v-if="iconshow === true"
              @click="iconshow = false"
              type="default"
              class="fonts"
              size="small"
              color="linear-gradient(to left, #4bb0ff, #6149f6)"
              round
              >完成</van-button
            >
          </template>
        </van-cell>
        <!-- 频道内容 -->
        <van-grid>
          <van-grid-item
            v-for="(item, index) in channelsList"
            :key="index"
            class="channelitem"
          >
            <template slot="text">
              <div @click="changeActive(index)">
                <div
                  :class="{ active: index === activeTab }"
                  class="channeltext"
                >
                  {{ item.name }}
                </div>
                <van-icon
                  @click="delChannel(index)"
                  v-show="iconshow && index !== 0"
                  name="clear"
                  class="channelicon"
                />
              </div>
            </template>
          </van-grid-item>
        </van-grid>
      </div>
      <div>
        <van-cell title-class="mytitle" title="频道列表"> </van-cell>
        <!-- 频道内容 -->
        <van-grid>
          <van-grid-item
            v-for="(item, index) in otherChannel"
            :key="index"
            class="channelitem"
          >
            <template slot="text">
              <div @click="addChannel(item)" class="channeltext">
                {{ item.name }}
              </div>
            </template>
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { apiGetAllChannels } from '@/api/channle.js'
export default {
  props: ['value', 'channelsList', 'activeTab'],
  data () {
    return {
      iconshow: false,
      // 所有的频道数据
      allChannels: []
    }
  },
  methods: {
    // 获取所有的频道数据
    async getAllChannels () {
      let res = await apiGetAllChannels(this.$http, {
        url: '/channels',
        method: 'GET'
      })
      // 赋值给所有频道数据
      this.allChannels = res.channels
    },
    // 点击频道管理元素时触发
    changeActive (index) {
      this.$emit('update:activeTab', index)
    },
    // 添加频道
    addChannel (item) {
      // 解决添加频道后点击报错的BUG
      // 添加的频道也需要动态添加一些属性
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
      this.channelsList.push(item)
      // 是否登录
    },
    // 删除频道
    delChannel (index) {
      this.channelsList.splice(index, 1)
    }
  },
  computed: {
    // 根据用户频道得到其他剩余频道
    otherChannel: function () {
      let ids = this.channelsList.map(item => {
        return item.id
      })
      // 根据用户频道 id 集合得到剩余频道
      let newArr = this.allChannels.filter(item => {
        return !ids.includes(item.id)
      })
      return newArr
    }
  },
  created () {
    this.getAllChannels()
  }
}
</script>

<style lang="less" scoped>
.fonts {
  font-size: 16px;
}
.mytitle {
  font-size: 16px;
}
.channelitem {
  position: relative;
  .channeltext {
    color: #999;
    font-size: 14px;
  }
  .channelicon {
    position: absolute;
    top: 0;
    right: 0;
    color: #ccc;
  }
  .active {
    color: red;
  }
}
</style>
