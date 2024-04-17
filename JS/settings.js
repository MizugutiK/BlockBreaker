// ゲーム画面の設定
// canvasの横幅
const canvasWidth = 600;
// canvasの縦幅
const canvasHeight = 800;
// canvasの背景色
const backgroundColor = '#454545';


// 壊すブロックの設定
// ブロック描画エリアの幅と高さ
const blocksAreaWidth = canvasWidth;
// ブロックエリアの縦幅
const blocksAreaHeight = canvasHeight/2.5;
// 列の個数 　横に何個ブロックを置くか
const blocksColumnLength = 30;
// 行の個数　縦に何個ブロックを置くか
const blocksRowLength =  15;
// １つのブロックの横幅　
    // ブロックエリアの横幅/横に置くブロックの個数
const blockWidth = blocksAreaWidth / blocksColumnLength;
// １つのブロックの縦幅
    // ブロックエリアの縦幅/縦に置くブロックの個数
const blockHeight = blocksAreaHeight / blocksRowLength;


// 操作バーの設定

// 操作バーの横幅
let barWidth = 200;
// 操作バーの横幅の半分の長さ
    // bar.jsで使用
const barHalfWidth = barWidth / 2;
// 操作バーの縦幅
const barHeight = 10;
// 操作バーの縦方向の位置
    // キャンバスから60pxだけ上に位置するようになる
const barPosition = canvasHeight - 60;
// 操作バーの色
const barColor = 'white';


// ボールの設定
// ボールの半径
const ballRadius = 8;
// ボールの移動スピード
const speed = 5;
// ボールの色
const ballColor = 'orange';
// 残りの試行回数を追跡する変数
// ボールの数を初期化
let ballCount = 0;
// ボールの最大残り回数
let remainingAttempts = 3;


// ゲームの状態
let gameState = 'initial';


// ブロック描画用キャンバスとコンテキスト
const blocksCanvas = document.getElementById('blocks-canvas');
// canvasのサイズを設定
    // ブロックを描写させるだけのキャンバス
blocksCanvas.width = canvasWidth;
blocksCanvas.height = canvasHeight;
// コンテキストの取得
    //コンテキスト：プログラム内の特定の状態や環境を指す
    // 今回の場合はブロックを2dで描写させるために入っている
const blocksCtx = blocksCanvas.getContext("2d");


// バーとボール描画用キャンバスとコンテキスト
const barBallsCanvas = document.getElementById('bar-balls-canvas');
// バーとボールだけのキャンバスを用意している
    // これを重ねることで処理しているように見せている
barBallsCanvas.width = canvasWidth;
barBallsCanvas.height = canvasHeight;
// コンテキストの取得
const barBallsCtx = barBallsCanvas.getContext("2d");


// メッセージラベルとブロック数ラベル
const messageLabel = document.getElementById('message');
const blocksCountLabel = document.getElementById('blocks-count');


// balls.js

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
        checkBarCollision(ball, bar);
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
const checkBarCollision = (ball, bar) => {
    const barLeftX = bar.x - barHalfWidth; // バーの左端のX座標
    const barRightX = bar.x + barHalfWidth; // バーの右端のX座標
    if (
       ball.rightX > barLeftX &&
        ball.leftX < barRightX &&
        ball.bottomY > bar.y &&
        ball.topY < bar.y + barHeight
    ) {
        // bar.jsに処理が書いてある
        collideBar(ball,bar);
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

// blocks.js
const hitSound1 = document.getElementById('hitSound1');
const hitSound2 = document.getElementById('hitSound2');
const hitSound3 = document.getElementById('hitSound3');
// ブロックの配列とブロックの総数を定義
let blocks ;
let blocksCount;

// ブロックの種類を定義する辞書オブジェクト
const blockDictionary = {
    'normal': {
        borderColor: 'midnightblue', // ブロックの境界線の色
        fillColor: 'deepskyblue', // ブロックの塗りつぶしの色
        hitPoints: 1, // ブロックの耐久ポイント
    },
    'hard': {
        borderColor: 'black',
        fillColor: 'blue',
        hitPoints: 2,
        effect () {
            // 色を変更したあとcanvasに描く
            this.borderColor = 'midnightblue';
            this.fillColor = 'deepskyblue';
            drawBlock(this);
        }
    },
    'double': {
        borderColor: 'chocolate',
        fillColor: 'orange',
        hitPoints: 1,
        effect (ball) {
            // 新しく生成するボールの進行角度
            const degree=Math.random() * 100 + 220
            createBall(ball.x, ball.y, degree);
        },
    },
    'barWidthChange': {
        borderColor: 'green',
        fillColor: 'lightgreen',
        hitPoints: 1,
        effect () {
            if (barWidth === 100) {
                barWidth = 200;
            } else {
                barWidth = 100;
            }
        },
    },
    
};



// 新しいブロックを生成する関数
const createRandomBlock = (rowIndex, columnIndex) => {
    // 0〜1の間の乱数を生成
    const randomNumber = Math.random();
    let blockName;

    // 確率に応じてブロックの種類を選択
    if (randomNumber < 0.6) { // 60%の確率で通常ブロック
        blockName = 'normal';
    }
     else if (randomNumber < 0.8) { 
        blockName = 'hard';
    }
    else if (randomNumber < 0.9) { 
        blockName = 'barWidthChange';

    } else { 
        blockName = 'double';
    }
    // 選択したブロックを生成
    createBlock(blockName, rowIndex, columnIndex);
};

// 指定した位置にブロックを生成する関数
const createBlock = (blockName, rowIndex, columnIndex) => {
    const block = {
        ...blockDictionary[blockName], // ブロックの種類に応じたプロパティを設定
        rowIndex: rowIndex, // ブロックの行インデックス
        columnIndex: columnIndex, // ブロックの列インデックス
        x: columnIndex * blockWidth, // ブロックのx座標
        y: rowIndex * blockHeight // ブロックのy座標
    };

    blocks[rowIndex][columnIndex] = block; // ブロックを配列に格納

// 壊れるブロックなら個数を1つ増やす
    if (!block.isUnbreakable) { 
        blocksCount++;
    }
    // ブロックを描画
    drawBlock(block); 
};


// ブロックを描画する関数
const drawBlock = (block) => {
    // ブロックの境界線を描画
    blocksCtx.fillStyle = block.borderColor;
    blocksCtx.fillRect(block.x, block.y, blockWidth, blockHeight);

    // ブロックの塗りつぶしを描画
    blocksCtx.fillStyle = block.fillColor;
    blocksCtx.fillRect(block.x + 1, block.y + 1, blockWidth - 2, blockHeight - 2);
};


// ブロックを消去する関数
const eraseBlock = (block) => {
    // ブロックの領域を背景色で塗りつぶす
    blocksCtx.fillStyle = backgroundColor;
    blocksCtx.fillRect(block.x, block.y, blockWidth, blockHeight);
};


// ブロックを削除する関数
const removeBlock = (block) => {
    // ブロックを配列から削除
    blocks[block.rowIndex][block.columnIndex] = null; 
    // ブロックを消去
    eraseBlock(block); 
    // ブロックの総数を減らす
    blocksCount--; 
    // ブロックの総数表示を更新
    updateBlocksCountLabel(); 

    // ブロックが全てなくなった場合、ゲームクリア状態に移行
    if (blocksCount === 0) {
        changeGameState('gameClear');
    }
};


// ボールとブロックの衝突処理を行う関数
const collideBlock = (ball, block) => {
    // 壊れないブロックなら何もしない
    if (block.isUnbreakable) {
        return;
    }
    // ブロックの耐久ポイントを減らす
    block.hitPoints--; 
    // ブロックの効果が設定されている場合は効果を実行
    if (block.effect) {
        block.effect(ball);
    }
    // ブロックの耐久ポイントが0になった場合、ブロックを削除
    if (block.hitPoints === 0) {
        removeBlock(block);
    }

    // ブロックがどの種類かによって、異なる効果音を再生
    const hitSound1 = document.getElementById('hitSound1');
    const hitSound2 = document.getElementById('hitSound2');
    const hitSound3 = document.getElementById('hitSound3');
    
        // ブロックのボーダーカラーで判断している
    
    // ノーマルブロック
    if (block.borderColor === 'midnightblue')  {
        hitSound1.currentTime = 0; // 再生位置をリセット
        hitSound1.play(); // SE1再生
    }
    //ダブルブロック 
    else if (block.borderColor === 'chocolate') {
        hitSound3.currentTime = 0; // 再生位置をリセット
        hitSound3.play(); // SE3再生
    }
    else if (block.borderColor === 'green') {
        hitSound2.currentTime = 0; // 再生位置をリセット
        hitSound2.play(); // SE3再生
    }
}; 


// ブロックの初期化を行う関数
const initBlocks = () => {
    blocks = []; // ブロックの配列を初期化
    blocksCount = 0; // ブロックの総数を初期化

    // ブロック領域を背景色で塗りつぶし
    blocksCtx.fillStyle = backgroundColor;
    blocksCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    // ブロックの行と列ごとにブロックを生成
    for (let rowIndex = 0; rowIndex < blocksRowLength; rowIndex++) {
        // 新しい行を追加
        blocks.push([]); 

        for (let columnIndex = 0; columnIndex < blocksColumnLength; columnIndex++) {
            // ランダムな種類のブロックを生成
            createRandomBlock(rowIndex, columnIndex);
        }
    }
    // ブロックの総数表示を更新
    updateBlocksCountLabel(); 
};


// ブロックの総数表示を更新する関数
const updateBlocksCountLabel = () => {
    // ブロックの総数を表示
    blocksCountLabel.textContent = blocksCount; 
 };

//  bar.js

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

// ボールの速度をバーの幅に応じて調整
const speedAdjustment = 2 * (barHalfWidth - Math.abs(barHalfWidth - (ball.x - bar.leftX))) / barWidth;
const speedAdjusted = speed * (1 + speedAdjustment);

// ボールのdxとdyを調整した速度で計算する
const { dx, dy } = calcDeltaXY(degree, speedAdjusted);


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

// main.js
const GameClear = document.getElementById('GameClear');
const GameOver = document.getElementById('GameOver');
// メッセージを更新する関数
const updateMessage = () => {

   if (gameState === 'initial') {
    messageLabel.classList.add('message-visible');
        messageLabel.textContent = 'クリックしてスタート！'; // メッセージの内容を設定
    }    

    // ゲームクリアの場合
    else if (gameState === 'gameClear') {
        messageLabel.classList.add('message-visible');
        messageLabel.innerHTML = 'ゲームクリア！<br>クリックしてリセット'; // メッセージの内容を設定
        GameClear.play(); // SE1再生
    } 

    else if (gameState === 'gameOver') {
        messageLabel.classList.add('message-visible');
        messageLabel.innerHTML= 'ゲームオーバー！<br>クリックして最初から';
        GameOver.play(); // SE1再生
    }
    // その他の場合はメッセージを非表示にする
    else {
        // messageLabel.classList.add('message-None');
        messageLabel.classList.remove('message-visible'); // message-visible クラスを削除して非表示にする
    }
   
};

// ボールの数を更新する関数
const updateBallCount = () => {
    const ballsCountLabel = document.getElementById('balls-count');
    ballsCountLabel.textContent = remainingAttempts.toString();
    if(gameState==="gameOver"){
        ballsCountLabel.textContent =0;
    }
};


// ゲームの状態を変更し、メッセージを更新する関数
const changeGameState = (newGameState) => {
    gameState = newGameState; // ゲームの状態を更新
    updateMessage(); // メッセージを更新
};


// ゲームのメイン処理を実行する関数
const run = () => {
    // ゲームクリア状態ならアニメーションを停止する
    if (gameState === 'gameClear'|| gameState === 'gameOver') {
        // メッセージを更新して表示
        updateMessage();
        return;
    }

    // キャンバスをクリアする
    barBallsCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 操作バーを描画する
    drawBar();

    // ボールの数を更新する
    updateBallCount();

    // ゲームが実行中の場合
    if (gameState === 'running') {
        // ボールを移動させる
        moveBalls();
    } 
    // それ以外の場合、ボールを操作バーの上に移動させる
    else {
        moveBallOnBar();
    }

    // アニメーションを再開する
    window.requestAnimationFrame(run);
    };


// クリックイベントを処理する関数
const click = () => {
    // ゲームが初期状態または待機状態の場合
    if (gameState === 'initial' || gameState === 'waiting') {
        changeGameState('running'); // ゲームを実行状態に変更
    } 
    // ゲームクリア状態の場合
    else if (gameState === 'gameClear'|| gameState === 'gameOver') {
        changeGameState('waiting'); // 待機状態に変更
        // ゲームを初期化する
        initGame();
    }

};

// ゲームの初期化を行う関数
const initGame = () => {
    changeGameState('initial'); // ゲームの状態を初期状態に設定
    remainingAttempts = 3;// 残りのボールの数を初期化
    initBar(); // 操作バーの初期化
    initBlocks(); // ブロックの初期化
    initBall(); // ボールの初期化
    // ボールの数を更新する
    updateBallCount();
    run(); // ゲームの実行
};


// イベントリスナーの設定
barBallsCanvas.addEventListener("mousemove", setBarX); // マウス移動イベント
barBallsCanvas.addEventListener("touchmove", setBarX, { passive: true }); // タッチ移動イベント
barBallsCanvas.addEventListener("click", click); // クリックイベント

initGame(); // ゲームの初期化
