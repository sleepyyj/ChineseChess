const CAMP = {
  RED: 1, // 红方
  BLACK: 2 // 黑方
}

const CHESS_TYPE = {
  CHE: 1,
  MA: 2,
  PAO: 3,
  XIANG: 4,
  SHI: 5,
  JIANG: 6,
  ZU: 7
}

const OFFSET = 58; // 棋盘格子的大小58px
const CHESS_RADIUS = 28; // 棋子半径
const EMPTY_POS = 99; // 空位

const GAME_STATUS = {
  NORMAL: 1, // 思考状态
  SELECT: 2, // 选中了一个棋子
}