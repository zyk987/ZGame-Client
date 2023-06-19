import { Vector3, Color, OrthographicCamera, Mesh } from "three";
import Base from "./Base";
import ky from "kyouka";
import gsap from "gsap";

const calcAspect = (el: HTMLElement) => el.clientWidth / el.clientHeight;

class Stack extends Base {
  cameraParams: Record<string, any>; // 相机参数
  cameraPosition: Vector3; // 相机位置
  lookAtPosition: Vector3; // 视点
  colorOffset: number; // 颜色偏移量
  boxParams: Record<string, any>; // 方块属性参数
  level: number; // 关卡
  moveLimit: number; // 移动上限
  moveAxis: "x" | "z"; // 移动所沿的轴
  moveEdge: "width" | "depth"; // 移动的边
  currentY: number; // 当前的y轴高度
  state: string; // 状态：paused - 静止；running - 运动
  speed: number; // 移动速度
  speedInc: number; // 速度增量
  speedLimit: number; // 速度上限
  gamestart: boolean; // 游戏开始
  gameover: boolean; // 游戏结束
  boxs: any[];
  constructor(sel: string, debug: boolean = false) {
    super(sel, debug);
    this.cameraParams = {};
    this.updateCameraParams();
    this.cameraPosition = new Vector3(2, 2, 2);
    this.lookAtPosition = new Vector3(0, 0, 0);
    this.colorOffset = ky.randomIntegerInRange(0, 255);
    this.boxParams = {};
    this.level = 0;
    this.moveLimit = 1.2;
    this.moveAxis = "x";
    this.moveEdge = "width";
    this.currentY = 0;
    this.state = "paused";
    this.speed = 0.02;
    this.speedInc = 0.0005;
    this.speedLimit = 0.05;
    this.gamestart = false;
    this.gameover = false;
    this.boxs = [];
  }
  // 更新相机参数
  updateCameraParams() {
    const { container } = this;
    const aspect = calcAspect(container!);
    const zoom = 2;
    this.cameraParams = {
      left: -zoom * aspect,
      right: zoom * aspect,
      top: zoom,
      bottom: -zoom,
      near: -100,
      far: 1000,
    };
  }
  // 创建正交相机
  createCamera() {
    const { cameraParams, cameraPosition, lookAtPosition } = this;
    const { left, right, top, bottom, near, far } = cameraParams;
    const camera = new OrthographicCamera(left, right, top, bottom, near, far);
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    camera.lookAt(lookAtPosition.x, lookAtPosition.y, lookAtPosition.z);
    this.camera = camera;
  }
  // 初始化
  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createBaseBox();
    this.createLight();
    this.addListeners();
    this.setLoop();
  }

  createBaseBox() {
    this.cameraPosition = new Vector3(2, 2, 2);
    this.lookAtPosition = new Vector3(0, 0, 0);
    this.level = 0;
    this.boxParams = {
      width: 1,
      height: 0.2,
      depth: 1,
      x: 0,
      y: 0,
      z: 0,
      color: new Color("#d9dfc8"),
    };
    this.updateColor();
    this.currentY = 0;
    this.updateCameraHeight();
    const baseParams = { ...this.boxParams };
    const baseHeight = 2.5;
    baseParams.height = baseHeight;
    baseParams.y -= (baseHeight - this.boxParams.height) / 2;
    const base = this.createBox(baseParams);
    this.box = base;
    this.boxs.push(base);
  }

  updateColor() {
    const { level, colorOffset } = this;
    const colorValue = (level + colorOffset) * 0.25;
    const r = (Math.sin(colorValue) * 55 + 200) / 255;
    const g = (Math.sin(colorValue + 2) * 55 + 200) / 255;
    const b = (Math.sin(colorValue + 4) * 55 + 200) / 255;
    this.boxParams.color = new Color(r, g, b);
  }

  // 开始游戏
  start() {
    this.gamestart = true;
    this.startNextLevel();
  }

  restart() {
    const { camera } = this;
    let that = this;
    this.gamestart = true;
    this.clearBox();
    this.createBaseBox();
    this.startNextLevel();
    gsap.to(camera, {
      zoom: 1,
      duration: 1,
      ease: "Power1.easeOut",
      onUpdate() {
        camera.updateProjectionMatrix();
      },
      onComplete() {
        that.gameover = false;
      },
    });
  }
  // 开始下一关
  startNextLevel() {
    this.level += 1;
    // 确定移动轴和移动边：奇数x；偶数z
    this.moveAxis = this.level % 2 ? "x" : "z";
    this.moveEdge = this.level % 2 ? "width" : "depth";
    // 增加方块生成的高度
    this.currentY += this.boxParams.height;
    // 增加方块的速度
    if (this.speed <= this.speedLimit) {
      this.speed += this.speedInc;
    }
    this.updateColor();
    const boxParams = { ...this.boxParams };
    boxParams.y = this.currentY;
    const box = this.createBox(boxParams);
    this.box = box;
    // 确定初始移动位置
    this.box.position[this.moveAxis] = this.moveLimit * -1;
    this.state = "running";
    if (this.level > 1) {
      this.updateCameraHeight();
    }
  }
  // 更新相机高度
  updateCameraHeight() {
    this.cameraPosition.y += this.boxParams.height;
    this.lookAtPosition.y += this.boxParams.height;
    gsap.to(this.camera.position, {
      y: this.cameraPosition.y,
      duration: 0.4,
    });
    gsap.to(this.camera.lookAt, {
      y: this.lookAtPosition.y,
      duration: 0.4,
    });
  }
  // 动画
  update() {
    if (this.state === "running") {
      const { moveAxis } = this;
      this.box.position[moveAxis] += this.speed;
      // 移到末端就反转方向
      if (Math.abs(this.box.position[moveAxis]) > this.moveLimit) {
        this.speed = this.speed * -1;
      }
    }
  }
  addListeners() {
    this.addResizeListeners();
    if (this.debug) {
      this.onKeyDown();
    } else {
      this.onClick();
    }
  }
  // 监听点击
  onClick() {
    this.renderer.domElement.addEventListener("click", () => {
      if (this.level === 0) {
        this.start();
      } else {
        this.detectOverlap();
      }
    });
  }

  onKeyDown() {
    document.addEventListener("keydown", (e) => {
      const code = e.code;
      if (code === "KeyP") {
        this.state = this.state === "running" ? "paused" : "running";
      } else if (code === "Space") {
        if (this.level === 0) {
          this.start();
        } else {
          this.detectOverlap();
        }
      } else if (code === "ArrowUp") {
        this.box.position[this.moveAxis] += this.speed / 2;
      } else if (code === "ArrowDown") {
        this.box.position[this.moveAxis] -= this.speed / 2;
      }
    });
  }

  detectOverlap() {
    const that = this;
    const { boxParams, moveEdge, box, moveAxis, currentY, camera } = this;
    const currentPosition = box.position[moveAxis];
    const prevPosition = boxParams[moveAxis];
    const direction = Math.sign(currentPosition - prevPosition);
    const edge = boxParams![moveEdge];
    // 重叠距离 = 上一个方块的边长 + 方向 * (上一个方块位置 - 当前方块位置)
    const overlap = edge + direction * (prevPosition - currentPosition);
    if (overlap <= 0) {
      this.state = "paused";
      this.dropBox(box);
      gsap.to(camera, {
        zoom: 0.6,
        duration: 1,
        ease: "Power1.easeOut",
        onUpdate() {
          camera.updateProjectionMatrix();
        },
        onComplete() {
          const score = that.level - 1;
          const prevHighScore = Number(localStorage.getItem("high-score")) || 0;
          if (score > prevHighScore) {
            localStorage.setItem("high-score", `${score}`);
          }
          that.gameover = true;
        },
      });
    } else {
      // 创建重叠部分的方块
      const overlapBoxParams = { ...boxParams };
      const overlapBoxPosition = (currentPosition + prevPosition) / 2;
      overlapBoxParams.y = currentY;
      overlapBoxParams[moveEdge] = overlap;
      overlapBoxParams[moveAxis] = overlapBoxPosition;
      const overlapBox = this.createBox(overlapBoxParams);
      this.boxs.push(overlapBox);
      // 创建切掉部分的方块
      const slicedBoxParams = { ...boxParams };
      const slicedBoxEdge = edge - overlap;
      const slicedBoxPosition =
        direction *
        ((edge - overlap) / 2 + edge / 2 + direction * prevPosition);
      slicedBoxParams.y = currentY;
      slicedBoxParams[moveEdge] = slicedBoxEdge;
      slicedBoxParams[moveAxis] = slicedBoxPosition;
      const slicedBox = this.createBox(slicedBoxParams);
      this.dropBox(slicedBox);
      this.boxParams = overlapBoxParams;
      this.scene.remove(box);
      this.startNextLevel();
    }
  }
  // 使方块旋转下落
  dropBox(box: Mesh) {
    const { moveAxis } = this;
    const that = this;
    gsap.to(box.position, {
      y: "-=3.2",
      ease: "power1.easeIn",
      duration: 1.5,
      onComplete() {
        that.scene.remove(box);
      },
    });
    gsap.to(box.rotation, {
      delay: 0.1,
      x: moveAxis === "z" ? ky.randomNumberInRange(4, 5) : 0.1,
      y: 0.1,
      z: moveAxis === "x" ? ky.randomNumberInRange(4, 5) : 0.1,
      duration: 1.5,
    });
  }

  clearBox() {
    const { scene, boxs } = this;
    for (let i = 0; i < boxs.length; i++) {
      if (boxs[i].type === "Mesh") scene.remove(boxs[i]);
    }
    boxs.length = 0;
  }
}

export default Stack;
