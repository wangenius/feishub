import { Feishu as FeishuClass } from "./core/Feishu";
import { Table as TableClass } from "./core/Table";

export const Feishu = FeishuClass;
export const Table = TableClass;

// 同时导出类型
export type { Feishu as FeishuType } from "./core/Feishu";
export type { Table as TableType } from "./core/Table";
