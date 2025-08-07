// 测试导入类型是否正确
import { Feishu } from './dist/index.js';

// 现在应该能正确识别 Feishu 为类
const feishu = new Feishu({
  appId: 'test',
  appSecret: 'test'
});

console.log('Feishu instance created:', feishu);