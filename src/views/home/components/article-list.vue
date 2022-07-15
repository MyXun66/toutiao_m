<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="successText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 导入加载文章列表
import { getArticles } from '@/api/article'
// 导入显示文章模块
import ArticleItem from '@/components/article-item/index.vue'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], // 存储列表数据
      loading: false, // 控制加载中加载中效果
      finished: false, // 控制数据加载结束状态
      timestamp: null, // 请求下一页的时间戳
      error: false, // 请求失败修饰符,列表加载失败状态
      //   下拉刷新相关
      isLoading: false, // 控制下拉刷新的loading状态
      successText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化或滚动到底部时会触发
    // 如果一次请求加载的数据条数较少，
    // 导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。
    // 因此你需要调整每次获取的数据条数，理想情况下每次请求获取的数据条数应能够填满一屏高度。
    // onLoad() {
    // 异步更新数据
    // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    // for (let i = 0; i < 10; i++) {
    //   this.list.push(this.list.length + 1)
    // }
    // 加载状态结束
    // this.loading = false
    // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       this.finished = true
    //     }
    //   }, 1000)
    async onLoad() {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          // 上一段文章中最后一个文章的时间戳, 用于获取下一页数据, (简单理解为页码)
          // 请求第二页的时间戳会在当前请求结果返回
          timestamp: this.timestamp || Date.now()
        })
        // 模拟请求出错的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('sgduabd')
        // }

        // 结构返回的data数据
        const { results } = data.data
        // 存入list数组
        // ...为数组展开符,将数组元素一个一个拿出来
        this.list.push(...results)
        // 本次加载完成后加载状态置为false
        this.loading = false
        // 判断数据是否全部加载完成
        if (results.length) {
          // 还有数据,获取请求下一页的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没用数据了,将finished设置为true
          this.finished = true
        }
      } catch (err) {
        // console.log('请求失败')
        this.error = true
        this.loading = false
      }
    },
    // 下拉刷新触发事件
    async onRefresh() {
      try {
        // 1请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          // 上一段文章中最后一个文章的时间戳, 用于获取下一页数据, (简单理解为页码)
          // 请求第二页的时间戳会在当前请求结果返回
          timestamp: Date.now() // 下拉刷新每次获取最新数据,所有传入最新时间戳
        })
        // 2数据放入列表顶部
        this.list.unshift(...data.data.results)
        // 3isloading为false(不显示加载中)
        this.isLoading = false
        // 4.更新下拉刷新提示文本
        this.successText = `刷新成功,更新了${data.data.results.length}条数据`
      } catch (err) {
        // console.log('请求失败')
        this.loading = false
        this.successText = '刷新失败'
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
