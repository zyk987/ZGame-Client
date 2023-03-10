import bgSvg from "assets/bg.svg";
import styles from "./index.module.less";

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <img className={styles.wave} src={bgSvg} />
    </div>
  );
};

export default Home;
