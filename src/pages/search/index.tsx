import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Input, Icon, Text } from '@tarojs/components'
import './index.styl'
import util from '../../utils/util'

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

interface garbageInfo {
  name: string
  type: number
  explain: string
  contain: string
  tip: string
}

interface hotRecordInfo {
  name: string,
  type: number,
  index: number
}

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '搜索'
  }

  state = {
    garbageName: '',
    isLoading: false,
    list: [] as garbageInfo[],
    historyRecord: [] as string[],
    hotRecord: [] as hotRecordInfo[],
  }

  componentWillMount() {
    this.getHistoryRecord()
    this.getHotSearch()
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className='search'>
        <View className='header'>
          <View className='input-wrap'>
            <Icon type='search' size='16' className='icon-search' />
            <Input
              placeholder='请输入垃圾名称'
              className='input'
              focus={true}
              value={this.state.garbageName}
              onInput={util.debounce((e: any) => this.search(e), 300)}
              confirm-type='search'
              onConfirm={this.search}
            />
            {/* 支付宝Icon不能绑定事件 */}
            {
              this.state.garbageName ?
                <View onClick={this.clearGarbageName}>
                  <Icon
                    type='clear'
                    size='18'
                    className='icon-clear'
                  />
                </View>
                :
                null
            }
          </View>
        </View>
        {
          !this.state.garbageName && this.state.hotRecord.length > 0 ?
            <View className='history-header'>
              <Text>热门搜索</Text>
            </View>
            :
            null
        }
        <View className='history-list'>
          {
            !this.state.garbageName ?
              this.state.hotRecord.map((item) => <View className='history-item' key={item.name} onClick={this.clickHistoryItem.bind(this, item.name)}>{item.name}</View>)
              :
              null
          }
        </View>
        {
          !this.state.garbageName && this.state.historyRecord.length > 0 && this.state.hotRecord.length > 0 ?
            <View className='history-header'>
              <Text>历史搜索</Text>
              <Image src={require('../../imgs/icon_clear_history.png')} className='icon-clear-history' onClick={this.clearHistoryRecord} />
            </View>
            :
            null
        }
        <View className='history-list'>
          {
            !this.state.garbageName ?
              this.state.historyRecord.map((item) => <View className='history-item' key={item} onClick={this.clickHistoryItem.bind(this, item)}>{item}</View>)
              :
              null
          }
        </View>
        <View className='list'>
          {
            this.state.list.map((item, index) =>
              <View className='item' key={index} onClick={this.jumpToDetail.bind(this, item)}>
                <View className='name'>{item.name}</View>
                <View className='type'>{TYPE[item.type]}</View>
              </View>
            )
          }
        </View>
      </View>
    )
  }

  clickCameraIcon() {
    process.env.TARO_ENV === 'weapp' && this.jumpToCameraPage()
    process.env.TARO_ENV === 'alipay' && this.chooseImage()
  }

  jumpToCameraPage() {
    Taro.navigateTo({
      url: '/pages/camera/index'
    })
  }

  chooseImage() {

  }

  inputGarbageName(e: any) {
    this.setState({
      garbageName: e.detail.value
    })
  }

  clearGarbageName() {
    this.setState({
      garbageName: '',
      list: []
    })
  }


  search(e?: any) {
    const value = e && e.detail.value || ''

    this.setState({
      garbageName: value
    }, () => {
      if (!this.state.garbageName) {
        this.setState({
          list: [],
        })
      }

      if (this.state.garbageName && e.type === 'confirm') {
        this.saveHistoryRecord()
      }
    })

    if (value) {
      this.setState({
        isLoading: true
      });

      Taro.cloud.callFunction({
        name: "getProduct",
        data: { garbage: value || this.state.garbageName }
      }).then((res) => {
        console.log(res)
        let lists = res.result.data.map((e: any) =>
          Object.assign({ name: e.name, type: e.sortId - 1 }, info[e.sortId - 1])
        )
        this.setState({
          list: lists,
          isLoading: false
        })
      })
    }
  }

  saveHistoryRecord(item?: string) {
    let arr = this.state.historyRecord.slice(0)
    arr.unshift(item || this.state.garbageName)

    Taro
      .setStorage({
        key: 'search_history',
        data: [...new Set(arr)]
      })
      .then(() => this.getHistoryRecord())
  }

  getHistoryRecord() {
    Taro
      .getStorage({
        key: 'search_history',
      })
      .then(res => {
        res.data && this.setState({
          historyRecord: res.data
        })
      })
  }

  clearHistoryRecord() {
    Taro.showModal({
      title: '提示',
      content: '是否确认删除历史记录',
      cancelText: '取消',
      confirmText: '确认',
      success: res => {
        if (res.confirm) {
          Taro
            .setStorage({
              key: 'search_history',
              data: []
            })
            .then(() => this.getHistoryRecord())
        }
      }
    })
  }

  clickHistoryItem(item: any) {
    this.setState({
      garbageName: item
    })
    this.search({
      detail: {
        value: item
      }
    })
  }

  getHotSearch() {
    Taro.cloud.callFunction({
      name: "getHotSearch"
    }).then(res => {
      console.log(res);
      this.setState({
        hotRecord: res.result.data.slice(0, 18)
      })
    })
  }

  jumpToDetail(item: garbageInfo) {
    Taro.navigateTo({
      url: `/pages/detail/index?garbageInfo=${JSON.stringify(item)}`
    })
    this.saveHistoryRecord(item.name)
  }

  onShareAppMessage() {
    return {}
  }


}