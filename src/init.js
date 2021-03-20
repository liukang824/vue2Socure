
import { initState } from './state'
import { compileToFunction } from './compiler/index.js'
import { mountComponent } from './lifecycle.js'
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 数据劫持 
    const vm = this  // vue 中使用this.$options 指代表就是用传递的属性
    vm.$options = options
    //  初始化状态
    initState(vm)  //分割代码


    // 如果有用户传入了el 属性 需要将页面渲染出来
    // 如果用户传入了el 就要实现挂在流程
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }
  Vue.prototype.$mount = function (el) {
    //1 保存this
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)


    //  默认会先查找有没有render 方法 再去查找有没有 template  最后查找 el  
    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML;
      }
      const render = compileToFunction(template)
      //我们需要将template转成render 方法 2.0  虚拟dom
      // 把render  方法放到options
      options.render = render
      // console.log(template);
      // 挂在当前组件 
      mountComponent(vm,el)
    }

  }
} 