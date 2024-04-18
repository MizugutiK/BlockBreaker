let bar;

// バーの初期化
const initBar = () => {
    // バーのオブジェクトを初期化
    bar = {
        x: canvasWidth / 2,
        y: barPosition, // バーのy座標
        bottomY: barPosition + barHeight, // バーの底辺のy座標
        // バーの左端のx座標
        get leftX() { return this.x - barHalfWidth; },
        // バーの右端のx座標
        get rightX() { return this.x + barHalfWidth; }
    };
};


// マウスまたはタッチイベントに基づいてバーの位置を設定
const setBarX = (event) => {
    if (event.offsetX) {
        bar.x = event.offsetX;
    } else {
        const touchEvent = event.changedTouches[0];
        bar.x = touchEvent.clientX - touchEvent.target.getBoundingClientRect().left;
    }
    bar.x *= barBallsCanvas.width / barBallsCanvas.clientWidth;

    // バーが画面外に出ないように制御
    if (bar.leftX < 0) {
        bar.x = barHalfWidth;
    } else if (bar.rightX > canvasWidth) {
        bar.x = canvasWidth - barHalfWidth;
    }
};

// バーの描画
const drawBar = () => {
    barBallsCtx.fillStyle = barColor;
    barBallsCtx.fillRect(bar.leftX, bar.y, barWidth, barHeight);
};

// ボールがバーに衝突したときの処理
const collideBar = (ball) => {
    const collidedPosition = (bar.rightX - ball.x) / barWidth;
    const degree = collidedPosition * 100 + 40;
    const { dx, dy } = calcDeltaXY(degree);

    ball.dx = dx;
    ball.dy = dy;

    const barHitSound = document.getElementById('barHitSound');
    barHitSound.currentTime = 0;
    barHitSound.play();
};

const calcDeltaXY = (degree) => {
    const radian = degree * Math.PI / 180;

    return {
        dx: Math.cos(radian) * speed,
        dy: -Math.sin(radian) * speed,
    };
};
