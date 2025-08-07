// 测试npm包导入
require('dotenv').config();
const { Feishu, Table } = require("./dist/index.js");

console.log("Feishu class:", typeof Feishu);
console.log("Table class:", typeof Table);

// 测试实例化
async function test() {
  try {
    // 检查环境变量
    const appId = process.env.FEISHU_APP_ID;
    const appSecret = process.env.FEISHU_APP_SECRET;
    const tableId = process.env.FEISHU_TABLE_ID;
    const appToken = process.env.FEISHU_APP_TOKEN;

    if (!appId || !appSecret || !tableId || !appToken) {
      console.log("⚠️  环境变量未配置，使用测试凭证（可能已过期）");
      console.log("请创建 .env 文件并配置正确的凭证:");
      console.log("FEISHU_APP_ID=your_app_id");
      console.log("FEISHU_APP_SECRET=your_app_secret");
      console.log("FEISHU_TABLE_ID=your_table_id");
      console.log("FEISHU_APP_TOKEN=your_app_token");
      console.log("");
    }

    const feishu = new Feishu({
      appId: appId || "cli_a803616748b8d013",
      appSecret: appSecret || "yLJF0j54gV3hu3xroSHy6fmCebB0xGHQ",
    });
    console.log("Feishu instance created successfully");

    // 先测试连接
    console.log("Testing connection...");
    await feishu.connect();
    console.log("Connection successful");

    const table = feishu.table({
      tableId: tableId || "tbl7Q2TvYwkUGFc0",
      appToken: appToken || "MKoEb9qWTayowZspl0Hc9aMwnIc",
    });
    console.log("Table instance created successfully");
    
    // 先获取表格元数据
    console.log("Getting table metadata...");
    const meta = await table.meta();
    if (meta) {
      console.log("Table metadata:", meta);
    } else {
      console.log("❌ Failed to get table metadata");
      return;
    }

    // 获取字段信息
    console.log("Getting table fields...");
    const fields = await table.fields();
    if (fields) {
      console.log("Available fields:", fields.map(f => f.field_name));
    } else {
      console.log("❌ Failed to get table fields");
      return;
    }

    // 执行搜索（使用更简单的条件）
    console.log("Performing search...");
    const result = await table.search({
      page_size: 1 // 只获取一条记录进行测试
    });
    
    if (result) {
      console.log("Search result:", {
        items_count: result.items?.length || 0,
        has_more: result.has_more,
        page_token: result.page_token
      });
      if (result.items && result.items.length > 0) {
        console.log("First record:", result.items[0]);
      }
    } else {
      console.log("❌ Search failed");
    }

    console.log("\n✅ Package import test passed!");
  } catch (error) {
    console.error("❌ Package import test failed:", error.message);
    console.error("Full error:", error);
  }
}
test();
