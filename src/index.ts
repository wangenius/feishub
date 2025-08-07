// 直接导出类，确保TypeScript正确识别
export { Feishu } from "./core/Feishu";
export { Table } from "./core/Table";

// 默认导出
import { Feishu } from "./core/Feishu";
import { Table } from "./core/Table";

export default {
  Feishu,
  Table
};
