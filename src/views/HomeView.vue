<template>
  <div class="wrap">
    <div class="hero">
      <h1><span class="zh">HSK 单词闪卡</span></h1>
      <p>Learn Chinese vocabulary lesson by lesson · 按课学中文单词</p>
    </div>
    <div class="grid-levels">
      <LevelCard
        v-for="lv in levels"
        :key="lv.level"
        :info="lv"
        :percent="percentFor(lv)"
      />
    </div>
  </div>
</template>

<script setup>
import LevelCard from "@/components/LevelCard.vue";
import { levels, allWords } from "@/data";
import { useProgress } from "@/composables/useProgress";

const { percentKnown } = useProgress();

function percentFor(lv) {
  return lv.available ? percentKnown(allWords(lv.level)) : 0;
}
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 26px 0 30px;
}
.hero h1 {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.3px;
}
.hero .zh {
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero p {
  margin-top: 8px;
  color: var(--muted);
  font-size: 15px;
}
.grid-levels {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
}
</style>
