export function patch(oldVnode,vnode){
  // 1 判断是否是初次渲染
  const  isRealElement = oldVnode.nodeType
  if(isRealElement){
    const oldElm = oldVnode  // id=app
    const parentElm = oldElm.parentNode; // body
    let el = createElm(vnode)
    parentElm.insertBefore(el,oldElm.nextSibling)
    parentElm.removeChild(oldElm);
    return el;
  }
  // 递归创建真实节点  替换掉老节点

}
function createElm(vnode){// 根据虚拟节点创建真是的节点 
  let {tag,data,key,children,text} = vnode
  if(typeof tag === 'string'){
    vnode.el = document.createElement(tag)
    updateProperties(vnode);
    children.forEach(child=>{ // 递归创建儿子节点，将儿子节点扔到父节点中
      return vnode.el.appendChild(createElm(child))
  })

  }else{
    // 虚拟dom上映射真实dom  方便后续更新
    vnode.el = document.createTextNode(text)
  }
    // 如果不是标签就是文本
  return vnode.el;

}
function updateProperties(vnode){
  let newProps = vnode.data;
  let el = vnode.el;
  for(let key in newProps){
      if(key === 'style'){
          for(let styleName in newProps.style){
              el.style[styleName] = newProps.style[styleName];
          }
      }else if(key === 'class'){
          el.className = newProps.class;
      }else{
          el.setAttribute(key,newProps[key]);
      }
  }
}