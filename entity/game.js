class Game {
  constructor() {
    this.whoseTurn = 0; // 谁走棋
    this.status = 0; // 走棋状态
    this.wayCanGo = []; // 当前棋子能走的地方
  }

  // 游戏开始
  start() {
    this.whoseTurn = CAMP.RED;
    this.status = GAME_STATUS.NORMAL;
  }

  // 选择的棋子是否能到x, y的位置
  canGo(x, y) {
    for (let i = 0; i < this.wayCanGo.length; i++) {
      const pos = this.wayCanGo[i];
      if (pos.x == x && pos.y == y) {
        return true;
      }
    }
    return false;
  }

  // selectChess 移动到 x, y 后是否正在被将军
  moveToDead(selectChess, x, y) {
    const cChessArr = _.cloneDeep(chessArr);
    const cChessObjArr = _.cloneDeep(chessObjArr);
    const { x: lx, y: ly } = selectChess;
    this.lastPos = [lx, ly];
    cChessArr[lx][ly] = EMPTY_POS;
    cChessObjArr[lx][ly] = EMPTY_POS;
    cChessArr[x][y] = selectChess.chessKey;
    cChessObjArr[x][y] = selectChess;

    const isJiang = this.checkJiang(selectChess.camp, cChessObjArr);
    if (isJiang) {
      popMsg('您可能正在被将军');
    }
    return isJiang;
  }

  // 获取老将的位置
  getJiangPos(chessObjArr = chessObjArr, camp) {
    for (let i = 0; i < chessObjArr.length; i++) {
      for (let j = 0; j < chessObjArr[i].length; j++) {
        let chess = chessObjArr[i][j];
        if (chess != EMPTY_POS && chess.chessType == CHESS_TYPE.JIANG && chess.camp == camp) {
          return chess;
        }
      }
    }
  }

  // camp有没有被将
  checkJiang(camp, chessObjArr) {
    // 获取所有敌方棋子可以到达的位置
    const positions = [];
    for (let i = 0; i < chessObjArr.length; i++) {
      for (let j = 0; j < chessObjArr[i].length; j++) {
        let chess = chessObjArr[i][j];
        if (chess != EMPTY_POS && chess.camp != camp) {
          positions.push(...chess.findWayCanGo(chessObjArr));
        }
      }
    }
    // 判断老将在不在对方任一棋子能到达的地方
    const jiangPos = this.getJiangPos(chessObjArr, camp);
    for (const pos of positions) {
      if ((pos.x == jiangPos.x && pos.y == jiangPos.y) || this.checkJiangMeet(chessObjArr)) {
        return true;
      }
    }
    return false;
  }

  // 判断老将是否碰面
  checkJiangMeet(chessObjArr) {
    const redJiangPos = this.getJiangPos(chessObjArr, CAMP.RED);
    const blackJiangPos = this.getJiangPos(chessObjArr, CAMP.BLACK);
    if (redJiangPos.x != blackJiangPos.x) {
      return false;
    }
    for (let i = 0; i < chessObjArr[redJiangPos.x].length; i++) {
      for (let j = blackJiangPos.y + 1; j < redJiangPos.y; j++) {
        const chess = chessObjArr[redJiangPos.x][j];
        if (chess != EMPTY_POS) {
          return false;
        }
      }
    }
    return true;
  }

  // 是否绝杀
  checkJueSha(camp, chessObjArr) {
    const myJiang = this.getJiangPos(chessObjArr, camp);
    const jiangCangoPos = myJiang.findWayCanGo(chessObjArr);
    const threatenPos = []; // 敌方棋子威胁的区域
    const myChessCanGoPos = []; // 我方棋子能到的位置
    for (let i = 0; i < chessObjArr.length; i++) {
      for (let j = 0; j < chessObjArr[i].length; j++) {
        let chess = chessObjArr[i][j];
        if (chess != EMPTY_POS && chess.camp != camp) {
          if (chess.chessType == CHESS_TYPE.PAO) {
            threatenPos.push(...chess.findThreatenPos(chessObjArr));
          } else {
            threatenPos.push(...chess.findWayCanGo(chessObjArr));
          }
        }
        if (chess != EMPTY_POS && chess.camp == camp) {
          myChessCanGoPos.push(...chess.findWayCanGo(chessObjArr));
        }
      }
    }
    let safePos = 0;
    for (const jcp of jiangCangoPos) {
      if (!this.moveToDead(myJiang, jcp.x, jcp.y)) {
        safePos++;
        break;
      }
    }

    // 有安全位置
    if (jiangCangoPos.length && safePos) {
      return false;
    }

    // 老将动不了 看看能不能把将的子吃掉或者阻挡
    const threatenChesses = []; // 威胁老将的子
    for (const tp of threatenPos) {
      if (tp.x == myJiang.x && tp.y == myJiang.y) {
        threatenChesses.push(tp.chess);
      }
    }

    // 单将
    if (threatenChesses.length == 1) {
      const tChess = threatenChesses[0];
      // 能不能吃了它
      for (const mccgp of myChessCanGoPos) {
        if (mccgp.x == tChess.x && mccgp.y == tChess.y) {
          return false;
        }
      }

      // 能不能挡住或者卡马腿
      if (tChess.chessType == CHESS_TYPE.CHE) {
        if (tChess.x == myJiang.x) {
          const miny = Math.min(tChess.y, myJiang.y);
          const maxy = Math.max(tChess.y, myJiang.y);
          for (const mccgp of myChessCanGoPos) {
            if (mccgp.x == tChess.x && mccgp.y > miny && mccgp.y < maxy) {
              return false;
            }
          }
        } else if (tChess.y == myJiang.y) {
          const minx = Math.min(tChess.x, myJiang.x);
          const maxx = Math.max(tChess.x, myJiang.x);
          for (const mccgp of myChessCanGoPos) {
            if (mccgp.y == tChess.y && mccgp.x > minx && mccgp.x < maxx) {
              return false;
            }
          }
        }
      } else if (tChess.chessType == CHESS_TYPE.MA) {
        let maLeg;
        if ((tChess.x - myJiang.x == 1 && tChess.y - myJiang.y == 2) || (tChess.x - myJiang.x == 2 && tChess.y - myJiang. y == 1)) {
          maLeg = { x: myJiang.x + 1, y: myJiang.y + 1 };
        } else if ((tChess.x - myJiang.x == -1 && tChess.y - myJiang.y == 2) || (tChess.x - myJiang.x == -2 && tChess.y - myJiang. y == 1)) {
          maLeg = { x: myJiang.x - 1, y: myJiang.y + 1 };
        } else if ((tChess.x - myJiang.x == -1 && tChess.y - myJiang.y == -2) || (tChess.x - myJiang.x == -2 && tChess.y - myJiang. y == -1)) {
          maLeg = { x: myJiang.x - 1, y: myJiang.y - 1 };
        } else if ((tChess.x - myJiang.x == 1 && tChess.y - myJiang.y == -2) || (tChess.x - myJiang.x == 2 && tChess.y - myJiang. y == -1)) {
          maLeg = { x: myJiang.x + 1, y: myJiang.y - 1 };
        }

        for (const mccgp of myChessCanGoPos) {
          if (mccgp.x == maLeg.x && mccgp.y == maLeg.y) {
            return false;
          }
        }
      } else if (tChess.chessType == CHESS_TYPE.PAO) {
        const canBlockPos = [];
        if (tChess.paojia.chessType == CHESS_TYPE.PAO && tChess.paojia.camp == tChess.camp) {
          if (tChess.x == tChess.paojia.x) {
            const miny = Math.min(tChess.y, tChess.paojia.y);
            const maxy = Math.max(tChess.y, tChess.paojia.y);
            for (let i = miny + 1; i < maxy; i++) {
              canBlockPos.push([tChess.x, i]);
            }
          } else if (tChess.y == tChess.paojia.y) {
            const minx = Math.min(tChess.x, tChess.paojia.x);
            const maxx = Math.max(tChess.x, tChess.paojia.x);
            for (let i = minx + 1; i < maxx; i++) {
              canBlockPos.push([tChess.y, i]);
            }
          }
        } else {
          if (tChess.x == myJiang.x) {
            if (tChess.y < myJiang.y) {
              for (let i = tChess.y + 1; i < tChess.paojia.y; i++) {
                canBlockPos.push({ x: tChess.x, y: i });
              }
              for (let i = tChess.paojia.y + 1; i < myJiang.y; i++) {
                canBlockPos.push({ x: tChess.x, y: i });
              }
            } else {
              for (let i = myJiang.y + 1; i < tChess.paojia.y; i++) {
                canBlockPos.push({ x: tChess.x, y: i });
              }
              for (let i = tChess.paojia.y + 1; i < tChess.y; i++) {
                canBlockPos.push({ x: tChess.x, y: i });
              }
            }
          } else if (tChess.y == myJiang.y) {
            if (tChess.x < myJiang.x) {
              for (let i = tChess.x + 1; i < tChess.paojia.x; i++) {
                canBlockPos.push({ x: i, y: tChess.y });
              }
              for (let i = tChess.paojia.x + 1; i < myJiang.x; i++) {
                canBlockPos.push({ x: i, y: tChess.y });
              }
            } else {
              for (let i = myJiang.x + 1; i < tChess.paojia.x; i++) {
                canBlockPos.push({ x: i, y: tChess.y });
              }
              for (let i = tChess.paojia.x + 1; i < tChess.x; i++) {
                canBlockPos.push({ x: i, y: tChess.y });
              }
            }
          }
        }

        for (const cbp of canBlockPos) {
          for (const mccgp of myChessCanGoPos) {
            if (mccgp.x == cbp.x && mccgp.y == cbp.y) {
              return false;
            }
          }
        }
      }
    }

    // 双将
    if (threatenChesses.length == 2) {
      // TODO
    }
  }
}