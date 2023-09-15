import { ServiceFactory } from "./factory";

export class BaseService {
  protected proxyHttp: any;

  constructor() {
    this.proxyHttp = ServiceFactory.createProxyHttp();
  }
}