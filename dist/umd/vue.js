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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
    // 对象劫持 用户改变了数据 我希望可以得到通知 =》 刷新页面
    // 为了让用户更好的使用 我希望可以直接vm.xxx
    // 做一个取值代理

    for (var key in data) {
      proxy(vm, '__data', key);
    }

    observe(data);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <aaa:asdads>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  <div>
  var root = null; //ast 语法树的根

  var currentParent; //识别当前父亲是谁

  var stack = [];
  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs: attrs,
      parent: null
    };
  } // 开始标签


  function start(tagName, attrs) {
    var element = createASTElement(tagName, attrs);

    if (!root) {
      root = element;
    } // 把当前元素标记成父ast


    currentParent = element;
    stack.push(element); //把标签存放在栈里
  }

  function end(tagName) {
    var element = stack.pop(); //拿到的是ast对象
    //我要表示当前这个p属于这个div 的儿子

    currentParent = stack[stack.length - 1];

    if (currentParen) {
      element.parent = currentParent;
      currentParent.children.push(element); //实现了一个树的父子关系
    }
  }

  function chars(text) {
    text = text.RegExp(/\s/g, ''); //去掉所有空字符串

    if (text) {
      currentParent.children.push({
        text: text,
        type: TEXT_TYPE
      });
    }
  }

  function parseHTML(html) {
    // 不停的去截取html字符串
    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        // 当前索引为0 肯定是一个开始标签 
        var startTagMatch = parseStartTag(); // 通过这个方法获取匹配的结果 tagname attrs

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue; // 如果开始标签匹配完毕后 继续下一次 匹配
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length); //删除结束标签

          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length); //删除文本属性

        chars(text);
      }
    } // 删除标签 


    function advance(n) {
      html = html.substring(n);
    } // 通过这个方法获取到匹配的结果 tagName,attrs


    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); //删除已经匹配的标签

        var _end, attr; //匹配结束标签  匹配属性


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 将属性解析 
          advance(attr[0].length); // 删除属性 

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  // argumens[0] = 匹配到的标签  arguments[1] 匹配到的标签名字

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function compileToFunction(template) {
    console.log(template); // 1 解析字符串将HTML 字符串 => ast  语法

    var root = parseHTML(template); // 需要将ast 语法树生成最终的render函数  就是字符串拼接（模板引擎）

    var code = generate(root); // 核心思路就是将模板转化成 下面这段字符串
    //  <div id="app"><p>hello {{name}}</p> hello</div>
    // 将ast树 再次转化成js的语法
    //  _c("div",{id:app},_c("p",undefined,_v('hello' + _s(name) )),_v('hello')) 
    // 所有的模板引擎实现 都需要new Function + with

    var renderFn = new Function("with(this){return ".concat(code, "}")); // return function render(){
    // }

    return renderFn;
  } // generate[{name:'id',value:'app'},{}]  {id:app,a:1,b:2}

  function generate(el) {
    var children = genChildren(el); //生成子模板 

    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c).join(',');
      }));
    } else {
      return false;
    }
  }

  function gen(node) {
    if (node.type == 1) {
      return generate(node);
    } else {
      var text = node.text;
      var tokens = [];
      var match, index; // 每次的偏移量 buffer.split()

      var lastIndex = defaultTagRE.lastIndex = 0; // 只要是全局匹配 就需要将lastIndex每次匹配的时候调到0处

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (index < lastIndex) {
        tokens.push(JSON.stringify(text.split(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genProps(attrs) {
    // 处理属性 拼接成属性的字符串
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name == 'style') {
        (function () {
          attr.value.forEach(function (item) {
            var _item$split = item.split(';'),
                _item$split2 = _slicedToArray(_item$split, 2);
                _item$split2[0];
                _item$split2[1];
          });
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value));
    }

    return str;
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // 数据劫持 
      var vm = this; // vue 中使用this.$options 指代表就是用传递的属性

      vm.$options = options; //  初始化状态

      initState(vm); //分割代码
      // 如果有用户传入了el 属性 需要将页面渲染出来
      // 如果用户传入了el 就要实现挂在流程

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      //1 保存this
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); //  默认会先查找有没有render 方法 再去查找有没有 template  最后查找 el  

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunction(template); //我们需要将template转成render 方法 2.0  虚拟dom
        // 把render  方法放到options

        options.render = render; // console.log(template);
      }
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
