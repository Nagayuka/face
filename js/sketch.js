let face_results;

function setup() {
  adjustCanvas();
  let p5canvas = createCanvas(windowWidth, windowHeight * 0.4);
  p5canvas.parent("#canvas");

  // 顔が見つかると以下の関数が呼び出される．resultsに検出結果が入っている．

  gotFaces = function (results) {
    face_results = results;

    hr = results;
    if (hr) {
      console.log(hr.faceBlendshapes[0].categories[25].score);

      // 追加: scoreが条件を満たしているかチェック
      if (hr.faceBlendshapes[0].categories[25].score > 0.5) {
        redCircleDisplayed = true; // 赤い丸を表示するフラグを立てる
        console.log("Open");
      } else {
        redCircleDisplayed = false; // 条件を満たさない場合はフラグを下げる
      }
    }
  };
}

// 追加: ゲーム用の変数
let eggsAndBombs = [
  2, 1, 2, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 2, 2, 1, 1,
  2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1,
];
let eggIndex = 0; // 現在表示されている卵または爆弾のインデックス
let eggSpeed = 3; // 卵と爆弾の移動速度
let eggSize = 20; // 卵と爆弾のサイズ
let eggY = 0; // 卵と爆弾のY座標

function draw() {
  clear();
  Mask();

  // 追加: 卵と爆弾を描画する
  if (redCircleDisplayed && eggIndex < eggsAndBombs.length) {
    const eggOrBomb = eggsAndBombs[eggIndex];
    let eggOrBombColor = color(255, 255, 0); // 卵は黄色
    if (eggOrBomb === 2) {
      eggOrBombColor = color(255, 0, 0); // 爆弾は赤色
    }
    fill(eggOrBombColor);
    ellipse(width, eggY, eggSize, eggSize);
    eggY += eggSpeed;
    if (eggY > height) {
      eggY = 0;
      eggIndex++;
    }
  }

  noFill();
  stroke(0);
  strokeWeight(2);
  rect(0, 0, width, height);
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

        noStroke();
        fill(255, 192, 203);
        circle(x * width, y * height, 10);
        // 番号を表示
        fill(50);
        textAlign(CENTER, CENTER);

        text(i, x * width, y * height);
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
