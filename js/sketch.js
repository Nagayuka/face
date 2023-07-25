let face_results;
let gameStarted = false;

function setup() {
  adjustCanvas();
  let p5canvas = createCanvas(windowWidth, windowHeight * 0.4);
  p5canvas.parent("#canvas");

  // 顔が見つかると以下の関数が呼び出される．resultsに検出結果が入っている．

  gotFaces = function (results) {
    face_results = results;

    hr = results;
    if (hr) {
      console.log(
        hr.faceBlendshapes[0].categories[25].score,
        hr.faceBlendshapes[0].categories[9].score,
        hr.faceBlendshapes[0].categories[10].score
      );

      // 追加: scoreが条件を満たしているかチェック
      if (hr.faceBlendshapes[0].categories[25].score > 0.5) {
        redCircleDisplayed = true; // 赤い丸を表示するフラグを立てる
        console.log("Open");
      } else {
        redCircleDisplayed = false; // 条件を満たさない場合はフラグを下げる
      }

      if (hr.faceBlendshapes[0].categories[9].score < 0.5) {
        LeftEyeClosed = true;
        console.log("Left");
      } else {
        LeftEyeClosed = false;
      }

      if (hr.faceBlendshapes[0].categories[10].score < 0.5) {
        RightEyeClosed = true;
        console.log("Right");
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
  } else {
    // ゲームが開始されていない場合はタイトル画面を表示
    displayTitle();
  }

  noFill();
  stroke(0);
  strokeWeight(2);
  rect(0, 0, width, height);
}

function displayTitle() {
  textSize(32);
  textAlign(CENTER);
  fill(0);
  text("Face Detection Game", width / 2, height / 2 - 50);
  textSize(24);
  text("Press 'Game' to Start", width / 2, height / 2 + 20);
}

function startGame() {
  // ゲームボタンが押されたらゲームを開始する
  gameStarted = true;
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

        // noStroke();
        // fill(255, 192, 203);
        // circle(x * width, y * height, 10);
        // // 番号を表示
        // textSize(5);
        // fill(50);
        // textAlign(CENTER, CENTER);
        // text(i, x * width, y * height);

        // 追加: 13番目の位置に丸を描画
        if (i === 13) {
          fill(255, 192, 203);

          ellipse(x * width, y * height, 120, 120);

          if (LeftEyeClosed) {
            fill(0);
            circle(x * width - 30, y * height - 15, 20);
          } else {
            strokeWeight(5);
            line(x * width - 30, y * height - 5, x * width - 10, y * height);
          }

          if (RightEyeClosed) {
            fill(0);
            circle(x * width + 30, y * height - 15, 20);
          } else {
            strokeWeight(5);
            line(x * width + 30, y * height - 5, x * width + 10, y * height);
          }

          // 口が開いている場合の処理
          if (redCircleDisplayed) {
            fill(0);
            ellipse(x * width, y * height * 1.05, 60, 60);
          } else {
            strokeWeight(5);
            line(
              x * width - 30,
              y * height * 1.05,
              x * width + 30,
              y * height * 1.05
            );
            strokeWeight(1);
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
  // ここにゲームの処理を書く
  ellipse(10, 10, 10, 10);
}
