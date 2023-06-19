import styles from "./index.module.less";
import { GridAttribute } from "./grid";
import Main from "./main";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const MainPage: React.FC = () => {
  const [start, setStart] = useState("开始游戏");
  const mainRef = useRef<Main>();
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  // const [max, setMax] = useState(0);
  const [num, setNum] = useState<GridAttribute[][]>([[]]);
  const [endMsg, setEndMsg] = useState("");

  const touchStart = (e: MouseEventHandler<HTMLDivElement> | any) => {
    touchStartX = e.clientX;
    touchStartY = e.clientY;
  };
  const touchMove = (e: MouseEventHandler<HTMLDivElement> | any) => {
    touchEndX = e.clientX;
    touchEndY = e.clientY;
  };
  const touchEnd = () => {
    const disX = touchStartX - touchEndX;
    const absdisX = Math.abs(disX);
    const disY = touchStartY - touchEndY;
    const absdisY = Math.abs(disY);

    if (mainRef.current?.isOver()) {
      gameOver();
    } else if (Math.max(absdisX, absdisY) > 10) {
      // 0：向上、1：向右、2：向下、3：向左
      let direction;
      if (absdisX > absdisY) {
        direction = disX < 0 ? 1 : 3;
      } else {
        direction = disY < 0 ? 2 : 0;
      }
      const { result, increase } = mainRef.current!.move(direction);
      if (result) updateView(result, increase);
    }
  };

  const onKeyDown = (e: any) => {
    if (mainRef.current?.isOver()) {
      gameOver();
    } else {
      const arrowCode = {
        ArrowUp: 0,
        ArrowRight: 1,
        ArrowDown: 2,
        ArrowLeft: 3,
      };
      const direction = arrowCode[e.code as keyof typeof arrowCode];
      if (direction !== undefined) {
        const { result, increase } = mainRef.current!.move(direction);
        if (result) updateView(result, increase);
      }
    }
  };

  const updateView = (data: GridAttribute[][], increase: number) => {
    // let max = 0;
    // for (let i = 0; i < 4; i++) {
    //   for (let j = 0; j < 4; j++) {
    //     if (data[i][j].value !== "" && data[i][j].value > max) {
    //       max = data[i][j].value as number;
    //       setMax(max);
    //     }
    //   }
    // }
    setNum(data);
    setScore((s) => s + increase);
  };

  const gameStart = () => {
    // 游戏开始
    const main = new Main(4);
    mainRef.current = main;
    setStart("重新开始");
    setOver(false);
    setNum(main.board.grid);
  };

  const gameOver = () => {
    setOver(true);

    setEndMsg("游戏结束!");
  };

  useEffect(() => {
    gameStart();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  return (
    <div className={styles.container}>
      <div
        className={classNames({ [styles.left]: true, [styles.hidden]: true })}
      >
        <h2>游戏规则</h2>
        <div>
          每次可以选择上下左右其中一个方向去滑动，每滑动一次，所有的数字方块都会往滑动的方向靠拢外，系统也会在空白的地方乱数出现一个数字方块，相同数字的方块在靠拢、相撞时会相加。不断的叠加最终拼凑出2048这个数字就算成功。
        </div>
        <h2>操作方式</h2>
        <h3>方式一</h3>
        <p>使用鼠标点击滑动</p>
        <h3>方式二</h3>
        <p>使用键盘方向键控制滑动</p>
        <div className={styles.arrow}>
          <div className={styles.row}>
            <div className={styles.piece}>
              <ArrowUpOutlined />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.piece}>
              <ArrowLeftOutlined />
            </div>
            <div className={styles.piece}>
              <ArrowDownOutlined />
            </div>
            <div className={styles.piece}>
              <ArrowRightOutlined />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.game}>
        <div
          className={styles.chessboard}
          onMouseDown={touchStart}
          onMouseUp={touchEnd}
          onMouseMove={touchMove}
        >
          {num.map((row: GridAttribute[], i: number) => (
            <div className={styles.row} key={`row${i}`}>
              {row.map((col: GridAttribute, j: number) => (
                <div
                  className={styles.col}
                  style={{
                    top: `${(i + 1) * 2 + 15 * i}vh`,
                    left: `${(j + 1) * 2 + 15 * j}vh`,
                  }}
                  key={`col${j}`}
                >
                  <div
                    className={classNames({
                      [styles.cell]: true,
                      [styles[`cellTypeOf${col.value}`]]: true,
                      [styles.newCell]: col.status === "new",
                      [styles.combineCell]: col.status === "combine",
                    })}
                    style={{ fontSize: col.value >= 128 ? "5vh" : "6vh" }}
                  >
                    {col.value}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        {over && (
          <div className={styles.boardMask}>
            {/* <Text className={styles.nowScore}>历史最高分：{bestScore}</Text> */}
            <div className={styles.nowScore}>本次成绩：{score}</div>
            <div className={styles.msg}>{endMsg}</div>
          </div>
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.score}>
          <div className={styles.scoreTitle}>score</div>
          <div className={styles.scoreNum}>{score}</div>
        </div>

        <div className={styles.play} onClick={() => gameStart()}>
          {start}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
