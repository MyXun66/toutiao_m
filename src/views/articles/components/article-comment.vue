<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="err"
      error-text="加载失败,请点击重试"
    >
      <van-cell v-for="(item, index) in list" :key="index">
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d" slot="title">{{ item.aut_name }}</span>
        <div slot="label">
          <p style="color: #363636">{{ item.content }}</p>
          <p>
            <span style="margin-right: 10px">{{
              item.pubdate | relativeTime
            }}</span>
            <van-button size="mini" type="default">回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" name="like-o" />
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容">
        <van-button slot="button" size="mini" type="info">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
export default {
  name: 'ArticleComment',
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 获取下页数据的标记
      limit: 10,
      err: false
    }
  },
  created() {
    this.onLoad()
  },
  methods: {
    async onLoad() {
      try {
        //  1 请求获取数据
        const { data } = await getComments({
          type: 'a',
          source: this.source,
          offset: this.offset,
          limit: this.limit
        })
        //  2 将数据添加到列表
        // console.log(data)
        const { results } = data.data
        this.list.push(...results)
        //  2.1把评论总数量返回给父组件
        this.$emit('onload-success', data.data)
        //  3 loading设置为false
        this.loading = false
        //  4 判断是否还有数据
        if (results.length) {
          // 更新获取下页数据的标记
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        this.err = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
