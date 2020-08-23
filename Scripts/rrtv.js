const chavy = init()
const cookieName = '人人视频'
const KEY_signcookie = 'chavy_cookie_rrtv'

const signinfo = {}
let VAL_signcookie = chavy.getdata(KEY_signcookie)

;(exec = async () => {
  chavy.log(`🔔 ${cookieName} 开始签到`)
  await signdaily()
  await signwelfare()
  await getquestion()
  if (!signinfo.hasAnswered) {
    await answerquestion()
    await getquestion()
  }
  await openbox(
    'copperbox',
    '铜宝箱',
    'boxId=3&token=' + VAL_signcookie
  )
  await openbox(
    'silverbox',
    '银宝箱',
    'boxId=2&token=' + VAL_signcookie
  )
  await openbox(
    'goldenbox',
    '金宝箱',
    'boxId=1&token=' + VAL_signcookie
  )
  await getinfo()
  showmsg()
  chavy.done()
})().catch((e) => chavy.log(`❌ ${cookieName} 签到失败: ${e}`), chavy.done())

function signdaily() {
  return new Promise((resolve, reject) => {
    let url = { url: `https://api.rr.tv/rrtv-activity/sign/sign`, headers: { token: VAL_signcookie } }
    url.headers['clientType'] = `web`
    url.headers['clientVersion'] = ``
    chavy.post(url, (error, response, data) => {
      try {
        signinfo.signdaily = JSON.parse(data)
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `日常签到: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} signdaily - 日常签到失败: ${e}`)
        chavy.log(`❌ ${cookieName} signdaily - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function signwelfare() {
  return new Promise((resolve, reject) => {
    let url = { url: `https://api.rr.tv/dailyWelfare/getWelfare`, headers: { token: VAL_signcookie } }
    url.headers['clientType'] = `web`
    url.headers['clientVersion'] = ``
    chavy.post(url, (error, response, data) => {
      try {
        signinfo.signwelfare = JSON.parse(data)
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `日常签到: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} signwelfare - 日常签到失败: ${e}`)
        chavy.log(`❌ ${cookieName} signwelfare - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function getinfo() {
  return new Promise((resolve, reject) => {
    let url = { url: `https://api.rr.tv/user/profile`, headers: { token: VAL_signcookie } }
    url.headers['clientType'] = `web`
    url.headers['clientVersion'] = ``
    chavy.post(url, (error, response, data) => {
      try {
        signinfo.userinfo = JSON.parse(data)
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `获取会员信息: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} getinfo - 获取会员信息失败: ${e}`)
        chavy.log(`❌ ${cookieName} getinfo - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function getquestion() {
  return new Promise((resolve, reject) => {
    let url = { url: `https://api.rr.tv/v3plus/question/getQuestion`, headers: { token: VAL_signcookie } }
    url.headers['clientType'] = `web`
    url.headers['clientVersion'] = ``
    chavy.post(url, (error, response, data) => {
      try {
        console.log(data)
        signinfo.question = JSON.parse(data)
        signinfo.questionopts = {}
        for (opt of signinfo.question.data.question.optionViewList) {
          signinfo.questionopts[opt.id] = opt
          if (!signinfo.answeropt) signinfo.answeropt = opt
          else signinfo.answeropt = opt.answererCount > signinfo.answeropt.answererCount ? opt : signinfo.answeropt
        }
        signinfo.hasAnswered = signinfo.question.data.question.hasAnswered
        if (signinfo.hasAnswered) {
          signinfo.selectId = signinfo.question.data.question.selectId
          signinfo.isRight = signinfo.questionopts[signinfo.selectId].isRight
        }
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `获取问题: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} getquestion - 获取问题失败: ${e}`)
        chavy.log(`❌ ${cookieName} getquestion - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function answerquestion() {
  return new Promise((resolve, reject) => {
    let url = { url: `https://api.rr.tv/v3plus/question/answerQuestion`, headers: { token: VAL_signcookie } }
    url.body = `optionId=${signinfo.answeropt.id}`
    url.headers['clientType'] = `web`
    url.headers['clientVersion'] = ``
    chavy.post(url, (error, response, data) => {
      try {
        signinfo.answerquestion = JSON.parse(data)
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `获取问题: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} getquestion - 获取问题失败: ${e}`)
        chavy.log(`❌ ${cookieName} getquestion - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function openbox(boxcode, boxname, body) {
  return new Promise((resolve, reject) => {
    let url = { url: `https://api.rr.tv/v3plus/taskCenter/openBox`, headers: { token: VAL_signcookie } }
    url.body = body
    url.headers['clientType'] = `web`
    url.headers['clientVersion'] = ``
    chavy.post(url, (error, response, data) => {
      try {
        signinfo[boxcode] = JSON.parse(data)
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `打开${boxname}: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} getquestion - 打开${boxname}失败: ${e}`)
        chavy.log(`❌ ${cookieName} getquestion - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function showmsg() {
  let subTitle = ''
  let detail = ''
  if (signinfo.signdaily) {
    subTitle = `签到: `
    if (signinfo.signdaily.code == '0000' || signinfo.signdaily.code == '8750') {
      subTitle += signinfo.signdaily.code == '0000' ? '成功; ' : ''
      subTitle += signinfo.signdaily.code == '8750' ? '重复; ' : ''
    } else {
      subTitle += '失败; '
    }
  }
  if (signinfo.signwelfare) {
    subTitle += `福利: `
    if (signinfo.signwelfare.code == '0000' || signinfo.signwelfare.code == '8623') {
      subTitle += signinfo.signwelfare.code == '0000' ? '成功; ' : ''
      subTitle += signinfo.signwelfare.code == '8623' ? '重复; ' : ''
    } else {
      subTitle += '失败;'
    }
  }
  if (signinfo.question && signinfo.questionopts) {
    subTitle += `答题: ${signinfo.isRight ? '✅' : '❌'}`
  }

  if (signinfo.userinfo.code == '0000') {
    const levelStr = signinfo.userinfo.data.user.levelStr ? ` (${signinfo.userinfo.data.user.levelStr})` : ``
    detail = `等级: ${signinfo.userinfo.data.user.level}${levelStr}, 银币: ${signinfo.userinfo.data.user.silverCount}`
  } else {
    detail = `编码: ${signinfo.userinfo.code}, 说明: ${signinfo.userinfo.msg}`
  }

  if (signinfo.question.data.question) {
    detail += `\n查看答题详情`
    detail += `\n\n问题: ${signinfo.question.data.question.questionStr}`
    for (key in signinfo.questionopts)
      detail += `\n选项: ${signinfo.questionopts[key].optionStr}, 回答人数: ${signinfo.questionopts[key].answererCount} (${signinfo.questionopts[key].percent})`
    if (signinfo.selectId) {
      detail += `\n最佳回答: ${signinfo.answeropt.optionStr}`
      detail += `\n我的回答: ${signinfo.questionopts[signinfo.selectId].optionStr}`
      detail += `${signinfo.isRight ? '✅' : '❌'}\n`
    } else {
      detail += `\n最佳回答: ${signinfo.answeropt.optionStr}\n`
    }
  }

  if (signinfo.copperbox) {
    if (signinfo.copperbox.code == '0000') {
      for (box of signinfo.copperbox.data.boxs) detail += `\n铜宝箱: ${box.rewardName} (+${box.rewardNum})`
    } else {
      detail += `\n铜宝箱: ${signinfo.copperbox.msg}`
    }
  }

  if (signinfo.silverbox) {
    if (signinfo.silverbox.code == '0000') {
      for (box of signinfo.silverbox.data.boxs) detail += `\n银宝箱: ${box.rewardName} (+${box.rewardNum})`
    } else {
      detail += `\n银宝箱: ${signinfo.silverbox.msg}`
    }
  }

  if (signinfo.goldenbox) {
    if (signinfo.goldenbox.code == '0000') {
      for (box of signinfo.goldenbox.data.boxs) detail += `\n金宝箱: ${box.rewardName} (+${box.rewardNum})`
    } else {
      detail += `\n金宝箱: ${signinfo.goldenbox.msg}`
    }
  }
  chavy.msg(cookieName, subTitle, detail)
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}