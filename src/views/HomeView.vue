<template>
  <div class="wrap">
    <div class="hero">
      <h1><span class="zh">中文单词闪卡</span></h1>
      <p>Learn Chinese vocabulary lesson by lesson · 按课学中文单词</p>
    </div>

    <section v-for="series in courseRegistry" :key="series.id" class="series-section">
      <div class="series-header">
        <span class="series-badge" :style="{ background: `linear-gradient(135deg, ${series.gradA}, ${series.gradB})` }"></span>
        <div>
          <h2 class="series-name">{{ series.name }}</h2>
          <p class="series-name-en">{{ series.nameEn }}</p>
        </div>
      </div>
      <div class="grid-units">
        <CourseUnitCard
          v-for="unit in series.units"
          :key="unit.id"
          :series="series"
          :unit="unit"
          :percent="percentFor(series.id, unit)"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import CourseUnitCard from "@/components/CourseUnitCard.vue";
import { courseRegistry, allWords } from "@/data";
import { useProgress } from "@/composables/useProgress";

const { percentKnown } = useProgress();

function percentFor(seriesId, unit) {
  if (!unit.available) return 0;
  return percentKnown(allWords(seriesId, unit.id));
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

.series-section {
  margin-bottom: 36px;
}
.series-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.series-badge {
  width: 6px;
  height: 42px;
  border-radius: var(--r-pill);
  flex-shrink: 0;
}
.series-name {
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
}
.series-name-en {
  font-size: 13px;
  color: var(--muted);
  font-weight: 600;
  margin-top: 2px;
}
.grid-units {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
</style>
