class Game {
  constructor() {
    this.whoseTurn = 0; // 谁走棋
    this.status = 0; // 走棋状态
    this.wayCanGo = []; // 当前棋子能走的地方
  }

  start() {
    this.whoseTurn = CAMP.RED;
    this.status = GAME_STATUS.NORMAL;
  }

  canGo(chess) {
    for (let i = 0; i < this.wayCanGo.length; i++) {
      const pos = this.wayCanGo[i];
      
    }
  }
}