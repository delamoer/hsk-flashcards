<template>
  <div class="printpage" v-if="lesson">
    <!-- screen-only controls -->
    <div class="controls">
      <router-link :to="`/course/${series}/${unit}/lesson/${lesson.num}`" class="btn secondary">← 返回 Back</router-link>
      <div class="toggle">
        <button :class="{ on: layout === 'list' }" @click="layout = 'list'">词表 List</button>
        <button :class="{ on: layout === 'cards' }" @click="layout = 'cards'">卡片 Cards</button>
      </div>
      <button class="btn primary" @click="print">🖨 打印 Print</button>
    </div>

    <div class="sheet">
      <h1 class="title">
        <span class="han">{{ unitLabel }} · 第 {{ lesson.num }} 课 {{ lesson.title }}</span>
        <span class="sub">{{ lesson.titleEn }} — {{ lesson.words.length }} words</span>
      </h1>

      <!-- LIST -->
      <table v-if="layout === 'list'" class="list">
        <thead>
          <tr><th>汉字</th><th>拼音 Pinyin</th><th>英文 Meaning</th><th>例句 Example</th></tr>
        </thead>
        <tbody>
          <tr v-for="w in lesson.words" :key="w.id">
            <td class="han h">{{ w.hanzi }}</td>
            <td class="py" v-html="py(w.pinyin)"></td>
            <td>{{ w.meaning }}</td>
            <td class="ex">
              <span class="han">{{ w.examples[0] && w.examples[0].zh }}</span>
              <span class="en">{{ w.examples[0] && w.examples[0].en }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- CUT-OUT CARDS -->
      <div v-else class="cutgrid">
        <div v-for="w in lesson.words" :key="w.id" class="cut">
          <div class="cut-han han">{{ w.hanzi }}</div>
          <div class="cut-py" v-html="py(w.pinyin)"></div>
          <div class="cut-mean">{{ w.meaning }}</div>
          <div class="cut-ex han" v-if="w.examples[0]">{{ w.examples[0].zh }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { getLesson } from "@/data";
import { getSeries } from "@/data/courses.js";
import { colorPinyin } from "@/utils/pinyinTones";
import { useSettings } from "@/composables/useSettings";

const props = defineProps({
  series: { type: String, required: true },
  unit: { type: [Number, String], required: true },
  lesson: { type: [Number, String], required: true },
});

const { settings } = useSettings();
const lesson = computed(() => getLesson(props.series, props.unit, props.lesson));
const layout = ref("list");

const seriesMeta = computed(() => getSeries(props.series));
const unitLabel = computed(() => {
  const u = seriesMeta.value?.units.find((u) => u.id === Number(props.unit));
  return u?.label || `Unit ${props.unit}`;
});

function py(p) {
  return settings.toneColors ? colorPinyin(p) : p;
}
function print() {
  window.print();
}
</script>

<style scoped>
.printpage {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.toggle {
  display: flex;
  background: var(--soft);
  border-radius: var(--r-pill);
  padding: 4px;
  margin-left: auto;
}
.toggle button {
  font-weight: 700;
  font-size: 13px;
  padding: 7px 14px;
  border-radius: var(--r-pill);
  color: var(--body);
}
.toggle button.on {
  background: #fff;
  color: var(--primary);
  box-shadow: var(--sh-card);
}
.title {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 16px;
}
.title .sub {
  display: block;
  font-size: 13px;
  color: var(--muted);
  font-weight: 600;
  margin-top: 2px;
}

.list {
  width: 100%;
  border-collapse: collapse;
}
.list th {
  text-align: left;
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  padding: 8px 10px;
  border-bottom: 2px solid var(--hairline);
}
.list td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--hairline);
  vertical-align: top;
  font-size: 14px;
}
.list td.h {
  font-size: 20px;
  font-weight: 700;
}
.list .py {
  font-weight: 700;
}
.list .ex .han {
  display: block;
}
.list .ex .en {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.cutgrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.cut {
  border: 1.5px dashed var(--border-strong);
  border-radius: 10px;
  padding: 14px;
  text-align: center;
  break-inside: avoid;
}
.cut-han {
  font-size: 40px;
  font-weight: 700;
}
.cut-py {
  font-weight: 700;
  margin-top: 4px;
}
.cut-mean {
  font-size: 13px;
  color: var(--body);
  margin-top: 6px;
}
.cut-ex {
  font-size: 12px;
  color: var(--muted);
  margin-top: 6px;
}

@media print {
  .controls {
    display: none;
  }
  .printpage {
    padding: 0;
  }
  .cutgrid {
    grid-template-columns: repeat(3, 1fr);
  }
  .cut {
    border-color: #999;
  }
  :deep(.t1),
  :deep(.t2),
  :deep(.t3),
  :deep(.t4),
  :deep(.t0) {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
