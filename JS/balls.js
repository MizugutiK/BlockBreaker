// ボールの配列
let balls = [];
// ボールが壁にぶつかった時のSE要素
const wallHitSound = document.getElementById('wallHitSound');

// ボールを作成する関数
const createBall = (x, y, degree) => {

    const { dx, dy } = calcDeltaXY(degree);

    balls.push({ x, y, dx, dy, __proto__: ballProto  });
    // ballCount++; // ボールの数を増やす
};

// ボールのプロトタイプ
// プロトタイプを使うことで同じオブジェクトに同じ機能を共有できる
    // ボールのオブジェクトを生成する際にいちいち定義しなくてもよくなる
const ballProto = {
    get topY() { return this.y - ballRadius; },
    get bottomY() { return this.y + ballRadius; },
    get leftX() { return this.x - ballRadius; },
    get rightX() { return this.x + ballRadius; },
};


// ボールの初期化
const initBall = () => {
    balls = [];
    // bar.yからballRadiusだけ上に描写させている
        // これでボールがめり込まないで描写される
    // 80はボールが操作バーに乗っている状態からの発射角度
    createBall(bar.x, bar.y - ballRadius, 80);
};


// ボールの描画
const drawBall = (ball) => {
    barBallsCtx.fillStyle = ballColor;
    barBallsCtx.beginPath();
    barBallsCtx.arc(ball.x, ball.y, ballRadius, 0, 2 * Math.PI);
    barBallsCtx.fill();
};


// バーの上でボールを移動させる
const moveBallOnBar = () => {
    balls[0].x = bar.x;
    drawBall(balls[0]);
};


// ボールの移動
const moveBalls = () => {
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];

        // ボールの座標を移動させる
        ball.x += ball.dx;
        ball.y += ball.dy;

        // 画面端と衝突しているかの検証
        checkEdgeCollision(ball);
        // 操作バーと衝突しているかの検証
        checkBarCollision(ball);
        // ブロックと衝突しているかの検証
        checkBlockCollision(ball);
        // 画面下に落ちているかの検証
        checkDropped(ball, i);
        // ボールを描く
        drawBall(ball);
    }
};

// ボールのエッジ衝突のチェック
const checkEdgeCollision = (ball) => {
    
    // canvasの上端からはみ出している場合
    if (ball.topY < 0) {
        ball.y = ballRadius;
        ball.dy = -ball.dy;
        resetAndPlayWallHitSound();
    }
    // canvasの左端からはみ出している場合 
    else if (ball.leftX < 0) {
        ball.x = ballRadius;
        ball.dx = -ball.dx;
        resetAndPlayWallHitSound();
    }
    // canvasの右端からはみ出している場合
     else if (ball.rightX > canvasWidth) {
        ball.x = canvasWidth - ballRadius;
        ball.dx = -ball.dx;
        resetAndPlayWallHitSound();
    }
};
const resetAndPlayWallHitSound = () => {
    wallHitSound.currentTime = 0; // 再生位置をリセット
    wallHitSound.play(); // SEを再生
};

// バーとの衝突のチェック
const checkBarCollision = (ball) => {
    if (
        ball.rightX > bar.leftX &&
        ball.leftX < bar.rightX &&
        ball.bottomY > bar.y &&
        ball.topY < bar.bottomY
    ) {
        // bar.jsに処理が書いてある
        collideBar(ball);
    }
};


// ブロックとの衝突のチェック
const checkBlockCollision = (ball) => {
     // 座標から行番号や列番号を計算する
    const topRowIndex = Math.floor(ball.topY / blockHeight);
    const centerRowIndex = Math.floor(ball.y / blockHeight);
    const bottomRowIndex = Math.floor(ball.bottomY / blockHeight);
    const leftColumnIndex = Math.floor(ball.leftX / blockWidth);
    const centerColumnIndex = Math.floor(ball.x / blockWidth);
    const rightColumnIndex = Math.floor(ball.rightX / blockWidth);

    // ボールの上端がブロックと衝突した場合
    if (blocks[topRowIndex] && blocks[topRowIndex][centerColumnIndex]) {
        collideBlock(ball, blocks[topRowIndex][centerColumnIndex]);
        if (ball.dy < 0) {
            ball.dy = -ball.dy;

        } else {
            ball.dx = -ball.dx;
        }
    } 

    // ボールの下端がブロックと衝突した場合
    else if (blocks[bottomRowIndex] && blocks[bottomRowIndex][centerColumnIndex]) {
        collideBlock(ball, blocks[bottomRowIndex][centerColumnIndex]);
        if (ball.dy > 0) {
            ball.dy = -ball.dy;
        } else {
            ball.dx = -ball.dx;
        }
    }     
    // ボールの左端がブロックと衝突した場合
    else if (blocks[centerRowIndex] && blocks[centerRowIndex][leftColumnIndex]) {
        collideBlock(ball, blocks[centerRowIndex][leftColumnIndex]);
        if (ball.dx < 0) {
            ball.dx = -ball.dx;
        } else {
            ball.dy = -ball.dy;
        }
    }
    // ボールの右端がブロックと衝突した場合
    else if (blocks[centerRowIndex] && blocks[centerRowIndex][rightColumnIndex]) {
        collideBlock(ball, blocks[centerRowIndex][rightColumnIndex]);
        if (ball.dx > 0) {
            ball.dx = -ball.dx;
        } else {
            ball.dy = -ball.dy;
        }
    }
};

// ボールが画面外に出たかどうかのチェック
const checkDropped = (ball, index) => {
    if (ball.topY > canvasHeight) {

        if (balls.length === 1) {
            remainingAttempts--;

            if (remainingAttempts === 0) {
                changeGameState('gameOver');  // ボールがなくなった場合にゲームオーバーにする
                const ballsCountLabel = document.getElementById('balls-count');
                ballsCountLabel.textContent =0;
                if ( gameState==="gameOver") {
                    // メッセージを更新して表示
                    updateMessage();
                    return;
                }
                changeGameState('waiting'); // 待機状態に変更
                // ゲームを初期化する
                initGame();
            }
        }
        // ボールをballsから削除する
        balls.splice(index, 1);

       
        if (balls.length === 0) {
            changeGameState('waiting');
            initBall();
        }
        
    }
};

// 画面上にボールがあるかどうかを確認する関数
const ballsOnScreen = () => {
    return balls.some(ball => ball.y + ball.radius < canvasHeight);
};