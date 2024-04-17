let bar;

// バーの初期化
const initBar = () => {
    // バーのオブジェクトを初期化
    bar = {
        x: barHalfWidth, // バーのx座標
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
    // マウスイベントの場合
        // パソコンのマウスで操作した場合
    if (event.offsetX) {
        // offesetXにカーソルがキャンバス上のどこに位置しているかが分かる
            //カーソルと操作バーの位置を同じにすることができる 
        bar.x = event.offsetX;
    } else {
    // タッチイベントの場合
         // スマホのドラッグで操作した場合
        const touchEvent = event.changedTouches[0];
        // スマホの方にはoffsetXがない
        // が、changedTouchesの中にブラウザウィンドウ左端からタップした場所のX座標を示すclientXがある
        // getBoundingClientRectはブラウザからキャンバス(ゲーム画面)までの距離を測る
        // clientXからgetBoundingClientRectを引くことでゲーム画面内のX座標の距離を測ることができる
        bar.x = touchEvent.clientX - touchEvent.target.getBoundingClientRect().left;
    }
    // 縮尺の調整をする
    bar.x *= barBallsCanvas.width / barBallsCanvas.clientWidth;

    // バーが画面外に出ないように制御
    // canvasの左端からはみ出してしまう場合、canvas内に納まるようにする
    if (bar.leftX < 0) {
        bar.x = barHalfWidth;
    }
    // canvasの右端からはみ出してしまう場合、canvas内に納まるようにする
    else if (bar.rightX > canvasWidth) {
        bar.x = canvasWidth - barHalfWidth;
    }
};


// バーの描画
const drawBar = () => {
    // バーの色　settings内で指定している
    barBallsCtx.fillStyle = barColor;
    // バーの大きさ
    barBallsCtx.fillRect(bar.leftX, bar.y, barWidth, barHeight);
};


// ボールがバーに衝突したときの処理
const collideBar = (ball) => {

 // 操作バーの当たった位置（0～1）
 const clidedPosition = (bar.rightX - ball.x) / barWidth;

 // 反射後の角度（40～140）
 const degree = clidedPosition * 100 + 40;

 // ボールのdxとdy計算する
 const { dx, dy } = calcDeltaXY(degree);

 ball.dx = dx;
 ball.dy = dy;

 const barHitSound = document.getElementById('barHitSound');
 barHitSound.currentTime=0;
 barHitSound.play();
 
};


const calcDeltaXY = (degree) => {

    // 角度をラジアンに変換
    const radian = degree * Math.PI / 180;

    return {
        dx: Math.cos(radian) * speed,
        dy: -Math.sin(radian) * speed,
    };
};