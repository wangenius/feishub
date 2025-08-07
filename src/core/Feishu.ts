import { Table } from "./Table";

export class Feishu {
  private appId: string;
  private appSecret: string;
  private tenant_access_token: string;
  constructor(appId: string, appSecret: string);
  constructor(config: { appId: string; appSecret: string });
  constructor(
    appIdOrConfig: string | { appId: string; appSecret: string },
    appSecret?: string
  ) {
    if (typeof appIdOrConfig === "string") {
      this.appId = appIdOrConfig;
      this.appSecret = appSecret!;
    } else {
      this.appId = appIdOrConfig.appId;
      this.appSecret = appIdOrConfig.appSecret;
    }
    this.tenant_access_token = "";
  }

  async connect() {
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
    if (!this.tenant_access_token) {
      await this.getTenantAccessToken();
    }
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this.tenant_access_token}`,
      },
    };

    // GET 和 HEAD 请求不能有 body
    if (method.toUpperCase() !== "GET" && method.toUpperCase() !== "HEAD") {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // 获取响应文本
    const responseText = await response.text();
    
    // 检查响应是否为空
    if (!responseText.trim()) {
      throw new Error('Empty response from server');
    }
    
    // 尝试解析JSON
    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse JSON response:', responseText);
      throw new Error(`Invalid JSON response: ${error}`);
    }
  }
}
