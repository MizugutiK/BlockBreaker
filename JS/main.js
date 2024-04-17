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
