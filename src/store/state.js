import {playMode} from 'common/js/config'
import {loadSearch} from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false, // 播放器是否全屏
  playlist: [], // 当前播放列表
  sequenceList: [], // 顺序播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1,
  disc: {}, // 歌单
  topList: {}, // 排行榜
  searchHistory: loadSearch() // 搜索历史
}

export default state