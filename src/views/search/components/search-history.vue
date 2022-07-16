<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <template v-if="isDeleteShow">
        <span @click="histories = []">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </template>
      <van-icon v-else name="delete" @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in histories"
      :key="index"
      @click="onHistoryClick(item, index)"
    >
      <van-icon v-show="isDeleteShow" name="close"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDeleteShow: false,
      histories: this.searchHistories
    }
  },
  computed: {},
  watch: {
    histories: {
      handler: function (value) {
        // console.log(value)
        this.$emit('updateHistories', value)
        // console.log(this.histories)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    onHistoryClick(item, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.histories.splice(index, 1)
        // console.log('删除操作')
        // console.log(`this.isDeleteShow${this.isDeleteShow}`)
      } else {
        // 否则执行搜索操作
        // console.log('搜索操作')
        this.$parent.onSearch(item)
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
