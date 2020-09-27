import Taro, { Component, Config, request } from '@tarojs/taro'
import { View, CoverView, CoverImage, Image, Camera, Button } from '@tarojs/components'
import './index.styl'

interface garbageInfo {
  title: string,
  type: string,
  desc: string,
  type_name: string
}

const TYPE = ['可回收垃圾', '有害垃圾', '厨余(湿)垃圾', '其他(干)垃圾']
const info = [{
  explain: "可回收垃圾是指适宜回收、可循环利用的生活废弃物。",
  contain: "常见包括各类废金属、玻璃瓶、易拉罐、饮料瓶、塑料玩具、书本、报纸、广告单、纸板箱、衣服、床上用品、电子产品等",
  tip: "轻投轻放；清洁干燥，避免污染，费纸尽量平整；立体包装物请清空内容物，清洁后压扁投放；有尖锐边角的、应包裹后投放"
}, {
  explain: "有毒有害垃圾是指存有对人体健康有害的重金属、有毒的物质或者对环境造成现实危害或者潜在危害的废弃物。",
  contain: "常见包括废电池、废荧光灯管、废灯泡、废水银温度计、废油漆桶、过期药品、农药、杀虫剂等。",
  tip: "分类投放有害垃圾时，应注意轻放。其中：废灯管等易破损的有害垃圾应连带包装或包裹后投放；废弃药品宜连带包装一并投放；杀虫剂等压力罐装容器，应排空内容物后投放；在公共场所产生有害垃圾且未发现对应收集容器时，应携带至有害垃圾投放点妥善投放。"
},
{
  explain: "厨余垃圾是指居民日常生活及食品加工、饮食服务、单位供餐等活动中产生的垃圾。",
  contain: "常见包括菜叶、剩菜、剩饭、果皮、蛋壳、茶渣、骨头等",
  tip: "纯流质的食物垃圾、如牛奶等，应直接倒进下水口。有包装物的湿垃圾应将包装物去除后分类投放、包装物请投放到对应的可回收物或干垃圾容器"
}, {
  explain: "干垃圾即其它垃圾，指除可回收物、有害垃圾、厨余垃圾（湿垃圾）以外的其它生活废弃物。",
  contain: "常见包括砖瓦陶瓷、渣土、卫生间废纸、猫砂、污损塑料、毛发、硬壳、一次性制品、灰土、瓷器碎片等难以回收的废弃物",
  tip: "尽量沥干水分；难以辨识类别的生活垃圾都可以投入干垃圾容器内"
}]
let times = 0

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '拍照识别'
  }

  state = {
    accessToken: "",
    src: '',
    isCompletedQuery: false,
    imgHeight: 0,
    imgWidth: 0,
    list: [] as garbageInfo[],
    devicePositionIsBack: true
  }

  componentWillMount() {
    var time = Taro.getStorageSync("time")
    var curTime = new Date().getTime()
    var timeInt = parseInt(time)
    var timeNum = parseInt((curTime - timeInt) / (1000 * 60 * 60 * 24))
    console.log("=======" + timeNum)
    var accessToken = Taro.getStorageSync("access_token")
    console.log("====accessToken===" + accessToken + "a")
    if (timeNum > 28 || (accessToken == "" ||
      accessToken == null || accessToken == undefined)) {
      this.accessTokenFunc()
    } else {
      this.setState({
        accessToken: Taro.getStorageSync("access_token")
      })
    }
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className='index'>
        {
          !this.state.isCompletedQuery ?
            <Camera devicePosition={this.state.devicePositionIsBack ? 'back' : 'front'} flash='off' className='camera' onError={this.checkIfAuthorizeCamera}>
              <CoverView className='btn-wrap'>
                <CoverImage onClick={this.chooseImage} src='../../imgs/icon_album.png' className='icon-back'></CoverImage>
                <CoverView onClick={this.takePhoto} className='btn' />
                <CoverImage src='../../imgs/icon_change.png' className='icon-change' onClick={this.changeDevicePosition}></CoverImage>
              </CoverView>
              {
                this.state.list.length > 0 ?
                  <CoverView className='mask'>
                    <CoverView className='modal'>
                      <CoverView className='modal-title'>识别结果</CoverView>
                      <CoverView className='modal-content'>
                        {
                          this.state.src ?
                            <CoverImage
                              src={this.state.src}
                              className='img'
                            // style={`height: ${this.state.imgHeight}px; width: ${this.state.imgWidth}px`}
                            />
                            :
                            null
                        }
                        <CoverView>
                          <CoverView className='title'>图中包含的垃圾有：</CoverView>
                          {
                            this.state.list.map((item) => {
                              return (
                                <CoverView className='item' key={item.title}>
                                  <CoverView>{item.title.split('-')[0]}</CoverView>
                                  <CoverView className='type'>{TYPE[parseInt(item.type) - 1]}</CoverView>
                                </CoverView>
                              )
                            })
                          }
                        </CoverView>
                      </CoverView>
                      <CoverView className='btn-row'>
                        <CoverView className='btn-item exit' onClick={this.exit}>退出</CoverView>
                        <CoverView className='btn-item continue' onClick={this.continue}>继续</CoverView>
                      </CoverView>
                    </CoverView>
                  </CoverView>
                  :
                  null
              }
            </Camera>
            :
            null
        }
      </View>
    )
  }

  accessTokenFunc() {
    console.log("accessTokenFunc is start")
    Taro.cloud.callFunction({
      name: 'baiduAccessToken',
      success: (res: any) => {
        console.log("==baiduAccessToken==" + JSON.stringify(res))
        this.setState("accessToken", res.result.data.access_token)
        Taro.setStorageSync("access_token", res.result.data.access_token)
        Taro.setStorageSync("time", new Date().getTime())
      },
      fail: err => {
        Taro.clearStorageSync()
        Taro.showToast({
          icon: 'none',
          title: '调用失败,请重新尝试',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  }

  back() {
    Taro.navigateBack()
  }

  chooseImage() {
    Taro.chooseImage({
      count: 1,
      sourceType: ['album'],
      success: res => {
        this.prepareRequest(res.tempFilePaths[0])
      }
    })
  }

  changeDevicePosition() {
    this.setState({
      devicePositionIsBack: !this.state.devicePositionIsBack
    })
  }

  takePhoto() {
    const ctx = Taro.createCameraContext()

    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.prepareRequest(res.tempImagePath)
      }
    })
  }

  prepareRequest(tempImagePath: string) {
    if (tempImagePath) {
      Taro.showLoading({
        title: '正在识别中...',
        mask: true
      })

      this.setState({
        src: tempImagePath
      })

      this.filePathToBase64(tempImagePath)
    }
  }

  filePathToBase64(tempImagePath: string) {
    wx
      .getFileSystemManager()
      .readFile({
        filePath: tempImagePath, //选择图片返回的相对路径
        encoding: 'base64', //编码格式
        success: (res: any) => { //成功的回调
          console.log(res, "imgbase64")
          this.requestAPI(res.data)
        }
      });
  }

  requestAPI(base64: string) {
    console.log("request")
    Taro.request({
      url: "https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=" + this.state.accessToken,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        token: this.state.accessToken,
        image: base64
      },
      success: res => {
        Taro.hideLoading()
        console.log(res)
        var code = res.data.err_code
        if (code == 111 || code == 100 || code == 110) {
          Taro.clearStorageSync()
          this.accessTokenFunc()
          return
        }

        if (res.statusCode === 200) {

          let result = res.data.result.map(item => item.keyword)
          console.log(result)
          Taro.showActionSheet({
            itemList: result
          }).then(res => {
            console.log(res, result, res.tapIndex)
            Taro.cloud.callFunction({
              name: "getProduct",
              data: { garbage: result[res.tapIndex] }
            }).then((res) => {
              console.log(res)
              const e = res.result.data[0]
              let lists = Object.assign({ name: e.name, type: e.sortId - 1 }, info[e.sortId - 1])

              Taro.navigateTo({
                url: `/pages/detail/index?garbageInfo=${JSON.stringify(lists)}`
              })
            }).catch(err=>{
              console.log(err.errMsg)
              this.promptNoResults()
            })

          }).catch(err => { 
            console.log(err.errMsg) 
            
          })
        } else {
          this.promptErrorMsg()
        }

      },
      fail: () => {
        Taro.hideLoading()
        this.promptErrorMsg()
      }
    })
  }

  promptErrorMsg() {
    if (times < 3) {
      times++

      Taro.showToast({
        title: '处理失败，请重试',
        icon: 'none'
      })
    } else {
      Taro.showModal({
        title: '提示',
        content: '拍照识别好像出了点故障，您可以选择手动搜索',
        confirmText: '重新拍照',
        cancelText: '去搜索',
        success: res => {
          if (res.cancel) {
            Taro.navigateTo({
              url: '/pages/search/index'
            })
          }
        }
      })
    }
  }

  promptNoResults() {
    if (this.state.list.length === 0) {
      Taro.showModal({
        title: '提示',
        content: '未识别到相应结果，请选择重新拍照或者去手动搜索',
        confirmText: '重新拍照',
        cancelText: '去搜索',
        success: res => {
          if (res.cancel) {
            Taro.navigateTo({
              url: '/pages/search/index'
            })
          }
        }
      })
    }
  }

  setImgSize(src: string) {
    Taro
      .getImageInfo({
        src,
      })
      .then(res => {
        this.setState({
          imgHeight: res.height,
          imgWidth: res.width
        })
      })
  }

  exit() {
    Taro.navigateBack()
  }

  continue() {
    this.setState({
      list: []
    })
  }

  checkIfAuthorizeCamera() {
    Taro.getSetting({
      success: (res: any) => {
        if (!res.authSetting['scope.camera']) {
          this.setState({
            isCompletedQuery: true
          })
          Taro.showModal({
            title: '提示',
            content: '您未授权使用摄像头，请授权后再使用',
            confirmText: '去授权',
            cancelText: '不使用',
            success: res => {
              if (res.confirm) {
                Taro.openSetting({
                  complete: () => {
                    this.checkIfAuthorizeCamera()
                    this.setState({
                      isCompletedQuery: false
                    })
                  }
                })
              } else if (res.cancel) {
                Taro.navigateBack()
              }
            }
          })
        }
      }
    })
  }

  onShareAppMessage() {
    return {}
  }
}
