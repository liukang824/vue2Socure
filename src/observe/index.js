import {isObject} from '../util/index'
import {arrayMethods} from './array'
class Observer{
  constructor(value){
    // 如果收据的层次过多 需要递归的去解析对象中的属性 依次在呢个价set 和get  方法 
    if(Array.isArray(value)){
      // 如果是数组的话 并不会对索引进行观测 因为消耗过大 
      // 前端开发中很少操作索引  
      value.__proto__ = observerArray  //装饰模式 
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
  observe(value)
    Object.defineProperty(data,key,{
      get(){
        return value
      },
      set(newValue){
        if(newValue===value)return;
        //  监控的值是一个对象的话 再次监控observe(value)
            observe(value)
            value = newValue
        }
    })
}
export function observe(data){
  // 判断是不是object 
  let isobj = isObject (data)
  if(!isobj)return;
  return new Observer(data)
}