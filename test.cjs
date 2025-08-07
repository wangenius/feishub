// CommonJS测试文件
const { Feishu, Table } = require('./dist/index.cjs');

console.log('CommonJS导入测试成功!');
console.log('Feishu类:', typeof Feishu);
console.log('Table类:', typeof Table);

// 创建实例测试
const feishu = new Feishu();
console.log('Feishu实例创建成功:', feishu instanceof Feishu);

console.log('所有测试通过! 🎉');