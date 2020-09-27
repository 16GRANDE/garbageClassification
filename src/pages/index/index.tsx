import Taro, { Component, Config } from '@tarojs/taro'
import { View, Icon, Text, Image, Button, CoverImage, CoverView } from '@tarojs/components'
import './index.styl'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页',
    navigationStyle: 'custom'
  }

  state = {
    screenWidth: 0,
    menuButtonInfo: {} as {
      height: number,
      width: number,
      top: number,
      left: number,
      right: number,
      bottom: number
    }
  }

  componentWillMount () {
    process.env.TARO_ENV === 'weapp' && this.getScreenWidthAndMenuButtonInfo()
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { 
  }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <View className='header'>
          <Image src='../../imgs/icon_photo.png' className='type-item recyclable' onClick={this.jumpToCameraPage}></Image>
          <View className='input-box' onClick={this.jumpToSearchPage}>
            <Icon type='search' size='16' color='#999' className='icon-search'/>
            <Text className='placeholder'>请输入垃圾名称</Text>
          </View>
          
        </View>
        {
          process.env.TARO_ENV === 'weapp' &&
            <View className='nav-bar' style={`top:${this.state.menuButtonInfo.top}px;left:${this.state.screenWidth - this.state.menuButtonInfo.right}px`}>
              <View className='btn-wrap' style={`height:${this.state.menuButtonInfo.height}px;width:${this.state.menuButtonInfo.width}px`}>
                <View className='Image-wrap'>
                  <Image src={require('../../imgs/icon_share.png')} className='icon-share' />
                  <Button openType='share' className='share-btn'></Button>
                </View>
              </View>
            </View>
        }
      </View>
    )
  }

  getScreenWidthAndMenuButtonInfo () {
    const menuButtonInfo = Taro.getMenuButtonBoundingClientRect()

    Taro.getSystemInfo({
      success: ({screenWidth}) => {
        this.setState({
          screenWidth,
          menuButtonInfo
        })
      }
    })
  }

  jumpToSearchPage () {
    Taro.navigateTo({
      url: '/pages/search/index'
    })
  }

  jumpToQrCodePage () {
    Taro.navigateTo({
      url: '/pages/qrCode/index'
    })
  }

  previewAppreciateCode () {
    Taro.previewImage({
      urls: ['http://tva1.sinaimg.cn/large/0060lm7Tly1g57jkjiuy5j30u00u0t9l.jpg'],
      current: 'http://tva1.sinaimg.cn/large/0060lm7Tly1g57jkjiuy5j30u00u0t9l.jpg'
    })
  }

  jumpToClassificationPage (classification: string) {
    Taro.navigateTo({
      url: `/pages/classification/index?classification=${classification}`
    })
  }

  clickCameraIcon (e: any) {
    e.stopPropagation()
    process.env.TARO_ENV === 'weapp' && this.jumpToCameraPage()
  }

  jumpToCameraPage () {
    Taro.navigateTo({
      url: '/pages/camera/index'
    })
  }

  chooseImage () {
    Taro.chooseImage({
      count: 1,
      sourceType: ['camera'],
      success: res => {
        console.log(res)
      }
    })
  }

  onShareAppMessage () {
    return {
      title: '超实用的垃圾分类工具(支持文字搜索、图像识别等功能)',
      path: '/pages/index/index',
      imageUrl: 'http://tva1.sinaimg.cn/large/007X8olVly1g6re2i1ss8j30dw0dw74k.jpg'
    }
  }
}
