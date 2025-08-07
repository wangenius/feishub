import { Table, FieldData } from "./src/core/Table";
import { Feishu } from "./src/core/Feishu";

// 定义用户数据接口
interface UserData extends FieldData {
  name: string;
  email: string;
  age: number;
  department?: string;
}

// 示例：测试 Table 类的各种功能
async function testTableOperations() {
  try {
    console.log("=== 飞书多维表格 Table 类测试示例 ===");
    
    // 方式1: 使用环境变量初始化
    console.log("\n1. 初始化 Table 实例（使用环境变量）");
    const table = new Table<UserData>();
    
    // 方式2: 手动指定参数初始化
    console.log("\n2. 初始化 Table 实例（手动指定参数）");
    const customTable = new Table<UserData>({
      appToken: "your_app_token_here",
      tableId: "your_table_id_here",
      feishu: new Feishu("your_app_id", "your_app_secret")
    });
    
    // 测试获取表格元数据
    console.log("\n3. 获取表格元数据");
    const meta = await table.meta();
    if (meta) {
      console.log("表格元数据:", meta);
    } else {
      console.log("获取表格元数据失败");
    }
    
    // 测试获取字段信息
    console.log("\n4. 获取表格字段信息");
    const fields = await table.fields();
    if (fields) {
      console.log("字段列表:", fields);
    } else {
      console.log("获取字段信息失败");
    }
    
    // 测试插入记录
    console.log("\n5. 插入新记录");
    const newUser: UserData = {
      name: "张三",
      email: "zhangsan@example.com",
      age: 25,
      department: "技术部"
    };
    
    const insertResult = await table.insert(newUser);
    if (insertResult) {
      console.log("插入成功:", insertResult);
      
      // 测试更新记录
      if (insertResult.record_id) {
        console.log("\n6. 更新记录");
        const updateData = {
          age: 26,
          department: "产品部"
        };
        
        const updateResult = await table.update(insertResult.record_id, updateData);
        if (updateResult) {
          console.log("更新成功:", updateResult);
        } else {
          console.log("更新失败");
        }
      }
    } else {
      console.log("插入失败");
    }
    
    // 测试搜索记录
    console.log("\n7. 搜索记录");
    
    // 简单搜索（获取所有记录）
    const allRecords = await table.search();
    if (allRecords) {
      console.log(`找到 ${allRecords.items?.length || 0} 条记录`);
      console.log("记录列表:", allRecords.items);
    }
    
    // 条件搜索
    const searchWithFilter = await table.search({
      filter: {
        conjunction: "and",
        conditions: [
          {
            field_name: "age",
            operator: "isGreater",
            value: 20
          },
          {
            field_name: "department",
            operator: "contains",
            value: "技术"
          }
        ]
      },
      sort: [
        {
          field_name: "age",
          desc: false
        }
      ],
      page_size: 10
    });
    
    if (searchWithFilter) {
      console.log("条件搜索结果:", searchWithFilter.items);
    }
    
    // 测试删除记录（注意：这会真的删除数据，请谨慎使用）
    if (insertResult?.record_id) {
      console.log("\n8. 删除记录（已注释，取消注释可测试删除功能）");
      // const deleteResult = await table.delete(insertResult.record_id);
      // if (deleteResult) {
      //   console.log("删除成功");
      // } else {
      //   console.log("删除失败");
      // }
    }
    
  } catch (error) {
    console.error("测试过程中发生错误:", error);
  }
}

// 示例：使用 Feishu 类创建 Table 实例
async function testFeishuTableCreation() {
  console.log("\n=== 使用 Feishu 类创建 Table 实例 ===");
  
  try {
    // 创建 Feishu 客户端
    const feishu = new Feishu({
      appId: process.env.FEISHU_APP_ID || "your_app_id",
      appSecret: process.env.FEISHU_APP_SECRET || "your_app_secret"
    });
    
    // 初始化客户端（获取 access token）
    await feishu.init();
    
    // 创建表格实例
    const table = feishu.table({
      appToken: process.env.FEISHU_APP_TOKEN || "your_app_token",
      tableId: process.env.FEISHU_TABLE_ID || "your_table_id"
    });
    
    // 测试获取表格信息
    const meta = await table.meta();
    console.log("表格信息:", meta);
    
  } catch (error) {
    console.error("Feishu 客户端测试失败:", error);
  }
}

// 运行测试
if (require.main === module) {
  console.log("开始测试...");
  console.log("\n请确保已设置以下环境变量:");
  console.log("- FEISHU_APP_ID: 飞书应用 ID");
  console.log("- FEISHU_APP_SECRET: 飞书应用密钥");
  console.log("- FEISHU_APP_TOKEN: 多维表格 App Token");
  console.log("- FEISHU_TABLE_ID: 表格 ID");
  console.log("\n或者在代码中直接指定这些参数\n");
  
  // 运行测试
  testTableOperations()
    .then(() => testFeishuTableCreation())
    .then(() => console.log("\n测试完成！"))
    .catch(error => console.error("测试失败:", error));
}

export { testTableOperations, testFeishuTableCreation };