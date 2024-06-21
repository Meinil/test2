//引入 QQMapWX 核心类
import QQMapWX from '../../../../../libs/qqmap-wx-jssdk'
//导入 async-validator 对参数进行验证
import Schema from 'async-validator'
//导入接口 API 函数
import { reqAddAddress,reqAddressInfo,reqUpdateAddress } from '../../../../../api/address'


Page({
  // 页面的初始数据
  data: {

    //需要将请求参数放到 data 对象下，方便在模板中绑定数据
    name:'',   //收货人
    phone:'',  //手机号码
    provinceName:'',  //省
    provinceCode:'',  //省编码
    cityName:'',      //市
    cityCode:'',      //市编码
    districtName:'',  //区
    districtCode:'',  //市编码
    address:'',       //详细地址
    fullAddress:'',   //完整地址
    isDefault: false    //是否设置为默认地址， 0不设置为默认地址，1设置为默认地址
    
  },

  // 保存收货地址
  async saveAddrssForm(event) {
    //组织参数 （完整地址，是否设置为默认地址）
    const { provinceName,cityName,districtName,address,isDefault} = this.data

    //最终需要发送的请求参数
    const params = {
      ...this.data,
      fullAddress:provinceName + cityName + districtName + address,
      isDefault:isDefault ? 1 : 0
    }
     //对组织以后的参数进行验证，验证通过以后，需要调用新增的接口实现新增收货地址功能
     // console.log(params)
     const { valid } = await this.validatorAddress(params)
     //如果 valid 等于 false ，说明验证失败，就不执行后续代码
     if(!valid){
       return
     }
     //如果 valid 等于 true ，说明验证成功调用新增的接口实现新增收货地址功能
     //console.log(params)
     const res = this.addressId ? await reqUpdateAddress(params) : await reqAddAddress(params)


     //console.log(res)

     if(res.code === 200) {
       //返回到收货地址页面
       wx.navigateBack({
         success:() =>{
            //需要给用户进行提示
            wx.toast({
              title: this.addressId ? '更新收货地址成功!' : '新增收货地址成功！'
            })
         }
       })
      
     }

  },

  // 对新增收货地址请求参数进行验证
    validatorAddress(params) {

      // 验证收货人，是否只包含大小写字母、数字和中文字符
      const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

      // 验证手机号，是否符合中国大陆手机号码的格式
      const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'

      //创建验证规则
      const rules = {
        name: [
          { required: true, message:'请输入收货人姓名'},
          { pattern: nameRegExp, message:'收货人姓名不合法' }
        ],
        phone: [
          { required: true, message:'请输入收货人手机号'},
          { pattern: phoneReg, message:'收货人手机号不合法' }
        ],
        provinceName: { required:true, message:'请选择收货人所在区域'},
        address: { required:true, message:'请输入详细地址'}

      }

      //传入验证规则
      const validator = new Schema(rules)


      //调用实例方法对请求的参数进行验证
      //注意：我们希望将验证结果通过 Promise 的形式返回给函数的调用者
      return new Promise((resolve) =>{
        validator.validate(params,(errors) =>{
          if(errors){
            //如果验证失败，需要给用户提示
            wx.toast({ title: errors[0].message })

            //如果属性值 false ，说明验证失败
            resolve({ valid:false })
          }else{
            //如果属性值 true ，说明验证失败
            resolve({ valid:true })
          }
        })
      })

       

  },

  // 省市区选择
  onAddressChange(event) {
    //console.log(event)
    //解构省市区
    const [provinceName,cityName,districtName ] = event.detail.value
    const [provinceCode,cityCode,districtCode] =  event.detail.code

    this.setData({
      provinceName,
      cityName,
      districtName,
      provinceCode,
      cityCode,
      districtCode
    })

  },

  //获取用户地理位置信息
  async onLocation() {
    // 获取当前地理位置（精度，纬度，高度等）
    // const res =  await wx.getLocation()
    // console.log(res)


    //打开地图让用户选择地理位置
    //latitude 纬度,longitude 经度,name 搜索名
    const {latitude,longitude,name } = await wx.chooseLocation()

    //使用 reverseGeocoder 方法进行逆地址解析
    this.qqmapwx.reverseGeocoder({
      location: {
        longitude,
        latitude
      },
      success:(res) => {

        console.log(res)
        //获取省市区， 省市区编码
        const { adcode,province,city,district } = res.result.ad_info

        //获取街道和门牌(街道，门可能为空)
        const { street,street_number } = res.result.address_component

        //获取标准地址
        const { standard_address } = res.result.formatted_addresses
        
        //console.log(standard_address)

        //对获取的数据进行格式化，组织，然后赋值给 data 中的字段
        this.setData({
          //省
          provinceName: province, 
          //如果是省，前两位有值，后面四位是0 
          provinceCode: adcode.replace(adcode.substring(2,6),'0000'), 

          //市
          cityName: city,  
          //如果是市，前四位有值，后面两位是0    
          cityCode: adcode.replace(adcode.substring(4,6),'00'),   

          //区
          //东菀市，中山市，瞻洲市，嘉峪关市 因其下无区县级
          districtName: district,  
          districtCode: district && adcode, 
    
          //详细地址以及完整地址，在以后的开发中根据产品的需求来进行选择，处理即可
          //组织详细地址
          address: street + street_number + name,  
          //组织完整地址     
          fullAddress: standard_address + name,  

        })
      }
    })

  },


  //用来处理更新的相关的逻辑
  async showAddressInfo(id) {

    //判断是否存在 id 如果不存在 id， 就不执行后面的逻辑
    if(!id) return

    // 将 id 挂载到当前页面的实例(this)上， 方便在多个方法中使用 id
    this.addressId = id

    // 动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title: '更新收货地址',
      
    })

    //调用接口 API 函数，来获取需要更新的收货地址详情
     const { data } = await reqAddressInfo(id)
     //console.log(res)

     //将详情数据进行赋值，复制以后，页面上就会回显要更新的地址信息
     this.setData(data)


  },

  onLoad(options) {
    //对核心类 QQMapWX 进行实例化
    this.qqmapwx = new QQMapWX({
      // key 要使用自己申请的 key
      key:'5UDBZ-35763-VKL3U-RA4GP-GX5NQ-6JFCJ'
    })

   //调用方法，实现更新的业务逻辑
   this.showAddressInfo(options.id)


  }


})
