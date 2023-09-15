// 请求对象: 汇总模块内的各类方法
export interface IProxyHttp {
  get<T, K>(api: string, params: K, path?: string[]): Promise<T>;
  // ...
  initInterceptors(): void;
}