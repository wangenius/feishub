---
title: 搜索和筛选
order: 3
---

# 搜索和筛选

Feishub 提供了强大的搜索和筛选功能，让您能够精确地查找所需的记录。

## 基本搜索

### 简单搜索

```typescript
// 搜索所有记录
const allRecords = await table.search();

if (allRecords?.items) {
  console.log(`共找到 ${allRecords.items.length} 条记录`);
}
```

### 分页搜索

```typescript
// 处理分页结果
let pageToken = "";
let allItems = [];

do {
  const result = await table.search({
    // 可以添加其他搜索条件
  });
  
  if (result?.items) {
    allItems.push(...result.items);
  }
  
  pageToken = result?.page_token || "";
} while (result?.has_more);

console.log(`总共获取了 ${allItems.length} 条记录`);
```

## 条件筛选

### 单个条件

```typescript
// 查找姓名等于"张三"的记录
const result = await table.search({
  filter: {
    conjunction: "and",
    conditions: [
      {
        field_name: "姓名",
        operator: "equal",
        value: ["张三"]
      }
    ]
  }
});
```

### 多个条件 - AND 关系

```typescript
// 查找年龄大于25且部门为"技术部"的记录
const result = await table.search({
  filter: {
    conjunction: "and",
    conditions: [
      {
        field_name: "年龄",
        operator: "isGreater",
        value: [25]
      },
      {
        field_name: "部门",
        operator: "equal",
        value: ["技术部"]
      }
    ]
  }
});
```

### 多个条件 - OR 关系

```typescript
// 查找部门为"技术部"或"产品部"的记录
const result = await table.search({
  filter: {
    conjunction: "or",
    conditions: [
      {
        field_name: "部门",
        operator: "equal",
        value: ["技术部"]
      },
      {
        field_name: "部门",
        operator: "equal",
        value: ["产品部"]
      }
    ]
  }
});
```

## 操作符详解

### 文本操作符

```typescript
// 等于
{
  field_name: "姓名",
  operator: "equal", // 或 "is"
  value: ["张三"]
}

// 不等于
{
  field_name: "姓名",
  operator: "isNot",
  value: ["张三"]
}

// 包含
{
  field_name: "备注",
  operator: "contains",
  value: ["重要"]
}

// 不包含
{
  field_name: "备注",
  operator: "doesNotContain",
  value: ["删除"]
}

// 为空
{
  field_name: "备注",
  operator: "isEmpty",
  value: []
}

// 不为空
{
  field_name: "备注",
  operator: "isNotEmpty",
  value: []
}

// 模糊匹配
{
  field_name: "邮箱",
  operator: "like",
  value: ["%@company.com"]
}
```

### 数字操作符

```typescript
// 大于
{
  field_name: "年龄",
  operator: "isGreater",
  value: [25]
}

// 大于等于
{
  field_name: "年龄",
  operator: "isGreaterEqual",
  value: [25]
}

// 小于
{
  field_name: "年龄",
  operator: "isLess",
  value: [60]
}

// 小于等于
{
  field_name: "年龄",
  operator: "isLessEqual",
  value: [60]
}

// 在范围内（使用多个条件组合）
{
  conjunction: "and",
  conditions: [
    {
      field_name: "年龄",
      operator: "isGreaterEqual",
      value: [25]
    },
    {
      field_name: "年龄",
      operator: "isLessEqual",
      value: [60]
    }
  ]
}
```

### 多选字段操作符

```typescript
// 包含某个选项
{
  field_name: "技能",
  operator: "contains",
  value: ["JavaScript"]
}

// 包含多个选项中的任意一个
{
  field_name: "技能",
  operator: "in",
  value: ["JavaScript", "TypeScript", "React"]
}
```

## 排序

### 单字段排序

```typescript
const result = await table.search({
  sort: [
    {
      field_name: "年龄",
      desc: true // 降序，false 为升序
    }
  ]
});
```

### 多字段排序

```typescript
// 先按部门升序，再按年龄降序
const result = await table.search({
  sort: [
    {
      field_name: "部门",
      desc: false
    },
    {
      field_name: "年龄",
      desc: true
    }
  ]
});
```

## 复杂查询示例

### 查询活跃用户

```typescript
// 查找最近30天登录过的25-40岁技术部员工
const activeUsers = await table.search({
  filter: {
    conjunction: "and",
    conditions: [
      {
        field_name: "部门",
        operator: "equal",
        value: ["技术部"]
      },
      {
        field_name: "年龄",
        operator: "isGreaterEqual",
        value: [25]
      },
      {
        field_name: "年龄",
        operator: "isLessEqual",
        value: [40]
      },
      {
        field_name: "最后登录时间",
        operator: "isGreater",
        value: [Date.now() - 30 * 24 * 60 * 60 * 1000] // 30天前
      }
    ]
  },
  sort: [
    {
      field_name: "最后登录时间",
      desc: true
    }
  ]
});
```

### 查询高级用户

```typescript
// 查找拥有特定技能组合的高级员工
const seniorDevelopers = await table.search({
  filter: {
    conjunction: "and",
    conditions: [
      {
        field_name: "级别",
        operator: "in",
        value: ["高级工程师", "专家工程师", "技术总监"]
      },
      {
        field_name: "技能",
        operator: "contains",
        value: ["架构设计"]
      },
      {
        field_name: "工作年限",
        operator: "isGreaterEqual",
        value: [5]
      }
    ]
  }
});
```

## 性能优化建议

1. **合理使用筛选条件**：减少不必要的条件可以提高查询速度
2. **适当的排序**：只在需要时使用排序，避免对大量数据进行复杂排序
3. **分页处理**：对于大量数据，使用分页避免一次性加载过多记录
4. **索引字段**：在飞书中为常用的筛选字段创建索引

## 下一步

- [错误处理](./error-handling) - 了解如何处理搜索中的错误情况
- [最佳实践](./best-practices) - 学习使用 Feishub 的最佳实践
