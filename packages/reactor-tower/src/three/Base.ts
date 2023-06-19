import {
  AmbientLight,
  AxesHelper,
  Color,
  DirectionalLight,
  Mesh,
  MeshToonMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
  BoxGeometry,
} from "three";

export interface Cube {
  width?: number;
  height?: number;
  depth?: number;
  x?: number;
  y?: number;
  z?: number;
  color?: string | Color;
}

const calcAspect = (el: HTMLElement) => el.clientWidth / el.clientHeight;

class Base {
  debug: boolean;
  container: HTMLElement | null;
  scene!: Scene;
  camera!: PerspectiveCamera | OrthographicCamera;
  renderer!: WebGLRenderer;
  box!: Mesh;
  light!: PointLight | DirectionalLight;
  constructor(sel: string, debug = false) {
    this.debug = debug;
    this.container = document.querySelector(sel);
  }
  // 初始化
  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    const box = this.createBox({});
    this.box = box;
    this.createLight();
    this.addResizeListeners();
    this.setLoop();
  }
  // 创建场景
  createScene() {
    const scene = new Scene();
    if (this.debug) {
      scene.add(new AxesHelper());
    }
    this.scene = scene;
  }
  // 创建透视相机
  createCamera() {
    const aspect = calcAspect(this.container!);
    const camera = new PerspectiveCamera(75, aspect, 0.1, 100);
    camera.position.set(-5, 3, 10);
    this.camera = camera;
  }
  // 创建渲染
  createRenderer() {
    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(this.container!.clientWidth, this.container!.clientHeight);
    this.container?.appendChild(renderer.domElement);
    this.renderer = renderer;
    this.renderer.setClearColor(0x000000, 0);
  }
  // 创建方块
  createBox(cube: Cube) {
    const {
      width = 1,
      height = 1,
      depth = 1,
      color = new Color("#d9dfc8"),
      x = 0,
      y = 0,
      z = 0,
    } = cube;
    const geo = new BoxGeometry(width, height, depth);
    const material = new MeshToonMaterial({ color });
    const box = new Mesh(geo, material);
    box.position.x = x;
    box.position.y = y;
    box.position.z = z;
    this.scene.add(box);
    return box;
  }
  // 创建光源
  createLight() {
    const light = new DirectionalLight(new Color("#ffffff"), 0.5);
    light.position.set(0, 50, 0);
    this.scene.add(light);
    const ambientLight = new AmbientLight(new Color("#ffffff"), 0.4);
    this.scene.add(ambientLight);
    this.light = light;
  }
  // 监听事件
  addResizeListeners() {
    this.onResize();
  }
  // 监听画面缩放
  onResize() {
    window.addEventListener("resize", (e) => {
      console.log(1);
      const aspect = calcAspect(this.container!);
      const camera = this.camera as PerspectiveCamera;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      this.renderer.setSize(
        this.container!.clientWidth,
        this.container!.clientHeight
      );
    });
  }
  // 动画
  update() {
    console.log("animation");
  }
  // 渲染
  setLoop() {
    this.renderer.setAnimationLoop(() => {
      this.update();
      this.renderer.render(this.scene, this.camera);
    });
  }
}

export default Base;
