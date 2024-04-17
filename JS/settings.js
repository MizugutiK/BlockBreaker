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
const barWidth = 200;
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
