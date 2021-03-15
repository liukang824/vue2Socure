(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      configurable: false,
      //能否使用delete、能否需改属性特性、或能否修改访问器属性、，false为不可重新定义，默认值为true
      enumerable: false,
      //对象属性是否可通过for-in循环，flase为不可循环，默认值为true
      value: value
    });
  }

  // 会对数组本身发生变化的一些方法  push shift  unshift pop reverse  sort  splice 
  // slice() 
  // value.__proto__ = arrayMethods  
  //  arrayMethods.__proto__ = oldArrayMethods
  var oldArrayMethods = Array.prototype; // 拿到数组原来的方法

  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // aop  切片进程  装饰着模式
      // oldArrayMethods 数组原型的方法  绑定this 执行 使重的方法 有效
      var result = oldArrayMethods[method].apply(this, args); //对原型的this 绑定 调用原生的数组方法

      var ob = this.__ob__;
      var inserted; //当前用户插入的元素

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          //3个惨数 新增的属性 删除修改  功能
          inserted = args.splice(2);
      }

      if (inserted) ob.observerArray(inserted); //新增的属性继续观测

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // vue 如果数据的层次过多 需要递归的去解析对象中的属性 一次的get和set
      // value.__ob__ = this   //给每一个监控过的对象新增加一个__ob__ 属性
      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        //初始化工作 
        // 数组并不会将对索引进行观测因为谁导致性能问题
        // 如果是数组的话 并不会对索引进行观测 因为消耗过大 
        // 前端开发中很少操作索引  
        value.__proto__ = arrayMethods; //装饰模式 
        // 如果数组中放的是对象我再去监控

        this.observerArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (item) {
          defineReactive(data, item, data[item]); //定义响应式数据
        });
      }
    }, {
      key: "observerArray",
      value: function observerArray(value) {
        value.forEach(function (item) {
          observe(item);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value);
    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return; //  监控的值是一个对象的话 再次监控observe(value)

        observe(value);
        value = newValue;
      }
    });
  }

  function observe(data) {
    // 判断是不是object 
    var isobj = isObject(data);
    if (!isobj) return;
    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options; // vue 的数据来源 属性  方法  数据  计算属性  watch

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
    var data = vm.$options.data;
    data = vm._data = typeof data === "function" ? data.call(vm) : data; // 对象劫持  用户改变了数据 我希望可以通知到 刷新页面 
    // mvvm  收据变化可以驱动视图变化  
    // Object.defineProperty  ()   给属性增加get 方法 set  方法 

    observe(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // 数据劫持 
      var vm = this; // vue 中使用this.$options 指代表就是用传递的属性

      vm.$options = options; //  初始化状态

      initState(vm); //分割代码
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
