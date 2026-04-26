import Mock from 'mockjs'

function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}',
  )
}

let List = []
const count = 120
const categoryList = ['手机数码', '电脑办公', '家居生活', '服饰鞋包', '图书文创']
const statusList = ['上架', '下架']

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      name: Mock.Random.ctitle(3, 8),
      category: categoryList[Mock.Random.integer(0, categoryList.length - 1)],
      'price|99-9999.1-2': 1,
      'stock|0-500': 1,
      status: statusList[Mock.Random.integer(0, 1)],
      coverTag: Mock.Random.pick(['新品', '热卖', '折扣', '精选']),
      desc: Mock.Random.csentence(10, 20),
      updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    }),
  )
}

export default {
  getMallList: (config) => {
    const { name, page = 1, limit = 10 } = param2Obj(config.url)

    const mockList = List.filter((item) => {
      if (name && item.name.indexOf(name) === -1 && item.category.indexOf(name) === -1) {
        return false
      }
      return true
    })

    const pageList = mockList.filter(
      (item, index) => index < limit * page && index >= limit * (page - 1),
    )

    return {
      code: 200,
      data: {
        list: pageList,
        count: mockList.length,
      },
    }
  },
  deleteMall: (config) => {
    const { id } = param2Obj(config.url)
    if (!id) {
      return {
        code: -999,
        msg: '参数不正确',
      }
    }

    List = List.filter((item) => item.id !== id)
    return {
      code: 200,
      data: {
        message: '删除成功',
      },
    }
  },
  createMall: (config) => {
    const { name, category, price, stock, status, coverTag, desc } = JSON.parse(config.body)
    List.unshift({
      id: Mock.Random.guid(),
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      status,
      coverTag,
      desc,
      updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    })
    return {
      code: 200,
      data: {
        message: '新增成功',
      },
    }
  },
  updateMall: (config) => {
    const { id, name, category, price, stock, status, coverTag, desc } = JSON.parse(config.body)
    List.some((item) => {
      if (item.id === id) {
        item.name = name
        item.category = category
        item.price = Number(price)
        item.stock = Number(stock)
        item.status = status
        item.coverTag = coverTag
        item.desc = desc
        item.updateTime = Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
        return true
      }
    })

    return {
      code: 200,
      data: {
        message: '编辑成功',
      },
    }
  },
}
