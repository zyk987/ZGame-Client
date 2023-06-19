<script setup lang="ts">
import Stack from "../three/Stack";
import Base from "../three/Base";
import { ref, onMounted, reactive } from "vue";

const container = ref<HTMLDivElement>();
let stack: Stack;
let score = ref<number>(0);
let state = ref<string>("");
onMounted(() => {
  // const base = new Base("#stack");
  // base.init();
  stack = new Stack("#stack");
  stack.init();
  container.value?.addEventListener("click", () => {
    score.value = stack.level - 1;
    state.value = stack.state;
  });
});
const onRestart = () => {
  stack.restart();
  score.value = stack.level - 1;
  state.value = stack.state;
};
</script>

<template>
  <div class="w-full h-[calc(100vh-64px)] flex">
    <div id="stack" class="w-full h-full absolute top-0 z-1" ref="container" />
    <div
      v-if="state === 'paused' && score > 0"
      class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] border-[#f00] w-[80vh] h-[50vh] bg-gray-300 bg-opacity-60 rounded-lg z-3 backdrop-filter backdrop-blur-[14px] flex flex-col items-center justify-around"
    >
      <div class="text-6xl text-white">游戏结束!</div>
      <div class="text-5xl text-white">最终得分:{{ score }}</div>
      <a href="#" :onclick="onRestart" data-title="重新开始" />
    </div>
    <div
      class="absolute left-1/2 translate-x-[-50%] top-[5vh] drop-shadow-3xl text-black text-6xl select-none"
    >
      {{ score }}
    </div>
  </div>
</template>

<style lang="less" scoped>
a {
  position: relative;
  display: inline-block;
  padding: 1.2em 2em;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  user-select: none;
  color: white;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    border-radius: 4px;
    transition: box-shadow 0.5s ease, transform 0.2s ease;
    will-change: transform;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transform: translateY(var(--ty, 0)) rotateX(var(--rx, 0))
      rotateY(var(--ry, 0)) translateZ(var(--tz, -12px));
  }

  &:hover::before {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  &::after {
    position: relative;
    display: inline-block;
    content: attr(data-title);
    transition: transform 0.2s ease;
    font-weight: bold;
    letter-spacing: 0.01em;
    will-change: transform;
    transform: translateY(var(--ty, 0)) rotateX(var(--rx, 0))
      rotateY(var(--ry, 0));
  }
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  transform-style: preserve-3d;
  transform: perspective(800px);
}
</style>
