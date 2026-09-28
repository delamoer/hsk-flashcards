<template>
  <div class="dsp">
    <template v-if="texts.length">
      <div class="ds-head">
        <div class="kicker">话题讨论 · Discussion</div>
        <button class="pill" :class="{ on: showPy }" @click="showPy = !showPy">
          拼音 <span class="e">Pinyin</span>
        </button>
      </div>
      <p class="lead">
        从课文话题聊到你自己的生活。没有标准答案，说出你想说的就好。
        <span class="e">Move from the lesson's topic to your own life — there is no right answer.</span>
      </p>

      <div class="dlist">
        <div class="dcard" v-for="(t, i) in texts" :key="i">
          <div class="dc-head">
            <span class="idx">{{ String(i + 1).padStart(2, "0") }}</span>
            <span class="nm">{{ t.title }}</span>
            <span class="chip" v-if="t.kind">{{ t.kind }}</span>
          </div>
          <div class="topic" v-if="t.topic">{{ t.topic }}</div>

          <ol class="qs">
            <li class="q" v-for="(q, qi) in t.questions" :key="qi">
              <div class="qrow">
                <span class="zh">{{ q.zh }}</span>
                <button class="play" @click="say(q.zh)" title="朗读 Play">🔊</button>
              </div>
              <div class="py" v-if="showPy && q.py" v-html="pyHtml(q.py)"></div>
            </li>
          </ol>

          <div class="hints" v-if="t.hints && t.hints.length">
            <span class="lab">可以聊到 Keywords</span>
            <span class="h" v-for="(h, hi) in t.hints" :key="hi">{{ h }}</span>
          </div>
        </div>
      </div>
    </template>

    <div v-else-if="!loading" class="placeholder">
      <div class="diamond">◇ ◇ ◇</div>
      <h3>本课暂无讨论话题</h3>
      <div class="en">No discussion topics for this lesson</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { getDiscussionLesson } from "@/data/discussion";
import { colorPinyin } from "@/utils/pinyinTones";
import { useSettings } from "@/composables/useSettings";
import { speak } from "@/utils/tts";

const props = defineProps({
  series: { type: String, required: true },
  unit: { type: [Number, String], required: true },
  lesson: { type: [Number, String], required: true },
});

const { settings } = useSettings();
const texts = ref([]);
const loading = ref(true);
const showPy = ref(false);

watch(
  () => [props.series, props.unit, props.lesson],
  async ([s, u, l]) => {
    loading.value = true;
    texts.value = [];
    const dl = await getDiscussionLesson(s, u, l);
    texts.value = dl?.texts || [];
    loading.value = false;
  },
  { immediate: true }
);

function pyHtml(py) {
  return settings.toneColors ? colorPinyin(py) : py;
}

function say(t) {
  speak(t, { rate: settings.ttsRate });
}
</script>

<style scoped>
.dsp { padding: 30px 0 20px; }
.ds-head { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 10px; }
.kicker { font-family: var(--caps); font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold-deep); }
.pill {
  border: 1px solid var(--line); background: var(--paper-3); color: var(--muted);
  border-radius: 999px; padding: 5px 13px; font-size: 12px; cursor: pointer; transition: .15s;
}
.pill .e { font-family: var(--serif-en); font-style: italic; font-size: 10.5px; opacity: .75; margin-left: 3px; }
.pill.on { background: var(--seal-a); border-color: var(--seal-a); color: #fff; }
.lead { font-size: 13.5px; line-height: 1.6; color: var(--muted); margin-bottom: 22px; }
.lead .e { display: block; font-family: var(--serif-en); font-style: italic; font-size: 12.5px; color: var(--muted-soft); margin-top: 2px; }

.dlist { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 18px; align-items: start; }
.dcard {
  position: relative; overflow: hidden; border: 1px solid var(--line);
  background:
    linear-gradient(rgba(250, 245, 235, .87), rgba(244, 236, 219, .87)),
    url("../assets/img/motif/pavilion.webp") right -12px bottom -8px / auto 140px no-repeat,
    linear-gradient(160deg, #fbf6ec, #f3ead9);
  border-radius: 12px; padding: 20px 22px 18px;
  box-shadow: 0 3px 12px -7px var(--shadow, rgba(45, 30, 10, .14));
}
.dc-head { display: flex; align-items: baseline; gap: 10px; }
.dc-head .idx { font-family: var(--caps); font-size: 11px; letter-spacing: 1.5px; color: var(--gold-deep); }
.dc-head .nm { font-family: var(--serif-cn); font-size: 17px; font-weight: 600; color: var(--ink); }
.dc-head .chip {
  font-size: 10px; color: var(--muted); border: 1px solid var(--line);
  border-radius: 999px; padding: 1px 8px; background: var(--paper-3);
}
.topic { font-size: 13px; color: var(--muted); margin-top: 6px; line-height: 1.5; }

.qs { list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 12px; counter-reset: q; }
.q { counter-increment: q; border-left: 2px solid var(--gold-lt); padding-left: 12px; }
.q .qrow { display: flex; align-items: flex-start; gap: 8px; }
.q .zh { font-family: var(--serif-cn); font-size: 15.5px; color: var(--ink); line-height: 1.55; }
.q .zh::before { content: counter(q) ". "; color: var(--gold-deep); font-family: var(--caps); font-size: 12px; }
.q .py { font-family: var(--ui); font-size: 13px; color: var(--muted); line-height: 1.45; margin-top: 2px; }
.play {
  flex: 0 0 auto; border: none; background: none; cursor: pointer; font-size: 13px;
  line-height: 1.6; opacity: .45; transition: opacity .15s; padding: 0;
}
.play:hover { opacity: 1; }

.hints { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--line-soft); display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.hints .lab { font-family: var(--caps); font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gold-deep); margin-right: 2px; }
.hints .h { font-size: 12px; color: var(--muted); background: var(--paper-3); border: 1px solid var(--line-soft); border-radius: 999px; padding: 2px 9px; }

.placeholder { text-align: center; padding: 76px 20px; color: var(--muted); }
.placeholder .diamond { color: var(--gold-lt); letter-spacing: 6px; margin-bottom: 14px; }
.placeholder h3 { font-family: var(--serif-cn); font-size: 19px; font-weight: 500; color: var(--ink-soft, #4a3d2a); margin: 0 0 4px; }
.placeholder .en { font-family: var(--serif-en); font-style: italic; font-size: 13.5px; color: var(--muted-soft); }

@media (max-width: 720px) {
  .dlist { grid-template-columns: 1fr; }
}
</style>
