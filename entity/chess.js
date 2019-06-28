class Chess {
  constructor(x, y, camp, chessKey) {
    this.img = imgObjects[chessKey];
    this.x = x; // 二维数组中的位置
    this.y = y;
    this.pixx = x * OFFSET; // 像素位置
    this.pixy = y * OFFSET; 
    this.camp = camp; // 阵营 1红方 2黑方
    this.chessType = chessMap[chessKey];
    this.chessKey = chessKey;
  }

  draw() {
    ctx.drawImage(this.img, this.pixx, this.pixy);
  }

  select() {
    ctx.drawImage(imgObjects[10], this.pixx, this.pixy);
    const positions = this.findWayCanGo();
    this.hitWayCanGo(positions);
    game.status = GAME_STATUS.SELECT;
    game.selectChess = this;
    game.wayCanGo = positions;
  }

  move(x, y) {
    this.eat(x, y);
  }

  hitWayCanGo(positions) {
    for (const pos of positions) {
      this.drawDot(pos[0] * OFFSET + 8, pos[1] * OFFSET + 7);
    }
  }

  drawDot(x, y) {
    ctx.drawImage(imgObjects[9], x, y);
  }

  // 可以去的点
  findWayCanGo() {
    var positions = [];
    switch (this.chessType) {
      case CHESS_TYPE.CHE:
        for (let i = this.x + 1; i < chessObjArr.length; i++) {
          if (chessObjArr[i][this.y] != 99) {
            if (chessObjArr[i][this.y].camp != this.camp) {
              positions.push([i, this.y]);
            }
            break;
          }
          positions.push([i, this.y]);
        }
        for (let i = this.x - 1; i >= 0; i--) {
          if (chessObjArr[i][this.y] != 99) {
            if (chessObjArr[i][this.y].camp != this.camp) {
              positions.push([i, this.y]);
            }
            break;
          }
          positions.push([i, this.y]);
        }
        for (let i = this.y + 1; i < chessObjArr[this.x].length; i++) {
          if (chessObjArr[this.x][i] != 99) {
            if (chessObjArr[this.x][i].camp != this.camp) {
              positions.push([this.x, i]);
            }
            break;
          }
          positions.push([this.x, i]);
        }
        for (let i = this.y - 1; i >= 0; i--) {
          if (chessObjArr[this.x][i] != 99) {
            if (chessObjArr[this.x][i].camp != this.camp) {
              positions.push([this.x, i]);
            }
            break;
          }
          positions.push([this.x, i]);
        }
        break;
      case CHESS_TYPE.MA:
        if (this.x - 2 >= 0 && this.y + 1 <= 9 && chessObjArr[this.x - 1][this.y] == 99 &&
          (chessObjArr[this.x - 2][this.y + 1] == 99 || chessObjArr[this.x - 2][this.y + 1].camp != this.camp)) {
          positions.push([this.x - 2, this.y + 1]);
        }
        if (this.x - 2 >= 0 && this.y - 1 >= 0 && chessObjArr[this.x - 1][this.y] == 99 &&
          (chessObjArr[this.x - 2][this.y - 1] == 99 || chessObjArr[this.x - 2][this.y - 1].camp != this.camp)) {
          positions.push([this.x - 2, this.y - 1]);
        }
        if (this.x + 2 <= 8 && this.y + 1 <= 9 && chessObjArr[this.x + 1][this.y] == 99 &&
          (chessObjArr[this.x + 2][this.y + 1] == 99 || chessObjArr[this.x + 2][this.y + 1].camp != this.camp)) {
          positions.push([this.x + 2, this.y + 1]);
        }
        if (this.x + 2 <= 8 && this.y - 1 >= 0 && chessObjArr[this.x + 1][this.y] == 99 &&
          (chessObjArr[this.x + 2][this.y - 1] == 99 || chessObjArr[this.x + 2][this.y - 1].camp != this.camp)) {
          positions.push([this.x + 2, this.y - 1]);
        }
        if (this.x + 1 <= 8 && this.y + 2 <= 9 && chessObjArr[this.x][this.y + 1] == 99 &&
          (chessObjArr[this.x + 1][this.y + 2] == 99 || chessObjArr[this.x + 1][this.y + 2].camp != this.camp)) {
          positions.push([this.x + 1, this.y + 2]);
        }
        if (this.x - 1 >= 0 && this.y + 2 <= 9 && chessObjArr[this.x][this.y + 1] == 99 &&
          (chessObjArr[this.x - 1][this.y + 2] == 99 || chessObjArr[this.x - 1][this.y + 2].camp != this.camp)) {
          positions.push([this.x - 1, this.y + 2]);
        }
        if (this.x + 1 <= 8 && this.y - 2 >= 0 && chessObjArr[this.x][this.y - 1] == 99 &&
          (chessObjArr[this.x + 1][this.y - 2] == 99 || chessObjArr[this.x + 1][this.y - 2].camp != this.camp)) {
          positions.push([this.x + 1, this.y - 2]);
        }
        if (this.x - 1 >= 0 && this.y - 2 >= 0 && chessObjArr[this.x][this.y - 1] == 99 &&
          (chessObjArr[this.x - 2][this.y - 2] == 99 || chessObjArr[this.x - 2][this.y - 2].camp != this.camp)) {
          positions.push([this.x - 1, this.y - 2]);
        }
        break;
      case CHESS_TYPE.PAO:
        let finding = false; // 是否在寻找可以吃的子
        for (let i = this.x + 1; i < chessObjArr.length; i++) {
          if (!finding && chessObjArr[i][this.y] == 99) {
            positions.push([i, this.y]);
          } else if (finding && chessObjArr[i][this.y].camp && chessObjArr[i][this.y].camp != this.camp) {
            positions.push([i, this.y]);
            break;
          } else {
            finding = true;
            continue;
          }
        }
        finding = false;
        for (let i = this.x - 1; i >= 0; i--) {
          if (!finding && chessObjArr[i][this.y] == 99) {
            positions.push([i, this.y]);
          } else if (finding && chessObjArr[i][this.y].camp && chessObjArr[i][this.y].camp != this.camp) {
            positions.push([i, this.y]);
            break;
          } else {
            finding = true;
            continue;
          }
        }
        finding = false;
        for (let i = this.y + 1; i < chessObjArr[this.x].length; i++) {
          if (!finding && chessObjArr[this.x][i] == 99) {
            positions.push([this.x, i]);
          } else if (finding && chessObjArr[this.x][i].camp && chessObjArr[this.x][i].camp != this.camp) {
            positions.push([this.x, i]);
            break;
          } else {
            finding = true;
            continue;
          }
        }
        finding = false;
        for (let i = this.y - 1; i >= 0; i--) {
          if (!finding && chessObjArr[this.x][i] == 99) {
            positions.push([this.x, i]);
          } else if (finding && chessObjArr[this.x][i].camp && chessObjArr[this.x][i].camp != this.camp) {
            positions.push([this.x, i]);
            break;
          } else {
            finding = true;
            continue;
          }
        }
        break;
      case CHESS_TYPE.XIANG:
        let xminX = 0;
        let xmaxX = 8;
        let xminY = 0;
        let xmaxY = 9;
        if (this.camp == CAMP.RED) {
          xminY = 5; // 5~9
        } else {
          xmaxY = 4; // 0~4 不能过河
        }
        if (this.x + 2 <= xmaxX && this.y + 2 <= xmaxY && (chessObjArr[this.x + 1][this.y + 1] == 99 || chessObjArr[this.x + 1][this.y + 1].camp != this.camp)) {
          positions.push([this.x + 2, this.y + 2]);
        }
        if (this.x + 2 <= xmaxX && this.y - 2 >= xminY && (chessObjArr[this.x + 1][this.y - 1] == 99 || chessObjArr[this.x + 1][this.y - 1].camp != this.camp)) {
          positions.push([this.x + 2, this.y - 2]);
        }
        if (this.x - 2 >= xminX && this.y + 2 <= xmaxY && (chessObjArr[this.x - 1][this.y + 1] == 99 || chessObjArr[this.x - 1][this.y + 1].camp != this.camp)) {
          positions.push([this.x - 2, this.y + 2]);
        }
        if (this.x - 2 >= xminX && this.y - 2 >= xminY && (chessObjArr[this.x - 1][this.y - 1] == 99 || chessObjArr[this.x - 1][this.y - 1].camp != this.camp)) {
          positions.push([this.x - 2, this.y - 2]);
        }
        break;
      case CHESS_TYPE.SHI:
        let sminX = 3;
        let smaxX = 5;
        let sminY = 0;
        let smaxY = 9;
        if (this.camp == CAMP.RED) {
          smaxY = 2;
        } else {
          sminY = 7;
        }
        if (this.x + 1 <= smaxX && this.y + 1 <= smaxY && (chessObjArr[this.x + 1][this.y + 1] == 99 || chessObjArr[this.x + 1][this.y + 1].camp != this.camp)) {
          positions.push([this.x + 1, this.y + 1]);
        }
        if (this.x + 1 <= smaxX && this.y - 1 >= sminY && (chessObjArr[this.x + 1][this.y - 1] == 99 || chessObjArr[this.x + 1][this.y - 1].camp != this.camp)) {
          positions.push([this.x + 1, this.y - 1]);
        }
        if (this.x - 1 >= sminX && this.y + 1 <= smaxY && (chessObjArr[this.x - 1][this.y + 1] == 99 || chessObjArr[this.x - 1][this.y + 1].camp != this.camp)) {
          positions.push([this.x - 1, this.y + 1]);
        }
        if (this.x - 1 >= sminX && this.y - 1 >= sminY && (chessObjArr[this.x - 1][this.y - 1] == 99 || chessObjArr[this.x - 1][this.y - 1].camp != this.camp)) {
          positions.push([this.x - 1, this.y - 1]);
        }
        break;
      case CHESS_TYPE.JIANG:
        let jminX = 3;
        let jmaxX = 5;
        let jminY = 0;
        let jmaxY = 9;

        if (this.camp == CAMP.RED) {
          jminY = 7;
        } else {
          jmaxY = 2;
        }

        if (this.x + 1 <= jmaxX && (chessObjArr[this.x + 1][this.y] == 99 || chessObjArr[this.x + 1][this.y].camp != this.camp)) {
          positions.push([this.x + 1, this.y]);
        }
        if (this.y + 1 <= jmaxY && (chessObjArr[this.x][this.y + 1] == 99 || chessObjArr[this.x][this.y + 1].camp != this.camp)) {
          positions.push([this.x, this.y + 1]);
        }
        if (this.x - 1 >= jminX && (chessObjArr[this.x - 1][this.y] == 99 || chessObjArr[this.x - 1][this.y].camp != this.camp)) {
          positions.push([this.x - 1, this.y]);
        }
        if (this.y - 1 >= jminY && (chessObjArr[this.x][this.y - 1] == 99 || chessObjArr[this.x][this.y - 1].camp != this.camp)) {
          positions.push([this.x, this.y - 1]);
        }
        break;
      case CHESS_TYPE.ZU:
        if (this.camp == CAMP.RED) {
          if (chessObjArr[this.x][this.y - 1] == 99 || chessObjArr[this.x][this.y - 1].camp != this.camp) {
            positions.push([this.x, this.y - 1]);
          }
          if (this.y <= 4 && this.x - 1 >= 0 && (chessObjArr[this.x - 1][this.y] == 99 || chessObjArr[this.x - 1][this.y].camp != this.camp)) {
            positions.push([this.x - 1, this.y]);
          }
          if (this.y <= 4 && this.x + 1 <= 8 && (chessObjArr[this.x + 1][this.y] == 99 || chessObjArr[this.x + 1][this.y].camp != this.camp)) {
            positions.push([this.x + 1, this.y]);
          }
        } else {
          if (chessObjArr[this.x][this.y + 1] == 99 || chessObjArr[this.x][this.y + 1].camp != this.camp) {
            positions.push([this.x, this.y + 1]);
          }
          if (this.y >= 5 && this.x - 1 >= 0 && (chessObjArr[this.x - 1][this.y] == 99 || chessObjArr[this.x - 1][this.y].camp != this.camp)) {
            positions.push([this.x - 1, this.y]);
          }
          if (this.y >= 5 && this.x + 1 <= 8 && (chessObjArr[this.x + 1][this.y] == 99 || chessObjArr[this.x + 1][this.y].camp != this.camp)) {
            positions.push([this.x + 1, this.y]);
          }
        }
        break;
    }
    return positions;
  }

  eat(x, y) {
    const selectChess = game.selectChess;
    selectChess.x = x;
    selectChess.y = y;
    selectChess.pixx = x * OFFSET;
    selectChess.pixy = y * OFFSET;
    chessArr[selectChess.x][selectChess.y] = 99;
    chessArr[x][y] = selectChess.chessKey;
    chessObjArr[selectChess.x][selectChess.y] = 99;
    chessObjArr[x][y] = selectChess;
    game.status = GAME_STATUS.NORMAL;
  }
}