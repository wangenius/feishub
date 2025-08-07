import { Feishu } from './src/index';

// 测试类型推断
const feishu1 = new Feishu(); // 无参数构造
const feishu2 = new Feishu({ appId: 'test', appSecret: 'test' }); // 带参数构造
const feishu3 = new Feishu({ appId: 'test' }); // 部分参数构造

console.log('Types work correctly!');