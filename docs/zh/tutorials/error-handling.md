---
title: 错误处理
order: 4
---

# 错误处理

在使用 Feishub 时，正确的错误处理是确保应用稳定性的关键。本章将介绍各种错误情况和处理方法。

## 错误类型

### 1. 网络错误

网络连接问题、超时等：

```typescript
try {
  const result = await table.search();
  if (result) {
    console.log("搜索成功");
  } else {
    console.log("搜索失败，可能是网络问题");
  }
} catch (error) {
  console.error("网络错误:", error);
}
```

### 2. 认证错误

App ID、App Secret 错误或过期：

```typescript
const feishu = new Feishu({
  appId: "invalid_app_id",
  appSecret: "invalid_secret"
});

const table = feishu.table({
  tableId: "xxxx",
  appToken: "xxxx"
});

// 这会失败并在控制台输出错误信息
const result = await table.meta();
if (!result) {
  console.log("认证失败，请检查 App ID 和 App Secret");
}
```

### 3. 权限错误

没有访问特定表格的权限：

```typescript
const result = await table.insert({ name: "test" });
if (!result) {
  console.log("插入失败，可能没有写入权限");
}
```

### 4. 数据格式错误

字段类型不匹配、必填字段缺失等：

```typescript
// 错误：年龄字段应该是数字，但传入了字符串
const result = await table.insert({
  姓名: "张三",
  年龄: "二十五" // 错误的数据类型
});

if (!result) {
  console.log("插入失败，请检查数据格式");
}
```

## 错误处理模式

### 1. 基本错误检查

```typescript
async function safeInsert(data: any) {
  const result = await table.insert(data);
  
  if (result) {
    console.log("插入成功:", result.record_id);
    return result;
  } else {
    console.error("插入失败");
    return null;
  }
}
```

### 2. 详细错误处理

```typescript
async function insertWithErrorHandling(data: any) {
  try {
    const result = await table.insert(data);
    
    if (result) {
      return {
        success: true,
        data: result
      };
    } else {
      return {
        success: false,
        error: "插入操作失败"
      };
    }
  } catch (error) {
    console.error("插入时发生异常:", error);
    return {
      success: false,
      error: `异常: ${error.message}`
    };
  }
}

// 使用
const insertResult = await insertWithErrorHandling({
  姓名: "李四",
  年龄: 30
});

if (insertResult.success) {
  console.log("数据插入成功:", insertResult.data);
} else {
  console.error("插入失败:", insertResult.error);
}
```

### 3. 重试机制

```typescript
async function insertWithRetry(data: any, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await table.insert(data);
      if (result) {
        return result;
      }
    } catch (error) {
      console.warn(`第 ${i + 1} 次尝试失败:`, error);
      
      if (i === maxRetries - 1) {
        throw new Error(`重试 ${maxRetries} 次后仍然失败`);
      }
      
      // 等待一段时间再重试（指数退避）
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

### 4. 批量操作错误处理

```typescript
async function batchInsertWithErrorHandling(records: any[]) {
  const results = [];
  const errors = [];
  
  for (let i = 0; i < records.length; i++) {
    try {
      const result = await table.insert(records[i]);
      
      if (result) {
        results.push({
          index: i,
          data: records[i],
          result: result
        });
      } else {
        errors.push({
          index: i,
          data: records[i],
          error: "插入失败"
        });
      }
    } catch (error) {
      errors.push({
        index: i,
        data: records[i],
        error: error.message
      });
    }
    
    // 避免请求过于频繁
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return {
    successful: results,
    failed: errors,
    summary: {
      total: records.length,
      success: results.length,
      failed: errors.length
    }
  };
}

// 使用
const batchResult = await batchInsertWithErrorHandling([
  { 姓名: "员工1", 部门: "技术部" },
  { 姓名: "员工2", 部门: "产品部" },
  { 姓名: "员工3", 部门: "运营部" }
]);

console.log(`批量插入完成: ${batchResult.summary.success}/${batchResult.summary.total} 成功`);

if (batchResult.failed.length > 0) {
  console.error("失败的记录:", batchResult.failed);
}
```

## 常见错误场景

### 1. 检查连接状态

```typescript
async function checkConnection() {
  try {
    const meta = await table.meta();
    
    if (meta) {
      console.log("连接正常");
      return true;
    } else {
      console.log("连接失败");
      return false;
    }
  } catch (error) {
    console.error("连接检查失败:", error);
    return false;
  }
}
```

### 2. 验证数据有效性

```typescript
function validateRecord(data: any): { valid: boolean; errors: string[] } {
  const errors = [];
  
  // 检查必填字段
  if (!data.姓名 || typeof data.姓名 !== 'string') {
    errors.push("姓名字段是必填的字符串");
  }
  
  if (data.年龄 !== undefined && (typeof data.年龄 !== 'number' || data.年龄 < 0)) {
    errors.push("年龄必须是非负数字");
  }
  
  if (data.邮箱 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.邮箱)) {
    errors.push("邮箱格式不正确");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

async function safeInsertWithValidation(data: any) {
  // 先验证数据
  const validation = validateRecord(data);
  
  if (!validation.valid) {
    console.error("数据验证失败:", validation.errors);
    return null;
  }
  
  // 再插入数据
  return await table.insert(data);
}
```

### 3. 处理大量数据的超时

```typescript
async function searchWithTimeout(searchOptions: any, timeoutMs = 30000) {
  return Promise.race([
    table.search(searchOptions),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error("操作超时")), timeoutMs)
    )
  ]);
}

// 使用
try {
  const result = await searchWithTimeout({
    filter: {
      conjunction: "and",
      conditions: [...]
    }
  }, 15000); // 15秒超时
  
  if (result) {
    console.log("搜索成功");
  }
} catch (error) {
  if (error.message === "操作超时") {
    console.error("搜索超时，请简化查询条件");
  } else {
    console.error("搜索失败:", error);
  }
}
```

## 日志记录

建议在生产环境中使用结构化日志：

```typescript
class FeishubLogger {
  static log(level: 'info' | 'warn' | 'error', operation: string, details: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      operation,
      details
    };
    
    console[level === 'error' ? 'error' : 'log'](JSON.stringify(logEntry));
  }
}

// 在操作中使用
async function insertWithLogging(data: any) {
  FeishubLogger.log('info', 'insert_start', { data });
  
  try {
    const result = await table.insert(data);
    
    if (result) {
      FeishubLogger.log('info', 'insert_success', { 
        recordId: result.record_id 
      });
      return result;
    } else {
      FeishubLogger.log('warn', 'insert_failed', { data });
      return null;
    }
  } catch (error) {
    FeishubLogger.log('error', 'insert_error', { 
      data, 
      error: error.message 
    });
    throw error;
  }
}
```

## 最佳实践

1. **总是检查返回值**：所有操作都可能失败，检查 `null` 返回值
2. **使用 try-catch**：捕获网络异常和其他意外错误
3. **实现重试机制**：对于重要操作，实现合理的重试逻辑
4. **验证输入数据**：在发送请求前验证数据格式
5. **记录详细日志**：便于问题排查和监控
6. **设置合理超时**：避免长时间等待
7. **优雅降级**：当部分功能不可用时，提供备选方案

## 下一步

- [最佳实践](./best-practices) - 学习更多使用技巧
- [API 参考](../api/feishu) - 查看完整的 API 文档
