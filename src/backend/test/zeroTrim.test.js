var string = '123456\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000';
console.log(string.length); // 11
console.log(string.replace(/\0.*$/g,'').length); // 10
console.log(string.replace(/\0/g, '').length); // 8