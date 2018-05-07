<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>

    <!-- 滚动的遮罩层 -->
    <div class="bg-layer" ref="layer"></div>

    <scroll :data="songs"  @scroll="scroll"
            :listen-scroll="listenScroll" :probe-type="probeType" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div> 
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import SongList from 'base/song-list/song-list'
import {prefixStyle} from 'common/js/dom'
// import {playlistMixin} from 'common/js/mixin'
import {mapActions} from 'vuex'

const RESERVED_HEIGHT = 40 // 预留的头部高度
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
//   mixins: [playlistMixin],
  props: {
    // 背景图
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    // 获取背景图，将音乐列表往下移
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT // 滑动层的最大滑动距离
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY(newVal) {
      // 监听音乐列表的滑动事件，动态设置歌手背景图的高度和滑动层的偏移
      let translateY = Math.max(this.minTransalteY, newVal)
      let scale = 1
      let zIndex = 0
      let blur = 0
      const percent = Math.abs(newVal / this.imageHeight) // 歌手背景图的放大比例

      // 音乐列表下拉，放大歌手图片;上拉，歌手图片变模糊
      if (newVal > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20, percent * 20) // 模糊程度最大为20
      }

      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`

      // ios手机的css属性
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`

      // 歌手图片的样式
      let bgImgStyle = this.$refs.bgImage.style

      if (newVal < this.minTransalteY) { // 滑动超过头部，改变歌手背景图的高度,播放按钮消失
        zIndex = 10
        bgImgStyle.paddingTop = 0
        bgImgStyle.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else { // 滑动未超过头部，还原。下拉则放大歌手背景图
        bgImgStyle.paddingTop = '70%'
        bgImgStyle.height = 0
        this.$refs.playBtn.style.display = ''
      }

      bgImgStyle[transform] = `scale(${scale})`
      bgImgStyle.zIndex = zIndex
    }
  },
  components: {
    Scroll,
    Loading,
    SongList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>