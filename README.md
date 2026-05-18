# 前端管理台说明

这是后台管理系统的前端项目，基于 `Vue 3 + Vite + Element Plus + Pinia + Vue Router` 实现。

## 1. 当前完成功能

- 登录页接真实后端
- 首页看板联调完成
- 用户管理页面联调完成
- 商品管理页面联调完成
- 个人中心页面联调完成
- 请求层统一处理 JWT 和 401 跳转
- 环境变量支持开发和生产切换

## 2. 环境变量

当前已提供：

- `.env.development`
- `.env.production`

变量说明：

```env
VITE_API_BASE=/api
VITE_USE_MOCK=false
VITE_MOCK_API=https://apifoxmock.com/m1/4068509-0-default/api
```

说明：

- `VITE_API_BASE=/api`
  前端请求统一走 `/api`
- `vite.config.js`
  通过代理把 `/api` 转发到后端 `http://localhost:3000`
- `VITE_USE_MOCK=false`
  当前以真实后端联调为主，不使用 mock

## 3. 本地运行

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:5173
```

## 4. 打包构建

```bash
npm run build
```

构建产物输出到：

```text
dist/
```

## 5. 联调前提

启动前端前，请确保后端已经运行：

```text
http://localhost:3000
```

并且前端代理配置保持可用。

## 6. 建议的联调顺序

### 登录

- 使用管理员账号登录
- 确认 token 正常写入本地存储

### 首页

- 检查头像、角色、最近登录信息
- 检查卡片统计、表格、图表

### 用户管理

- 列表查询
- 搜索
- 新增
- 编辑
- 删除
- 分页

### 商品管理

- 列表查询
- 搜索
- 新增
- 编辑
- 删除
- 确认状态只能是 `上架 / 下架`

### 个人中心

- 查询资料
- 修改签名、城市、头像
- 保存后刷新页面确认数据仍在

## 7. 当前状态

这个前端项目已经可以作为一个可演示的后台管理台使用。  
如果继续完善，下一步建议补：

- 账号管理页面的完整手工验收
- 页面 loading / empty / error 状态继续统一
- 首页包体积优化
- 更规范的菜单与路由配置抽离
