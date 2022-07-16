<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(option, index) in suggestions"
      :key="index"
      :title="option"
      icon="search"
      @click="$emit('search', option)"
    >
      <!-- <div slot="title" v-html="hightlight(option)"></div> -->
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: [],
      htmlStr: 'Hello <span style="color: red">World</span>'
    }
  },
  computed: {},
  watch: {
    searchText: {
      //   // 名称固定
      //   handler(value) {
      //     this.loadSearchSuggestion(value)
      //   },
      //   debounce防抖，延迟200ms调用请求
      handler: debounce(function (value) {
        this.loadSearchSuggestion(value)
      }, 200),
      //   监听开始后立即调用
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSuggestion(q) {
      try {
        const { data } = await getSearchSuggestion(q)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    }
    // 高亮函数
    // hightlight(option) {
    //   console.log(option)
    //   // 创建正则表达式
    //   // RegExp 是原生 JavaScript 的内置构造函数
    //   // 参数1：字符串，注意，这里不要加 //
    //   // 参数2：匹配模式，g 全局，i 忽略大小写
    //   if (this.suggestions.length < 1) return option
    //   else {
    //     const reg = new RegExp(this.searchText, 'gi')
    //     return option.replace(
    //       reg,
    //       `<span class="active">${this.searchText}</span>`
    //     )
    //   }
    // }
  }
}
</script>
<style scoped lang="less">
.search-suggestion {
  /deep/span.active {
    color: #3296fa;
  }
}
</style>
