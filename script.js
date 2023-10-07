"use strict";

const canvas = document.getElementById("myCanvas");
const chartCanvas = document.getElementById("chartCanvas");
const ctx = canvas.getContext("2d");
const chartCtx = chartCanvas.getContext("2d");

const offset = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

const chartOffset = {
  x: chartCanvas.width / 2,
  y: chartCanvas.height / 2,
};

let theta = Math.PI / 4;
const c = 100;

const A = { x: 0, y: 0 };
const B = {
  x: Math.cos(theta) * c,
  y: Math.sin(theta) * c,
};
const C = { x: B.x, y: 0 };

ctx.translate(offset.x, offset.y);
chartCtx.translate(chartOffset.x, chartOffset.y);

const average = function (p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
};

const distance = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

const update = function () {
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const tan = Math.tan(theta); // sin/cos
  const cot = 1 / tan; // cos / sin

  const T = {
    x: Math.sign(cos) * Math.hypot(1, tan) * c,
    y: 0,
  };

  const O = {
    x: 0,
    y: Math.sign(sin) * Math.hypot(cot, 1) * c,
  };

  ctx.clearRect(-offset.x, -offset.y, canvas.width, canvas.height);

  drawCoordinateSystem(ctx, offset);

  drawText(
    `sin = opposite / hypotenuse = ${-1 * +sin.toFixed(2)}`,
    {
      x: -offset.x / 2,
      y: offset.y * 0.6,
    },
    "red"
  );

  drawText(
    `cos = adjacent / hypotenuse = ${+cos.toFixed(2)}`,
    {
      x: -offset.x / 2,
      y: offset.y * 0.7,
    },
    "blue"
  );

  drawText(
    `tan = opposite / adjacent = ${tan < 3000 && tan > -3000 ? +tan.toFixed(2) : 'undefined'}`,
    {
      x: -offset.x / 2,
      y: offset.y * 0.8,
    },
    "magenta"
  );

  drawText(
    `cot = adjacent / opposite = ${cot < 3000 && cot > -3000 ? +cot.toFixed(2) : 'undefined'}`,
    {
      x: -offset.x / 2,
      y: offset.y * 0.9,
    },
    "green"
  );

  drawText(
    `ϴ = ${+theta.toFixed(2)}rad (${Math.round(toDeg(theta))
      .toString()
      .padStart(2, " ")}°)`,
    {
      x: offset.x / 2,
      y: offset.y * 0.7,
    }
  );

  drawLine(A, B);
  drawText("1", average(A, B));
  drawLine(A, C, "blue");
  drawText("cosϴ", average(A, C), "blue");
  drawLine(B, C, "red");
  drawText("sinϴ", average(B, C), "red");
  drawLine(B, T, "magenta");
  drawText("tanϴ", average(B, T), "magenta");
  drawLine(B, O, "green");
  drawText("cotϴ", average(B, O), "green");

  drawText("ϴ", A);

  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.arc(0, 0, c, 0, theta, theta < 0);
  ctx.stroke();

  const chartScaler = chartOffset.y * 0.5;
  drawPoint(
    {
      x: theta * chartScaler,
      y: sin * chartScaler,
    },
    2,
    "red"
  );
  drawPoint(
    {
      x: theta * chartScaler,
      y: cos * chartScaler,
    },
    2,
    "blue"
  );
  drawPoint(
    {
      x: theta * chartScaler,
      y: tan * chartScaler,
    },
    2,
    "magenta"
  );
  drawPoint(
    {
      x: theta * chartScaler,
      y: cot * chartScaler,
    },
    2,
    "green"
  );
};

const toDeg = (rad) => (rad * 180) / Math.PI;
const toRad = (deg) => (deg * Math.PI) / 180;

document.addEventListener("wheel", function (event) {
  theta -= toRad(Math.sign(event.deltaY));

  B.x = Math.cos(theta) * c;
  B.y = Math.sin(theta) * c;

  C.x = B.x;

  update();
});

const drawText = function (text, loc, color = "black") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 18px Courier";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 7;
  ctx.strokeText(text, loc.x, loc.y);
  ctx.fillText(text, loc.x, loc.y);
};

const drawPoint = function (loc, size = 20, color = "black") {
  chartCtx.beginPath();
  chartCtx.fillStyle = color;
  chartCtx.arc(loc.x, loc.y, size / 2, 0, Math.PI * 2);
  chartCtx.fill();
};

const drawLine = function (p1, p2, color = "black") {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();
};

const drawCoordinateSystem = function (ctx, offset) {
  ctx.beginPath();
  ctx.moveTo(-offset.x, 0);
  ctx.lineTo(ctx.canvas.width - offset.x, 0);
  ctx.moveTo(0, -offset.y);
  ctx.lineTo(0, ctx.canvas.height - offset.y);
  ctx.setLineDash([4, 2]);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "gray";
  ctx.stroke();
  ctx.setLineDash([]);
};

drawCoordinateSystem(ctx, offset);
drawCoordinateSystem(chartCtx, chartOffset);
