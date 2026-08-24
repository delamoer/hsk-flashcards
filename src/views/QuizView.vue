<template>
  <div class="wrap quizwrap" v-if="lesson">
    <div class="crumb">
      <router-link to="/">首页</router-link><span class="sep">/</span>
      <router-link :to="`/hsk/${level}`">HSK {{ level }}</router-link><span class="sep">/</span>
      <router-link :to="`/hsk/${level}/lesson/${lesson.num}`">第 {{ lesson.num }} 课</router-link>
      <span class="sep">/</span><span class="cur">自测 Quiz</span>
    </div>

    <!-- result -->
    <div v-if="done" class="result">
      <div class="score">{{ correctCount }}<span>/ {{ questions.length }}</span></div>
      <p class="rlabel">{{ scoreLabel }}</p>
      <p class="muted" v-if="missed.length">
        {{ missed.length }} 个词已标记为「需复习」· marked for review
      </p>
      <div class="ractions">
        <button class="btn primary" @click="restart">再来一次 Try again</button>
        <router-link :to="`/hsk/${level}/lesson/${lesson.num}`" class="btn secondary">
          ← 返回本课 Back
        </router-link>
      </div>
    </div>

    <!-- running -->
    <div v-else-if="q" class="quiz">
      <div class="pbar top"><i :style="{ width: progressPct + '%' }"></i></div>
      <div class="qcard">
        <div class="qtype">{{ q.type === "audio" ? "听音选字 · Listen & choose" : "英文选汉字 · Choose the character" }}</div>

        <template v-if="q.type === 'audio'">
          <button class="playbig" @click="say(q.answer.hanzi)">🔊</button>
          <div class="qsub">点 🔊 再听 · Tap to replay</div>
        </template>
        <template v-else>
          <div class="qprompt">“{{ q.answer.meaning }}”</div>
          <div class="qsub">选出对应的汉字 · Pick the matching character</div>
        </template>

        <div class="opts">
          <button
            v-for="opt in q.options"
            :key="opt.id"
            class="opt han"
            :class="optClass(opt)"
            :disabled="answered"
            @click="pick(opt)"
          >
            {{ opt.hanzi }}
          </button>
        </div>

        <div class="qfoot">
          <span class="prog">{{ index + 1 }} / {{ questions.length }}</span>
          <button v-if="answered" class="btn primary" @click="next">
            {{ index + 1 < questions.length ? "下一题 Next" : "看结果 Result" }} →
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty">
      <p class="muted">本课词汇不足以生成测验 · Not enough words to quiz.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { getLesson, allWords } from "@/data";
import { useProgress } from "@/composables/useProgress";
import { useSettings } from "@/composables/useSettings";
import { speak } from "@/utils/tts";

const props = defineProps({
  level: { type: [Number, String], required: true },
  lesson: { type: [Number, String], required: true },
});

const { setStatus } = useProgress();
const { settings } = useSettings();

const lesson = computed(() => getLesson(props.level, props.lesson));

function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildQuestions() {
  const words = lesson.value ? lesson.value.words : [];
  if (words.length < 4) return [];
  const pool = words.length >= 4 ? words : allWords(props.level);
  return shuffle(words).map((answer, i) => {
    const distractors = shuffle(pool.filter((w) => w.id !== answer.id)).slice(0, 3);
    return {
      answer,
      type: i % 2 === 0 ? "en" : "audio",
      options: shuffle([answer, ...distractors]),
    };
  });
}

const questions = ref(buildQuestions());
const index = ref(0);
const answered = ref(false);
const picked = ref(null);
const correctCount = ref(0);
const missed = ref([]);
const done = ref(false);

const q = computed(() => questions.value[index.value]);
const progressPct = computed(() =>
  questions.value.length ? Math.round((index.value / questions.value.length) * 100) : 0
);

function say(text) {
  speak(text, { rate: settings.ttsRate });
}

function pick(opt) {
  if (answered.value) return;
  answered.value = true;
  picked.value = opt;
  if (opt.id === q.value.answer.id) {
    correctCount.value++;
  } else {
    missed.value.push(q.value.answer);
    setStatus(q.value.answer.id, "review"); // wrong → mark for review
  }
}

function optClass(opt) {
  if (!answered.value) return "";
  if (opt.id === q.value.answer.id) return "correct";
  if (picked.value && opt.id === picked.value.id) return "wrong";
  return "dim";
}

function next() {
  if (index.value + 1 < questions.value.length) {
    index.value++;
    answered.value = false;
    picked.value = null;
    // auto-play audio questions
    if (q.value.type === "audio") setTimeout(() => say(q.value.answer.hanzi), 150);
  } else {
    done.value = true;
  }
}

const scoreLabel = computed(() => {
  const p = questions.value.length ? correctCount.value / questions.value.length : 0;
  if (p === 1) return "满分！太棒了 Perfect!";
  if (p >= 0.8) return "很好 Great job!";
  if (p >= 0.5) return "继续加油 Keep going!";
  return "多练几遍 Keep practicing!";
});

function restart() {
  questions.value = buildQuestions();
  index.value = 0;
  answered.value = false;
  picked.value = null;
  correctCount.value = 0;
  missed.value = [];
  done.value = false;
}
</script>

<style scoped>
.quizwrap {
  max-width: 560px;
}
.pbar.top {
  margin-bottom: 20px;
}
.qcard {
  background: var(--card);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-card);
  padding: 28px;
  text-align: center;
}
.qtype {
  font-size: 12px;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.qprompt {
  font-size: 24px;
  font-weight: 800;
  margin: 14px 0 4px;
}
.qsub {
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 22px;
}
.playbig {
  font-size: 40px;
  margin: 16px 0 6px;
  width: 84px;
  height: 84px;
  border-radius: var(--r-pill);
  background: var(--accent-soft);
  color: var(--accent-active);
}
.opts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.opt {
  background: var(--card);
  border: 1.5px solid var(--hairline);
  border-radius: var(--r-lg);
  padding: 18px;
  font-size: 30px;
  font-weight: 700;
  box-shadow: var(--sh-card);
  transition: transform 0.12s, border-color 0.12s, background 0.12s;
}
.opt:not(:disabled):hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}
.opt.correct {
  background: var(--success-soft);
  border-color: var(--success);
}
.opt.wrong {
  background: var(--primary-soft);
  border-color: var(--primary);
}
.opt.dim {
  opacity: 0.5;
}
.qfoot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 22px;
}
.prog {
  font-weight: 800;
  color: var(--muted);
  font-size: 14px;
}

.result {
  text-align: center;
  padding: 40px 0;
}
.score {
  font-size: 64px;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
}
.score span {
  font-size: 24px;
  color: var(--muted);
  margin-left: 6px;
}
.rlabel {
  font-size: 20px;
  font-weight: 800;
  margin: 12px 0 6px;
}
.ractions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  flex-wrap: wrap;
}
.empty {
  text-align: center;
  padding: 40px 0;
}
</style>
