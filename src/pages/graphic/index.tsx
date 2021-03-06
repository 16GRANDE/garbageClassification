import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
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
    navigationBarTitleText: '图文'
  }

  state = {
    screenWidth: 0,
    imgHeight: 0,
    isIpX: false
  }

  componentWillMount () { 
    Taro.getSystemInfo({
      success: (res: any) => {
        console.log(res)
        this.setState({
          screenWidth: res.screenWidth,
          isIpX: res.model.includes('iPhone X')
        })
        this.setImgHeight()
      }
    })
    
  }

  setImgHeight () {
    Taro.showLoading({
      title: '正在加载...'
    })

    Taro
      .getImageInfo({
        src: '../../imgs/0060lm7Tly1g52p7mhyigj30m84blwm4.jpg',
      })
      .then(res => {
        this.setState({
          imgHeight: res.height * this.state.screenWidth / res.width
        })
        Taro.hideLoading()
      })
      .catch(e => Taro.hideLoading())
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () {
  }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Image src='../../imgs/0060lm7Tly1g52p7mhyigj30m84blwm4.jpg' className='graphic-img' style={`height: ${this.state.imgHeight}px`} onClick={this.preview}></Image>
      </View>
    )
  }

  preview () {
    Taro.previewImage({
      current: '../../imgs/0060lm7Tly1g52p7mhyigj30m84blwm4.jpg',
      urls: ['../../imgs/0060lm7Tly1g52p7mhyigj30m84blwm4.jpg']
    })
  }
}
