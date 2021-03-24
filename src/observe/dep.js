let id = 0
class Dep{
  constructor(){
    this.id = id++;
    this.subs=[]
  }
  addSub(watcher){ //观察者模式
    this.subs.push(watcher)
  }
  depend(){
    // 让这个watcher 记住我当前的dep 如果没有watcher没有存过dep  dep 肯定也不会存watcher
    Dep.target.addDep(this)
  }
  notify(){
    this.subs.forEach(watcher=>watcher.update())  //调用当前watcher 的uodate方法
  }


}
let stack =[]

// 目前可以做到watcher 保存和移除功能
export function pushTarget(watcher){
  // console.log(watcher,2222);
  Dep.target = watcher
  stack.push(watcher)
}

export function popTarget(){
  stack.pop()
  Dep.target = stack[stack.length-1]
}

export default Dep