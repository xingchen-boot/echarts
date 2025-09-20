# ECharts 数据可视化后端服务

这是一个基于 Koa.js 和 WebSocket 的数据可视化后端服务，为 ECharts 图表提供数据支持。项目包含多种业务数据的模拟，支持实时数据推送和静态数据接口。

## 项目特性

- 🚀 基于 Koa.js 的轻量级 Web 服务器
- 📊 支持多种数据可视化图表数据
- 🔄 WebSocket 实时数据推送
- 📁 静态 JSON 数据文件管理
- ⚡ 响应时间监控
- 🌐 CORS 跨域支持

## 技术栈

- **Node.js** - 运行环境
- **Koa.js** - Web 框架
- **WebSocket (ws)** - 实时通信
- **文件系统 (fs)** - 数据文件读取

## 项目结构

```
koa_server/
├── app.js                    # 应用入口文件
├── package.json              # 项目依赖配置
├── websocket_demo.html       # WebSocket 测试页面
├── middleware/               # 中间件目录
│   ├── koa_response_duration.js  # 响应时间计算中间件
│   ├── koa_response_header.js    # 响应头设置中间件
│   └── koa_response_data.js      # 业务逻辑处理中间件
├── service/                  # 服务层
│   └── web_socket_service.js     # WebSocket 服务
├── utils/                    # 工具类
│   └── file_utils.js             # 文件操作工具
└── data/                     # 数据文件目录
    ├── budget.json           # 预算数据
    ├── hotproduct.json       # 热门产品数据
    ├── map.json              # 地图数据
    ├── rank.json             # 排行榜数据
    ├── seller.json           # 商家数据
    ├── stock.json            # 库存数据
    └── trend.json            # 趋势数据
```

## 安装和运行

### 环境要求

- Node.js >= 14.0.0
- npm 或 pnpm

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 启动服务

```bash
node app.js
```

服务启动后：
- HTTP 服务运行在端口 `8888`
- WebSocket 服务运行在端口 `9998`

## API 接口

### HTTP 接口

所有数据接口都通过 `/api/{数据文件名}` 访问：

- `GET /api/budget` - 获取预算数据
- `GET /api/hotproduct` - 获取热门产品数据
- `GET /api/map` - 获取地图数据
- `GET /api/rank` - 获取排行榜数据
- `GET /api/seller` - 获取商家数据
- `GET /api/stock` - 获取库存数据
- `GET /api/trend` - 获取趋势数据

### WebSocket 接口

WebSocket 连接地址：`ws://localhost:9998`

#### 消息格式

**获取数据请求：**
```json
{
  "action": "getData",
  "chartName": "budget"
}
```

**主题切换广播：**
```json
{
  "action": "themeChange",
  "socketType": "themeChange",
  "chartName": "",
  "value": "chalk"
}
```

## 数据说明

### 预算数据 (budget.json)
包含各部门的预算、支出和最大值信息：
- 销售部门
- 管理部门
- 研发部门
- 客服部门
- 市场部门

### 趋势数据 (trend.json)
包含三种趋势图表数据：
- 地区销量趋势
- 商家销量趋势
- 商品销量趋势

### 排行榜数据 (rank.json)
各省市销售数据排名，包含地区名称和对应数值。

### 商家数据 (seller.json)
各商家的销售数据，包含商家名称和销售数值。

### 库存数据 (stock.json)
商品库存和销售数据，包含商品名称、库存量和销售量。

### 地图数据 (map.json)
用户分布地图数据，按用户等级（黄金、白金、钻石）和地理位置分组。

## 中间件说明

### 响应时间中间件
- 计算服务器响应时间
- 在响应头中添加 `X-Response-Time`

### 响应头中间件
- 设置 `Content-Type` 为 `application/json`
- 配置 CORS 跨域支持
- 允许的请求方法：GET, POST, PUT, DELETE, OPTIONS

### 业务逻辑中间件
- 处理 `/api` 开头的请求
- 自动读取对应的 JSON 数据文件
- 错误处理和 404 响应

## WebSocket 功能

### 连接管理
- 自动处理客户端连接和断开
- 支持多客户端同时连接

### 数据推送
- 支持按需获取特定图表数据
- 支持主题切换广播到所有客户端

### 测试页面
项目包含 `websocket_demo.html` 测试页面，可以：
- 连接 WebSocket 服务
- 发送测试消息
- 查看服务端响应

## 开发说明

### 添加新的数据文件
1. 在 `data/` 目录下添加 JSON 文件
2. 通过 `/api/{文件名}` 访问
3. 通过 WebSocket 的 `getData` 动作获取

### 自定义中间件
在 `middleware/` 目录下添加新的中间件文件，并在 `app.js` 中引入使用。

### 扩展 WebSocket 功能
在 `service/web_socket_service.js` 中添加新的消息处理逻辑。

## 注意事项

- 确保 `data/` 目录下的 JSON 文件格式正确
- WebSocket 连接需要客户端支持
- 生产环境建议添加错误日志和监控
- 可根据需要调整端口配置

## 许可证

ISC License
