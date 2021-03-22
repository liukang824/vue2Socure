import {mergeOptions} from '../util/index'
export function initGlobalAPI(Vue){
  // 整合所有相关Api 内容
  Vue.options = {}
  Vue.mixin = function (mixin){
    this.options = mergeOptions(this.options,mixin)
  }


}