---
title: 表格操作
order: 2
---

# 表格操作

本章节详细介绍 Feishub 支持的各种表格操作。

## 表格元数据

获取表格的基本信息：

```typescript
const meta = await table.meta();

if (meta) {
  console.log("表格名称:", meta.table_name);
  console.log("应用Token:", meta.app_token);
  console.log("表格ID:", meta.table_id);
  console.log("版本号:", meta.revision);
}
```

## 字段管理

### 获取所有字段

```typescript
const fields = await table.fields();

if (fields) {
  fields.forEach(field => {
    console.log("字段名:", field.field_name);
    console.log("字段ID:", field.field_id);
    console.log("字段类型:", field.type);
    console.log("字段属性:", field.property);
  });
}
```

### 字段类型说明

飞书多维表格支持多种字段类型：

- `1` - 多行文本
- `2` - 数字
- `3` - 单选
- `4` - 多选
- `5` - 日期
- `7` - 复选框
- `11` - 人员
- `13` - 电话号码
- `15` - 超链接
- `17` - 附件
- `18` - 关联
- `20` - 公式
- `21` - 双向关联

## 记录操作

### 插入记录

#### 基本插入

```typescript
const newRecord = await table.insert({
  "姓名": "李四",
  "年龄": 30,
  "邮箱": "lisi@example.com",
  "是否激活": true
});
```

#### 插入复杂数据类型

```typescript
// 插入包含多选、人员、日期等复杂类型的记录
const complexRecord = await table.insert({
  "姓名": "王五",
  "技能": ["JavaScript", "TypeScript", "React"], // 多选
  "入职日期": 1672531200000, // 时间戳
  "负责人": [{
    "id": "ou_xxxx",
    "name": "张经理"
  }], // 人员字段
  "薪资": 15000 // 数字
});
```

### 批量插入

虽然 API 一次只能插入一条记录，但您可以使用循环批量插入：

```typescript
const records = [
  { "姓名": "员工1", "部门": "技术部" },
  { "姓名": "员工2", "部门": "产品部" },
  { "姓名": "员工3", "部门": "运营部" }
];

const results = [];
for (const record of records) {
  const result = await table.insert(record);
  if (result) {
    results.push(result);
  }
  // 避免请求过于频繁
  await new Promise(resolve => setTimeout(resolve, 100));
}

console.log(`成功插入 ${results.length} 条记录`);
```

### 更新记录

#### 基本更新

```typescript
const recordId = "recxxxxxx";
const updated = await table.update(recordId, {
  "年龄": 31,
  "邮箱": "newemail@example.com"
});
```

#### 部分字段更新

```typescript
// 只更新指定字段，其他字段保持不变
const updated = await table.update(recordId, {
  "最后登录时间": Date.now()
});
```

### 删除记录

```typescript
const recordId = "recxxxxxx";
const deleted = await table.delete(recordId);

if (deleted) {
  console.log("记录删除成功");
} else {
  console.log("记录删除失败");
}
```

## 类型安全

Feishub 支持 TypeScript 泛型，您可以定义记录的类型：

```typescript
interface Employee {
  姓名: string;
  年龄: number;
  部门: string;
  邮箱?: string;
  是否激活: boolean;
}

const table = new Table<Employee>({
  appToken: "xxxx",
  tableId: "xxxx",
  feishu
});

// 现在 insert 方法会有类型检查
const employee = await table.insert({
  姓名: "张三",
  年龄: 25,
  部门: "技术部",
  是否激活: true
});
```

## 错误处理

所有操作都会返回 `null` 表示失败，建议始终检查返回值：

```typescript
const result = await table.insert(data);

if (result) {
  console.log("操作成功:", result);
} else {
  console.log("操作失败，请检查日志");
}
```

## 下一步

- [搜索和筛选](./search-and-filter) - 学习如何搜索和筛选记录
- [错误处理](./error-handling) - 了解错误处理最佳实践
