
import http from '@/utils/http'

/**
 * @description [商品详情加入购物车] 以及 [购物车更新商品数量]
 * @param { Object } param0 { goodsId:商品ID, count:商品数量，blessing:祝福语}
 */

export const reqAddCart = ({ goodsId,count,...data}) =>{
  return http.get(`/cart/addToCart/${goodsId}/${count}`,data)
}

/**
 * @description 获取购物车列表数据
 * @returns Promise
 */
export const reqCartList = () =>{
  return http.get('/cart/getCartList')
}

/**
 * @description 更新商品的选中状态
 * @param {@} goodsId 商品的ID
 * @param {*} isChecked  商品的勾选状态， 0 说明需要取消勾选，1 需要勾选
 * @returns Promise
 */
export const reqUpdateChecked = (goodsId,isChecked) =>{
  return http.get(`/cart/checkCart/${goodsId}/${isChecked}`)
}


/**
 * @description 实现全选和全不选
 * @param {*} isChecked 全选与不全选状态，0就是取消全选，1进行全选
 * @returns Promise
 */
export const reqCheckAllStatus = (isChecked) =>{
  return http.get(`/cart/checkAllCart/${isChecked}`)
}

/**
 * @description 删除购物车商品
 * @param {*} goodsId 商品的 ID
 * @returns Promise
 */
export const reqDelCartGoods = (goodsId) =>{
  return http.get(`/cart/delete/${goodsId}`)
}