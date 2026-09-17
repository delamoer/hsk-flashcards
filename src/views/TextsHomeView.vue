<template>
  <div class="wrap">
    <div class="hero">
      <h1><span class="zh">课文</span> <span class="en">Texts</span></h1>
      <p>逐篇课文 · 双重挖空练习 — Read each lesson's texts, then fill the blanks</p>
    </div>

    <section v-for="series in textsRegistry" :key="series.id" class="series-section">
      <div class="series-header">
        <span
          class="series-badge"
          :style="{ background: `linear-gradient(135deg, ${series.gradA}, ${series.gradB})` }"
        ></span>
        <div>
          <h2 class="series-name">{{ series.name }}</h2>
          <p class="series-name-en">{{ series.nameEn }}</p>
        </div>
      </div>
      <div class="grid-units">
        <router-link
          v-for="unit in series.units"
          :key="unit.id"
          class="unit-card"
          :style="seriesTheme(series.id)"
          :to="`/texts/${series.id}/${unit.id}`"
        >
          <div class="uc-top">
            <span class="uc-label">{{ unit.label }}</span>
            <span class="uc-arrow">→</span>
          </div>
          <div class="uc-meta">
            <span>{{ unit.lessonCount }} 课 lessons</span>
            <span class="dot">·</span>
            <span>{{ unit.textCount }} 篇 texts</span>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { textsRegistry } from "@/data/texts";
import { seriesTheme } from "@/data/courses.js";
</script>

<style scoped>
.wrap {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
.hero {
  text-align: center;
  padding: 18px 0 24px;
}
.hero h1 {
  font-family: "Noto Serif SC", serif;
  font-size: 34px;
  font-weight: 900;
  letter-spacing: 0.5px;
}
.hero .zh {
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero .en {
  color: var(--muted-soft);
  font-weight: 800;
}
.hero p {
  margin-top: 8px;
  color: var(--muted);
  font-weight: 600;
  font-size: 14px;
}
.series-section {
  margin-bottom: 30px;
}
.series-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.series-badge {
  width: 14px;
  height: 36px;
  border-radius: 6px;
  flex-shrink: 0;
}
.series-name {
  font-family: "Noto Serif SC", serif;
  font-size: 21px;
  font-weight: 700;
}
.series-name-en {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted-soft);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.grid-units {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}
.unit-card {
  display: block;
  background: var(--card);
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
  padding: 18px;
  box-shadow: var(--sh-card);
  transition: transform 0.15s, box-shadow 0.15s;
}
.unit-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--sh-hover);
}
.uc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.uc-label {
  font-size: 19px;
  font-weight: 800;
  color: var(--ink);
}
.uc-arrow {
  color: var(--primary);
  font-weight: 800;
}
.uc-meta {
  margin-top: 10px;
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--muted);
}
.uc-meta .dot {
  opacity: 0.5;
}
</style>
