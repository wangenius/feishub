# feishub

feishub 是一个 飞书的 sdk。

```shell
npm i feishub
```

## 快速开始

```typescript
import { Feishu, Table } from "feishub";

const feishu = new Feishu({
  appId: "cli_xxxx",
  appSecret: "xxxx",
});
const table = feishu.table({
  tableId: "xxxx",
  appToken: "xxxx",
});

// 或者
const table = new Table({
  appToken: "xxxx",
  tableId: "xxxx",
  feishu,
});

// 获取多维表格元数据
const meta = await table.meta();
// 插入记录
table.insert({});
// 更新记录
table.update("id", {});
// 删除记录
table.delete("id");
// 搜索记录
table.search({
  filter: {
    conjunction: "and",
    conditions: [
      {
        field_name: "name",
        // is isNot contains doesNotContain isEmpty isNotEmpty isGreater isGreaterEqual isLess isLessEqual like in
        operator: "equal",
        // string[]
        value: "张三",
      },
    ],
  },
  sort: [
    {
      field_name: "name",
      desc: true,
    },
  ],
});
// 列出多维表格的所有字段
table.fields();
```
