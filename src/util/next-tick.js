let callbacks = []  // 回调数组 
let waiting = false
function flushCallbfaack(){
  callbacks.forEach(cb=>cb())
  callbacks = []  //清空
  waiting = false
}

export function nextTick(cb){  //异步更新原理
   // 多次调用nextTick 如果没有刷新的时候 就先把他放到数组中,
    // 刷新后 更改waiting
  callbacks.push(cb)
  if(waiting === false){
    setTimeout(flushCallbfaack, 0);
    waiting = true
  }
}