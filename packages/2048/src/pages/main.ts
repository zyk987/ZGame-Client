import Board from "./grid";
import type { GridAttribute } from "./grid";

class Main {
  size: number;
  board!: Board;
  changeTimes: number;
  increaseNumber: number;
  constructor(size: number) {
    this.size = size;
    this.init();
    this.changeTimes = 0;
    this.increaseNumber = 0;
  }

  init() {
    this.board = new Board(this.size);
    this.setDataRandom(2);
  }

  /** 随机填充 */
  setDataRandom(size?: number) {
    for (let i = 0; i < (size || 1); i++) {
      this.addRandomData();
    }
  }

  /** 填充数据 */
  addRandomData() {
    if (!this.board.cellEmpty()) {
      const value = Math.random() < 0.9 ? 2 : 4;
      const cell = this.board.selectCell();
      cell.value = value;
      cell.status = "new";
      this.update(cell);
    }
  }

  /** 更新数据 */
  update(cell: GridAttribute) {
    this.board.grid[cell.pos[0]][cell.pos[1]] = cell;
  }

  move(dir: number): { result: GridAttribute[][]; increase: number } {
    // 0:上, 1:右, 2:下, 3:左
    this.increaseNumber = 0;
    const curList = this.formList(dir);
    const list = this.combine(curList, dir);
    const result: GridAttribute[][] = [[], [], [], []];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        switch (dir) {
          case 0:
            result[i][j] = list[j][i];
            break;
          case 1:
            result[i][j] = list[i][this.size - 1 - j];
            break;
          case 2:
            result[i][j] = list[j][this.size - 1 - i];
            break;
          case 3:
            result[i][j] = list[i][j];
            break;
          default:
            break;
        }
      }
    }

    this.board.grid = result;
    if (this.changeTimes > 0) this.setDataRandom();
    this.changeTimes = 0;

    return { result, increase: this.increaseNumber };
  }

  formList(dir: number) {
    // 根据滑动方向生成list的四个数组
    const list: GridAttribute[][] = [[], [], [], []];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        switch (dir) {
          case 0:
            list[i].push(this.board.grid[j][i]);
            break;
          case 1:
            list[i].push(this.board.grid[i][this.size - 1 - j]);
            break;
          case 2:
            list[i].push(this.board.grid[this.size - 1 - j][i]);
            break;
          case 3:
            list[i].push(this.board.grid[i][j]);
            break;
          default:
            break;
        }
      }
    }
    return list;
  }

  combine(list: GridAttribute[][], dir: number) {
    // 滑动时相同的合并
    // 数字靠边
    for (let i = 0; i < list.length; i++) {
      list[i] = this.changeItem(list[i], dir);
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 1; j < this.size; j++) {
        if (
          list[i][j - 1].value === list[i][j].value &&
          list[i][j].value !== ""
        ) {
          list[i][j - 1] = {
            ...list[i][j - 1],
            value:
              (list[i][j - 1].value as number) + (list[i][j].value as number),
            status: "combine",
          };
          this.increaseNumber += Number(list[i][j - 1].value);
          list[i][j].value = "";
          this.changeTimes += 1;
        }
      }
    }
    // 再次数字靠边
    for (let i = 0; i < list.length; i++) {
      list[i] = this.changeItem(list[i], dir);
    }

    return list;
  }

  changeItem(item: GridAttribute[], dir: number) {
    // 将 ['', 2, '', 2] 改为 [2, 2, '', '']
    const res: GridAttribute[] = [];
    let cnt = 0;
    for (let i = 0; i < item.length; i++) {
      if (item[i].value !== "") {
        switch (dir) {
          case 0:
            res[cnt++] = {
              pos: [item[i].pos[0], cnt],
              from: item[i].pos,
              value: item[i].value,
            };
            break;
          case 1:
            res[cnt++] = {
              pos: [this.size - 1 - cnt, item[i].pos[1]],
              from: item[i].pos,
              value: item[i].value,
            };
            break;
          case 2:
            res[cnt++] = {
              pos: [item[i].pos[0], this.size - 1 - cnt],
              from: item[i].pos,
              value: item[i].value,
            };
            break;
          case 3:
            res[cnt++] = {
              pos: [cnt, item[i].pos[1]],
              from: item[i].pos,
              value: item[i].value,
            };
            break;
          default:
            break;
        }
      }
    }
    for (let j = cnt; j < item.length; j++) {
      res[j] = { ...item[j], from: [-1, -1], value: "" };
    }

    res.forEach((ele: GridAttribute, index: number) => {
      if (ele.value !== item[index].value) {
        this.changeTimes += 1;
      }
    });
    return res;
  }

  isOver() {
    console.log(this.board.cellEmpty());
    // 游戏是否结束，结束条件：可用格子为空且所有格子上下左右值不等
    if (!this.board.cellEmpty()) {
      return false;
    } else {
      // 左右不等
      for (let i = 0; i < this.size; i++) {
        for (let j = 1; j < this.size; j++) {
          if (this.board.grid[i][j].value === this.board.grid[i][j - 1].value)
            return false;
        }
      }
      // 上下不等
      for (let j = 0; j < this.size; j++) {
        for (let i = 1; i < this.size; i++) {
          if (this.board.grid[i][j].value === this.board.grid[i - 1][j].value)
            return false;
        }
      }
    }
    return true;
  }
}

export default Main;
