var a = ''
var b = ''
var pattern = 5;

for (var i = 1; i <= pattern; i++) {
    for (var j = 1; j <= i; j++) {
        a += ' '
    }
    for (var k = pattern; k >= (2*i - pattern); k--) {
        a += '+'
    }
    a += '\n'
}
console.log(a)