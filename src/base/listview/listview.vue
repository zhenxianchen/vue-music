<template>
  <scroll class="listview"
          ref="listview"
          @scroll="scroll"
          :listen-scroll="listenScroll"
          :data="data"
          :probe-type="probeType">
    <!-- 歌手列表 -->
    <ul>
      <li v-for="(group, index) in data" class="list-group" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item, index) in group.items" class="list-group-item" :key="index" @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 索引列表 -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
            :key="index"
            class="item"
            :data-index="index"
            :class="{'current':currentIndex===index}"
        >
          {{item}}
        </li>
      </ul>
    </div>

    <!-- 固定头部 -->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT = 18 // 索引每个字母的高度
const TITLE_HEIGHT = 30 // 固定头部高度

export default {
  props: {
    // 父组件传来的歌手列表数据
    data: {
      type: Array,
      default: null
    }
  },

  data() {
    return {
      scrollY: -1, // 滚动的y坐标，为负值
      currentIndex: 0, // 当前索引（首字母）
      diff: -1 // 当前区域的下边界和已滚动距离（scrollY）的差
    }
  },

  created() {
    this.listenScroll = true // 监听scroll组件的scroll事件，better-scroll模块会监听内容区域的scroll事件，进而触发scroll组件的scroll事件，传递pos对象属性
    this.touch = {} // 手指滑动的对象属性，监听touchmove事件时用到
    this.listHeight = [] // 各个歌手区域的高度
    this.probeType = 3 // 开启better-scroll的实时派发scroll事件
  },

  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },

    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },

  components: {
    Scroll
  },

  methods: {
    // 仅仅派发事件，不处理业务逻辑
    selectItem(item) {
      this.$emit('select', item)
    },

    onShortcutTouchStart(e) {
      // 获取索引值
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]

      // 记录点击开始的y坐标
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex

      // 根据索引滚动到指定的歌手区域
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY

      // 根据touch开始和结束的y坐标，计算滚动过的索引个数
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta

      this._scrollTo(anchorIndex)
    },

    // scroll组件上的scroll事件，获取滚动的y坐标
    scroll(pos) {
      this.scrollY = pos.y
    },

    // 每个group的高度，放置在listHeight数组里面
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup

      // 上边界
      let height = 0
      this.listHeight.push(height)

      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },

    // 根据索引，滚动到指定的歌手区域
    _scrollTo(index) {
      // 兼容索引列表中上下两块空白区域的点击，即空白区域的index为null，滑动时index可能为负数或超过最大值
      if (!index && index !== 0) {
        return
      }

      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2 // 数组索引从0开始
      }

      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    }
  },

  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },

    scrollY(newY) {
      const listHeight = this.listHeight

      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动，注意newY为负值
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },

    diff(newVal) {
      // 头部往上移动，需要值为负值
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0

      // 在当前区域内滚动，头部不偏移
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
