onmessage = function (e) {
  console.log("Worker: Message received from main script");
  console.log(e.data);
  const { pointWorkLoad } = e.data;

  const results = simulation(1, 1, 3, 3, pointWorkLoad);
  postMessage(results);
};

function generateNumber(start, end) {
  return Math.random() * (end - start) + start;
}

function generatePoint(startX, startY, endX, endY) {
  const x = generateNumber(startX, endX);
  const y = generateNumber(startY, endY);

  return [x, y];
}

function simulation(startX, startY, endX, endY, pointCount = 10) {
  const results = {
    points: [],
    inCircleCount: 0,
    outCircleCount: 0,
  };

  const { mx, my, r } = getCircleParameters(endX, startX, endY, startY);

  for (let i = 0; i < pointCount; i++) {
    const [x, y] = generatePoint(startX, startY, endX, endY);
    const isInCircle = pointCheck(mx, my, r, x, y);

    if (isInCircle) {
      results.inCircleCount++;
    } else {
      results.outCircleCount++;
    }

    results.points.push({ x, y, isInCircle });
  }

  console.log(results.inCircleCount, results.outCircleCount);
  return results;
}

function getCircleParameters(endX, startX, endY, startY) {
  const mx = (endX - startX) / 2 + startX;
  const my = (endY - startY) / 2 + startY;
  const r = (endX - startX) / 2;
  return { mx, my, r };
}

function pointCheck(mx, my, r, x, y) {
  const distance = ((x - mx) ** 2 + (y - my) ** 2) ** 0.5;

  return distance < r;
}
