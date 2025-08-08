---
title: Getting Started
order: 1
---

# Getting Started

Welcome to Feishub! This is a powerful yet simple TypeScript SDK for Feishu multi-dimensional tables.

## Installation

Install with npm:

```bash
npm install feishub
```

Install with yarn:

```bash
yarn add feishub
```

Install with pnpm:

```bash
pnpm add feishub
```

## Basic Configuration

### Getting Credentials

Before using Feishub, you need to obtain the following information from Feishu Open Platform:

1. **App ID** - Application ID
2. **App Secret** - Application Secret
3. **App Token** - Multi-dimensional table app token
4. **Table ID** - Table ID

### Environment Variables (Optional)

You can set these credentials via environment variables:

```bash
# .env file
FEISHU_APP_ID=cli_xxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxx
FEISHU_APP_TOKEN=xxxxxxxxxxxxxxxxxx
FEISHU_TABLE_ID=xxxxxxxxxxxxxxxxxx
```

## Basic Usage

### Method 1: Using Feishu Class

```typescript
import { Feishu } from "feishub";

// Create Feishu instance
const feishu = new Feishu({
  appId: "cli_xxxx",
  appSecret: "xxxx",
});

// Create table instance
const table = feishu.table({
  tableId: "xxxx",
  appToken: "xxxx",
});

// Get table metadata
const meta = await table.meta();
console.log(meta);
```

### Method 2: Using Table Class Directly

```typescript
import { Table, Feishu } from "feishub";

// Create Feishu client
const feishu = new Feishu({
  appId: "cli_xxxx",
  appSecret: "xxxx",
});

// Create table instance directly
const table = new Table({
  appToken: "xxxx",
  tableId: "xxxx",
  feishu,
});
```

### Method 3: Using Environment Variables

If you have set environment variables, you can create instances more simply:

```typescript
import { Table } from "feishub";

// Will automatically read configuration from environment variables
const table = new Table();
```

## Basic Operation Examples

### Insert Record

```typescript
const result = await table.insert({
  name: "John Doe",
  age: 25,
  email: "john@example.com"
});

if (result) {
  console.log("Insert successful:", result.record_id);
} else {
  console.log("Insert failed");
}
```

### Search Records

```typescript
const searchResult = await table.search({
  filter: {
    conjunction: "and",
    conditions: [
      {
        field_name: "name",
        operator: "equal",
        value: ["John Doe"]
      }
    ]
  }
});

if (searchResult?.items) {
  console.log("Found records:", searchResult.items.length);
}
```

### Update Record

```typescript
const updated = await table.update("record_id", {
  age: 26
});

if (updated) {
  console.log("Update successful");
}
```

### Delete Record

```typescript
const deleted = await table.delete("record_id");

if (deleted) {
  console.log("Delete successful");
}
```

## Next Steps

Now that you understand the basic usage, you can continue learning:

- [Table Operations](./table-operations) - Learn about various table operations
- [Search and Filter](./search-and-filter) - Learn advanced search functionality
- [Error Handling](./error-handling) - Learn how to handle error situations
