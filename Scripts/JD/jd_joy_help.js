/**
宠汪汪强制为别人助力（助力一个好友你自己可以获得30积分，一天上限是帮助3个好友，自己获得90积分，不管助力是否成功，对方都会成为你的好友）
更新地址：https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_help.js
更新时间：2020-10-20
目前提供了304位好友的friendPin供使用。脚本随机从里面获取一个，助力成功后，退出小程序重新点击进去开始助力新的好友
欢迎大家使用 https://jdjoy.jd.com/pet/getFriends?itemsPerPage=20&currentPage=1 (currentPage=1表示第一页好友，=2表示第二页好友)
提供各自账号列表的friendPin给我
如果想设置固定好友，那下载下来放到本地使用，可以修改friendPin换好友(助力一好友后，更换一次friendPin里面的内容)
感谢github @Zero-S1提供
使用方法：
①设置好相应软件的重写
②从京东APP宠汪汪->领狗粮->邀请好友助力，分享给你小号微信或者微信的文件传输助手。 自己再打开刚才的分享，助力成功后，返回到此小程序首页重新进去宠汪汪即可助力下一位好友
③如提示好友人气旺，说明此好友已满了三人助力，需重新进出小程序，重新进入来客有礼-宠汪汪。
[MITM]
hostname = draw.jdfcloud.com
surge
[Script]
宠汪汪强制为别人助力= type=http-request,pattern=(^https:\/\/draw\.jdfcloud\.com\/\/pet\/enterRoom\/h5\?reqSource=weapp&invitePin=.*+(&inviteSource=task_invite&shareSource=\w+&inviteTimeStamp=\d+&openId=\w+)?|^https:\/\/draw\.jdfcloud\.com\/\/pet\/helpFriend\?friendPin),requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_help.js

圈x
[rewrite_local]
^https:\/\/draw\.jdfcloud\.com\/\/pet\/enterRoom\/h5\?reqSource=weapp&invitePin=.*+(&inviteSource=task_invite&shareSource=\w+&inviteTimeStamp=\d+&openId=\w+)?|^https:\/\/draw\.jdfcloud\.com\/\/pet\/helpFriend\?friendPin url script-request-header https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_help.js

 LOON：
[Script]
http-request ^https:\/\/draw\.jdfcloud\.com\/\/pet\/enterRoom\/h5\?reqSource=weapp&invitePin=.*+(&inviteSource=task_invite&shareSource=\w+&inviteTimeStamp=\d+&openId=\w+)?|^https:\/\/draw\.jdfcloud\.com\/\/pet\/helpFriend\?friendPin script-path=https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_help.js
, requires-body=true, timeout=10, tag=宠汪汪强制为别人助力


你也可从下面链接拿好友的friendPin(复制链接到有京东ck的浏览器打开即可)

https://jdjoy.jd.com/pet/getFriends?itemsPerPage=20&currentPage=1
**/
let url = $request.url
const friendsArr = ["jd_7da9924d92a2c", "jd_6fcfb7044255e"]
function randomFriendPin(m,n) {
  return Math.floor(Math.random()*(m - n) + n);
}
let friendPin = friendsArr[randomFriendPin(0, friendsArr.length - 1)]  //强制为对方助力,可成为好友关系
friendPin = encodeURI(friendPin);
const timestamp = new Date().getTime()
newUrl = url.replace(/friendPin=.*?$/i, "friendPin=" + friendPin).replace(/invitePin=.*?$/i, "invitePin=" + friendPin).replace(/inviteTimeStamp=.*?$/i, "inviteTimeStamp=" + timestamp + "&")
console.log(newUrl)
$done({ url: newUrl })