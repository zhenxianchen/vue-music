import {playMode} from 'common/js/config'

const state = {
  singer: {},
  playing: false,
  fullScreen: false, // 播放器是否全屏
  playlist: [], // 当前播放列表
  sequenceList: [], // 顺序播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1
}

export default state