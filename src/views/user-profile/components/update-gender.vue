<template>
  <div class="update-gender">
    <van-picker
      title="标题"
      show-toolbar
      :default-index="value"
      :columns="columns"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onPickerChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女'],
      localGender: this.value
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续时间
      })
      try {
        const localGender = this.localGender

        await updateUserProfile({
          gender: localGender
        })
        // console.log(data)
        // 更新视图
        this.$emit('input', localGender)
        this.$emit('close')
        this.$toast.success('更新完成')
      } catch (err) {
        this.$toast('更新失败')
      }
    },
    onPickerChange(picker, value, index) {
      this.localGender = index
    }
  }
}
</script>

<style scoped lang="less"></style>
