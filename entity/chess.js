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
    this.lastPos = []; // 上一次的位置
  }

  draw() {
    ctx.drawImage(this.img, this.pixx, this.pixy);
  }

  select() {
    ctx.drawImage(imgObjects[10], this.pixx, this.pixy);
    const positions = this.findWayCanGo(chessObjArr);
    this.hitWayCanGo(positions);
    game.status = GAME_STATUS.SELECT;
    game.selectChess = this;
    game.wayCanGo = positions;
  }

  // 标出之前和现在的位置
  drawBeforeAndNow() {
    ctx.drawImage(imgObjects[10], this.pixx, this.pixy);
    ctx.drawImage(imgObjects[10], this.lastPos[0] * OFFSET, this.lastPos[1] * OFFSET);
  }

  move(x, y) {
    this.eat(x, y);
  }

  hitWayCanGo(positions) {
    for (const pos of positions) {
      this.drawDot(pos.x * OFFSET + 8, pos.y * OFFSET + 7);
    }
  }

  drawDot(x, y) {
    ctx.drawImage(imgObjects[9], x, y);
  }

  // 可以去的点
  findWayCanGo(chessObjArr) {
    var positions = [];
    switch (this.chessType) {
      case CHESS_TYPE.CHE:
        for (let i = this.x + 1; i < chessObjArr.length; i++) {
          if (chessObjArr[i][this.y] != EMPTY_POS) {
            if (chessObjArr[i][this.y].camp != this.camp) {
              positions.push({ chess: this, x: i, y: this.y });
            }
            break;
          }
          positions.push({ chess: this, x: i, y: this.y });
        }
        for (let i = this.x - 1; i >= 0; i--) {
          if (chessObjArr[i][this.y] != EMPTY_POS) {
            if (chessObjArr[i][this.y].camp != this.camp) {
              positions.push({ chess: this, x: i, y: this.y });
            }
            break;
          }
          positions.push({ chess: this, x: i, y: this.y });
        }
        for (let i = this.y + 1; i < chessObjArr[this.x].length; i++) {
          if (chessObjArr[this.x][i] != EMPTY_POS) {
            if (chessObjArr[this.x][i].camp != this.camp) {
              positions.push({ chess: this, x: this.x, y: i });
            }
            break;
          }
          positions.push({ chess: this, x: this.x, y: i });
        }
        for (let i = this.y - 1; i >= 0; i--) {
          if (chessObjArr[this.x][i] != EMPTY_POS) {
            if (chessObjArr[this.x][i].camp != this.camp) {
              positions.push({ chess: this, x: this.x, y: i });
            }
            break;
          }
          positions.push({ chess: this, x: this.x, y: i });
        }
        break;
      case CHESS_TYPE.MA:
        if (this.x - 2 >= 0 && this.y + 1 <= 9 && chessObjArr[this.x - 1][this.y] == EMPTY_POS &&
          (chessObjArr[this.x - 2][this.y + 1] == EMPTY_POS || chessObjArr[this.x - 2][this.y + 1].camp != this.camp)) {
          positions.push({ chess: this, x: this.x - 2, y: this.y + 1 });
        }
        if (this.x - 2 >= 0 && this.y - 1 >= 0 && chessObjArr[this.x - 1][this.y] == EMPTY_POS &&
          (chessObjArr[this.x - 2][this.y - 1] == EMPTY_POS || chessObjArr[this.x - 2][this.y - 1].camp != this.camp)) {
          positions.push({ chess: this, x: this.x - 2, y: this.y - 1 });
        }
        if (this.x + 2 <= 8 && this.y + 1 <= 9 && chessObjArr[this.x + 1][this.y] == EMPTY_POS &&
          (chessObjArr[this.x + 2][this.y + 1] == EMPTY_POS || chessObjArr[this.x + 2][this.y + 1].camp != this.camp)) {
          positions.push({ chess: this, x: this.x + 2, y: this.y + 1 });
        }
        if (this.x + 2 <= 8 && this.y - 1 >= 0 && chessObjArr[this.x + 1][this.y] == EMPTY_POS &&
          (chessObjArr[this.x + 2][this.y - 1] == EMPTY_POS || chessObjArr[this.x + 2][this.y - 1].camp != this.camp)) {
          positions.push({ chess: this, x: this.x + 2, y: this.y - 1 });
        }
        if (this.x + 1 <= 8 && this.y + 2 <= 9 && chessObjArr[this.x][this.y + 1] == EMPTY_POS &&
          (chessObjArr[this.x + 1][this.y + 2] == EMPTY_POS || chessObjArr[this.x + 1][this.y + 2].camp != this.camp)) {
          positions.push({ chess: this, x: this.x + 2, y: this.y + 2 });
        }
        if (this.x - 1 >= 0 && this.y + 2 <= 9 && chessObjArr[this.x][this.y + 1] == EMPTY_POS &&
          (chessObjArr[this.x - 1][this.y + 2] == EMPTY_POS || chessObjArr[this.x - 1][this.y + 2].camp != this.camp)) {
          positions.push({ chess: this, x: this.x - 1, y: this.y + 2 });
        }
        if (this.x + 1 <= 8 && this.y - 2 >= 0 && chessObjArr[this.x][this.y - 1] == EMPTY_POS &&
          (chessObjArr[this.x + 1][this.y - 2] == EMPTY_POS || chessObjArr[this.x + 1][this.y - 2].camp != this.camp)) {
          positions.push({ chess: this, x: this.x + 1, y: this.y - 2 });
        }
        if (this.x - 1 >= 0 && this.y - 2 >= 0 && chessObjArr[this.x][this.y - 1] == EMPTY_POS &&
          (chessObjArr[this.x - 1][this.y - 2] == EMPTY_POS || chessObjArr[this.x - 1][this.y - 2].camp != this.camp)) {
          positions.push({ chess: this, x: this.x - 1, y: this.y - 2 });
        }
        break;
      case CHESS_TYPE.PAO:
        let finding = false; // 是否在寻找可以吃的子
        for (let i = this.x + 1; i < chessObjArr.length; i++) {
          if (!finding && chessObjArr[i][this.y] == EMPTY_POS) {
            positions.push({ chess: this, x: i, y: this.y });
          } else if (finding && chessObjArr[i][this.y].camp && chessObjArr[i][this.y].camp != this.camp) {
            positions.push({ chess: this, x: i, y: this.y });
            break;
          } else {
            finding = true;
            continue;
          }
        }
        finding = false;
        for (let i = this.x - 1; i >= 0; i--) {
          if (!finding && chessObjArr[i][this.y] == EMPTY_POS) {
            positions.push({ chess: this, x: i, y: this.y });
          } else if (finding && chessObjArr[i][this.y].camp && chessObjArr[i][this.y].camp != this.camp) {
            positions.push({ chess: this, x: i, y: this.y });
            break;
          } else {
            finding = true;
            continue;
          }
        }
        finding = false;
        for (let i = this.y + 1; i < chessObjArr[this.x].length; i++) {
          if (!finding && chessObjArr[this.x][i] == EMPTY_POS) {
            positions.push({ chess: this, x: this.x, y: i });
          } else if (finding && chessObjArr[this.x][i].camp && chessObjArr[this.x][i].camp != this.camp) {
            positions.push({ chess: this, x: this.x, y: i });
            break;
          } else {
            finding = true;
            continue;
          }
        }
        finding = false;
        for (let i = this.y - 1; i >= 0; i--) {
          if (!finding && chessObjArr[this.x][i] == EMPTY_POS) {
            positions.push({ chess: this, x: this.x, y: i });
          } else if (finding && chessObjArr[this.x][i].camp && chessObjArr[this.x][i].camp != this.camp) {
            positions.push({ chess: this, x: this.x, y: i });
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
        if (this.x + 2 <= xmaxX && this.y + 2 <= xmaxY && chessObjArr[this.x + 1][this.y + 1] == EMPTY_POS && (chessObjArr[this.x + 2][this.y + 2] == EMPTY_POS || chessObjArr[this.x + 2][this.y + 2].camp != this.camp)) {
          positions.push({ chess: this, x: this.x + 2, y: this.y + 2 });
        }
        if (this.x + 2 <= xmaxX && this.y - 2 >= xminY && chessObjArr[this.x + 1][this.y - 1] == EMPTY_POS && (chessObjArr[this.x + 2][this.y - 2] == EMPTY_POS || chessObjArr[this.x + 2][this.y - 2].camp != this.camp)) {
          positions.push({ chess: this, x: this.x + 2, y: this.y - 2 });
        }
        if (this.x - 2 >= xminX && this.y + 2 <= xmaxY && chessObjArr[this.x - 1][this.y + 1] == EMPTY_POS && (chessObjArr[this.x - 2][this.y + 2] == EMPTY_POS || chessObjArr[this.x - 2][this.y + 2].camp != this.camp)) {
          positions.push({ chess: this, x: this.x - 2, y: this.y + 2 });
        }
        if (this.x - 2 >= xminX && this.y - 2 >= xminY && chessObjArr[this.x - 1][this.y - 1] == EMPTY_POS && (chessObjArr[this.x - 2][this.y - 2] == EMPTY_POS || chessObjArr[this.x - 2][this.y - 2].camp != this.camp)) {
          positions.push({ chess: this, x: this.x - 2, y: this.y - 2 });
        }
        break;
      case CHESS_TYPE.SHI:
        let sminX = 3;
        let smaxX = 5;
        let sminY = 0;
        let smaxY = 9;
        if (this.camp == CAMP.RED) {
          sminY = 7;
        } else {
          smaxY = 2;
        }
        if (this.x + 1 <= smaxX && this.y + 1 <= smaxY && (chessObjArr[this.x + 1][this.y + 1] == EMPTY_POS || chessObjArr[this.x + 1][this.y + 1].camp != this.camp)) {
          positions.push({ chess: this, x: this.x + 1, y: this.y + 1 });
        }
        if (this.x + 1 <= smaxX && this.y - 1 >= sminY && (chessObjArr[this.x + 1][this.y - 1] == EMPTY_POS || chessObjArr[this.x + 1][this.y - 1].camp != this.camp)) {
          positions.push({ chess: this, x: this.x + 1, y: this.y - 1 });
        }
        if (this.x - 1 >= sminX && this.y + 1 <= smaxY && (chessObjArr[this.x - 1][this.y + 1] == EMPTY_POS || chessObjArr[this.x - 1][this.y + 1].camp != this.camp)) {
          positions.push({ chess: this, x: this.x - 1, y: this.y + 1 });
        }
        if (this.x - 1 >= sminX && this.y - 1 >= sminY && (chessObjArr[this.x - 1][this.y - 1] == EMPTY_POS || chessObjArr[this.x - 1][this.y - 1].camp != this.camp)) {
          positions.push({ chess: this, x: this.x - 1, y: this.y - 1 });
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

        if (this.x + 1 <= jmaxX && (chessObjArr[this.x + 1][this.y] == EMPTY_POS || chessObjArr[this.x + 1][this.y].camp != this.camp)) {
          positions.push({ chess: this, x: this.x + 1, y: this.y });
        }
        if (this.y + 1 <= jmaxY && (chessObjArr[this.x][this.y + 1] == EMPTY_POS || chessObjArr[this.x][this.y + 1].camp != this.camp)) {
          positions.push({ chess: this, x: this.x, y: this.y + 1 });
        }
        if (this.x - 1 >= jminX && (chessObjArr[this.x - 1][this.y] == EMPTY_POS || chessObjArr[this.x - 1][this.y].camp != this.camp)) {
          positions.push({ chess: this, x: this.x - 1, y: this.y });
        }
        if (this.y - 1 >= jminY && (chessObjArr[this.x][this.y - 1] == EMPTY_POS || chessObjArr[this.x][this.y - 1].camp != this.camp)) {
          positions.push({ chess: this, x: this.x, y: this.y - 1 });
        }
        break;
      case CHESS_TYPE.ZU:
        if (this.camp == CAMP.RED) {
          if (this.y - 1 >= 0 && (chessObjArr[this.x][this.y - 1] == EMPTY_POS || chessObjArr[this.x][this.y - 1].camp != this.camp)) {
            positions.push({ chess: this, x: this.x, y: this.y - 1 });
          }
          if (this.y <= 4 && this.x - 1 >= 0 && (chessObjArr[this.x - 1][this.y] == EMPTY_POS || chessObjArr[this.x - 1][this.y].camp != this.camp)) {
            positions.push({ chess: this, x: this.x - 1, y: this.y });
          }
          if (this.y <= 4 && this.x + 1 <= 8 && (chessObjArr[this.x + 1][this.y] == EMPTY_POS || chessObjArr[this.x + 1][this.y].camp != this.camp)) {
            positions.push({ chess: this, x: this.x + 1, y: this.y });
          }
        } else {
          if (this.y + 1 <= 9 && (chessObjArr[this.x][this.y + 1] == EMPTY_POS || chessObjArr[this.x][this.y + 1].camp != this.camp)) {
            positions.push({ chess: this, x: this.x, y: this.y + 1 });
          }
          if (this.y >= 5 && this.x - 1 >= 0 && (chessObjArr[this.x - 1][this.y] == EMPTY_POS || chessObjArr[this.x - 1][this.y].camp != this.camp)) {
            positions.push({ chess: this, x: this.x - 1, y: this.y });
          }
          if (this.y >= 5 && this.x + 1 <= 8 && (chessObjArr[this.x + 1][this.y] == EMPTY_POS || chessObjArr[this.x + 1][this.y].camp != this.camp)) {
            positions.push({ chess: this, x: this.x + 1, y: this.y });
          }
        }
        break;
    }
    return positions;
  }

  // 寻找该棋子能威胁到对方棋子的区域 除了炮以外的棋子 其实就是该棋子能够到达的区域
  findThreatenPos(chessObjArr) {
    const positions = [];
    let finding = 0; // 是否在寻找可以吃的子 1、找到了炮架2、结束寻找
    let paojia = null;
    for (let i = this.x + 1; i < chessObjArr.length; i++) {
      if (!finding && chessObjArr[i][this.y] != EMPTY_POS) {
        finding = 1;
        paojia = chessObjArr[i][this.y];
        continue;
      } else if (finding > 0) {
        if (finding == 1 && chessObjArr[i][this.y] != EMPTY_POS) {
          positions.push({ chess: this, paojia, x: i, y: this.y });
          finding = 2;
        } else if (finding == 2 && chessObjArr[i][this.y] != EMPTY_POS) {
          break;
        } else {
          positions.push({ chess: this, paojia, x: i, y: this.y });
        }
      }
    }
    finding = 0;
    paojia = null;
    for (let i = this.x - 1; i >= 0; i--) {
      if (!finding && chessObjArr[i][this.y] != EMPTY_POS) {
        finding = 1;
        paojia = chessObjArr[i][this.y];
        continue;
      } else if (finding > 0) {
        if (finding == 1 && chessObjArr[i][this.y] != EMPTY_POS) {
          positions.push({ chess: this, paojia, x: i, y: this.y });
          finding = 2;
        } else if (finding == 2 && chessObjArr[i][this.y] != EMPTY_POS) {
          break;
        } else {
          positions.push({ chess: this, paojia, x: i, y: this.y });
        }
      }
    }
    finding = 0;
    paojia = null;
    for (let i = this.y + 1; i < chessObjArr[this.x].length; i++) {
      if (!finding && chessObjArr[this.x][i] != EMPTY_POS) {
        finding = 1;
        paojia = chessObjArr[this.x][i];
        continue;
      } else if (finding > 0) {
        if (finding == 1 && chessObjArr[this.x][i] != EMPTY_POS) {
          positions.push({ chess: this, paojia, x: this.x, y: i });
          finding = 2;
        } else if (finding == 2 && chessObjArr[this.x][i] != EMPTY_POS) {
          break;
        } else {
          positions.push({ chess: this, paojia, x: i, y: this.y });
        }
      }
    }
    finding = 0;
    paojia = null;
    for (let i = this.y - 1; i >= 0; i--) {
      if (!finding && chessObjArr[this.x][i] != EMPTY_POS) {
        finding = 1;
        paojia = chessObjArr[this.x][i];
        continue;
      } else if (finding > 0) {
        if (finding == 1 && chessObjArr[this.x][i] != EMPTY_POS) {
          positions.push({ chess: this, paojia, x: this.x, y: i });
          finding = 2;
        } else if (finding == 2 && chessObjArr[this.x][i] != EMPTY_POS) {
          break;
        } else {
          positions.push({ chess: this, paojia, x: i, y: this.y });
        }
      }
    }
    return positions;
  }

  eat(x, y) {
    const selectChess = game.selectChess;
    const { x: lx, y: ly } = selectChess;
    this.lastPos = [lx, ly];
    chessArr[lx][ly] = EMPTY_POS;
    chessObjArr[lx][ly] = EMPTY_POS;
    selectChess.x = x;
    selectChess.y = y;
    selectChess.pixx = x * OFFSET;
    selectChess.pixy = y * OFFSET;
    chessArr[x][y] = selectChess.chessKey;
    chessObjArr[x][y] = selectChess;
    game.status = GAME_STATUS.NORMAL;
    game.whoseTurn = game.whoseTurn == CAMP.RED ? CAMP.BLACK : CAMP.RED;
    const isJiang = game.checkJiang(game.whoseTurn, chessObjArr);
    if (isJiang) {
      const juesha = game.checkJueSha(game.whoseTurn, chessObjArr);
      if (juesha) {
        popMsg('绝杀！');
      } else {
        popMsg('将军！');
      }
    }
  }
}