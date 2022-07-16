<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败，请点击重试"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10,
      error: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      try {
        //  1获取数据
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.perPage,
          q: this.searchText
        })
        // console.log(data)
        const { results } = data.data
        //  2添加至数组列表
        this.list.push(...results)
        //  3本次加载中loading关闭
        this.loading = false
        //  4判断是否还有数据
        if (results.length) {
          //     有=》获取请求下页数据的页码
          this.page++
        } else {
          //     没有=》关闭
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
        this.$toast('获取数据失败，请稍后重试')
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
