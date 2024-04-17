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