export function isObject(data){
  return typeof data === 'object' && data !==null
}
export function  def(data,key,value){
  Object.defineProperty(data,key,{
    configurable:false,//能否使用delete、能否需改属性特性、或能否修改访问器属性、，false为不可重新定义，默认值为true
    enumerable:false,//对象属性是否可通过for-in循环，flase为不可循环，默认值为true
    value
  })
}

 export function proxy(vm,source,key){
   Object.defineProperty(vm,key,{
    get(){
      return vm[source][key]
    },
    set(newVlaue){
      vm[source][key] = newVlaue
    }
   })

}