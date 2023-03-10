import bgSvg from "assets/bg.svg";
import styles from "./index.module.less";

const GameWindow: React.FC = () => {
  return (
    <div className={styles.gameWindow}>
      <img className={styles.wave} src={bgSvg} />
      <div id={"container"} className={styles.container}></div>
    </div>
  );
};

export default GameWindow;
