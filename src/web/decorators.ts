import { ServiceFactory } from "./factory";
/**
 **1. 属性装饰器
 * @param target 静态属性是类的构造函数，实例的属性是类的原型对象
 * @param property 属性名称
 **2. 用法
 * 在需要使用的组件class中，引用待使用service类，并通过该装饰器注入
 * @AutowiredService(UserService)
 * userService:any
 */
export function AutowiredService(serviceClass: Function) {
  return (target: any, property: string) => {
    if (!serviceClass) {
      console.error(`${target.constructor.name}中服务定义错误！`);
      return;
    }
    let serveTemp = ServiceFactory.createService(serviceClass);
    const getter = () => {
      if (serveTemp) {
        return serveTemp;
      } else {
        return () => {
          return null;
        };
      }
    };

    Object.defineProperty(target, property, {
      configurable: true,
      enumerable: true,
      get: getter,
      set: undefined,
    });
  };
}