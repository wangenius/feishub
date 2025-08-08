---
title: 快速开始
order: 1
---

# 快速开始

欢迎使用 Feishub！这是一个强大而简单的飞书多维表格 TypeScript SDK。

## 安装

使用 npm 安装：

```bash
npm install feishub
```

使用 yarn 安装：

```bash
yarn add feishub
```

使用 pnpm 安装：

```bash
pnpm add feishub
```

## 基础配置

### 获取凭证

在使用 Feishub 之前，您需要从飞书开放平台获取以下信息：

1. **App ID** - 应用ID
2. **App Secret** - 应用密钥
3. **App Token** - 多维表格的应用Token
4. **Table ID** - 表格ID

### 环境变量设置（可选）

您可以通过环境变量设置这些凭证：

```bash
# .env 文件
FEISHU_APP_ID=cli_xxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxx
FEISHU_APP_TOKEN=xxxxxxxxxxxxxxxxxx
FEISHU_TABLE_ID=xxxxxxxxxxxxxxxxxx
```

## 基本用法

### 方式一：使用 Feishu 类

```typescript
import { Feishu } from "feishub";

// 创建 Feishu 实例
const feishu = new Feishu({
  appId: "cli_xxxx",
  appSecret: "xxxx",
});

// 创建表格实例
const table = feishu.table({
  tableId: "xxxx",
  appToken: "xxxx",
});

// 获取表格元数据
const meta = await table.meta();
console.log(meta);
```

### 方式二：直接使用 Table 类

```typescript
import { Table, Feishu } from "feishub";

// 创建 Feishu 客户端
const feishu = new Feishu({
  appId: "cli_xxxx",
  appSecret: "xxxx",
});

// 直接创建表格实例
const table = new Table({
  appToken: "xxxx",
  tableId: "xxxx",
  feishu,
});
```

### 方式三：使用环境变量

如果您已经设置了环境变量，可以更简单地创建实例：

```typescript
import { Table } from "feishub";

// 会自动从环境变量读取配置
const table = new Table();
```

## 基本操作示例

### 插入记录

```typescript
const result = await table.insert({
  name: "张三",
  age: 25,
  email: "zhangsan@example.com"
});

if (result) {
  console.log("插入成功:", result.record_id);
} else {
  console.log("插入失败");
}
```

### 搜索记录

```typescript
const searchResult = await table.search({
  filter: {
    conjunction: "and",
    conditions: [
      {
        field_name: "name",
        operator: "equal",
        value: ["张三"]
      }
    ]
  }
});

if (searchResult?.items) {
  console.log("找到记录:", searchResult.items.length);
}
```

### 更新记录

```typescript
const updated = await table.update("记录ID", {
  age: 26
});

if (updated) {
  console.log("更新成功");
}
```

### 删除记录

```typescript
const deleted = await table.delete("记录ID");

if (deleted) {
  console.log("删除成功");
}
```

## 下一步

现在您已经了解了基本用法，可以继续学习：

- [表格操作](./table-operations) - 深入了解表格的各种操作
- [搜索和筛选](./search-and-filter) - 学习高级搜索功能
- [错误处理](./error-handling) - 了解如何处理错误情况
