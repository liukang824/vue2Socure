import {observe} from './observe/index'
import { proxy} from './util/index'
export function initState(vm) {
  const opts = vm.$options
// vue 的数据来源 属性  方法  数据  计算属性  watch
    if(opts.props){
      initProps(vm)
    }  
    if(opts.methods){
      initMethod(vm)
    }
    if(opts.data){
        initDta(vm)
    }
    if(opts.computed){
      initComputed(vm)
    }
    if(opts.watch){
      initWatch(vm)
    }
  }

  function initProps(){}
  function initMethod(){}
  function initDta(vm){
      // 初始化数据
    let data = vm.$options.data
    data = vm._data = typeof data ==="function"?data.call(vm):data
    // 对象劫持  用户改变了数据 我希望可以通知到 刷新页面 
    // mvvm  收据变化可以驱动视图变化  
    // Object.defineProperty  ()   给属性增加get 方法 set  方法 
    // 对象劫持 用户改变了数据 我希望可以得到通知 =》 刷新页面
    // 为了让用户更好的使用 我希望可以直接vm.xxx
    // 做一个取值代理
    for(let key in data){
      proxy(vm,'__data',key )
    }

    observe(data)
  }
  function initComputed(){}
  function initWatch(){}