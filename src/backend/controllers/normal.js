Array.prototype.remove = function(s) {
  for (var i = 0; i < this.length; i++) {
    if (s == this[i])
      this.splice(i, 1);
  }
}
String.prototype.tlen = function() {
  var len = 0;
  for (var i=0; i<this.length; i++) {
    if (this.charCodeAt(i)>127 || this.charCodeAt(i)==94) {
      len += 2;
    } else {
      len ++;
    }
  }
  return len;
}
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
  if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
    return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
  } else {
    return this.replace(reallyDo, replaceWith);
  }
}
String.prototype.endWith=function(endStr){
  var d=this.length-endStr.length;
  return (d>=0&&this.lastIndexOf(endStr)==d)
}
String.prototype.startWith=function(str){
  if(str==null||str==""||this.length==0||str.length>this.length)
    return false;
  if(this.substr(0,str.length)==str)
    return true;
  else
    return false;
  return true;
}
String.prototype.trim = function()
{
  return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim = function()
{
  return this.replace(/(^\s*)/g, "");
}
String.prototype.rtrim = function()
{
  return this.replace(/(\s*$)/g, "");
}
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
