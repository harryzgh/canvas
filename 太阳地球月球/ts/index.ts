// js 创建canvas元素
const canvas = document.createElement('canvas')
// 棋盘宽度
const boardWidth: number = 800
canvas.width = boardWidth
canvas.height = boardWidth
document.body.append(canvas)
// 获取画笔
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
let earthAngle = 0
let moonAngle = 0
function loop (): void {
    ctx.save()
    // 清理整张画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 画太阳
    ctx.beginPath()
    ctx.fillStyle = '#e3fa14'
    ctx.shadowColor = '#e3fa14'
    ctx.shadowBlur = 5
    ctx.arc(400, 400, 120, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    // 画地球
    ctx.beginPath()
    ctx.fillStyle = 'blue'
    ctx.shadowBlur = 0
    ctx.translate(400, 400)
    ctx.rotate(earthAngle += 0.1 * Math.PI / 180) 
    // ctx.arc(680, 400, 40, 0, Math.PI * 2)
    ctx.translate(300, 0)
    ctx.arc(0, 0, 40, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    // 画月球
    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.shadowBlur = 0
    ctx.rotate(moonAngle += 1.2 * Math.PI / 180) 
    ctx.arc(70, 0, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
    requestAnimationFrame(loop)
}
requestAnimationFrame(loop)