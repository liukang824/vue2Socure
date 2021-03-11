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
      oldArrayMethods[method].apply(this,args)  //对原型的this 绑定 调用原生的数组方法
    }
  });