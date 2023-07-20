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
      console.log(hr);
      // console.log(hr.faceLandmarks);
    }
  };
}

function draw() {
  // 描画処理
  clear(); // これを入れないと下レイヤーにあるビデオが見えなくなる
  // マスクを描画
  Mask();

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

        // 目の周りの点を黒で描画
        if (i >= 68 && i <= 187) {
          fill(0);
        }
        //眉毛の点を茶色で描画
        else if (i >= 198 && i <= 393) {
          fill(230, 200, 200);
        }
        // 鼻の周りの点をオレンジで描画
        else if (i >= 188 && i <= 197) {
          fill(255, 165, 0);
        }
        // 口の周りの点を赤で描画
        else if (i >= 398 && i <= 467) {
          fill(255, 0, 0);
        }
        // その他の点を白で描画
        else {
          fill(255);
        }

        noStroke();
        circle(x * width, y * height, 10);
        // // 番号を表示
        // fill(50);
        // textAlign(CENTER, CENTER);
        // text(i, x * width, y * height);
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
