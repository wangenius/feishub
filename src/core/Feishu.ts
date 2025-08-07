import { Table } from "./Table";

export class Feishu {
  private appId: string;
  private appSecret: string;
  private tenant_access_token: string;
  constructor(appId: string, appSecret: string);
  constructor(config: { appId: string; appSecret: string });
  constructor(appIdOrConfig: string | { appId: string; appSecret: string }, appSecret?: string) {
    if (typeof appIdOrConfig === 'string') {
      this.appId = appIdOrConfig;
      this.appSecret = appSecret!;
    } else {
      this.appId = appIdOrConfig.appId;
      this.appSecret = appIdOrConfig.appSecret;
    }
    this.tenant_access_token = "";
  }

  async init() {
    await this.getTenantAccessToken();
  }

  // 获取租户 access token
  private async getTenantAccessToken() {
    const url =
      "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        app_id: this.appId,
        app_secret: this.appSecret,
      }),
    });
    const data = await response.json();
    this.tenant_access_token = data.tenant_access_token;
  }

  // 表格
  table({ tableId, appToken }: { tableId: string; appToken: string }) {
    return new Table({
      tableId,
      appToken,
      feishu: this,
    });
  }

  // 发送请求
  async query(url: string, method: string, data: any) {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this.tenant_access_token}`,
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
}
