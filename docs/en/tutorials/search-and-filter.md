---
title: Search and Filter
order: 3
---

# Search and Filter

Feishub provides powerful search and filtering capabilities that allow you to precisely find the records you need.

## Basic Search

### Simple Search

```typescript
// Search all records
const allRecords = await table.search();

if (allRecords?.items) {
  console.log(`Found ${allRecords.items.length} records`);
}
```

### Paginated Search

```typescript
// Handle paginated results
let pageToken = "";
let allItems = [];

do {
  const result = await table.search({
    // You can add other search conditions here
  });
  
  if (result?.items) {
    allItems.push(...result.items);
  }
  
  pageToken = result?.page_token || "";
} while (result?.has_more);

console.log(`Retrieved a total of ${allItems.length} records`);
```

## Conditional Filtering

### Single Condition

```typescript
// Find records where name equals "John Doe"
const result = await table.search({
  filter: {
    conjunction: "and",
    conditions: [
      {
        field_name: "Name",
        operator: "equal",
        value: ["John Doe"]
      }
    ]
  }
});
```

### Multiple Conditions - AND Relationship

```typescript
// Find records where age > 25 AND department = "Engineering"
const result = await table.search({
  filter: {
    conjunction: "and",
    conditions: [
      {
        field_name: "Age",
        operator: "isGreater",
        value: [25]
      },
      {
        field_name: "Department",
        operator: "equal",
        value: ["Engineering"]
      }
    ]
  }
});
```

### Multiple Conditions - OR Relationship

```typescript
// Find records where department is "Engineering" OR "Product"
const result = await table.search({
  filter: {
    conjunction: "or",
    conditions: [
      {
        field_name: "Department",
        operator: "equal",
        value: ["Engineering"]
      },
      {
        field_name: "Department",
        operator: "equal",
        value: ["Product"]
      }
    ]
  }
});
```

## Operator Reference

### Text Operators

```typescript
// Equal
{
  field_name: "Name",
  operator: "equal", // or "is"
  value: ["John Doe"]
}

// Not equal
{
  field_name: "Name",
  operator: "isNot",
  value: ["John Doe"]
}

// Contains
{
  field_name: "Notes",
  operator: "contains",
  value: ["important"]
}

// Does not contain
{
  field_name: "Notes",
  operator: "doesNotContain",
  value: ["delete"]
}

// Is empty
{
  field_name: "Notes",
  operator: "isEmpty",
  value: []
}

// Is not empty
{
  field_name: "Notes",
  operator: "isNotEmpty",
  value: []
}

// Like (pattern matching)
{
  field_name: "Email",
  operator: "like",
  value: ["%@company.com"]
}
```

### Number Operators

```typescript
// Greater than
{
  field_name: "Age",
  operator: "isGreater",
  value: [25]
}

// Greater than or equal
{
  field_name: "Age",
  operator: "isGreaterEqual",
  value: [25]
}

// Less than
{
  field_name: "Age",
  operator: "isLess",
  value: [60]
}

// Less than or equal
{
  field_name: "Age",
  operator: "isLessEqual",
  value: [60]
}

// In range (using multiple conditions)
{
  conjunction: "and",
  conditions: [
    {
      field_name: "Age",
      operator: "isGreaterEqual",
      value: [25]
    },
    {
      field_name: "Age",
      operator: "isLessEqual",
      value: [60]
    }
  ]
}
```

### Multi-select Field Operators

```typescript
// Contains specific option
{
  field_name: "Skills",
  operator: "contains",
  value: ["JavaScript"]
}

// Contains any of multiple options
{
  field_name: "Skills",
  operator: "in",
  value: ["JavaScript", "TypeScript", "React"]
}
```

## Sorting

### Single Field Sort

```typescript
const result = await table.search({
  sort: [
    {
      field_name: "Age",
      desc: true // Descending, false for ascending
    }
  ]
});
```

### Multi-field Sort

```typescript
// Sort by department ascending, then by age descending
const result = await table.search({
  sort: [
    {
      field_name: "Department",
      desc: false
    },
    {
      field_name: "Age",
      desc: true
    }
  ]
});
```

## Complex Query Examples

### Query Active Users

```typescript
// Find 25-40 year old Engineering employees who logged in within the last 30 days
const activeUsers = await table.search({
  filter: {
    conjunction: "and",
    conditions: [
      {
        field_name: "Department",
        operator: "equal",
        value: ["Engineering"]
      },
      {
        field_name: "Age",
        operator: "isGreaterEqual",
        value: [25]
      },
      {
        field_name: "Age",
        operator: "isLessEqual",
        value: [40]
      },
      {
        field_name: "Last Login",
        operator: "isGreater",
        value: [Date.now() - 30 * 24 * 60 * 60 * 1000] // 30 days ago
      }
    ]
  },
  sort: [
    {
      field_name: "Last Login",
      desc: true
    }
  ]
});
```

### Query Senior Users

```typescript
// Find senior employees with specific skill combinations
const seniorDevelopers = await table.search({
  filter: {
    conjunction: "and",
    conditions: [
      {
        field_name: "Level",
        operator: "in",
        value: ["Senior Engineer", "Staff Engineer", "Engineering Manager"]
      },
      {
        field_name: "Skills",
        operator: "contains",
        value: ["System Design"]
      },
      {
        field_name: "Years of Experience",
        operator: "isGreaterEqual",
        value: [5]
      }
    ]
  }
});
```

## Performance Optimization Tips

1. **Use reasonable filter conditions**: Reducing unnecessary conditions can improve query speed
2. **Appropriate sorting**: Only use sorting when needed, avoid complex sorting on large datasets
3. **Pagination handling**: Use pagination for large amounts of data to avoid loading too many records at once
4. **Indexed fields**: Create indexes for frequently filtered fields in Feishu
