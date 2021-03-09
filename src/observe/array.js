// 会对数组本身发生变化的一些方法  push shift  unshift pop reverse  sort  splice 
// slice() 
let oldArrayMethods = Array.prototype ;// 拿到数组原来的方法
export let observerArray = Object.create(oldArrayMethods)