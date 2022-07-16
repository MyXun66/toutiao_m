<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        class="search-btn"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- 频道列表 -->
    <!-- 通过 swipeable 属性可以开启滑动切换标签页。
      通过 animated 属性可以开启切换标签内容时的转场动画。
     -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <!-- 文章列表 -->
        <article-list :channel="channel" />
      </van-tab>
      <!-- 占位 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 汉堡按钮 -->
      <div slot="nav-right" class="ham-btn" @click="isChannelEditShow = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :my-channels="channels"
        :channel-active="active"
        @update-active="onUpdateActive"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannel } from '@/api/user'
// 1加载列表组件
import ArticleList from './components/article-list.vue'
// 加频道列表编辑载弹出层
import ChannelEdit from './components/channelEdit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    // 2 注册列表组件
    ArticleList,
    ChannelEdit
  },
  props: {},
  data() {
    return {
      active: 0,
      channels: {}, // 频道列表数据
      isChannelEditShow: false // 控制编辑频道弹出层显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    // 加载列表数据
    this.loadChannels()
  },
  mounted() {},
  methods: {
    async loadChannels() {
      try {
        let channelss = []
        // const { data } = await getUserChannel()
        // this.channels = data.data.channels
        if (this.user) {
          const { data } = await getUserChannel()
          channelss = data.data.channels
        } else {
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            channelss = localChannels
          } else {
            const { data } = await getUserChannel()
            channelss = data.data.channels
          }
        }

        this.channels = channelss
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
    onUpdateActive(index, isChannelEditShow = false) {
      this.active = index
      this.isChannelEditShow = isChannelEditShow
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset !important;
    // max-width: none;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 18px;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      width: 66px;
      height: 80px;
      flex-shrink: 0;
    }
    .ham-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: '';
        width: 1px;
        position: absolute;
        left: 0;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        // 图片拉长显示
        background-size: contain;
      }
    }
  }
}
</style>
