// js 创建canvas元素
var canvas = document.createElement('canvas'); // 类型断言定义context为非空变量
var tipDom = document.querySelector('.tip'); // 类型断言定义context为非空变量
// 棋盘宽度
var boardWidth = 1200;
var boardSpace = 50;
canvas.width = boardWidth;
canvas.height = boardWidth;
document.body.append(canvas);
// 获取画笔
// const context = canvas.getContext('2d') as CanvasRenderingContext2D // 类型断言定义context为非空变量
var context = canvas.getContext('2d'); // 非空断言定义context为非空变量
// 棋盘横线起点x坐标
var boardStartX = boardSpace;
var boardStartY = boardSpace;
// 棋盘横/纵线终点x/y坐标
var boardEndX = boardWidth - boardSpace;
var boardEndY = boardEndX;
// 横向或者纵向棋盘线数量
var boardLineNum = (boardWidth - boardSpace * 2) / boardSpace + 1;
// 画棋盘线
for (var i = 0; i < boardLineNum; i++) {
    // 画棋盘横线, context需加非空断言操作符
    context.moveTo(boardStartX, boardStartX + boardSpace * i);
    context.lineTo(boardEndX, boardStartX + boardSpace * i);
    context.stroke();
    // 画棋盘纵线
    context.moveTo(boardStartX + boardSpace * i, boardStartX);
    context.lineTo(boardStartX + boardSpace * i, boardEndY);
    context.stroke();
}
var isBlack = true;
// 二维数组，存储当前落子信息
var arr = [];
var isWin = false;
// 注册点击事件
canvas.addEventListener('click', function (e) {
    if (isWin)
        return;
    var x = e.offsetX, y = e.offsetY;
    // 限制点击范围
    var xCanClickStart = boardStartX - boardSpace / 2;
    var yCanClickStart = xCanClickStart;
    var xCanClickEnd = boardEndX + boardSpace / 2;
    var yCanClickEnd = xCanClickEnd;
    if (x < xCanClickStart || x > xCanClickEnd || y < yCanClickStart || y > yCanClickEnd) {
        tipDom.innerText = '点击范围超出可点击区域！';
        return;
    }
    //
    context.beginPath();
    var xm = Math.floor(x / boardSpace);
    var xn = x % boardSpace;
    var ym = Math.floor(y / boardSpace);
    var yn = y % boardSpace;
    var xx = boardSpace - xn >= xn ? xm * boardSpace : (xm + 1) * boardSpace;
    var yy = boardSpace - yn >= yn ? ym * boardSpace : (ym + 1) * boardSpace;
    // 
    var isRepeat = arr.some(function (ele) {
        var ox = ele[0], oy = ele[1];
        if (xx === ox && yy === oy) {
            return true;
        }
    });
    if (isRepeat) {
        tipDom.innerText = '当前位置已经有棋子了！';
        return;
    }
    else {
        tipDom.innerText = isBlack ? '刚下了黑子' : '刚下了白子';
    }
    // 画棋子
    context.arc(xx, yy, 20, 0, 2 * Math.PI);
    var tx = isBlack ? xx - 10 : xx + 10;
    var ty = isBlack ? yy - 10 : yy + 10;
    // 给棋子加渐变
    var g = context.createRadialGradient(tx, ty, 0, tx, ty, 30);
    g.addColorStop(0, isBlack ? '#ccc' : '#666');
    g.addColorStop(1, isBlack ? '#000' : '#fff');
    context.fillStyle = g;
    // 内部填充颜色
    context.fill();
    // 给棋子加阴影
    context.shadowColor = '#333';
    context.shadowOffsetX = 4;
    context.shadowOffsetY = 4;
    context.shadowBlur = 10;
    //
    context.closePath();
    arr.push([xx, yy, isBlack]);
    // 双方共至少落子9颗，进行是否有获胜判断
    var arrLen = arr.length;
    if (arrLen >= 9) {
        console.log('test--------------------------------------------');
        isWin = isXWinChecked(xx, yy);
        if (isWin)
            return;
        isWin = isYWinChecked(xx, yy);
        if (isWin)
            return;
        isWin = isWs2EnWinChecked(xx, yy);
        if (isWin)
            return;
        isWin = isWn2EsYWinChecked(xx, yy);
    }
    isBlack = !isBlack;
});
/**
 * 判断横向是否有获胜
 * @xx
 * @yy
 * @blackContinuousNum
 * @whiteContinuousNum
 */
function isXWinChecked(xx, yy) {
    var blackContinuousNum = 1;
    var whiteContinuousNum = 1;
    var bwx = xx - boardSpace;
    while (bwx >= boardStartX) {
        if (containsArray(arr, [bwx, yy, isBlack])) {
            isBlack ? blackContinuousNum++ : whiteContinuousNum++;
            console.log('XWin++++00', blackContinuousNum, whiteContinuousNum);
            bwx = bwx - boardSpace;
        }
        else {
            break;
        }
    }
    bwx = xx + boardSpace;
    while (bwx <= boardEndX) {
        if (containsArray(arr, [bwx, yy, isBlack])) {
            isBlack ? blackContinuousNum++ : whiteContinuousNum++;
            console.log('XWin++++11', blackContinuousNum, whiteContinuousNum);
            bwx = bwx + boardSpace;
        }
        else {
            break;
        }
    }
    if (blackContinuousNum >= 5) {
        tipDom.innerText = '黑方已获胜，请刷新后再重开一局';
        return true;
    }
    if (whiteContinuousNum >= 5) {
        tipDom.innerText = '白方已获胜，请刷新后再重开一局';
        return true;
    }
    return false;
}
/**
* 判断纵向是否有获胜
* @xx
* @yy
* @blackContinuousNum
* @whiteContinuousNum
*/
function isYWinChecked(xx, yy) {
    var blackContinuousNum = 1;
    var whiteContinuousNum = 1;
    var bwy = yy - boardSpace;
    while (bwy >= boardStartY) {
        if (containsArray(arr, [xx, bwy, isBlack])) {
            isBlack ? blackContinuousNum++ : whiteContinuousNum++;
            console.log('YWin++++00', blackContinuousNum, whiteContinuousNum);
            bwy = bwy - boardSpace;
        }
        else {
            break;
        }
    }
    bwy = yy + boardSpace;
    while (bwy <= boardEndY) {
        if (containsArray(arr, [xx, bwy, isBlack])) {
            isBlack ? blackContinuousNum++ : whiteContinuousNum++;
            console.log('YWin++++11', blackContinuousNum, whiteContinuousNum);
            bwy = bwy + boardSpace;
        }
        else {
            break;
        }
    }
    if (blackContinuousNum >= 5) {
        tipDom.innerText = '黑方已获胜，请刷新后再重开一局';
        return true;
    }
    if (whiteContinuousNum >= 5) {
        tipDom.innerText = '白方已获胜，请刷新后再重开一局';
        return true;
    }
    return false;
}
/**
* 判断西南往东北斜向是否有获胜
* @xx
* @yy
* @blackContinuousNum
* @whiteContinuousNum
*/
function isWs2EnWinChecked(xx, yy) {
    var blackContinuousNum = 1;
    var whiteContinuousNum = 1;
    var mx = xx - boardSpace;
    var my = yy + boardSpace;
    while (mx >= boardStartX && my <= boardEndY) {
        if (containsArray(arr, [mx, my, isBlack])) {
            isBlack ? blackContinuousNum++ : whiteContinuousNum++;
            console.log('Ws2EnWin++++00', blackContinuousNum, whiteContinuousNum);
            mx = mx - boardSpace;
            my = my + boardSpace;
        }
        else {
            break;
        }
    }
    mx = xx + boardSpace;
    my = yy - boardSpace;
    console.log('mx+++my', mx <= boardEndX && my <= boardEndY, containsArray(arr, [mx, my, isBlack]), arr, [mx, my, isBlack]);
    while (mx <= boardEndX && my >= boardStartY) {
        if (containsArray(arr, [mx, my, isBlack])) {
            isBlack ? blackContinuousNum++ : whiteContinuousNum++;
            console.log('Ws2EnWin++++11', blackContinuousNum, whiteContinuousNum);
            mx = mx + boardSpace;
            my = my - boardSpace;
        }
        else {
            break;
        }
    }
    if (blackContinuousNum >= 5) {
        tipDom.innerText = '黑方已获胜，请刷新后再重开一局';
        return true;
    }
    if (whiteContinuousNum >= 5) {
        tipDom.innerText = '白方已获胜，请刷新后再重开一局';
        return true;
    }
    return false;
}
/**
* 判断西北往东南斜巷是否有获胜
* @xx
* @yy
* @blackContinuousNum
* @whiteContinuousNum
*/
function isWn2EsYWinChecked(xx, yy) {
    var blackContinuousNum = 1;
    var whiteContinuousNum = 1;
    var nx = xx - boardSpace;
    var ny = yy - boardSpace;
    while (nx >= boardStartX && ny >= boardStartY) {
        if (containsArray(arr, [nx, ny, isBlack])) {
            isBlack ? blackContinuousNum++ : whiteContinuousNum++;
            console.log('Wn2EsYWin++++00', blackContinuousNum, whiteContinuousNum);
            nx = nx - boardSpace;
            ny = ny - boardSpace;
        }
        else {
            break;
        }
    }
    nx = xx + boardSpace;
    ny = yy + boardSpace;
    while (nx <= boardEndX && ny <= boardEndY) {
        if (containsArray(arr, [nx, ny, isBlack])) {
            isBlack ? blackContinuousNum++ : whiteContinuousNum++;
            console.log('Wn2EsYWin++++11', blackContinuousNum, whiteContinuousNum);
            nx = nx + boardSpace;
            ny = ny + boardSpace;
        }
        else {
            break;
        }
    }
    if (blackContinuousNum >= 5) {
        tipDom.innerText = '黑方已获胜，请刷新后再重开一局';
        return true;
    }
    if (whiteContinuousNum >= 5) {
        tipDom.innerText = '白方已获胜，请刷新后再重开一局';
        return true;
    }
    return false;
}
/**
 * 判断二维数组中是否包含某个数组
 * 如： [[1, 2], [3, 4]] 是否包含 [1, 2]
 * @twoDimArray 二维数组 Array<number | boolean> 可以写成 (number | boolean)[]
 * @targetArray 数组
 */
function containsArray(twoDimArray, targetArray) {
    // 不能使用数组的 includes和indexOf判断
    var targetString = JSON.stringify(targetArray);
    for (var i = 0; i < twoDimArray.length; i++) {
        if (JSON.stringify(twoDimArray[i]) === targetString) {
            return true;
        }
    }
    return false;
}
