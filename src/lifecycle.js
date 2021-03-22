import Watcher from './observe/watcher.js'
import {patch}  from './vdom/patch'
// 
export function lifecycleMixin(Vue){
  Vue.prototype._updata = function (vnode) {
      // 创建真是的dom 节点
      const vm = this
      // console.log(vm,vnode);
      vm.$el = patch(vm.$el,vnode)
  }

}
export function mountComponent(vm,el){
  const options = vm.$options
  vm.$el = el  // 真是的dom元素


  // Watcher 就是来渲染的
  // vm._render 通过解析render方法 渲染出虚拟dom _c_v_s 
  // vm._update 通过虚拟dom 创建真是的dom
  callHook(vm,'beforeMount');
  // 渲染页面
  let  updataComponent = () =>{  //无论渲染还是更新都会执行此方法
      // 返回的是虚拟dom
      vm._updata(vm._render())
  }

  // 渲染 Watcher  没一个组件都有一个Watcher  
  new Watcher(vm,updataComponent,()=>{},true)   //true  表示是一个渲染过程 
  callHook(vm,'mounted');
}

export function callHook(vm,hook){
  const handlers = vm.$options[hook]; // [fn,fn,fn]
  if(handlers){ // 找到对应的钩子依次执行
      for(let i =0; i< handlers.length;i++){
          handlers[i].call(vm);
      }
  }
}