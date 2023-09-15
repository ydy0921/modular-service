
export abstract class ServiceFactory {
  public static configAdapter:any;
  public static proxyHttp:any; //! 实际发送请求的axios实例
  public static utils:any;
  public static instantiatedServices: Object[] = []; //! 已经实例化的service模块

  //* 单例创建服务模块实例
  public static createService(serviceClass:Function):any {
    if (!serviceClass) {
      console.error("service class is none or error");
      return;
    }

    let serviceInstance: any = null;
    serviceInstance = this.instantiatedServices.find((serve) => {
      return serve instanceof serviceClass;
    });

    if (!serviceInstance) {
      // @ts-ignore
      serviceInstance = new serviceClass();
      this.instantiatedServices.push(serviceInstance);
    }
    return serviceInstance;
  }

  //* 单例创建Axios承载对象实例
  public static createProxyHttp():any {
    if(!this.proxyHttp) {
      // this.proxyHttp = createProxyHttp(ProxyHttp);
    }
    return this.proxyHttp;
  }
} 