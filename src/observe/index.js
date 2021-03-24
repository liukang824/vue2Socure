import {isObject,def} from '../util/index'
import {arrayMethods} from './array'
import Dep from './dep.js';
class Observer{
  constructor(value){
     this.dep = new Dep // 给数组用的
   // vue 如果数据的层次过多 需要递归的去解析对象中的属性 一次的get和set
    // value.__ob__ = this   //给每一个监控过的对象新增加一个__ob__ 属性
    def(value,'__ob__',this)
    if(Array.isArray(value)){  //初始化工作 
        // 数组并不会将对索引进行观测因为谁导致性能问题
      // 如果是数组的话 并不会对索引进行观测 因为消耗过大 
      // 前端开发中很少操作索引  
      value.__proto__ = arrayMethods  //装饰模式 
      // 如果数组中放的是对象我再去监控
      this.observerArray(value)
    }else{
      this.walk(value)
    }
    
  }
  walk(data){
    let keys = Object.keys(data)
    keys.forEach(item => {
      defineReactive(data,item,data[item])  //定义响应式数据
    });
  }
  observerArray(value){
    value.forEach(item => {
        observe(item)
    });
  }
}
function defineReactive(data,key,value){
  let dep = new Dep()  //这个dep 给对象使用
      // 这里这个value可能是数组 也可能是对象 ，返回的结果是observer的实例，当前这个value对应的observer
   let childOb = observe(value) // 数组的observer实例
    Object.defineProperty(data,key,{
      configurable:true,
      enumerable:true,
      get(){ //  获取值的时候做一些操作 
         // 每个属性都对应着自己的watcher
         if(Dep.target){  //如果当前有watcher 
            dep.depend()  //意味着我要将watcher 存起来 

          if(childOb){ // *******数组的依赖收集*****
            childOb.dep.depend()  // 收集了数组的相关依赖 
            // 如果数组中还有数组 
            if(Array.isArray(value)){
                dependArray(value)
            }
          }
         }
        return value
      },
      set(newValue){
        if(newValue===value)return;
        //  监控的值是一个对象的话 再次监控observe(value)
            observe(value)
            value = newValue
          dep.notify()  //通知依赖收集watcher 进行更新操作
        }
    })
}
function dependArray(value){
  for(let i =0; i<value.length; i++){
    let current = value[i]  //将数组的每一项取出来数据变化后也去视图更新
    current.__ob__&& current.__ob__.dep.depend()
    if(Array.isArray(current)){
      dependArray(current)
    }

  }
}
export function observe(data){
  // 判断是不是object 
  let isobj = isObject (data)
  if(!isobj)return;
  return new Observer(data)
}