---
title: Table Operations
order: 2
---

# Table Operations

This chapter details various table operations supported by Feishub.

## Table Metadata

Get basic information about the table:

```typescript
const meta = await table.meta();

if (meta) {
  console.log("Table name:", meta.table_name);
  console.log("App token:", meta.app_token);
  console.log("Table ID:", meta.table_id);
  console.log("Revision:", meta.revision);
}
```

## Field Management

### Get All Fields

```typescript
const fields = await table.fields();

if (fields) {
  fields.forEach(field => {
    console.log("Field name:", field.field_name);
    console.log("Field ID:", field.field_id);
    console.log("Field type:", field.type);
    console.log("Field properties:", field.property);
  });
}
```

### Field Type Description

Feishu multi-dimensional tables support various field types:

- `1` - Multi-line text
- `2` - Number
- `3` - Single select
- `4` - Multi-select
- `5` - Date
- `7` - Checkbox
- `11` - User
- `13` - Phone number
- `15` - URL
- `17` - Attachment
- `18` - Link
- `20` - Formula
- `21` - Bidirectional link

## Record Operations

### Insert Record

#### Basic Insert

```typescript
const newRecord = await table.insert({
  "Name": "John Smith",
  "Age": 30,
  "Email": "john@example.com",
  "Active": true
});
```

#### Insert Complex Data Types

```typescript
// Insert records with multi-select, user, date and other complex types
const complexRecord = await table.insert({
  "Name": "Jane Doe",
  "Skills": ["JavaScript", "TypeScript", "React"], // Multi-select
  "Start Date": 1672531200000, // Timestamp
  "Manager": [{
    "id": "ou_xxxx",
    "name": "John Manager"
  }], // User field
  "Salary": 15000 // Number
});
```

### Batch Insert

Although the API can only insert one record at a time, you can use loops for batch insertion:

```typescript
const records = [
  { "Name": "Employee 1", "Department": "Engineering" },
  { "Name": "Employee 2", "Department": "Product" },
  { "Name": "Employee 3", "Department": "Operations" }
];

const results = [];
for (const record of records) {
  const result = await table.insert(record);
  if (result) {
    results.push(result);
  }
  // Avoid too frequent requests
  await new Promise(resolve => setTimeout(resolve, 100));
}

console.log(`Successfully inserted ${results.length} records`);
```

### Update Record

#### Basic Update

```typescript
const recordId = "recxxxxxx";
const updated = await table.update(recordId, {
  "Age": 31,
  "Email": "newemail@example.com"
});
```

#### Partial Field Update

```typescript
// Only update specified fields, other fields remain unchanged
const updated = await table.update(recordId, {
  "Last Login": Date.now()
});
```

### Delete Record

```typescript
const recordId = "recxxxxxx";
const deleted = await table.delete(recordId);

if (deleted) {
  console.log("Record deleted successfully");
} else {
  console.log("Record deletion failed");
}
```

## Type Safety

Feishub supports TypeScript generics, allowing you to define record types:

```typescript
interface Employee {
  Name: string;
  Age: number;
  Department: string;
  Email?: string;
  Active: boolean;
}

const table = new Table<Employee>({
  appToken: "xxxx",
  tableId: "xxxx",
  feishu
});

// Now the insert method will have type checking
const employee = await table.insert({
  Name: "John Doe",
  Age: 25,
  Department: "Engineering",
  Active: true
});
```

## Error Handling

All operations return `null` to indicate failure, it's recommended to always check return values:

```typescript
const result = await table.insert(data);

if (result) {
  console.log("Operation successful:", result);
} else {
  console.log("Operation failed, please check logs");
}
```

## Next Steps

- [Search and Filter](./search-and-filter) - Learn how to search and filter records
- [Error Handling](./error-handling) - Learn error handling best practices
