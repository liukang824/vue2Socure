import {
  pushTarget,
  popTarget
} from './dep.js';
let id = 0
class Watcher{
    constructor(vm,exprOrFn,callback,options){
        this.vm = vm;
        this.callback = callback;
        this.options = options;
        this.id = id++;
        this.getter = exprOrFn; // 将内部传过来的回调函数 放到getter属性上
        this.depsId = new Set() // es6中的集合 （不能放重复项）
        this.deps = []
        this.get();
    }
    addDep(dep){  // watcher 里不能放重复的dep  dep里不能放重复的watcher
        let id = this.id
        if(!this.depsId.has(id)){
          this.depsId.add(id)
          this.deps.push(id)
          dep.addSub(this); //存当前watcher
        }

    }
    get(){
        pushTarget(this) // 把当前实例传进进去  存当前watcher
        this.getter();
        popTarget() //移除watcher

    }
    update(){

    }
    run(){
      this.get();
    }
}

export default Watcher