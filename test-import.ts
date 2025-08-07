// 测试类型导出
import { Feishu } from 'feishub';

// 测试类的实例化
const feishu = new Feishu({
  appId: 'test',
  appSecret: 'test'
});

console.log('Feishu type:', typeof Feishu);
console.log('Feishu instance:', feishu);