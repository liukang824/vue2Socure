import {parseHTML} from './parser-html'
import {generate} from './generate';
// ast 语法树 是用对象来描述js语法的  虚拟dom 用对象来描dom述节点的 
// argumens[0] = 匹配到的标签  arguments[1] 匹配到的标签名字

export function compileToFunction(template){
  // 1 解析字符串将HTML 字符串 => ast  语法
  let root  = parseHTML(template) 
  // 需要将ast 语法树生成最终的render函数  就是字符串拼接（模板引擎）
  let code = generate(root)

  // 核心思路就是将模板转化成 下面这段字符串
    //  <div id="app"><p>hello {{name}}</p> hello</div>
    // 将ast树 再次转化成js的语法
    //  _c("div",{id:app},_c("p",undefined,_v('hello' + _s(name) )),_v('hello')) 
    // 所有的模板引擎实现 都需要new Function + with

    let renderFn = new Function(`with(this){ return ${code}}`); 
  // return function render(){

  // }
    return renderFn;
}

