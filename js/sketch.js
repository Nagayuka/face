// ひよこ画像の配列
let chickImages = [];
let chickImageSize = 100; // ひよこの画像のサイズ
let mouthOpenSound;
let gameBgm;
let titleBgm;
let tamago;
let bakudan;

function preload() {
  // GitHub Pagesでの画像パス
  let imagePath = "js/hiyokara.png";
  mouthOpenSound = loadSound("assets/Motion-Eating02-2.mp3");
  gameBgm = loadSound("assets/gamebgm.wav");
  titleBgm = loadSound("assets/titlebgm.wav");
  tamago = loadSound("assets/Onoma-Surprise04-5(Up).mp3");
  bakudan = loadSound("assets/爆発2.mp3");

  // ローカル環境での画像パス
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    imagePath = "hiyokara.png";
    mouthOpenSound = loadSound("../assets/Motion-Eating02-2.mp3");
    mouthOpenSound = loadSound("../assets/Motion-Eating02-2.mp3");
    gameBgm = loadSound("../assets/gamebgm.wav");
    titleBgm = loadSound("../assets/titlebgm.wav");
    tamago = loadSound("../assets/Onoma-Surprise04-5(Up).mp3");
    bakudan = loadSound("../assets/爆発2.mp3");
  }

  // ひよこ画像を読み込む
  for (let i = 1; i <= 5; i++) {
    let chickImage = loadImage(imagePath);
    chickImages.push(chickImage);
  }
}

let face_results;
let gameStarted = false;
let eggs = [];
let bombs = [];
let score = 0;
let fallingObjects = [
  2, 1, 2, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 2, 2, 1, 1,
  2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 2, 1, 1, 1,
];
let index = 0;
let objectTimer = 0;
let objectInterval = 13; // 1秒ごとにオブジェクトを生成

let gameTimer = 0; // ゲームの経過時間
const gameDuration = 30; // ゲームの制限時間（秒）

function setup() {
  gameBgm.setVolume(0.3);
  titleBgm.setVolume(0.3);

  adjustCanvas();
  let p5canvas = createCanvas(windowWidth, windowHeight * 0.4);
  p5canvas.parent("#canvas");
  background(0, 191, 255); // 水色の背景を設定

  // 顔が見つかると以下の関数が呼び出される．resultsに検出結果が入っている．

  gotFaces = function (results) {
    face_results = results;

    hr = results;
    if (hr) {
      // console.log(
      //   hr.faceBlendshapes[0].categories[25].score,
      //   hr.faceBlendshapes[0].categories[9].score,
      //   hr.faceBlendshapes[0].categories[10].score
      // );

      // 追加: scoreが条件を満たしているかチェック
      if (hr.faceBlendshapes[0].categories[25].score > 0.5) {
        redCircleDisplayed = true; // 赤い丸を表示するフラグを立てる
        // console.log("Open");
        if (!mouthOpenSound.isPlaying()) {
          mouthOpenSound.play();
        }
      } else {
        redCircleDisplayed = false; // 条件を満たさない場合はフラグを下げる
      }

      if (hr.faceBlendshapes[0].categories[9].score < 0.5) {
        LeftEyeClosed = true;
        // console.log("Left");
      } else {
        LeftEyeClosed = false;
      }

      if (hr.faceBlendshapes[0].categories[10].score < 0.5) {
        RightEyeClosed = true;
        // console.log("Right");
      } else {
        RightEyeClosed = false;
      }
    }
  };
}
function draw() {
  clear();
  Mask();

  // ゲームが開始されていればゲームの描画処理を行う
  if (gameStarted) {
    Game();
    // 卵と爆弾の更新
    updateObjects();
    // 卵と爆弾の描画
    drawObjects();

    // スコアを表示
    fill(0);
    textSize(24);
    textAlign(RIGHT, TOP);
    text("Score: " + score, width - 20, 20);

    // 残り時間を計算
    const remainingTime = max(gameDuration - gameTimer, 0);

    // 残り時間を表示
    textAlign(LEFT, TOP);
    text("Time: " + nf(remainingTime, 0, 1), 20, 20); // nf() 関数は小数点以下の桁数を指定して数値をフォーマット
  } else {
    // ゲームが開始されていない場合はタイトル画面を表示
    displayTitle();
  }

  noFill();
  stroke(0);
  strokeWeight(2);
  rect(0, 0, width, height);
}

let chickPositions = []; // ひよこの位置を格納する配列

function displayTitle() {
  if (!titleBgm.isPlaying()) {
    titleBgm.play();
  }
  textSize(50);
  textAlign(CENTER);
  fill(0);
  text("卵🥚を食べよう！爆弾🔵は食べないで！", width / 2, height / 2 - 50);
  textSize(30);
  text(
    "①カメラON ②スタート の順に押してください。",
    width / 2,
    height / 2 + 50
  );
  text("※音が流れます。", width / 2, height / 2 + 100);
  textSize(40);
  text("孵化させたたまごの数: " + score, width / 2, 70);

  // ひよこの画像を初めて配置した位置に固定して表示
  for (let i = 0; i < score; i++) {
    if (!chickPositions[i]) {
      // 初めて配置するひよこの場合はランダムな位置を保存
      let x = random(width * 0.1, width * 0.9); // 横方向の位置をランダムに決定
      let y = random(height * 0.3, height * 0.7); // 縦方向の位置をランダムに決定
      chickPositions[i] = createVector(x, y); // ひよこの位置をベクトルで保存
    }

    // 配置された位置にひよこ画像を表示
    let x = chickPositions[i].x;
    let y = chickPositions[i].y;
    image(
      chickImages[i % chickImages.length],
      x,
      y,
      chickImageSize,
      chickImageSize
    );
  }

  if (face_results) {
    for (let landmarks of face_results.faceLandmarks) {
      for (let i = 0; i < landmarks.length; i++) {
        const landmark = landmarks[i];

        if (RightEyeClosed) {
          fill(0);
        } else {
          //ひよこを移動させる
          for (let i = 0; i < score; i++) {
            chickPositions[i].x += random(-1, 1);
            chickPositions[i].y += random(-1, 1);
          }
        }
      }
    }
  }
}

function startGame() {
  // ゲームボタンが押されたらゲームを開始する
  gameStarted = true;

  //titleBGMを止める
  titleBgm.stop();

  if (!gameBgm.isPlaying()) {
    gameBgm.play();
  }
}
function Mask() {
  // 各頂点座標を表示する
  // 各頂点座標の位置と番号の対応は以下のURLを確認
  // https://developers.google.com/mediapipe/solutions/vision/pose_landmarker
  if (face_results) {
    for (let landmarks of face_results.faceLandmarks) {
      for (let i = 0; i < landmarks.length; i++) {
        const landmark = landmarks[i];
        const { x, y } = landmark;

        // 追加: 13番目の位置に丸を描画
        if (i === 13) {
          fill(255, 192, 203);

          ellipse(x * width, (height / 5) * 4, 120, 120);

          if (redCircleDisplayed) {
            fill(0);
            ellipse(x * width, (height / 5) * 4 * 1.05, 60, 60);
          } else {
            strokeWeight(5);
            line(
              x * width - 30,
              (height / 5) * 4 * 1.05,
              x * width + 30,
              (height / 5) * 4 * 1.05
            );
            strokeWeight(1);
          }

          if (LeftEyeClosed) {
            fill(0);
            circle(x * width - 30, (height / 5) * 4 - 15, 20);
          } else {
            strokeWeight(5);
            line(
              x * width - 30,
              (height / 5) * 4 - 5,
              x * width - 10,
              (height / 5) * 4
            );
            strokeWeight(1);
          }

          if (RightEyeClosed) {
            fill(0);
            circle(x * width + 30, (height / 5) * 4 - 15, 20);
          } else {
            strokeWeight(5);
            line(
              x * width + 30,
              (height / 5) * 4 - 5,
              x * width + 10,
              (height / 5) * 4
            );
            strokeWeight(1);

            // if ((gameStarted = false)) {
            //   //ひよこを移動させる
            //   for (let i = 0; i < score; i++) {
            //     chickPositions[i].x += random(-10, 10);
            //     chickPositions[i].y += random(-10, 10);
            //   }
            // }
          }
        }
      }
    }
  }
}
function windowResized() {
  adjustCanvas();
}

function adjustCanvas() {
  resizeCanvas(windowWidth, windowHeight * 0.4);
}

function Game() {
  // ゲームの経過時間を更新
  gameTimer += deltaTime / 1000; // deltaTimeは前フレームからの経過時間（ミリ秒）なので、秒に変換

  // 制限時間を超えた場合はゲームクリア画面を表示
  if (gameTimer >= gameDuration) {
    gameStarted = false; // ゲームを終了
    gameBgm.stop(); // ゲームBGMを停止
    displayGameClear(); // ゲームクリア画面を表示
    return; // ゲームが終了したので、それ以降の処理をスキップする
  }
}

// オブジェクトの更新
function updateObjects() {
  // 口が開いている場合の処理
  if (redCircleDisplayed) {
    // 卵と口の当たり判定
    for (let i = eggs.length - 1; i >= 0; i--) {
      const egg = eggs[i];
      const mouthX = face_results.faceLandmarks[0][13].x * width;
      const mouthY = (height / 5) * 4 * 1.05;
      if (dist(egg.x, egg.y, mouthX, mouthY) < egg.width / 2 + 60 / 2) {
        // 卵が口にぶつかった場合、スコアを加算して卵を削除
        score++;
        eggs.splice(i, 1);
        if (!tamago.isPlaying()) {
          tamago.play();
        }
      }
    }

    // 爆弾と口の当たり判定
    for (let i = bombs.length - 1; i >= 0; i--) {
      const bomb = bombs[i];
      const mouthX = face_results.faceLandmarks[0][13].x * width;
      const mouthY = (height / 5) * 4 * 1.05;
      if (dist(bomb.x, bomb.y, mouthX, mouthY) < bomb.width / 2 + 60 / 2) {
        // 爆弾が口にぶつかった場合、ゲームを終了してゲームクリア画面を表示
        if (!bakudan.isPlaying()) {
          bakudan.play();
        }
        gameStarted = false;

        gameBgm.stop();
        displayGameClear();
        return;
      }
    }
  }

  objectTimer++; // フレーム数をカウント

  if (objectTimer >= objectInterval) {
    // 1秒ごとにオブジェクトを生成
    let objectType = fallingObjects[index];
    index = (index + 1) % fallingObjects.length;
    objectTimer = 0; // タイマーをリセット

    if (objectType === 1) {
      // 卵を生成
      eggs.push(new Egg());
    } else if (objectType === 2) {
      // 爆弾を生成
      bombs.push(new Bomb());
    }
  }

  // オブジェクトの移動
  const secondsElapsed = deltaTime / 1000; // 前フレームからの経過時間を秒単位に変換

  for (let i = eggs.length - 1; i >= 0; i--) {
    eggs[i].update(secondsElapsed); // 経過時間を渡してオブジェクトを更新
    if (eggs[i].isOutOfScreen()) {
      eggs.splice(i, 1); // 画面外に出た卵を削除
    }
  }

  for (let i = bombs.length - 1; i >= 0; i--) {
    bombs[i].update(secondsElapsed); // 経過時間を渡してオブジェクトを更新
    if (bombs[i].isOutOfScreen()) {
      bombs.splice(i, 1); // 画面外に出た爆弾を削除
    }
  }
}

// オブジェクトの描画
function drawObjects() {
  for (let egg of eggs) {
    egg.display();
  }
  for (let bomb of bombs) {
    bomb.display();
  }
}

// 卵のクラス
class Egg {
  constructor() {
    this.x = random(300, width - 300);
    this.y = -100; // 画面外から降ってくるように高さを変更
    this.speed = 500; // 1秒あたりの移動距離（ピクセル）
    this.width = 80;
    this.height = 100;
  }

  update(secondsElapsed) {
    this.y += this.speed * secondsElapsed; // 経過時間を考慮した速度で更新
  }

  display() {
    fill(255); // 白色
    ellipse(this.x, this.y, this.width, this.height);
  }

  isOutOfScreen() {
    return this.y > height + this.height / 2;
  }
}

// 爆弾のクラス

class Bomb {
  constructor() {
    this.x = random(300, width - 300);
    this.y = -100; // 画面外から降ってくるように高さを変更
    this.speed = 500; // 1秒あたりの移動距離（ピクセル）
    this.width = 80;
    this.height = 80;
  }

  update(secondsElapsed) {
    this.y += this.speed * secondsElapsed; // 経過時間を考慮した速度で更新
  }

  display() {
    fill(0, 0, 230); //紺色
    ellipse(this.x, this.y, this.width, this.height);
  }

  isOutOfScreen() {
    return this.y > height + this.height / 2;
  }
}

function displayGameClear() {
  textSize(32);
  textAlign(CENTER);
  fill(0);
  text("Game Clear!", width / 2, height / 2 - 50);
  textSize(24);
  text("Your score: " + score, width / 2, height / 2 + 20);
  text("Press 'Restart' to Play Again", width / 2, height / 2 + 60);
}

function restartGame() {
  // Restartボタンが押されたらゲームをリスタートする
  gameStarted = true;
  eggs = [];
  bombs = [];
  score = 0;
  gameTimer = 0;
}

function restartGame() {
  // Restartボタンが押されたらゲームをリスタートする
  gameStarted = true;
  eggs = [];
  bombs = [];
  score = 0;
  gameTimer = 0;
}
