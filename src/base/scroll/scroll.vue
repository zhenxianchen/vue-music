<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'

export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    }
  },

  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },

  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType, // 滚动的位置。当probeType为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件
        click: this.click
      })

      // if (this.listenScroll) {
      //   let me = this
      //   this.scroll.on('scroll', (pos) => {
      //     me.$emit('scroll', pos)
      //   })
      // }

      // if (this.pullup) {
      //   this.scroll.on('scrollEnd', () => {
      //     if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
      //       this.$emit('scrollToEnd')
      //     }
      //   })
      // }

      // if (this.beforeScroll) {
      //   this.scroll.on('beforeScrollStart', () => {
      //     this.$emit('beforeScroll')
      //   })
      // }
    },

    disable() {
      this.scroll && this.scroll.disable()
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    }

    // scrollTo() {
    //   this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    // },
    // scrollToElement() {
    //   this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    // }
  },

  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
