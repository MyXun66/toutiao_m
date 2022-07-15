<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        @click="isEdit = !isEdit"
        type="danger"
        plain
        round
        size="mini"
        class="edit-btn"
      >
        {{ isEdit ? '完成' : '编辑' }}
      </van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        v-for="(channel, index) in myChannels2"
        :key="channel.id"
        class="grid-item"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          v-show="isEdit && !fiexChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span
          slot="text"
          class="text"
          :class="{ active: index === channelActive }"
          >{{ channel.name }}</span
        >
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        v-for="(rechannel, index) in recommendChannels"
        :key="index"
        icon="plus"
        :text="rechannel.name"
        class="grid-item"
        @click="onAddChannel(rechannel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannels } from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    channelActive: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [],
      myChannels2: this.myChannels, // 将传递过来的用户频道赋值给myChannels2
      isEdit: false,
      fiexChannels: [0], // 固定频道不能删除
      userData: []
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels() {
      return this.allChannels.filter((channel) => {
        return !this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id
        })
      })
    }
    // recommendChannels() {
    //   const channels = []
    //   this.allChannels.forEach((channel) => {
    //     const ret = this.myChannels.find((myChannel) => {
    //       return myChannel.id === channel.id
    //     })
    //     // 如果我的频道中不包括该频道,则加入推荐频道
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   return channels
    // }
  },
  watch: {},
  created() {
    this.loadAllChannels()
  },
  mounted() {},
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        console.log('数据获取失败')
      }
      //   添加
      this.myChannels2.forEach((channel, index) => {
        console.log(channel.id, index + 1)
        this.userData.push({
          id: channel.id,
          seq: index + 1
        })
      })
      console.log(this.userData)
    },
    async onAddChannel(rechannel) {
      this.myChannels2.push(rechannel)
      // 数据持久化
      if (this.user) {
        //  以登录,存储到服务器
        try {
          console.log('线上添加' + this.myChannels2.length)
          this.userData.push({
            id: rechannel.id,
            seq: this.myChannels2.length
          })
          await addUserChannels(this.userData)
        } catch (err) {
          this.$toast('保存失败,请稍后重试')
        }
      } else {
        //   未登录,存储到本地
        setItem('TOUTIAO_CHANNELs', this.myChannels2)
      }
      //   console.log(rechannel)
    },
    onMyChannelClick(channel, index) {
      //   console.log(channel, index)
      // 编辑状态执行删除频道,非编辑状态执行切换频道
      if (this.isEdit) {
        // 删除操作
        if (this.fiexChannels.includes(index)) {
          // 如果是固定频道则不删除
          return
        }
        if (index < this.channelActive) {
          console.log('通知父元素')
          this.$emit('update-active', this.channelActive - 1, true)
        }
        this.myChannels2.splice(index, 1)
        // 处理持久化
        this.deleteChannel(channel, index)
      } else {
        // 切换频道
        this.$emit('update-active', index)
      }
    },
    async deleteChannel(channel, index) {
      if (this.user) {
        // console.log(this.user)
        // 删除userdata中对应的数据
        console.log(channel.id, index)
        this.userData = this.userData.filter((x) => {
          return x.id !== channel.id
        })
        // 发送请求
        await addUserChannels(this.userData)
      } else {
        setItem('TOUTIAO_CHANNELs', this.myChannels2)
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .edit-btn {
    width: 100px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border-color: #f85959;
  }
  .title-text {
    font-size: 33px;
    color: #333;
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/.grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 5px;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
