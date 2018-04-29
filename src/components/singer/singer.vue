<template>
  <div class="singer">
      歌手
  </div>
</template>

<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  data() {
    return {
      singers: []
    }
  },

  created() {
    this._getSingerList()
  },

  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = res.data.list
          console.log(this._normalizeSinger(this.singers))
        }
      })
    },

    // 序列化接口数据，按首字母分组
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }

        const key = item.Findex

        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }

        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })

      // 为了得到有序列表，我们需要处理 map
      let ret = [] // 首字母排列的歌手数据
      let hot = [] // 热门歌手

      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }

      // 根据字母升序排列
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      return hot.concat(ret)
    }
  }
}
</script>

<style lang="stylus" scoped>
.singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>