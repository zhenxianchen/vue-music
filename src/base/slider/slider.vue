<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { addClass } from 'common/js/dom'
import BScroll from 'better-scroll'

export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },

  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },

  mounted() {
    // 确保dom结构已经渲染
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    // 兼容视窗宽度变化，重新设置轮播图的宽度
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },

  destroyed() {
    clearTimeout(this.timer)
  },

  methods: {
    // 设置轮播图的宽度
    _setSliderWidth(isResize) {
      // 获取轮播元素
      this.children = this.$refs.sliderGroup.children

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth

      // 设置每一个轮播元素的宽度为容器的宽度，并添加类名
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }

      // 如果开启循环，轮播结构会在前后各增加一个宽度，如果是视窗调整则不加
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },

    // 初始化轮播图
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true, // 横向滚动
        scrollY: false,
        momentum: false, // 动画
        snap: {
          loop: this.loop, // 支持循环轮播
          threshold: 0.3, // 可滚动到下一个的阈值
          speed: 400
        }
      })

      // 监听滑动完成事件，获取当前滑动的页面数
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX

        this.currentPageIndex = pageIndex

        // 兼容用户手动滑动和循环滑动，在滑动完成后先清除定时器
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },

    // 初始化轮播点
    _initDots() {
      this.dots = new Array(this.children.length)
    },

    // 自动轮播
    _play() {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'

.slider {
  min-height: 1px;
  width: 100%;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>