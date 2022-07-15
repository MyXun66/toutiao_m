// 频道请求模块

import request from '@/utils/request'
// 获取所有频道
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}
// 添加用户频道
// /v1_0/user/channels
export const addUserChannels = (channel) => {
  return request({
    method: 'PUT',
    url: '/v1_0/user/channels',
    data: {
      channels: channel
    }
  })
}
