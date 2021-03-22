
// import { initState } from './state'
// import { compileToFunction } from './compiler/index.js'
// import { mountComponent } from './lifecycle.js'
// export function initMixin(Vue) {
//   Vue.prototype._init = function (options) {
//     // 数据劫持 
//     const vm = this  // vue 中使用this.$options 指代表就是用传递的属性
//     vm.$options = options
//     //  初始化状态
//     initState(vm)  //分割代码


//     // 如果有用户传入了el 属性 需要将页面渲染出来
//     // 如果用户传入了el 就要实现挂在流程
//     if (vm.$options.el) {
//       vm.$mount(vm.$options.el);
//     }
//   }
//   Vue.prototype.$mount = function (el) {
//     //1 保存this
//     const vm = this
//     const options = vm.$options
//     el = document.querySelector(el)


//     //  默认会先查找有没有render 方法 再去查找有没有 template  最后查找 el  
//     if (!options.render) {
//       let template = options.template
//       if (!template && el) {
//         template = el.outerHTML;
//       }
//       const render = compileToFunction(template);
//       //我们需要将template转成render 方法 2.0  虚拟dom
//       // 把render  方法放到options
//       options.render = render
//       // console.log(template);
     
    
//     }
//      // 挂在当前组件 
//     mountComponent(vm,el)
//   }
// } 
import {initState} from './state'

import {compileToFunction} from './compiler/index.js'

import {mountComponent,callHook} from './lifecycle'
import {mergeOptions} from './util/index';
// 在原型上添加一个init方法
export function initMixin(Vue){
    // 初始化流程
    Vue.prototype._init = function (options) {
        // 数据的劫持
        const vm = this; // vue中使用 this.$options 指代的就是用户传递的属性
           // 将用户传递的 和 全局的进行一个合并 
        vm.$options = mergeOptions(vm.constructor.options,options)
        // vm.$options = options;
        callHook(vm,'beforeCreate')
        // 初始化状态
        initState(vm); // 分割代码
        callHook(vm,'created');
        // 如果用户传入了el属性 需要将页面渲染出来
        // 如果用户传入了el 就要实现挂载流程

        if(vm.$options.el){
            vm.$mount(vm.$options.el);
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el); 
        // 默认先会查找有没有render方法，没有render 会 采用template template也没有就用el中的内容
        if(!options.render){
            // 对模板进行编译
            let template = options.template; // 取出模板
            if(!template && el){
                template = el.outerHTML;
            }
            const render = compileToFunction(template);
            options.render = render;
            // 我们需要将template 转化成render方法 vue1.0 2.0虚拟dom 
        }
        
        // 渲染当前的组件 挂载这个组件
        mountComponent(vm,el);
    }
}