//导入封装的接口 API 函数
import { reqCatgoryData} from '../../api/category'

Page({


  //初始化数据
  data:{
    categoryList:[],  //商品分类列表数据
    activeIndex:0    //被激活哪一项的索引，默认值为0
  },

  //实现一级分类的切换效果
  updataActive(event) {
    //console.log(event.currentTarget.dataset)
    const { index } = event.currentTarget.dataset
    //console.log(index)

    this.setData({
      activeIndex: index 
    })

  },

  //获取商品分类的数据
  async getCategoryData () {

    const res = await reqCatgoryData()

    if(res.code === 200){
      this.setData({
        categoryList:res.data
      })
    }
  },

  //监听页面加载
  onLoad () {

    //调用获取商品分类的数据方法
    this.getCategoryData()
  }
})
