<template>
  <div class="fc" :class="{ flip: flipped, focus }" @click="flipped = !flipped">
    <div class="fc-inner">
      <!-- FRONT: character only -->
      <div class="fc-face fc-front">
        <div class="toprow">
          <span class="lvl">{{ tag || `HSK ${level}` }}</span>
          <button class="iconbtn" @click.stop="say(word.hanzi)" title="朗读 Play">🔊</button>
        </div>
        <div class="char">{{ word.hanzi }}</div>
        <div class="peek" :class="{ show: peeking }" v-html="pinyinHtml"></div>
        <button class="hint" @click.stop="peeking = !peeking">👁 拼音 Peek</button>
      </div>

      <!-- BACK: full detail -->
      <div class="fc-face fc-back" @click.stop="flipped = false">
        <span v-if="pos" class="pos-tag"><b>{{ pos.zh }}</b><i>{{ pos.en }}</i></span>
        <div class="brow">
          <span class="bh">{{ word.hanzi }}</span>
          <button class="iconbtn small" @click.stop="say(word.hanzi)" title="朗读 Play">🔊</button>
        </div>
        <div class="py" v-html="pinyinHtml"></div>
        <div class="mean">{{ word.meaning }}</div>
        <div v-if="word.note" class="note">{{ word.note }}</div>
        <div class="examples">
          <div v-for="(ex, i) in shownExamples" :key="i" class="ex">
            <div class="z">
              <button class="mini" @click.stop="say(ex.zh)" title="朗读 Play">🔊</button>
              <span>{{ ex.zh }}</span>
            </div>
            <div v-if="ex.en" class="e">{{ ex.en }}</div>
          </div>
        </div>
        <div v-if="word.collocations && word.collocations.length" class="collocs">
          <span class="cl-lab">搭配<i>Collocations</i></span>
          <span class="cl-list">{{ word.collocations.join("　·　") }}</span>
        </div>
        <div class="marks" @click.stop>
          <button
            class="mk known"
            :class="{ on: status === 'known' }"
            @click="setStatus(word.id, 'known')"
          >
            ✓<span class="lab">已掌握<i>Got it</i></span>
          </button>
          <button
            class="mk review"
            :class="{ on: status === 'review' }"
            @click="setStatus(word.id, 'review')"
          >
            ↻<span class="lab">需复习<i>Review</i></span>
          </button>
          <button
            class="mk star"
            :class="{ on: starred }"
            @click="toggleStar(word.id)"
            title="收藏 Save"
          >
            ★
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { colorPinyin } from "@/utils/pinyinTones";
import { posLabel } from "@/data/pos";
import { speak } from "@/utils/tts";
import { useProgress } from "@/composables/useProgress";
import { useSettings } from "@/composables/useSettings";

const props = defineProps({
  word: { type: Object, required: true },
  level: { type: [Number, String], default: 1 },
  tag: { type: String, default: "" }, // front badge label (e.g. "Book 3"); falls back to "HSK {level}"
  full: { type: Boolean, default: false }, // show all examples (focus mode)
  focus: { type: Boolean, default: false }, // large focus-mode styling
});

const { settings } = useSettings();
const { statusOf, isStarred, setStatus, toggleStar } = useProgress();

const flipped = ref(false);
const peeking = ref(false);

// reset transient UI when the word changes (focus mode reuses the component)
watch(
  () => props.word.id,
  () => {
    flipped.value = false;
    peeking.value = false;
  }
);

const status = computed(() => statusOf(props.word.id));
const starred = computed(() => isStarred(props.word.id));
const shownExamples = computed(() =>
  props.full ? props.word.examples : props.word.examples.slice(0, 1)
);
const pinyinHtml = computed(() =>
  settings.toneColors ? colorPinyin(props.word.pinyin) : props.word.pinyin
);
const pos = computed(() => posLabel(props.word.pos));

function say(text) {
  speak(text, { rate: settings.ttsRate });
}
</script>

<style scoped>
.fc {
  height: 288px;
  perspective: 1000px;
  cursor: pointer;
}
.fc.focus {
  height: 460px;
  width: min(92vw, 380px);
}
.fc-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.fc.flip .fc-inner {
  transform: rotateY(180deg);
}
.fc-face {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--r-xl);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  padding: 16px;
}
/* opacity swap at the flip midpoint — bulletproof even if backface-visibility misbehaves */
.fc-front {
  background:
    linear-gradient(rgba(250,245,235,.92), rgba(240,231,214,.92)),
    url("../assets/img/motif/cloud.webp") right -8px bottom -8px / 132px auto no-repeat,
    linear-gradient(160deg, #fbf7ee, #efe4d0);
  color: var(--ink);
  box-shadow: var(--sh-front);
  border: 1px solid var(--line);
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: 1;
  transition: opacity 0s 0.22s;
}
/* gold inner frame */
.fc-front::after {
  content: "";
  position: absolute;
  inset: 12px;
  border: 1px solid var(--gold-lt);
  border-radius: 12px;
  opacity: 0.6;
  pointer-events: none;
}
.fc.flip .fc-front {
  opacity: 0;
}
.fc-back {
  background: linear-gradient(160deg, #f6ede0, #ede0c8);
  color: var(--ink);
  transform: rotateY(180deg);
  box-shadow: var(--sh-card);
  border: 1px solid var(--line);
  border-top: 3px solid var(--gold);
  opacity: 0;
  transition: opacity 0s 0.22s;
}
.fc.flip .fc-back {
  opacity: 1;
}

/* front */
.toprow {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.lvl {
  font-family: var(--caps);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--gold-deep);
}
.char {
  font-family: var(--serif-cn);
  font-weight: 700;
  font-size: 72px;
  line-height: 1;
  letter-spacing: 4px;
  color: var(--ink);
  text-shadow: 1px 1px 0 var(--gold-lt);
}
.fc.focus .char {
  font-size: 128px;
}
.peek {
  margin-top: 12px;
  font-family: var(--ui);
  font-weight: 700;
  font-size: 20px;
  height: 24px;
  color: var(--gold-deep);
  opacity: 0;
  transition: opacity 0.2s;
}
.fc.focus .peek {
  font-size: 26px;
  height: 32px;
}
.peek.show {
  opacity: 0.96;
}
.hint {
  position: absolute;
  bottom: 14px;
  font-family: var(--caps);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 500;
}
.iconbtn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 14px;
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--gold-deep);
  transition: 0.2s;
}
.iconbtn:hover {
  background: var(--gold);
  color: #fff8ea;
  border-color: var(--gold-deep);
}
.iconbtn.small {
  width: 30px;
  height: 30px;
}

/* back */
.pos-tag {
  position: absolute;
  top: 12px;
  right: 14px;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.1;
  padding: 4px 10px;
  border-radius: var(--r-md);
  background: var(--primary-soft);
  color: var(--primary-strong);
}
.pos-tag b {
  font-size: 12px;
  font-weight: 800;
}
.pos-tag i {
  font-style: normal;
  font-size: 9px;
  font-weight: 700;
  opacity: 0.8;
  letter-spacing: 0.2px;
}
.brow {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 96px;
}
.bh {
  font-family: var(--serif-cn);
  font-weight: 700;
  font-size: 26px;
  letter-spacing: 2px;
  white-space: nowrap;
}
.fc.focus .bh {
  font-size: 30px;
}
.py {
  font-weight: 700;
  font-size: 17px;
  margin-top: 3px;
  margin-bottom: 2px;
}
.mean {
  font-weight: 700;
  font-size: 15px;
  line-height: 1.35;
  margin: 6px 0;
}
.note {
  font-size: 12px;
  color: var(--muted);
  font-style: italic;
  margin-bottom: 4px;
}
.examples {
  flex: 1;
  overflow: hidden;
}
.ex {
  border-top: 1px solid var(--hairline);
  padding-top: 7px;
  margin-top: 6px;
}
.ex .z {
  font-family: var(--serif-cn);
  font-size: 15px;
  font-weight: 500;
  display: flex;
  gap: 6px;
  align-items: flex-start;
}
.fc.focus .ex .z {
  font-size: 16px;
}
.ex .e {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}
.ex .mini {
  color: var(--accent);
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 1px;
}
.collocs {
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed var(--hairline);
  font-family: var(--han);
  min-width: 0;
}
.cl-lab {
  flex: none;
  display: inline-flex;
  flex-direction: column;
  line-height: 1.05;
  font-size: 11px;
  font-weight: 800;
  color: var(--primary-strong);
}
.cl-lab i {
  font-style: normal;
  font-size: 8px;
  font-weight: 700;
  opacity: 0.7;
  letter-spacing: 0.2px;
  text-transform: uppercase;
}
.cl-list {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fc.focus .cl-list {
  white-space: normal;
}

.marks {
  display: flex;
  gap: 6px;
  margin-top: auto;
  padding-top: 10px;
}
.mk {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 800;
  padding: 6px 9px;
  border-radius: var(--r-pill);
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}
.mk .lab {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
  text-align: left;
}
.mk .lab i {
  font-size: 9px;
  font-weight: 700;
  opacity: 0.8;
  font-style: normal;
  letter-spacing: 0.2px;
}
.mk.known {
  background: var(--success-soft);
  color: var(--success);
  flex: 1;
}
.mk.known.on {
  background: var(--success);
  color: #fff;
}
.mk.review {
  background: var(--review-soft);
  color: var(--review);
  flex: 1;
}
.mk.review.on {
  background: var(--review);
  color: #fff;
}
.mk.star {
  background: var(--star-soft);
  color: var(--star);
  font-size: 16px;
  padding: 6px 11px;
}
.mk.star.on {
  background: var(--star);
  color: #fff;
}

@media (max-width: 480px) {
  .char {
    font-size: 56px;
  }
}
</style>
