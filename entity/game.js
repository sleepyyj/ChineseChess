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
      if (pos[0] == x && pos[1] == y) {
        return true;
      }
    }
    return false;
  }

  // 移动某一个棋子后是否正在被将军
  moveToDead(x, y) {
    const cChessArr = _.cloneDeep(chessArr);
    const cChessObjArr = _.cloneDeep(chessObjArr);
    const selectChess = game.selectChess;
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
          return [i, j];
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
      if ((pos[0] == jiangPos[0] && pos[1] == jiangPos[1]) || this.checkJiangMeet(chessObjArr)) {
        return true;
      }
    }
    return false;
  }

  // 判断老将是否碰面
  checkJiangMeet(chessObjArr) {
    const redJiangPos = this.getJiangPos(chessObjArr, CAMP.RED);
    const BlackJiangPos = this.getJiangPos(chessObjArr, CAMP.BLACK);
    if (redJiangPos[0] != BlackJiangPos[0]) {
      return false;
    }
    for (let i = 0; i < chessObjArr[redJiangPos[0]].length; i++) {
      for (let j = BlackJiangPos[1] + 1; j < redJiangPos[1]; j++) {
        const chess = chessObjArr[redJiangPos[0]][j];
        if (chess != EMPTY_POS) {
          return false;
        }
      }
    }
    return true;
  }

  // 是否绝杀
  checkJueSha(camp, chessObjArr) {
    // TODO
  }
}