class ChessBoard {
  constructor(img, x, y) {
    this.img = img;
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y);
  }
}