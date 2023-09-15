
import { IProxyHttp } from "../../types";

export class ProxyHttp {
  private configAdapter: any;
  private utils:any;
  private reqInterceptor:any;
  private resInterceptor:any;

  constructor(){
    this.configAdapter = null;
    this.utils = null;
    this.initInterceptor();
  }

  initInterceptor(): void {

  }
}