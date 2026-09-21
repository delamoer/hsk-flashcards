<template>
  <div class="gnp">
    <template v-if="items.length">
      <div class="gn-head">
        <div class="kicker">本课语法点 · Grammar</div>
        <p class="sub">整课共用，分布在本课各篇课文中 · shared across all texts in this lesson</p>
      </div>
      <div class="notes">
        <div class="mnote" v-for="(nt, i) in items" :key="i">
          <div class="lab">{{ String(i + 1).padStart(2, "0") }}</div>
          <div class="gp">{{ nt }}</div>
        </div>
      </div>
    </template>
    <div v-else-if="loading" class="placeholder"><div class="diamond">◇ ◇ ◇</div><p>加载中… · Loading…</p></div>
    <div v-else class="placeholder">
      <div class="diamond">◇ ◇ ◇</div>
      <h3>本课暂无语法点</h3>
      <div class="en">No grammar notes for this lesson</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { getTextUnit } from "@/data/texts";

const props = defineProps({
  series: { type: String, required: true },
  unit: { type: [Number, String], required: true },
  lesson: { type: [Number, String], required: true },
});

const note = ref("");
const loading = ref(true);
watch(
  () => [props.series, props.unit, props.lesson],
  async ([s, u, l]) => {
    loading.value = true;
    note.value = "";
    const ds = await getTextUnit(s, u);
    const ld = ds?.lessons.find((x) => x.num === Number(l));
    // grammar list is identical across a lesson's texts — take the first non-empty
    note.value = ld?.texts.map((t) => t.note).find(Boolean) || "";
    loading.value = false;
  },
  { immediate: true }
);

const items = computed(() =>
  (note.value || "")
    .split(/[；;、\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
);
</script>

<style scoped>
.gnp { padding: 30px 0 20px; }
.gn-head { margin-bottom: 22px; }
.kicker { font-family: var(--caps); font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold-deep); }
.sub { font-size: 12px; font-weight: 600; color: var(--muted-soft); margin-top: 6px; }
.notes { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }
.mnote { position: relative; display: flex; gap: 14px; align-items: flex-start; background: linear-gradient(160deg, #fbf6ec, #f3ead9); border: 1px solid var(--line); border-radius: 10px; padding: 16px 18px; box-shadow: 0 3px 10px -6px var(--shadow, rgba(45,30,10,.14)); }
.mnote::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; border-radius: 10px 0 0 10px; background: linear-gradient(180deg, var(--gold-lt), var(--gold-deep)); }
.mnote .lab { font-family: var(--caps); font-size: 12px; font-weight: 700; color: var(--gold-deep); flex: 0 0 auto; margin-top: 2px; }
.mnote .gp { font-family: var(--serif-cn); font-weight: 600; font-size: 17px; color: var(--cinnabar-dk); line-height: 1.4; }

.placeholder { text-align: center; padding: 70px 20px; color: var(--muted); }
.placeholder .diamond { color: var(--gold); letter-spacing: 6px; margin-bottom: 14px; }
.placeholder h3 { font-family: var(--serif-cn); font-size: 28px; color: var(--ink-soft, #4a3d2a); letter-spacing: 2px; }
.placeholder .en { font-family: var(--serif-en); font-style: italic; font-size: 16px; margin-top: 4px; }
</style>
