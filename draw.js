const s = function (p) {
  let widthG, heightG;
  p.points = [];

  p.setup = function () {
    const canvas = p.createCanvas(320, 320);
    canvas.parent("sketch-holder");
    p.fill(0);
    widthG = p.width;
    heightG = p.height;
    p.noLoop();
  };

  p.draw = function () {
    p.background(240);
    drawGrid();
    p.fill(0);
    putPoints();
    drawAreas(1, 1, 3, 3);
  }

  p.drawAllPoints = function (points) {
    points.forEach(({ x, y }) => {
      p.stroke('rgba(0,0,255,0.01)');
      p.point(mapX(x), mapY(y));
      drawAreas(1, 1, 3, 3);
    });
  }

  function drawGrid() {
    const { width, height } = p;
    p.stroke(200);
    p.fill(120);

    for (var x = 40; x < width; x += 40) {
      const mappedX = x / 40 - (width / 80);
      p.line(x, 0, x, height);
      if (mappedX === 0) {
        continue;
      }
      p.text(mappedX, x - 15, width / 2 + 15);
    }

    for (var y = 40; y < height; y += 40) {
      const mappedY = y / 40 - (width / 80);
      p.line(-width, y, width, y);
      p.text(-mappedY, width / 2 - 15, y + 12);
    }
  }

  function mapX(x, gridGap = 40, width = widthG) {
    // console.log(width);
    return x * gridGap + width / 2;
  }

  function mapY(y, gridGap = 40, width = widthG) {
    return (-y * gridGap + width / 2);
  }

  function drawAreas(x1, y1, x2, y2) {
    [x1, x2] = [x1, x2].map(x => mapX(x));
    [y1, y2] = [y1, y2].map(y => mapY(y));

    p.noFill();
    p.stroke(255, 0, 0);
    p.rectMode(p.CORNERS);
    p.rect(x1, y1, x2, y2);

    p.stroke(0, 255, 0);
    const centerX = (x2 - x1) / 2 + x1;
    const centerY = (y2 - y1) / 2 + y1;
    const diameter = x2 - x1;
    p.circle(centerX, centerY, diameter);
  }

  function putPoints() {
    p.stroke('rgba(0,0,255,0.01)');

    const mappedPoints = p.points.map(({ x, y }) => [mapX(x), mapY(y)]);

    mappedPoints.forEach(mappedPoint => p.point(...mappedPoint));
  }
};

const myP5 = new p5(s, "sketch-holder");
export default myP5;





