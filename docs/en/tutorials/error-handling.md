---
title: Error Handling
order: 4
---

# Error Handling

When using Feishub, proper error handling is crucial for ensuring application stability. This chapter introduces various error scenarios and handling methods.

## Error Types

### 1. Network Errors

Network connection issues, timeouts, etc.:

```typescript
try {
  const result = await table.search();
  if (result) {
    console.log("Search successful");
  } else {
    console.log("Search failed, possibly due to network issues");
  }
} catch (error) {
  console.error("Network error:", error);
}
```

### 2. Authentication Errors

Invalid or expired App ID, App Secret:

```typescript
const feishu = new Feishu({
  appId: "invalid_app_id",
  appSecret: "invalid_secret"
});

const table = feishu.table({
  tableId: "xxxx",
  appToken: "xxxx"
});

// This will fail and output error information to console
const result = await table.meta();
if (!result) {
  console.log("Authentication failed, please check App ID and App Secret");
}
```

### 3. Permission Errors

No permission to access specific tables:

```typescript
const result = await table.insert({ name: "test" });
if (!result) {
  console.log("Insert failed, possibly no write permission");
}
```

### 4. Data Format Errors

Field type mismatch, missing required fields, etc.:

```typescript
// Error: Age field should be a number, but a string was passed
const result = await table.insert({
  Name: "John Doe",
  Age: "twenty-five" // Wrong data type
});

if (!result) {
  console.log("Insert failed, please check data format");
}
```

## Error Handling Patterns

### 1. Basic Error Checking

```typescript
async function safeInsert(data: any) {
  const result = await table.insert(data);
  
  if (result) {
    console.log("Insert successful:", result.record_id);
    return result;
  } else {
    console.error("Insert failed");
    return null;
  }
}
```

### 2. Detailed Error Handling

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
        error: "Insert operation failed"
      };
    }
  } catch (error) {
    console.error("Exception during insert:", error);
    return {
      success: false,
      error: `Exception: ${error.message}`
    };
  }
}

// Usage
const insertResult = await insertWithErrorHandling({
  Name: "Jane Smith",
  Age: 30
});

if (insertResult.success) {
  console.log("Data inserted successfully:", insertResult.data);
} else {
  console.error("Insert failed:", insertResult.error);
}
```

### 3. Retry Mechanism

```typescript
async function insertWithRetry(data: any, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await table.insert(data);
      if (result) {
        return result;
      }
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error);
      
      if (i === maxRetries - 1) {
        throw new Error(`Failed after ${maxRetries} retries`);
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

### 4. Batch Operation Error Handling

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
          error: "Insert failed"
        });
      }
    } catch (error) {
      errors.push({
        index: i,
        data: records[i],
        error: error.message
      });
    }
    
    // Avoid too frequent requests
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

// Usage
const batchResult = await batchInsertWithErrorHandling([
  { Name: "Employee 1", Department: "Engineering" },
  { Name: "Employee 2", Department: "Product" },
  { Name: "Employee 3", Department: "Operations" }
]);

console.log(`Batch insert completed: ${batchResult.summary.success}/${batchResult.summary.total} successful`);

if (batchResult.failed.length > 0) {
  console.error("Failed records:", batchResult.failed);
}
```

## Common Error Scenarios

### 1. Check Connection Status

```typescript
async function checkConnection() {
  try {
    const meta = await table.meta();
    
    if (meta) {
      console.log("Connection normal");
      return true;
    } else {
      console.log("Connection failed");
      return false;
    }
  } catch (error) {
    console.error("Connection check failed:", error);
    return false;
  }
}
```

### 2. Validate Data Validity

```typescript
function validateRecord(data: any): { valid: boolean; errors: string[] } {
  const errors = [];
  
  // Check required fields
  if (!data.Name || typeof data.Name !== 'string') {
    errors.push("Name field is required and must be a string");
  }
  
  if (data.Age !== undefined && (typeof data.Age !== 'number' || data.Age < 0)) {
    errors.push("Age must be a non-negative number");
  }
  
  if (data.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)) {
    errors.push("Email format is incorrect");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

async function safeInsertWithValidation(data: any) {
  // Validate data first
  const validation = validateRecord(data);
  
  if (!validation.valid) {
    console.error("Data validation failed:", validation.errors);
    return null;
  }
  
  // Then insert data
  return await table.insert(data);
}
```

### 3. Handle Large Data Timeouts

```typescript
async function searchWithTimeout(searchOptions: any, timeoutMs = 30000) {
  return Promise.race([
    table.search(searchOptions),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Operation timeout")), timeoutMs)
    )
  ]);
}

// Usage
try {
  const result = await searchWithTimeout({
    filter: {
      conjunction: "and",
      conditions: [...]
    }
  }, 15000); // 15 second timeout
  
  if (result) {
    console.log("Search successful");
  }
} catch (error) {
  if (error.message === "Operation timeout") {
    console.error("Search timeout, please simplify query conditions");
  } else {
    console.error("Search failed:", error);
  }
}
```

## Logging

It's recommended to use structured logging in production environments:

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

// Use in operations
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

## Best Practices

1. **Always check return values**: All operations can fail, check for `null` return values
2. **Use try-catch**: Catch network exceptions and other unexpected errors
3. **Implement retry mechanisms**: For important operations, implement reasonable retry logic
4. **Validate input data**: Validate data format before sending requests
5. **Log detailed information**: Facilitate troubleshooting and monitoring
6. **Set reasonable timeouts**: Avoid long waits
7. **Graceful degradation**: Provide alternative solutions when some features are unavailable

## Next Steps

- [Best Practices](./best-practices) - Learn more usage tips
- [API Reference](../api/feishu) - View complete API documentation
