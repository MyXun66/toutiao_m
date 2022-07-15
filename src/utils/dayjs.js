import Vue from 'vue'

import dayjs from 'dayjs'
// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'
// 配置使用相对时间的插件
dayjs.extend(relativeTime)

// dayjs 默认为中文,配置中文
dayjs.locale('zh-cn') // 全局使用

// 定义全局过滤器,可以在任何模板中使用
// 相当于全局可用方法(仅模板可用使用)
// 参数1,过滤器名称
// 参数2,过滤器函数
// 使用方式{{表达式| 过滤器名称}}
// 管道符前面的表达式结果作为参数传递到过滤器
// 过滤器的返回值渲染到使用过滤器的模板位置
Vue.filter('relativeTime', (value) => {
  return dayjs().to(dayjs(value))
})
