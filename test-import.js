// 测试npm包导入
const { Feishu, Table } = require('./dist/index.js');

console.log('Feishu class:', typeof Feishu);
console.log('Table class:', typeof Table);

// 测试实例化
try {
  const feishu = new Feishu({
    appId: 'test_app_id',
    appSecret: 'test_app_secret'
  });
  console.log('Feishu instance created successfully');
  
  const table = feishu.table({
    tableId: 'test_table_id',
    appToken: 'test_app_token'
  });
  console.log('Table instance created successfully');
  
  console.log('\n✅ Package import test passed!');
} catch (error) {
  console.error('❌ Package import test failed:', error.message);
}