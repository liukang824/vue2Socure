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


const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]

let strats ={}
function mergeHook(parentVal,childVal){
  if(childVal){
    if(parentVal){
      return parentVal.concat(childVal);
    }else{
      
      return [childVal];
    }
  }else{
    return parentVal;
  }
}
LIFECYCLE_HOOKS.forEach(hook=>{
  strats[hook] = mergeHook
})

export function  mergeOptions(parent,child){
  const options = {}

  for(let key in parent){
    mergeField(key);
  }
  for(let key in child ){
    if(!parent.hasOwnProperty(key)){  //如果已经和平过了 就不需要合并了
      mergeField(key)
    }
  }
    // 默认的合并策略 但是有些属性 需要有特殊的合并方式 生命周期的合并
  function mergeField(key){
    if(strats[key]){
      return options[key] = strats[key](parent[key],child[key])
    }
    if(typeof parent[key] === 'object'  && typeof child[key] === 'object'){
      options[key]={
        ...parent[key],
        ...child[key]
      }
      
    }else  if(child[key] === null){
        options[key] = parent[key]
    }else{
      options[key] = child[key];
    }
  }
  return options;
}


