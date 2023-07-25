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

function draw() {
  // 描画処理
  clear(); // これを入れないと下レイヤーにあるビデオが見えなくなる
  // マスクを描画
  Mask();
  Game();

  // キャンバスに枠をつける
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

function Game() {
  ellipse(10, 10, 10, 10);
}
