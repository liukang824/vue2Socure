// 会对数组本身发生变化的一些方法  push shift  unshift pop reverse  sort  splice 
// slice() 
// value.__proto__ = arrayMethods  
//  arrayMethods.__proto__ = oldArrayMethods
let oldArrayMethods = Array.prototype ;// 拿到数组原来的方法
export let arrayMethods = Object.create(oldArrayMethods)

const methods=[
  'push',
  'shift',
  'unshift',
  'pop',
  'reverse',
  'sort',
  'splice'
]
  methods.forEach(method => {
    arrayMethods[method] = function (...args) {
      // aop  切片进程  装饰着模式
      // oldArrayMethods 数组原型的方法  绑定this 执行 使重的方法 有效
      const result =   oldArrayMethods[method].apply(this,args)  //对原型的this 绑定 调用原生的数组方法
      let ob  = this.__ob__;
      let inserted;  //当前用户插入的元素
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args
          break;
        case 'splice' :  //3个惨数 新增的属性 删除修改  功能
         inserted = args.splice(2)
        default:
          break;
      }
      if(inserted) ob.observerArray(inserted) ;  //新增的属性继续观测
      return result;
    }
  });