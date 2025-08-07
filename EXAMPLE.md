# 飞书多维表格 Table 类使用示例

本示例展示了如何使用 `Table` 类来操作飞书多维表格。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 文件为 `.env`，并填入你的飞书应用信息：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 飞书应用配置
FEISHU_APP_ID=your_app_id_here
FEISHU_APP_SECRET=your_app_secret_here

# 多维表格配置
FEISHU_APP_TOKEN=your_app_token_here
FEISHU_TABLE_ID=your_table_id_here
```

### 3. 获取飞书应用信息

#### 获取 APP_ID 和 APP_SECRET

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 在应用详情页面获取 `App ID` 和 `App Secret`
4. 在「权限管理」中添加以下权限：
   - `bitable:app` - 查看、编辑多维表格
   - `bitable:app:readonly` - 查看多维表格

#### 获取 APP_TOKEN 和 TABLE_ID

1. 打开你的飞书多维表格
2. 在浏览器地址栏中找到类似这样的 URL：
   ```
   https://example.feishu.cn/base/APP_TOKEN?table=TABLE_ID
   ```
3. 其中 `APP_TOKEN` 是多维表格的应用令牌，`TABLE_ID` 是具体表格的 ID

### 4. 运行示例

```bash
# 运行完整示例
npm run example

# 或者
npm run test:table
```

## 示例功能

示例文件 `example.ts` 包含以下测试功能：

### 1. 初始化 Table 实例

```typescript
// 使用环境变量初始化
const table = new Table<UserData>();

// 手动指定参数初始化
const customTable = new Table<UserData>({
  appToken: "your_app_token_here",
  tableId: "your_table_id_here",
  feishu: new Feishu("your_app_id", "your_app_secret")
});
```

### 2. 获取表格元数据

```typescript
const meta = await table.meta();
console.log("表格元数据:", meta);
```

### 3. 获取字段信息

```typescript
const fields = await table.fields();
console.log("字段列表:", fields);
```

### 4. 插入记录

```typescript
const newUser = {
  name: "张三",
  email: "zhangsan@example.com",
  age: 25,
  department: "技术部"
};

const result = await table.insert(newUser);
```

### 5. 搜索记录

```typescript
// 简单搜索（获取所有记录）
const allRecords = await table.search();

// 条件搜索
const searchResult = await table.search({
  filter: {
    conjunction: "and",
    conditions: [
      {
        field_name: "age",
        operator: "isGreater",
        value: 20
      }
    ]
  },
  sort: [
    {
      field_name: "age",
      desc: false
    }
  ],
  page_size: 10
});
```

### 6. 更新记录

```typescript
const updateResult = await table.update(recordId, {
  age: 26,
  department: "产品部"
});
```

### 7. 删除记录

```typescript
const deleteResult = await table.delete(recordId);
```

## 注意事项

1. **权限配置**：确保你的飞书应用有足够的权限访问多维表格
2. **数据安全**：不要将 `.env` 文件提交到版本控制系统
3. **API 限制**：注意飞书 API 的调用频率限制
4. **错误处理**：示例中包含了基本的错误处理，实际使用时请根据需要完善

## 故障排除

### 常见错误

1. **401 Unauthorized**：检查 APP_ID 和 APP_SECRET 是否正确
2. **403 Forbidden**：检查应用权限配置
3. **404 Not Found**：检查 APP_TOKEN 和 TABLE_ID 是否正确
4. **网络错误**：检查网络连接和防火墙设置

### 调试建议

1. 先测试获取表格元数据，确认连接正常
2. 检查字段名称是否与表格中的字段匹配
3. 使用飞书开放平台的 API 调试工具进行测试

## 更多信息

- [飞书开放平台文档](https://open.feishu.cn/document/)
- [多维表格 API 文档](https://open.feishu.cn/document/server-docs/docs/bitable-v1/)