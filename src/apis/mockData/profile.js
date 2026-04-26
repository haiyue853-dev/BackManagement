export default {
  updateProfile: (config) => {
    const payload = JSON.parse(config.body)
    return {
      code: 200,
      data: {
        ...payload,
        message: '保存成功',
      },
    }
  },
}
