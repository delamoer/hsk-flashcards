<template>
  <div class="wrap">
    <header class="intro">
      <h1>中国风<small>Chinese-style pop</small></h1>
      <p>
        <b>中国风</b> zhōngguó fēng is a pop style that blends modern music with traditional instruments and the
        imagery of classical poetry — ink, moonlight, old inns, West Lake. Listen, then learn the words hidden in each song.
      </p>
    </header>

    <div class="desk">
      <!-- 曲目册: sticky on desktop, a horizontal strip on mobile -->
      <nav ref="listRef" class="list" aria-label="曲目 Songs">
        <h3>曲目 · {{ songs.length }} songs</h3>
        <template v-for="g in groups" :key="g.zh">
          <h4 class="grp">{{ g.zh }} <i>{{ g.en }}</i></h4>
          <button
            v-for="(s, j) in g.songs" :key="s.id"
            class="trk" :class="{ on: g.from + j === cur }" @click="pick(g.from + j)"
          >
            <span class="n">{{ cn(g.from + j + 1) }}</span>
            <span class="tt"><span class="t">{{ s.zh }}</span><span class="p">{{ s.py }}</span></span>
            <span class="a">{{ s.artist }}</span>
          </button>
        </template>
      </nav>

      <!-- 卷轴播放台 -->
      <article class="scroll">
        <div class="top">
          <div class="label">
            <h2>{{ song.zh }}</h2>
            <span class="who">{{ song.artist }}</span>
            <span class="seal">第{{ cn(cur + 1) }}<br />首</span>
          </div>
          <div class="heart">
            <div class="mount"><div class="yt">
              <!-- 画心: the MV's cover + a cinnabar play seal until the student presses play,
                   so the black YouTube chrome doesn't sit in the scroll at rest -->
              <button v-if="!playing" class="poster" @click="playing = true" :aria-label="`播放 Play ${song.zh}`">
                <img :src="`https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`" alt="" />
                <span class="play"><span class="tri"></span><i>播放 Play</i></span>
              </button>
              <!-- IFrame Player API mounts its iframe here (one player, reused across songs) -->
              <div v-else-if="!apiFailed" ref="playerEl" class="ytp"></div>
              <!-- API script blocked → plain embed: plays fine, just no play modes -->
              <iframe
                v-else
                :key="song.id"
                :src="embedUrl"
                :title="`${song.zh} ${song.en} — ${song.artistEn}`"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div></div>
            <div class="cap">
              <span class="py">{{ song.py }}</span>
              <span class="en">{{ song.en }}</span>
              <span v-if="song.live" class="live">现场版 Live</span>
              <span class="ae">{{ song.artistEn }}</span>
            </div>
            <div class="ctrl">
              <button class="skip" @click="pick((cur - 1 + songs.length) % songs.length)" title="上一首 Previous song">
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4h2v12H4zm3 6 9-6v12z" /></svg>上一首<i>Prev</i>
              </button>
              <button class="skip" @click="pick(mode === 'shuffle' ? shuffleNext() : (cur + 1) % songs.length)" title="下一首 Next song">
                下一首<i>Next</i><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M14 4h2v12h-2zm-1 6L4 16V4z" /></svg>
              </button>
              <button v-if="!apiFailed" class="mode" @click="nextMode" :title="`${MODES[mode].tip} · 点击切换 Tap to change`">
                <svg viewBox="0 0 20 20" aria-hidden="true"><path :d="MODES[mode].icon" /></svg>
                {{ MODES[mode].zh }}<i>{{ MODES[mode].en }}</i>
              </button>
            </div>
          </div>
        </div>

        <div class="colophon">
          <div>
            <h4>题跋 · The story</h4>
            <p>{{ song.note }}</p>
            <p class="zh">{{ song.noteZh }}</p>
          </div>
          <div>
            <h4>歌里的词 · Words in the song</h4>
            <div class="ws">
              <button
                v-for="w in song.words" :key="w.zh"
                class="word" :class="{ on: nowPlaying === w.zh }" @click="speak(w.zh)"
                :title="nowPlaying === w.zh ? '停止 Stop' : '点击朗读 Tap to listen'"
              >
                <b>{{ w.zh }}</b><span>{{ w.py }}</span><em>{{ w.en }}</em>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <p class="credit">
      视频由 YouTube 官方及唱片公司频道提供，版权归原作者所有 · Videos are embedded from the artists' and labels' official YouTube channels.
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import data from "@/data/music.json";
import { speak, stop as stopAudio, nowPlaying } from "@/utils/tts";

// Songs are grouped (周杰伦 / 更多歌手) but numbered straight through; `from` is each
// group's offset into the flat list, which is what ?song= indexes.
let offset = 0;
const groups = data.groups.map((g) => ({ ...g, from: (offset += g.songs.length) - g.songs.length }));
const songs = groups.flatMap((g) => g.songs);

const DIGITS = "〇一二三四五六七八九";
// 1 → 一, 10 → 十, 12 → 十二, 27 → 二十七 (song numbers stay under 100)
function cn(n) {
  const t = Math.floor(n / 10), u = n % 10;
  return (t > 1 ? DIGITS[t] : "") + (t ? "十" : "") + (u ? DIGITS[u] : "");
}
const route = useRoute();
const router = useRouter();

// ?song=N (1-based) keeps the chosen song in the URL so a teacher can share it.
const fromQuery = () => {
  const n = parseInt(route.query.song, 10);
  return n >= 1 && n <= songs.length ? n - 1 : 0;
};
const cur = ref(fromQuery());
// The player loads only once the student presses play (poster first) — picking a
// song from the list counts as pressing play. Never autoplays on first page load.
const playing = ref(false);
const song = computed(() => songs[cur.value]);

watch(() => route.query.song, () => { cur.value = fromQuery(); });

// The 曲目册 scrolls inside itself (vertically on desktop, as a horizontal strip on
// mobile) — the current song should be in view: on a shared ?song= link and when a play
// mode moves on by itself. Only the list's own scroll offsets are set, so the page never jumps.
const listRef = ref(null);
function revealCurrent() {
  const list = listRef.value;
  const chip = list?.querySelector(".trk.on");
  if (!chip) return;
  const lr = list.getBoundingClientRect(), cr = chip.getBoundingClientRect();
  if (list.scrollWidth > list.clientWidth) list.scrollLeft += cr.left - lr.left - (list.clientWidth - cr.width) / 2;
  if (list.scrollHeight > list.clientHeight) list.scrollTop += cr.top - lr.top - (list.clientHeight - cr.height) / 2;
}
onMounted(revealCurrent);

function go(i) {
  router.replace({ query: { ...route.query, song: i + 1 } });
  cur.value = i;
}

function pick(i) {
  if (i === cur.value) return;
  stopAudio();
  playing.value = true;
  go(i);
}

// ── Play modes (what happens when a song ends) ─────────────────────────────
// Default 播完停止: in class the teacher talks after each song, so nothing should
// start on its own unless a student opts in. The choice is remembered.
const MODES = {
  stop: { zh: "播完停止", en: "Stop after", tip: "播完这首就停 Stops when the song ends", icon: "M5 5h10v10H5z" },
  order: { zh: "顺序播放", en: "In order", tip: "自动播下一首 Plays the next song", icon: "M3 6h9v2H3zm0 6h9v2H3zm11-6 5 4-5 4z" },
  one: { zh: "单曲循环", en: "Repeat one", tip: "这首一直重复 Repeats this song", icon: "M4 9a5 5 0 0 1 9-3h-2l3 3 3-3h-2A7 7 0 0 0 2 9zm12 2a5 5 0 0 1-9 3h2l-3-3-3 3h2a7 7 0 0 0 13-3zM9 7h2v6H9z" },
  shuffle: { zh: "随机播放", en: "Shuffle", tip: "随机播一首没听过的 Plays a random unheard song", icon: "M2 5h4l7 10h3v-2l3 3-3 3v-2h-4L5 7H2zm11 0h3V3l3 3-3 3V7h-2l-2 3-1.2-1.7zM2 13h3l1.8-2.5L8 12.2 6 15H2z" },
};
const MODE_KEY = "hsk-music-mode-v1";
const mode = ref(MODES[localStorage.getItem(MODE_KEY)] ? localStorage.getItem(MODE_KEY) : "stop");
function nextMode() {
  const keys = Object.keys(MODES);
  mode.value = keys[(keys.indexOf(mode.value) + 1) % keys.length];
  localStorage.setItem(MODE_KEY, mode.value);
}

// Shuffle draws from songs not yet heard this visit; once all are heard it starts over.
const heard = new Set();
watch(cur, (i) => heard.add(i), { immediate: true });
function shuffleNext() {
  let pool = songs.map((_, i) => i).filter((i) => !heard.has(i));
  if (!pool.length) { heard.clear(); heard.add(cur.value); pool = songs.map((_, i) => i).filter((i) => i !== cur.value); }
  return pool[Math.floor(Math.random() * pool.length)];
}

function onEnded() {
  if (mode.value === "one") { player.seekTo(0); player.playVideo(); return; }
  if (mode.value === "stop") return;
  go(mode.value === "order" ? (cur.value + 1) % songs.length : shuffleNext());
  nextTick(revealCurrent);
}

// ── YouTube IFrame Player API ──────────────────────────────────────────────
// One player for the whole visit: created on the first play, then each song change
// just loads the next video (so autoplay keeps working). The official API is what lets
// us hear "ended" — the player itself stays fully visible, as YouTube's policy requires.
const playerEl = ref(null);
const apiFailed = ref(false);
let player = null;

let apiReady = null;
function loadApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  apiReady ??= new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(window.YT); };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.onerror = reject;
    document.head.appendChild(s);
    setTimeout(() => reject(new Error("iframe_api timeout")), 8000);
  });
  return apiReady;
}

watch(playing, async (on) => {
  if (!on || player) return;
  try {
    const YT = await loadApi();
    await nextTick();
    // The API swaps its target for an iframe — give it a child node of our own so
    // Vue's element stays put.
    const target = document.createElement("div");
    playerEl.value.appendChild(target);
    player = new YT.Player(target, {
      host: "https://www.youtube-nocookie.com",
      videoId: song.value.id,
      playerVars: { autoplay: 1, rel: 0, playsinline: 1 },
      events: {
        // a song picked while the player was still starting up
        onReady: (e) => { if (e.target.getVideoData?.().video_id !== song.value.id) e.target.loadVideoById(song.value.id); },
        onStateChange: (e) => { if (e.data === YT.PlayerState.ENDED) onEnded(); },
      },
    });  } catch {
    apiReady = null;
    apiFailed.value = true;
  }
});

watch(cur, () => {
  if (player?.loadVideoById) player.loadVideoById(song.value.id);
});

onBeforeUnmount(() => { player?.destroy?.(); player = null; });

// Privacy-enhanced embed; it only mounts after a tap, so autoplay is always wanted.
const embedUrl = computed(() =>
  `https://www.youtube-nocookie.com/embed/${song.value.id}?rel=0&playsinline=1&autoplay=1`
);
</script>

<style scoped>
.intro { display: flex; align-items: flex-end; gap: 28px; margin: 6px 0 22px; }
.intro h1 { flex: none; font-family: var(--brush); font-weight: 400; font-size: 56px; line-height: 1; letter-spacing: 6px; color: var(--sumi); }
.intro h1 small { display: block; font-family: var(--caps); font-size: 12px; letter-spacing: 4px; text-transform: uppercase; color: var(--gold-deep); margin-top: 10px; }
.intro p { max-width: 580px; font-size: 14.5px; line-height: 1.6; color: var(--body); }
.intro p b { font-family: var(--han); color: var(--primary-strong); }

.desk { display: grid; grid-template-columns: 300px 1fr; gap: 24px; align-items: start; }

/* 曲目册 */
.list { position: sticky; top: calc(var(--appbar-h, 70px) + 16px); max-height: calc(100vh - var(--appbar-h, 70px) - 32px); overflow-y: auto; overscroll-behavior: contain;
  background: var(--card); border: 1px solid var(--hairline); border-radius: var(--r-md); padding: 10px; box-shadow: var(--sh-card); scrollbar-width: thin; scrollbar-color: var(--border-strong) transparent; }
.grp { display: flex; align-items: baseline; gap: 8px; margin: 12px 12px 4px; font-family: var(--serif-cn); font-size: 13px; font-weight: 600; color: var(--gold-deep); }
.grp i { font-style: normal; font-family: var(--caps); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
.grp::after { content: ""; flex: 1; height: 1px; background: var(--hairline-soft); align-self: center; }
.list h3 { font-family: var(--ui); font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); padding: 8px 12px 10px; border-bottom: 1px solid var(--hairline-soft); margin-bottom: 6px; }
.trk { display: grid; grid-template-columns: 40px 1fr auto; justify-items: start; align-items: center; gap: 10px; width: 100%; padding: 9px 12px; border-radius: 9px; text-align: left; transition: background 0.15s; }
.trk:hover { background: var(--soft); }
.trk .n { min-width: 26px; height: 26px; padding: 0 3px; border: 1.5px solid var(--hairline); border-radius: 5px; display: grid; place-items: center; font-family: var(--serif-cn); font-size: 12px; font-weight: 600; letter-spacing: -1px; white-space: nowrap; color: var(--muted); transition: 0.15s; }
.trk .tt { min-width: 0; }
.trk .t { display: block; font-family: var(--serif-cn); font-size: 18px; font-weight: 500; color: var(--ink); }
.trk .p { display: block; font-size: 11.5px; font-weight: 600; color: var(--muted); }
.trk .a { max-width: 84px; overflow: hidden; text-overflow: ellipsis; font-family: var(--han); font-size: 12px; color: var(--muted); white-space: nowrap; }
.trk.on { background: var(--primary-soft); }
.trk.on .n { background: var(--cinnabar); border-color: var(--cinnabar); color: #fbe9d6; transform: rotate(-4deg); }
.trk.on .t { color: var(--primary-strong); }

/* 卷轴播放台 */
.scroll { background: var(--paper); border: 1px solid var(--border-strong); border-radius: 4px; padding: 26px;
  box-shadow: 0 14px 34px rgba(45, 30, 10, 0.16), inset 0 0 0 8px var(--paper-2), inset 0 0 0 9px var(--hairline); }
.top { display: grid; grid-template-columns: 86px 1fr; gap: 22px; }
.label { writing-mode: vertical-rl; display: flex; align-items: center; gap: 16px; padding: 6px 0; border-right: 1px solid var(--hairline); }
.label h2 { font-family: var(--brush); font-weight: 400; font-size: 50px; line-height: 1; letter-spacing: 8px; color: var(--sumi); }
/* upright: a Latin name like "JS" stands letter-by-letter in the vertical label instead of lying sideways */
.label .who { font-family: var(--serif-cn); font-size: 14px; letter-spacing: 4px; color: var(--muted); text-orientation: upright; }
.label .seal { writing-mode: horizontal-tb; min-width: 34px; height: 34px; padding: 0 4px; white-space: nowrap; border-radius: 4px; background: var(--cinnabar); color: #fbe9d6; font-family: var(--serif-cn); font-size: 12px; font-weight: 700; line-height: 1.05; display: grid; place-items: center; text-align: center; transform: rotate(-3deg); }
.heart { min-width: 0; }
/* 装裱: a silk mat + thin gold rule around the video, like a painting mounted in the scroll */
.mount { padding: 9px; background: var(--paper-2); border: 1px solid var(--border-strong); border-radius: 3px;
  box-shadow: inset 0 0 0 4px var(--paper-2), inset 0 0 0 5px var(--gold-lt), 0 6px 16px -10px rgba(45, 30, 10, 0.35); }
.yt { position: relative; width: 100%; aspect-ratio: 16 / 9; overflow: hidden; background: var(--sumi); }
.yt iframe, .ytp :deep(iframe) { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.ytp { position: absolute; inset: 0; }
.ctrl { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.skip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border: 1px solid var(--hairline); border-radius: 99px; background: var(--card);
  font-family: var(--han); font-size: 13px; font-weight: 600; color: var(--body); transition: 0.15s; }
.skip:hover { background: var(--primary-soft); border-color: var(--cinnabar); color: var(--primary-strong); }
.skip svg { width: 13px; height: 13px; fill: var(--cinnabar); }
.skip i { font-style: normal; font-family: var(--ui); font-size: 11px; font-weight: 600; color: var(--muted); }
.ctrl .mode { margin-left: auto; }
.mode { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px 4px 9px; border: 1px solid var(--hairline); border-radius: 99px; background: var(--card);
  font-family: var(--han); font-size: 12.5px; font-weight: 600; color: var(--body); transition: 0.15s; align-self: center; }
.mode:hover { background: var(--accent-soft); border-color: var(--accent); }
.mode svg { width: 14px; height: 14px; fill: var(--cinnabar); }
.mode i { font-style: normal; font-family: var(--ui); font-size: 11px; font-weight: 600; color: var(--muted); }
.poster { position: absolute; inset: 0; width: 100%; height: 100%; padding: 0; cursor: pointer; }
.poster img { width: 100%; height: 100%; object-fit: cover; filter: sepia(0.28) saturate(0.85) brightness(0.96); transition: filter 0.25s; }
.poster::after { content: ""; position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 45%, rgba(42, 36, 26, 0.38)); pointer-events: none; }
.poster:hover img { filter: sepia(0.12) saturate(1) brightness(1); }
.poster .play { position: absolute; left: 50%; top: 50%; z-index: 1; transform: translate(-50%, -50%) rotate(-4deg); width: 84px; height: 84px; border-radius: 10px;
  background: var(--cinnabar); box-shadow: inset 0 0 0 3px rgba(251, 233, 214, 0.55), inset 0 0 0 4.5px var(--cinnabar), 0 8px 22px rgba(0, 0, 0, 0.35);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; transition: transform 0.2s; }
.poster:hover .play { transform: translate(-50%, -50%) rotate(-4deg) scale(1.06); }
.poster .tri { width: 0; height: 0; margin-left: 5px; border-left: 22px solid #fbe9d6; border-top: 13px solid transparent; border-bottom: 13px solid transparent; }
.poster .play i { font-style: normal; font-family: var(--serif-cn); font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #fbe9d6; }
.cap { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 14px; margin-top: 12px; }
.cap .py { font-size: 17px; font-weight: 700; color: var(--primary-strong); }
.cap .en { font-family: var(--serif-en); font-style: italic; font-size: 19px; color: var(--muted); }
.cap .ae { margin-left: auto; font-size: 13px; color: var(--muted); }
.cap .live { align-self: center; font-family: var(--han); font-size: 11px; font-weight: 700; color: var(--gold-deep); border: 1px solid var(--gold-lt); border-radius: 99px; padding: 1px 9px; }

.colophon { display: grid; grid-template-columns: 1.25fr 1fr; gap: 26px; margin-top: 20px; padding-top: 18px; border-top: 1px dashed var(--hairline); }
.colophon h4 { font-family: var(--ui); font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--gold-deep); margin-bottom: 8px; }
.colophon p { font-size: 14.5px; line-height: 1.65; color: var(--body); }
.colophon p.zh { font-family: var(--serif-cn); font-size: 14px; line-height: 1.6; color: var(--primary-strong); margin-top: 10px; }
.ws { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.word { display: inline-flex; align-items: baseline; gap: 8px; padding: 6px 12px; border: 1px solid var(--hairline); border-radius: 10px; background: var(--card); transition: 0.15s; }
.word:hover { background: var(--accent-soft); border-color: var(--accent); }
.word.on { background: var(--primary-soft); border-color: var(--cinnabar); }
.word b { font-family: var(--han); font-size: 18px; font-weight: 500; color: var(--ink); }
.word span { font-size: 12.5px; font-weight: 700; color: var(--primary-strong); }
.word em { font-style: normal; font-size: 12.5px; color: var(--muted); }

.credit { margin-top: 22px; text-align: center; font-size: 12px; color: var(--muted); }

@media (max-width: 860px) {
  .intro { flex-direction: column; align-items: flex-start; gap: 12px; }
  .intro h1 { font-size: 44px; }
  .desk { grid-template-columns: 1fr; gap: 16px; }
  /* 曲目册 → a horizontal strip of chips above the player */
  .list { position: static; display: flex; gap: 8px; max-height: none; overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; padding: 8px; }
  .grp { display: none; }
  .list h3 { display: none; }
  .trk { flex: none; width: auto; grid-template-columns: 24px auto; gap: 8px; padding: 7px 12px 7px 8px; background: var(--paper-2); }
  .trk { grid-template-columns: auto auto; }
  .trk .n { min-width: 22px; height: 22px; font-size: 11px; }
  .trk .t { font-size: 16px; }
  .trk .a { display: none; }
  .scroll { padding: 16px; }
  /* 竖排题签 → a horizontal title row */
  .top { grid-template-columns: 1fr; gap: 14px; }
  .label { writing-mode: horizontal-tb; border-right: 0; border-bottom: 1px solid var(--hairline); padding: 0 0 12px; gap: 12px; }
  .label h2 { font-size: 38px; letter-spacing: 4px; }
  .label .who { letter-spacing: 1px; }
  .label .seal { margin-left: auto; }
  .colophon { grid-template-columns: 1fr; gap: 18px; }
}
</style>
