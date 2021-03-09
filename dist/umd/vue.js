(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function isObject(data) {
    return typeof data === 'object' && data !== null;
  }

  class Observer {
    constructor(value) {
      // 如果收据的层次过多 需要递归的去解析对象中的属性 依次在呢个价set 和get  方法 
      if (Array.isArray(value)) {
        // 如果是数组的话 并不会对索引进行观测 因为消耗过大 
        // 前端开发中很少操作索引  
        value.__proto__ = observerArray; //装饰模式 
        // 如果数组中放的是对象我再去监控

        this.observerArray(value);
      } else {
        this.walk(value);
      }
    }

    walk(data) {
      let keys = Object.keys(data);
      keys.forEach(item => {
        defineReactive(data, item, data[item]); //定义响应式数据
      });
    }

    observerArray(value) {
      value.forEach(item => {
        observe(item);
      });
    }

  }

  function defineReactive(data, key, value) {
    observe(value);
    Object.defineProperty(data, key, {
      get() {
        return value;
      },

      set(newValue) {
        if (newValue === value) return; //  监控的值是一个对象的话 再次监控observe(value)

        observe(value);
        value = newValue;
      }

    });
  }

  function observe(data) {
    // 判断是不是object 
    let isobj = isObject(data);
    if (!isobj) return;
    return new Observer(data);
  }

  function initState(vm) {
    const opts = vm.$options; // vue 的数据来源 属性  方法  数据  计算属性  watch

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initDta(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initDta(vm) {
    // 初始化数据
    let data = vm.$options.data;
    data = vm._data = typeof data === "function" ? data.call(vm) : data; // 对象劫持  用户改变了数据 我希望可以通知到 刷新页面 
    // mvvm  收据变化可以驱动视图变化  
    // Object.defineProperty  ()   给属性增加get 方法 set  方法 

    observe(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // 数据劫持 
      const vm = this; // vue 中使用this.$options 指代表就是用传递的属性

      vm.$options = options; //  初始化状态

      initState(vm);
    };
  }

  function Vue(options) {
    // 初始化
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
