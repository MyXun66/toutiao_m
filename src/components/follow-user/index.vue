<template>
  <van-button
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    v-if="!isFollowed"
    @click="onFollow"
    :loading="loading"
  >
    关注
  </van-button>
  <van-button
    class="follow-btn"
    round
    size="small"
    v-else
    @click="onFollow"
    :loading="loading"
    >已关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',
  components: {},
  model: {
    prop: 'isFollowed',
    event: 'update-is_followed'
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onFollow() {
      this.Loading = true
      try {
        if (this.isFollowed) {
          // 已关注
          await deleteFollow(this.userId)
        } else {
          // 未关注
          await addFollow(this.userId)
        }
        // 更新视图
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        console.log(err.response)
        if (err.response && err.response.status === 400) {
          this.$toast('用户不能关注自己')
        } else {
          this.$toast('操作失败，请重试')
        }
      }
      this.Loading = false
    }
  }
}
</script>
<style scoped lang="less"></style>
