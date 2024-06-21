
//在使用toast方法时，可以传入参数，也可以不传入参数
//const toast = (option = {}) =>{}


/**
 * @description 消息提示框
 * @param {*} param0 
 */
const toast = ({ title='数据加载中...' ,icon = 'none', duration = 2000, mask = true} ={}) =>{
//如果用户传入了对象作为参数，在形参位置通过结构的方式获取用户传入的参数，同时设置默认值
     wx.showToast({
       title,
       icon,
       duration,
       mask
     })

} 


//在调用 modal 方法时，可以传递参数，也可以不传递参数，如果不传递参数，默认值就是空对象
//如果传递参数，参数需要是一个对象，对象中的属性需要和 wx.showModal参数保持一致
const modal = (options = {}) =>{
     
  return new Promise((resolve) =>{
      //设置默认参数
      const defaultOpt = {
        title:'提示',
        content:'你确定执行该操作吗？',
        confirmColor:'#f3514f'
      }

      //通过 object.assign 方法将参数进行合并
      const opts =Object .assign({},defaultOpt,options)

      wx.showModal({
        //将合并以后的参数通过展开运算符赋值给 wx.showModal 对象
        ...opts,
        complete({ confirm,cancel}){
          confirm && resolve(true)
          confirm && resolve(false)
        }
      })

  }
  )

}


//避免导包问题，直接将 toast 方法挂载到 wx 全局对象身上
wx.toast = toast
wx.modal= modal

//如果其他 .js文件，需要使用 toast 方法 需要先导入 toast，然后进行调用才可以

export { toast,modal }