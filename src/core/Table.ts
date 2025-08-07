import { config } from "dotenv";
import { Feishu } from "./Feishu";

// 加载环境变量
config();

export interface FieldData {
  [key: string]: any;
}

export interface SearchResult<T> {
  items?: T[] | undefined;
  page_token?: string | undefined;
  has_more?: boolean | undefined;
}

export interface RecordData {
  record_id?: string | undefined;
  fields?: FieldData | undefined;
  created_time?: string | undefined;
  last_modified_time?: string | undefined;
}

export interface FieldInfo {
  field_id?: string | undefined;
  field_name?: string | undefined;
  type?: number | undefined;
  property?: any;
}

export interface SearchCondition {
  field_name: string;
  operator:
    | "is"
    | "isNot"
    | "contains"
    | "doesNotContain"
    | "isEmpty"
    | "isNotEmpty"
    | "isGreater"
    | "isGreaterEqual"
    | "isLess"
    | "isLessEqual"
    | "like"
    | "in"
    | "equal";
  value: any;
}

export interface SearchFilter {
  conjunction: "and" | "or";
  conditions: SearchCondition[];
}

export interface SearchSort {
  field_name: string;
  desc?: boolean;
}

export interface SearchOptions {
  filter?: SearchFilter;
  sort?: SearchSort[];
  page_token?: string;
  page_size?: number;
}

export interface TableMeta {
  app_token?: string;
  table_id?: string;
  table_name?: string;
  revision?: number;
}

/**
 * 使用FeishuTable 需要确认提供 appId、appSecret、appToken、 tableId
 */
export class Table<T extends FieldData = FieldData> {
  private appToken: string;
  private tableId: string;
  private client: Feishu;

  constructor({
    appToken,
    tableId,
    feishu,
  }: {
    appToken?: string;
    tableId?: string;
    feishu?: Feishu;
  } = {}) {
    /**
     * 初始化飞书表格客户端
     *
     * @param appToken - 多维表格的 FEISHU_APP_TOKEN，如果不提供则从环境变量获取
     * @param tableId - 表格的 FEISHU_TABLE_ID，如果不提供则从环境变量获取
     * @param appId - 飞书应用的 FEISHU_APP_ID，如果不提供则从环境变量获取
     * @param appSecret - 飞书应用的 FEISHU_APP_SECRET，如果不提供则从环境变量获取
     */
    this.appToken = appToken || process.env.FEISHU_APP_TOKEN || "";
    this.tableId = tableId || process.env.FEISHU_TABLE_ID || "";
    this.client =
      feishu ||
      new Feishu(
        process.env.FEISHU_APP_ID || "",
        process.env.FEISHU_APP_SECRET || ""
      );

    // 确保客户端创建成功
    if (!this.client) {
      throw new Error("客户端创建失败");
    }
  }

  /**
   * 插入记录
   *
   * @param fields - 要插入的字段数据
   * @returns 成功返回记录数据，失败返回 null
   */
  async insert(fields: T): Promise<RecordData | null> {
    try {
      const response = await this.client.query(
        `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.appToken}/tables/${this.tableId}/records`,
        "POST",
        {
          fields,
        }
      );

      if (response.code !== 0) {
        console.error(
          `插入记录失败, code: ${response.code}, msg: ${response.msg}`
        );
        return null;
      }

      return (response.data?.record as RecordData) || null;
    } catch (error) {
      console.error(`插入记录时发生异常: ${error}`);
      return null;
    }
  }

  /**
   * 删除记录
   *
   * @param recordId - 要删除的记录 ID
   * @returns 成功返回 true，失败返回 false
   */
  async delete(recordId: string): Promise<boolean> {
    try {
      const response = await this.client.query(
        `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.appToken}/tables/${this.tableId}/records/${recordId}`,
        "DELETE",
        {}
      );

      if (response.code !== 0) {
        console.error(
          `删除记录失败, code: ${response.code}, msg: ${response.msg}`
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error(`删除记录时发生异常: ${error}`);
      return false;
    }
  }

  /**
   * 获取多维表格元数据
   *
   * @returns 成功返回表格元数据，失败返回 null
   */
  async meta(): Promise<TableMeta | null> {
    try {
      const response = await this.client.query(
        `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.appToken}`,
        "GET",
        {}
      );

      if (response.code !== 0) {
        console.error(
          `获取表格元数据失败, code: ${response.code}, msg: ${response.msg}`
        );
        return null;
      }

      return (response.data?.app as TableMeta) || null;
    } catch (error) {
      console.error(`获取表格元数据时发生异常: ${error}`);
      return null;
    }
  }

  /**
   * 搜索记录
   *
   * @param options - 搜索选项
   * @returns 成功返回搜索结果，失败返回 null
   */
  async search(
    options: SearchOptions = {}
  ): Promise<SearchResult<RecordData> | null> {
    try {
      const body: any = {};

      if (options.filter) {
        body.filter = options.filter;
      }

      if (options.sort) {
        body.sort = options.sort;
      }

      if (options.page_token) {
        body.page_token = options.page_token;
      }

      if (options.page_size) {
        body.page_size = options.page_size;
      }

      const response = await this.client.query(
        `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.appToken}/tables/${this.tableId}/records/search`,
        "POST",
        body
      );

      if (response.code !== 0) {
        console.error(
          `搜索记录失败, code: ${response.code}, msg: ${response.msg}`
        );
        return null;
      }

      return {
        items: response.data?.items || [],
        page_token: response.data?.page_token,
        has_more: response.data?.has_more,
      };
    } catch (error) {
      console.error(`搜索记录时发生异常: ${error}`);
      return null;
    }
  }

  /**
   * 列出多维表格的所有字段
   *
   * @returns 成功返回字段列表，失败返回 null
   */
  async fields(): Promise<FieldInfo[] | null> {
    try {
      const response = await this.client.query(
        `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.appToken}/tables/${this.tableId}/fields`,
        "GET",
        {}
      );

      if (response.code !== 0) {
        console.error(
          `获取字段列表失败, code: ${response.code}, msg: ${response.msg}`
        );
        return null;
      }

      return (response.data?.items as FieldInfo[]) || [];
    } catch (error) {
      console.error(`获取字段列表时发生异常: ${error}`);
      return null;
    }
  }

  /**
   * 更新记录
   *
   * @param recordId - 要更新的记录 ID
   * @param fields - 要更新的字段数据
   * @returns 成功返回更新后的记录数据，失败返回 null
   */
  async update(
    recordId: string,
    fields: FieldData
  ): Promise<RecordData | null> {
    try {
      const response = await this.client.query(
        `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.appToken}/tables/${this.tableId}/records/${recordId}`,
        "PUT",
        {
          fields,
        }
      );

      if (response.code !== 0) {
        console.error(
          `更新记录失败, code: ${response.code}, msg: ${response.msg}`
        );
        return null;
      }

      return (response.data?.record as RecordData) || null;
    } catch (error) {
      console.error(`更新记录时发生异常: ${error}`);
      return null;
    }
  }
}
