import {commonParams} from './config'
import axios from 'axios'

export function getSongVkey(songmid) {
  const url = '/api/getSongVkey'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    loginUin: 0,
    cid: 205361747,
    uin: 0,
    songmid: songmid,
    filename: `C400${songmid}.m4a`,
    guid: 3434438386,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}