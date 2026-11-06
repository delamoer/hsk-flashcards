<template>
  <div class="landing" :style="{ backgroundImage: `url(${paperTexture})` }">
    <!-- ============ HERO: the opening of the scroll ============ -->
    <header class="band" :style="{ backgroundImage: `url(${heroMain})` }">
      <div class="topbar">
        <button type="button" class="logo" @click="toTop">
          <span class="seal">學</span>
          <span class="logo-t"><b>学中文</b><small>LEARN CHINESE</small></span>
        </button>
        <router-link class="signin" to="/login">Sign in <span class="zh">登录</span></router-link>
      </div>

      <div class="hero-inner">
        <div class="vert" aria-hidden="true">学中文<span class="mini-seal">一字一音</span></div>
        <div class="anno">
          <h1>
            <span>Hear every pinyin sound.</span>
            <span>Find every grammar point.</span>
            <span>Then talk to a real teacher.</span>
          </h1>
          <p class="sub">
            Lesson-by-lesson courses with a full-time Chinese teacher — plus free tools anyone can use: a grammar
            index you can search in English, Chinese songs with their MVs, classical poems with pinyin and
            English, and a pinyin chart with native-speaker recordings.
          </p>
          <div class="hero-cta">
            <button type="button" class="btn btn-primary" @click="go('start-where')">
              Find your starting point <span class="zh">从哪儿开始</span>
            </button>
            <button type="button" class="link" @click="go('book')">Book a lesson with the teacher</button>
          </div>
        </div>
      </div>
    </header>

    <!-- album leaf (intro video) over the band's bottom edge + colophon -->
    <section class="below">
      <div class="wrap">
        <div class="colophon">
          <div class="zh-line">一页一页，都是给学生备的课。</div>
          <p>
            Everything here began as class material for her own students. The pinyin chart, grammar index,
            songs and poems are free for anyone; the full courses are part of her lessons.
          </p>
        </div>
        <figure class="leaf">
          <div class="leaf-frame" :class="{ live: videoOn, poster: videoEmbed && !videoOn }">
            <!-- poster first: the player (and its third-party host) loads only when pressed, so a blocked
                 host never shows a broken frame on arrival -->
            <template v-if="videoOn">
              <iframe
                v-if="videoEmbed.kind === 'youtube' || videoEmbed.kind === 'vimeo'"
                :src="videoEmbed.src"
                title="Teacher intro video"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              ></iframe>
              <video v-else :src="videoEmbed.src" :poster="videoEmbed.poster" controls autoplay playsinline></video>
            </template>
            <button
              v-else-if="videoEmbed"
              type="button"
              class="poster-btn"
              :class="{ photo: videoEmbed.poster }"
              :style="{ backgroundImage: `url(${videoEmbed.poster || photoPlumDesk})` }"
              aria-label="Play the teacher’s intro video"
              @click="videoOn = true"
            >
              <span class="play"><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z" fill="#f8ead9" /></svg></span>
              <b>Meet the teacher</b>
              <small>老师介绍视频 · {{ TEACHER.video.length || "intro" }}</small>
            </button>
            <div v-else>
              <div class="play"><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z" fill="#f8ead9" /></svg></div>
              <b>Teacher intro video</b>
              <small>老师介绍视频（待补）</small>
            </div>
          </div>
          <figcaption class="leaf-cap">
            <span>Teacher intro{{ TEACHER.video?.length ? ` · ${TEACHER.video.length}` : "" }}</span>
            <a v-if="videoEmbed?.page" :href="videoEmbed.page" target="_blank" rel="noopener">Not playing? Watch on {{ videoEmbed.host }} ↗</a>
            <span v-else>{{ videoEmbed?.host || "" }}</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- ============ THE PATH: courses first, then three free tools ============ -->
    <main ref="journeyEl" class="journey">
      <div class="path" aria-hidden="true">
        <svg :viewBox="path.box" preserveAspectRatio="none">
          <path :d="path.d" fill="none" stroke="#b3a582" stroke-width="1.6" stroke-dasharray="2 9" stroke-linecap="round" />
        </svg>
      </div>

      <div class="wrap">
        <!-- stop 一: the pavilion — what students study with -->
        <section id="courses" class="pav">
          <div class="pav-head">
            <div class="pav-art">
              <img :src="motifPavilion" alt="" />
              <div class="milestone"><i></i>一 · 亭中书架</div>
            </div>
            <div>
              <h2><span class="zh">学生在学的课程</span>What her students study with</h2>
              <p>
                Each course follows a real textbook, lesson by lesson, with everything for a lesson on one page. When a
                student needs a new book, it gets added.
              </p>
            </div>
          </div>

          <div class="shelf-bar">
            <div class="shelf-count">
              <b>{{ shelfCountText }}</b> so far — more added as students ask
            </div>
            <div class="shelf-nav">
              <button type="button" aria-label="Scroll shelf left" :disabled="shelf.atStart" @click="scrollShelf(-1)">‹</button>
              <button type="button" aria-label="Scroll shelf right" :disabled="shelf.atEnd" @click="scrollShelf(1)">›</button>
            </div>
          </div>
          <div class="shelf">
            <div
              ref="shelfEl"
              class="shelf-row"
              :class="{ mid: !shelf.atStart && !shelf.atEnd, end: shelf.atEnd && !shelf.atStart }"
              @scroll.passive="updateShelf"
            >
              <router-link
                v-for="c in courses"
                :key="c.id"
                class="cover"
                :to="c.to"
                :style="coverStyle(c)"
                :aria-label="`${c.zh} — ${c.en}`"
              >
                <span class="stitch"><i></i><i></i><i></i><i></i></span><span class="frame"></span>
                <span class="ser">{{ c.ser }}</span>
                <span class="seal-chip">{{ c.seal }}</span>
                <span class="nm" :class="{ long: c.long }">{{ c.zh }}</span>
                <span class="en">{{ c.en }}</span>
              </router-link>

              <div v-if="readers.length" class="group-tag"><b>课外阅读</b><span>Readers</span></div>

              <router-link
                v-for="r in readers"
                :key="r.key"
                class="cover rd"
                :to="r.to"
                :style="coverStyle(r)"
                :aria-label="`${r.zh} — ${r.en} ${r.level}`"
              >
                <span class="stitch"><i></i><i></i><i></i><i></i></span><span class="frame"></span>
                <span class="lvl-tag">{{ r.level }}</span>
                <span class="nm" :class="{ long: r.long }">{{ r.zh }}</span>
                <span class="en">{{ r.en }}</span>
              </router-link>

              <button
                type="button"
                class="cover ask-book"
                :style="{ backgroundImage: `url(${paperTexture})` }"
                aria-label="Using another textbook? Tell the teacher"
                @click="go('book')"
              >
                <span class="stitch"><i></i><i></i><i></i><i></i></span><span class="frame"></span>
                <span class="ab-top"><span class="ab-slip">你的教材</span><span class="ab-seal">添</span></span>
                <span class="ab-copy">Using another textbook?</span>
                <em class="ab-link">Tell the teacher →</em>
              </button>
            </div>
          </div>

          <div id="start-where" class="fork">
            <h3><span class="zh">从你的水平开始</span>Start where you are</h3>
            <svg class="fork-svg" viewBox="0 0 1000 70" preserveAspectRatio="none" aria-hidden="true">
              <g fill="none" stroke="#b3a582" stroke-width="1.6" stroke-dasharray="2 8" stroke-linecap="round">
                <path v-for="x in [6, 210, 414, 618, 822]" :key="x" :d="`M500 0 C500 40 ${x} 30 ${x} 70`" vector-effect="non-scaling-stroke" />
              </g>
            </svg>
            <ul class="trails">
              <li v-for="t in TRAILS" :key="t.zh" class="trail">
                <b>{{ t.zh }}</b><span class="who">{{ t.who }}</span><span class="to">{{ t.to }}</span>
              </li>
            </ul>
            <p class="mix">
              Mix and match — any book, any lesson, any section. Your teacher helps you choose.<br />
              <span class="ask">Don’t see your goal?
                <button type="button" class="link" @click="go('contact')">Ask the teacher</button></span>
            </p>
          </div>

          <div class="pav-body">
            <div class="pb-cards">
              <h3 class="sub-h">Flashcards with audio<span class="zh">生词闪卡</span></h3>
              <p class="sub-p">Chinese on the front, pinyin and meaning on the back. Tap a card to flip it and hear the word.</p>
              <div class="cards">
                <button
                  v-for="(w, i) in FLASH"
                  :key="w.hanzi"
                  type="button"
                  class="fc"
                  :class="{ flip: flipped[i] }"
                  :aria-label="`Flashcard ${w.hanzi} — click to flip`"
                  @click="flipCard(i)"
                >
                  <span class="fc-in">
                    <span class="fc-face fc-front">
                      <span class="hz" :class="{ two: w.hanzi.length > 1 }">{{ w.hanzi }}</span>
                      <small>tap to flip</small>
                    </span>
                    <span class="fc-face fc-back">
                      <span v-if="w.posEn" class="pos">{{ w.posEn }}</span>
                      <span class="py" v-html="colorPinyin(w.pinyin)"></span>
                      <span class="mean">{{ w.meaning }}</span>
                      <span class="eg"><b>{{ w.eg.zh }}</b><span>{{ w.eg.en }}</span></span>
                    </span>
                  </span>
                </button>
              </div>
            </div>
            <div class="pb-inside">
              <h3 class="sub-h">Inside every lesson<span class="zh">每一课</span></h3>
              <ul class="inside">
                <li v-for="x in INSIDE" :key="x[0]"><b>{{ x[0] }}</b>{{ x[1] }}</li>
              </ul>
            </div>
          </div>
          <p class="disclaim">
            Textbook names belong to their publishers. Covers shown are our own artwork; lesson content is for enrolled
            students.
          </p>
        </section>

        <div class="free-head">
          <span class="zh-k">免费开放 · 不用注册</span>
          <h2>Four tools you can use right now — free, no sign-up</h2>
        </div>

        <!-- stop 二: grammar -->
        <section class="stop r">
          <div class="art">
            <img class="desk" :src="photoDesk" alt="A scholar’s desk with brushes by a lattice window" />
            <img class="cloud" :src="motifCloud" alt="" />
            <div class="milestone" style="left: 20px; top: 100px"><i></i>二 · 窗下查典</div>
          </div>
          <div class="tool">
            <h3><span class="zh">语法汇总</span><span class="en">Grammar index</span></h3>
            <div class="facts">{{ grammarFacts.points }} grammar points from {{ grammarFacts.books }} textbooks so far</div>
            <p>
              Every point from HSK 1–6, New HSK 3.0, Conversational Chinese 360 and Discover China in one place.
              Search in Chinese, in pinyin with or without tones, or in plain English.
            </p>
            <div class="slip">
              <div class="search">
                <svg viewBox="0 0 24 24" fill="none" stroke="#75674f" stroke-width="2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
                <span class="q">{{ gQuery.q }}</span><span class="caret"></span>
              </div>
              <div class="try">
                Try:
                <button
                  v-for="t in G_TRY"
                  :key="t.q"
                  type="button"
                  :class="{ on: gQuery.q === t.q }"
                  @click="gQuery = t"
                >{{ t.q }}</button>
              </div>
              <div class="gp">
                <template v-if="gPoint">
                  <div class="gp-top">
                    <span class="gp-name" v-html="mark(gPoint.name, gQuery.field === 'name' && gQuery.re)"></span>
                    <span class="gp-py" v-html="mark(gPoint.pinyin, gQuery.field === 'py' && gQuery.re)"></span>
                    <span v-if="gPoint.tag" class="gp-tag">{{ gPoint.tag }}</span>
                  </div>
                  <div class="gp-en" v-html="mark(gPoint.explainEn, gQuery.field === 'en' && gQuery.re)"></div>
                  <div class="gp-struct" v-html="structHtml(gPoint.structure)"></div>
                  <div v-if="gPoint.eg" class="gp-eg">
                    <span class="zh">{{ gPoint.eg.zh }}</span> <span class="p">{{ gPoint.eg.py }}</span>
                    <div class="e">{{ gPoint.eg.en }}</div>
                  </div>
                </template>
              </div>
            </div>
            <router-link class="link go" :to="{ path: '/grammar', query: { q: gQuery.q } }">Search the grammar index →</router-link>
          </div>
        </section>

        <!-- stop 三: songs -->
        <section v-if="song" class="stop l">
          <div class="art">
            <img class="cranes" :src="motifCranes" alt="" />
            <div class="milestone" style="left: 40px; top: 290px"><i></i>三 · 云间听曲</div>
          </div>
          <div class="tool">
            <h3><span class="zh">中国风</span><span class="en">Chinese songs</span></h3>
            <div class="facts">{{ songCount }} songs so far · each with its MV</div>
            <p>
              From Jay Chou’s “Blue and White Porcelain” to theme songs from classic kung fu and fantasy dramas.
              Watch the MV, then tap three key words from the lyrics to hear them.
            </p>
            <div class="slip song-slip">
              <span class="song-wm" aria-hidden="true">曲</span>
              <div class="song">
                <router-link class="tile" :to="{ path: '/music', query: { song: songNo } }" :aria-label="`Play ${song.en}`">
                  <span class="tile-t">{{ song.zh }}</span>
                  <i><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z" fill="#f8ead9" /></svg></i>
                </router-link>
                <div>
                  <div class="song-t">{{ song.zh }}<small>{{ song.py }}</small></div>
                  <div class="song-en">{{ song.en }}</div>
                  <div class="song-by">{{ song.artist }} {{ song.artistEn }}</div>
                  <figure v-if="lyric.zh" class="lyric">
                    <blockquote>{{ lyric.zh }}</blockquote>
                    <figcaption v-if="lyric.en">“{{ lyric.en }}”</figcaption>
                  </figure>
                </div>
              </div>
              <div class="chips">
                <button
                  v-for="w in song.words"
                  :key="w.zh"
                  type="button"
                  class="chip"
                  :class="{ on: nowPlaying === w.zh }"
                  @click="speak(w.zh)"
                >
                  <b>{{ w.zh }}<i class="ting" aria-hidden="true">听</i></b><span><em>{{ w.py }}</em>{{ w.en }}</span>
                </button>
              </div>
            </div>
            <router-link class="link go" :to="{ path: '/music', query: { song: songNo } }">Listen to the songs →</router-link>
          </div>
        </section>

        <!-- stop 四: pinyin -->
        <section class="stop r">
          <div class="art art-py">
            <figure class="py-sheet">
              <div class="tzg"><span class="tzg-hz">{{ TONES[tone].hz }}</span></div>
              <div class="staff-wrap">
                <svg class="staff" viewBox="0 0 320 200" aria-label="The four tones of ma">
                  <defs>
                    <filter id="landing-ink" x="-10%" y="-30%" width="120%" height="160%">
                      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" />
                      <feDisplacementMap in="SourceGraphic" scale="2.4" />
                    </filter>
                  </defs>
                  <g stroke="#d9cbb0" stroke-width="1">
                    <line v-for="y in [24, 62, 100, 138, 176]" :key="y" x1="0" :y1="y" x2="320" :y2="y" />
                  </g>
                  <g font-family="Cormorant Garamond" font-size="11" fill="#9a8a6e">
                    <text v-for="(y, k) in [20, 58, 96, 134, 172]" :key="y" x="2" :y="y">{{ 5 - k }}</text>
                  </g>
                  <g filter="url(#landing-ink)" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path v-for="(t, i) in TONES" :key="i" class="cont" :class="{ on: tone === i }" :d="t.curve" :stroke="t.color" />
                  </g>
                  <g fill="transparent">
                    <rect v-for="(t, i) in TONES" :key="i" class="hit" :x="t.hit[0]" y="0" :width="t.hit[1]" height="200" @click="pickTone(i)" />
                  </g>
                </svg>
                <div class="py-labels">
                  <button
                    v-for="(t, i) in TONES"
                    :key="i"
                    type="button"
                    :class="[t.cls, { on: tone === i }]"
                    :aria-label="`Play ${t.py}`"
                    @click="pickTone(i)"
                  >{{ t.py }}</button>
                </div>
              </div>
              <figcaption class="py-cap">
                <b :class="TONES[tone].cls">{{ TONES[tone].py }}</b> {{ TONES[tone].hz }} · {{ TONES[tone].en }} —
                {{ TONES[tone].d }}
              </figcaption>
            </figure>
            <div class="milestone" style="left: -10px; top: -24px"><i></i>四 · 格中辨音</div>
          </div>
          <div class="tool">
            <h3><span class="zh">拼音表</span><span class="en">Pinyin chart</span></h3>
            <div class="facts">{{ PINYIN_SYLLABLES }} syllables · native recordings · English sound-alikes</div>
            <p>
              Every syllable is a real native-speaker recording, not a robot voice. Each initial and final has an
              English sound-alike — <b>x</b> is like “sh” with a smile, <b>q</b> like “ch” with lips spread. Tap a
              tone stroke to see one sound carry four meanings.
            </p>
            <router-link class="link go" to="/pinyin">Open the pinyin chart →</router-link>
          </div>
        </section>

        <!-- stop 五: classical poems — a short handscroll with 静夜思 on it -->
        <section class="stop l">
          <div class="art art-po">
            <figure class="hs" aria-label="静夜思 by Li Bai, written top to bottom, right to left">
              <HandscrollFrame :bg="heroMain">
                <div class="hs-paper">
                  <span class="hs-seal" aria-hidden="true">月</span>
                  <p v-for="l in poem.lines" :key="l.zh" class="hs-col">{{ l.zh }}</p>
                  <p class="hs-title">静夜思 · 李白</p>
                </div>
              </HandscrollFrame>
            </figure>
            <div class="milestone" style="left: 10px; top: -18px"><i></i>五 · 卷中读诗</div>
          </div>
          <div class="tool">
            <h3><span class="zh">古诗词</span><span class="en">Classical poems</span></h3>
            <div class="facts">{{ poemCount }} poems · from the Book of Songs to the Qing</div>
            <p>
              Li Bai, Du Fu, Su Shi, Li Qingzhao — on one handscroll, oldest to newest. Every line has pinyin and
              an English translation; tap a word for its meaning, and learn what the moon, the willow or the wild
              goose means in a Chinese poem.
            </p>
            <div class="slip po-slip">
              <div class="po-top">
                <span class="po-t">{{ poem.title }}<small>{{ poem.titlePy }} · {{ poem.authorEn }}</small></span>
                <span class="po-tg">
                  <button type="button" :class="{ on: poShow.py }" @click="poShow.py = !poShow.py">拼音 Pinyin</button>
                  <button type="button" :class="{ on: poShow.en }" @click="poShow.en = !poShow.en">English</button>
                </span>
              </div>
              <button
                v-for="l in poem.lines"
                :key="l.zh"
                type="button"
                class="po-line"
                :class="{ on: nowPlaying === l.zh }"
                @click="speak(l.zh)"
              >
                <span v-if="poShow.py" class="po-py">{{ l.py }}</span>
                <span class="po-zh">{{ l.zh }}<i class="ting" aria-hidden="true">听</i></span>
                <span v-if="poShow.en" class="po-en">{{ l.en }}</span>
              </button>
              <div class="po-img"><b>月</b> {{ poemMoon }}</div>
            </div>
            <router-link class="link go" :to="{ name: 'poem', params: { slug: poem.slug } }">Read it with notes →</router-link>
            <router-link class="link go po-all" to="/poems">Unroll all {{ poemCount }} poems →</router-link>
          </div>
        </section>
      </div>
    </main>

    <!-- ============ TEACHER, at the end of the bamboo path ============ -->
    <section id="book" class="teacher">
      <div class="teacher-grid">
        <div class="bamboo" :style="{ backgroundImage: `url(${photoBamboo})` }">
          <div class="poem">曲径通幽处</div>
          <div class="portrait">
            <img v-if="TEACHER.photo" :src="TEACHER.photo" :alt="TEACHER.name || 'Teacher photo'" />
            <div v-else class="ph-box"><span><b>Teacher photo</b><small>老师照片（待补）</small></span></div>
          </div>
        </div>
        <div class="t-body">
          <div class="t-kicker">你的老师 · YOUR TEACHER</div>
          <h2 class="t-name">
            <span :class="{ ph: !TEACHER.name }">{{ TEACHER.name || "[Teacher name]" }}</span><span class="zh">老师</span>
          </h2>
          <div class="t-role">{{ TEACHER.role }}</div>
          <div class="sample">
            <span v-if="TEACHER.bioIsSample" class="tag">Sample copy — to be replaced</span>
            <p v-for="(para, k) in TEACHER.bio" :key="k">{{ para }}</p>
          </div>
          <div v-if="TEACHER.traits.length" class="traits">
            <span class="lab">Students call her</span>
            <span v-for="t in TEACHER.traits" :key="t" class="trait">{{ t }}</span>
          </div>
          <div v-if="TEACHER.quotes.length" class="quotes">
            <div class="quotes-h">What students say <span class="zh">学生评价 · from Preply</span></div>
            <figure v-for="(qt, k) in TEACHER.quotes" :key="k" class="quote">
              <blockquote>“{{ qt.text }}”</blockquote>
              <figcaption>— {{ qt.who }}</figcaption>
            </figure>
          </div>
          <div class="stats">
            <div v-for="s in TEACHER.stats" :key="s.label" class="stat">
              <b>{{ s.value ?? "—" }}</b><span>{{ s.label }}</span>
            </div>
          </div>
          <div class="stats-src">{{ TEACHER.statsSource }}</div>

          <div class="gates">
            <div class="gate">
              <div class="gate-mark" aria-hidden="true">约</div>
              <h3><span class="zh">在 Preply 上约课</span>Book a trial on Preply</h3>
              <p>Pay and schedule safely through Preply. <span class="proof">★ 5.0 · 1,000+ lessons</span></p>
              <a class="btn btn-primary" :href="TEACHER.preplyShare" target="_blank" rel="noopener">Book a trial lesson →</a>
              <small class="url">{{ preplyShort }}</small>
            </div>
            <div id="contact" class="gate">
              <div class="gate-mark" aria-hidden="true">聊</div>
              <h3><span class="zh">直接联系老师</span>Contact the teacher directly</h3>
              <p>Have a question first? Send a message — no sign-up, no booking.</p>
              <ul>
                <li v-for="ch in CONTACTS" :key="ch.key">
                  <b>{{ ch.label }}</b>
                  <button v-if="TEACHER.contact[ch.key]" type="button" class="c-btn" @click="ch.open">
                    {{ copied === ch.key ? "Copied 已复制" : ch.action }}
                  </button>
                  <span v-else class="c-off">to be added · 待补</span>
                </li>
              </ul>
              <p v-if="copied" class="c-hint" role="status">{{ COPY_HINT[copied] }}</p>
              <button type="button" class="btn btn-ink" :disabled="!primaryContact" @click="primaryContact?.open()">
                {{ primaryContact ? "Send a message →" : "Send a message · 待补" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ STUDENTS ============ -->
    <section class="students">
      <div class="wrap">
        <div class="students-line">
          <h3>Already a student?<span class="zh">已经是学生？请登录</span></h3>
          <router-link class="link" to="/login">Sign in to your courses →</router-link>
        </div>
      </div>
    </section>

    <footer class="foot">
      © 2026 学中文 Learn Chinese · Pinyin recordings CC-BY-SA
      <a href="https://github.com/hugolpz/audio-cmn" target="_blank" rel="noopener">hugolpz/audio-cmn</a>
    </footer>
  </div>
</template>

<script setup>
// ═══════════════════════════════════════════════════════════════════════════
//  TEACHER CONFIG — the owner fills these in. Everything left null/empty stays a
//  visible "待补" placeholder on the page.
// ═══════════════════════════════════════════════════════════════════════════
const TEACHER = {
  name: "Yihui", // shows "Yihui 老师"; null → "[Teacher name] 老师"
  role: "Full-time Chinese teacher · from Sichuan, China",
  // Bio paragraphs — her own words, updated past the (outdated) Preply profile. Never mention young
  // (primary-school) children — she doesn't take them. bioIsSample:true shows a "sample" tag.
  bio: [
    "I’m Yihui, a full-time Chinese teacher from Sichuan with a Master’s in Teaching Chinese as a Foreign Language. My students range from complete beginners getting their first tones right to HSK 6 candidates and people who simply want to talk.",
    "We work on what you need: pinyin and pronunciation from zero, the HSK (levels 1–6 or the new HSK 3.0), everyday conversation, survival Chinese for a trip or a move to China, graded readers, even Chinese songs. Every lesson has its own page on this site — text, flashcards with audio, grammar and exercises — so you can review between classes.",
    "Lessons feel like conversations, not lectures, and after each one I send feedback and practice so nothing slips away.",
  ],
  bioIsSample: false,
  // How students describe her (Preply "teaching style" tags). [] hides the chips.
  traits: ["Engaging", "Patient", "Structured"],
  // Student reviews from her Preply profile — first name only, wording unchanged
  // (a cut-off review ends with "…"). [] hides the block.
  quotes: [
    { text: "I started from scratch and YiHui is a perfect match for me — we go step by step…", who: "Ira" },
    { text: "I’m currently studying for the HSK 5, and she supplements the material with conversation and checks my homework in a timely manner…", who: "Jill" },
    { text: "She’s a great tutor — friendly, encouraging, and easy to learn from. Her positive energy creates a comfortable environment.", who: "Rakan" },
  ],
  photo: teacherPhoto, // sources/老师照片3.jpg (same look as the intro video), cropped to the 3:4 frame
  // Intro video: { file, poster } (self-hosted, preferred) / { vimeo: "ID" } / { youtube: "ID" }; null → placeholder.
  // Self-hosted so it plays where Vimeo is blocked (mainland China). Same clip as her Preply intro
  // (vimeo.com/1122436853) — the phone original is HEVC, re-encoded to H.264 so every browser can play it.
  video: { file: introVideo, poster: introPoster, length: "1 min" },
  // Preply numbers; value null → "—"
  // Numbers from her Preply profile (update now and then). value null → "—".
  stats: [
    { label: "Preply rating · 18 reviews", value: "5.0" },
    { label: "lessons taught", value: "1,000+" },
    { label: "of Chinese tutors on Preply", value: "Top 15%" },
  ],
  statsSource: "From her Preply profile · Nov 2026 · students stay for 29+ lessons on average",
  preplyUrl: "https://preply.com/en/tutor/6953432", // shown as text under the button
  // Her profile's "Share profile → Copy link" — Preply's own short link, which redirects to the same profile page
  // with Preply's tutor-share tracking. Linked as-is so the redirect can count the click too.
  preplyShare: "https://preply.in/YIHUI7EN30094143102?ts=17938484",
  // Never rendered as text: links are built only when a button is clicked.
  contact: {
    // She doesn't use WhatsApp — email + WeChat only. Shown as buttons, never as plain text.
    email: "valerielq987@gmail.com",
    wechat: "lq636688", // WeChat ID — the button copies it to the clipboard
  },
};
// ═══════════════════════════════════════════════════════════════════════════

import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import HandscrollFrame from "@/components/HandscrollFrame.vue";
import {
  heroMain, photoBamboo, photoDesk, photoPlumDesk, motifPavilion, motifCranes, motifCloud,
  paperTexture, bookCover, readingCover,
} from "@/assets/img.js";
import introVideo from "@/assets/teacher/teacher-intro.mp4";
import introPoster from "@/assets/teacher/teacher-intro-poster.webp";
import teacherPhoto from "@/assets/teacher/teacher-photo.webp";
import { courseRegistry } from "@/data";
import { readingBooks } from "@/data/reading.js";
import { getGrammarLesson } from "@/data/grammar.js";
import grammarMeta from "@/data/grammar/meta.json";
import music from "@/data/music.json";
import poemsMeta from "@/data/poems/meta.json";
import jingYeSi from "@/data/poems/p/jing-ye-si.json";
import { posLabel } from "@/data/pos.js";
import { colorPinyin } from "@/utils/pinyinTones.js";
import { speak, playPinyin, nowPlaying } from "@/utils/tts.js";


// ── poems: 静夜思, the one every Chinese person knows ──────────────────────
const poem = jingYeSi;
const poemCount = poemsMeta.poems.length;
const poemMoon = jingYeSi.imagery.find((m) => m.name === "月")?.en || "";
const poShow = reactive({ py: true, en: true });

// ── scrolling (hash routing owns the URL hash, so no href="#…") ──────────────
function go(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
function toTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── the shelf: driven by the course registry + reading meta ─────────────────
// Same colorClass → tint mapping as SeriesBooksView's cover fallbacks.
const COVER_COLOR = {
  "c-coral": "#8f2f24",
  "c-violet": "#463060",
  "c-jade": "#1b5245",
  "c-amber": "#7d5216",
  "c-indigo": "#243a57",
  "c-olive": "#434d1c",
};
// rough rendered width: CJK = 1, latin/digits/space ≈ .55
const visualLen = (s) => [...s].reduce((n, ch) => n + (/[　-鿿＀-￯]/.test(ch) ? 1 : 0.55), 0);

const courses = courseRegistry.map((s) => {
  const zh = s.heroTitle || s.name;
  const n = s.units.length;
  const unit = String(s.volUnit || "Books");
  return {
    id: s.id,
    zh,
    en: s.nameEn,
    seal: s.seal?.cn || "",
    ser: `${n} ${n === 1 ? unit.replace(/s$/, "") : unit}`,
    img: bookCover[s.id],
    color: COVER_COLOR[s.colorClass] || "#4a3d2a",
    long: visualLen(zh) > 4.5, // ~5 CJK chars fit the 18px line of a 140px cover
    to: `/course/${s.id}`,
  };
});
const readers = readingBooks.map((b) => ({
  key: b.key,
  zh: b.title,
  en: b.seriesEn || b.titleEn || "",
  level: b.level,
  img: readingCover[b.key],
  color: b.color || "#4a3d2a",
  long: visualLen(b.title) > 4.5,
  to: `/reading/${b.key}`,
}));
const readerLevels = new Set(readers.map((r) => String(r.level).replace(/\D/g, ""))).size; // 1A/1B → level 1
const shelfCountText = `${courses.length} course series · ${readers.length} graded reader${readers.length === 1 ? "" : "s"}`;

function coverStyle(b) {
  const c = b.color;
  const tint = `linear-gradient(180deg,${c}14 0%,${c}3d 40%,${c}b3 74%,${c}e6 100%)`;
  return { backgroundColor: c, backgroundImage: b.img ? `${tint},url(${b.img})` : tint };
}

const shelfEl = ref(null);
const shelf = reactive({ atStart: true, atEnd: false });
function updateShelf() {
  const el = shelfEl.value;
  if (!el) return;
  const max = el.scrollWidth - el.clientWidth - 2;
  shelf.atStart = el.scrollLeft < 2;
  shelf.atEnd = el.scrollLeft >= max;
}
function scrollShelf(dir) {
  const el = shelfEl.value;
  if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
}

// ── start where you are ─────────────────────────────────────────────────────
const TRAILS = [
  { zh: "零基础", who: "Complete beginner", to: "The pinyin chart, then HSK 1 or Conversational Chinese 360, Book 1" },
  { zh: "有基础", who: "I know some Chinese", to: "Jump into HSK 3–4 or New HSK 3.0 at your level" },
  { zh: "想开口说", who: "I want to speak", to: "Spoken Chinese for a New Era, Conversational Chinese 360, or Survival Chinese for travel and daily life" },
  { zh: "备考 HSK", who: "I’m taking the HSK exam", to: "HSK Standard Course 1–6, plus the grammar index" },
  { zh: "爱读书", who: "I like reading", to: `Reading China (中文天天读) — ${readers.length} graded readers in ${readerLevels} levels` },
];
const INSIDE = [
  ["课文", "Lesson text"], ["生词闪卡", "Flashcards"],
  ["词汇详解", "Vocabulary"], ["语法", "Grammar"],
  ["练习", "Exercises"], ["话题讨论", "Talking points"],
];

// ── flashcards (values copied from src/data/hsk-1.json: h1-l1-1, h1-l1-2, h1-l13-3) ──
const FLASH = [
  { hanzi: "你", pinyin: "nǐ", meaning: "you", pos: "pron", eg: { zh: "你好。", en: "Hello." } },
  { hanzi: "好", pinyin: "hǎo", meaning: "good; well", pos: "a", eg: { zh: "很好。", en: "Very good." } },
  { hanzi: "学习", pinyin: "xuéxí", meaning: "to study; to learn", pos: "v", eg: { zh: "我学习汉语。", en: "I study Chinese." } },
].map((w) => ({ ...w, posEn: posLabel(w.pos)?.en }));
const flipped = ref([false, false, true]);
function flipCard(i) {
  const next = !flipped.value[i];
  flipped.value = flipped.value.map((f, k) => (k === i ? next : f));
  if (next) speak(FLASH[i].hanzi);
}

// ── grammar preview: one real point, loaded from the grammar data ───────────
const grammarFacts = {
  points: Object.values(grammarMeta).reduce((n, m) => n + (m.pointCount || 0), 0),
  books: Object.keys(grammarMeta).length,
};
const G_SAMPLE = { series: "hsk", unit: 3, lesson: 9, id: "3.9.1", example: 1 }; // 越A越B
const G_TRY = [
  { q: "越A越B", field: "name", re: /越/g },
  { q: "yue A yue B", field: "py", re: /yuè/g },
  { q: "the more", field: "en", re: /the more/gi },
];
const gQuery = ref(G_TRY[0]);
const gPoint = ref(null);
async function loadGrammarSample() {
  try {
    const l = await getGrammarLesson(G_SAMPLE.series, G_SAMPLE.unit, G_SAMPLE.lesson);
    const p = l?.points.find((x) => x.id === G_SAMPLE.id);
    if (!p) return;
    const unitLabel = courseRegistry.find((s) => s.id === G_SAMPLE.series)?.units.find((u) => u.id === G_SAMPLE.unit)?.label;
    gPoint.value = {
      name: p.name,
      pinyin: p.pinyin,
      explainEn: p.explainEn,
      structure: p.structure,
      eg: p.examples?.[G_SAMPLE.example] || p.examples?.[0] || null,
      tag: unitLabel ? `${unitLabel} · L${l.num}` : "",
    };
  } catch {
    /* preview stays empty */
  }
}
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
function mark(text, re) {
  const safe = esc(text);
  return re ? safe.replace(re, (m) => `<mark>${m}</mark>`) : safe;
}
const structHtml = (s) => esc(s).replace(/越/g, "<em>越</em>");

// ── songs: 青花瓷 from music.json ──────────────────────────────────────────
const allSongs = music.groups.flatMap((g) => g.songs);
const songCount = allSongs.length;
const songIdx = allSongs.findIndex((s) => s.zh === "青花瓷");
const song = songIdx >= 0 ? allSongs[songIdx] : allSongs[0];
const songNo = Math.max(songIdx, 0) + 1; // MusicView's ?song= is 1-based over the flat order
// one quoted lyric line, lifted from the song's own note (「…」 in noteZh, “…” in note) — a single line only
const lyric = {
  zh: (song.noteZh || "").match(/「(.+?)」/)?.[1] || "",
  en: ((song.note || "").match(/“(.+?)”/)?.[1] || "").replace(/^./, (c) => c.toUpperCase()),
};

// ── pinyin: tap a tone stroke → human recording ma1…ma4 ─────────────────────
const PINYIN_SYLLABLES = 399; // = src/data/pinyin.json syllables.length (too big to import for one number)
const TONES = [
  { py: "mā", hz: "妈", en: "mother", d: "high and level, like holding a note", cls: "t1", color: "#c0392b",
    curve: "M22 26 C40 23 62 25 74 24", hit: [10, 76] },
  { py: "má", hz: "麻", en: "hemp", d: "rises, like asking “huh?”", cls: "t2", color: "#3f7a52",
    curve: "M100 102 C114 84 130 50 150 25", hit: [88, 74] },
  { py: "mǎ", hz: "马", en: "horse", d: "dips low, then comes back up", cls: "t3", color: "#2f6d8c",
    curve: "M176 140 C186 168 200 180 212 172 C222 164 230 110 238 64", hit: [164, 82] },
  { py: "mà", hz: "骂", en: "to scold", d: "falls sharply, like a firm “No.”", cls: "t4", color: "#7a4f86",
    curve: "M262 24 C276 70 288 130 300 174", hit: [248, 72] },
];
const tone = ref(2);
function pickTone(i) {
  tone.value = i;
  playPinyin(`ma${i + 1}`).catch(() => speak(TONES[i].hz));
}

// ── teacher video + contact ─────────────────────────────────────────────────
const videoOn = ref(false);
const videoEmbed = computed(() => {
  const v = TEACHER.video;
  // dnt=1: no Vimeo tracking cookies; title/byline/portrait=0 keeps the uploader's account name off the player
  if (v?.vimeo) return { kind: "vimeo", host: "Vimeo", src: `https://player.vimeo.com/video/${encodeURIComponent(v.vimeo)}?autoplay=1&dnt=1&title=0&byline=0&portrait=0&color=a33f2e`, page: `https://vimeo.com/${encodeURIComponent(v.vimeo)}` };
  if (v?.youtube) return { kind: "youtube", host: "YouTube", src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtube)}?rel=0&autoplay=1`, page: `https://www.youtube.com/watch?v=${encodeURIComponent(v.youtube)}` };
  if (v?.file) return { kind: "file", host: "", src: v.file, poster: v.poster };
  return null;
});
const preplyShort = TEACHER.preplyUrl.replace(/^https?:\/\/(www\.)?/, "");
// which contact was just copied ("email" | "wechat" | null) — drives the button label + hint
const copied = ref(null);
let copiedTimer = 0;
async function copyContact(key, label) {
  try {
    await navigator.clipboard.writeText(TEACHER.contact[key]);
    copied.value = key;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied.value = null), 8000);
  } catch { window.prompt(label, TEACHER.contact[key]); } // clipboard blocked: let them copy it by hand
}
const COPY_HINT = {
  // mailto: does nothing when no mail app is set up (common for webmail users), so the address is copied too
  email: "No mail app opened? The address is copied — paste it into Gmail, Outlook or any email.",
  wechat: "Now open WeChat → Add Contacts and paste the ID.",
};
const CONTACTS = [
  {
    key: "email", label: "Email", action: "Write an email",
    open: () => {
      copyContact("email", "Email · 邮箱");
      window.location.href = `mailto:${TEACHER.contact.email}`;
    },
  },
  {
    key: "wechat", label: "WeChat", action: "Copy WeChat ID",
    open: () => copyContact("wechat", "WeChat ID · 微信号"),
  },
];
const primaryContact = CONTACTS.find((c) => c.key !== "wechat" && TEACHER.contact[c.key]) || null;

// ── ink path linking the stops' milestones ──────────────────────────────────
const journeyEl = ref(null);
const path = reactive({ box: "0 0 1 1", d: "" });
function drawPath() {
  const host = journeyEl.value;
  if (!host) return;
  const hr = host.getBoundingClientRect();
  const pts = [...host.querySelectorAll(".stop .milestone i")]
    .map((i) => i.getBoundingClientRect())
    .filter((r) => r.width > 0)
    .map((r) => [r.left - hr.left + r.width / 2, r.top - hr.top + r.height / 2]);
  path.box = `0 0 ${Math.max(hr.width, 1)} ${Math.max(hr.height, 1)}`;
  if (pts.length < 2) return (path.d = "");
  let prev = pts.shift();
  let d = `M${prev[0]},${prev[1]}`;
  for (const p of pts) {
    const my = (prev[1] + p[1]) / 2;
    d += ` C${prev[0]},${my} ${p[0]},${my} ${p[0]},${p[1]}`;
    prev = p;
  }
  path.d = d;
}

let ro = null;
function relayout() {
  updateShelf();
  drawPath();
}
onMounted(() => {
  loadGrammarSample();
  relayout();
  ro = new ResizeObserver(relayout);
  if (journeyEl.value) ro.observe(journeyEl.value);
  if (shelfEl.value) ro.observe(shelfEl.value);
  document.fonts?.ready.then(relayout);
});
onBeforeUnmount(() => {
  ro?.disconnect();
});
</script>

<style scoped>
.landing {
  --sh: var(--sh-card);
  background-color: var(--canvas); background-size: 900px auto; /* stronger 皮纸 than the global body tile, as in the mockup */
  overflow-x: clip;
  color: var(--body);
  font-size: 16px;
  line-height: 1.65;
}
.landing :deep(img) { display: block; max-width: 100%; }
.zh { font-family: var(--serif-cn); }
.wrap { max-width: 1240px; margin: 0 auto; padding: 0 40px; }
button { font: inherit; color: inherit; }

/* ---------- buttons ---------- */
.btn {
  display: inline-flex; align-items: center; gap: 10px;
  font: 700 16px/1 var(--ui); letter-spacing: .01em; text-decoration: none;
  padding: 15px 26px; border-radius: var(--r-sm); border: 1px solid transparent; cursor: pointer;
  transition: background .15s, transform .15s, box-shadow .15s;
}
.btn .zh { font-weight: 600; font-size: 14px; opacity: .85; }
.btn-primary { background: linear-gradient(180deg, #a8442f, #8a3324); color: #fbf3e8; box-shadow: 0 6px 18px rgba(139, 42, 31, .26); }
.btn-primary:hover { background: linear-gradient(180deg, #9a3a29, #7a2b21); transform: translateY(-1px); }
.btn-ink { background: var(--sumi); color: #f5efe6; box-shadow: 0 6px 18px rgba(42, 36, 26, .22); }
.btn-ink:hover:not(:disabled) { background: var(--ink); transform: translateY(-1px); }
.btn:disabled { opacity: .5; cursor: default; box-shadow: none; }
.link {
  font-weight: 700; color: var(--primary-strong); text-decoration: none; cursor: pointer;
  background: none; border: 0; border-bottom: 1px solid rgba(122, 43, 33, .35); padding: 0 0 2px; font-size: inherit;
}
.link:hover { border-bottom-color: var(--primary-strong); }

/* ---------- 1. hero band ---------- */
.band {
  position: relative; min-height: 660px;
  background-color: var(--soft); background-position: center 42%; background-size: cover; background-repeat: no-repeat;
}
.band::before { /* mist behind the annotation + fade into paper */
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 46% 62% at 52% 38%, rgba(245, 239, 230, .86) 0%, rgba(245, 239, 230, .62) 48%, rgba(245, 239, 230, 0) 100%),
    linear-gradient(180deg, rgba(245, 239, 230, 0) 72%, rgba(245, 239, 230, .55) 100%);
}
.band::after { /* thin gold double frame */
  content: ""; position: absolute; inset: 16px; pointer-events: none;
  border: 1px solid rgba(138, 124, 92, .55);
  box-shadow: inset 0 0 0 5px rgba(245, 239, 230, 0), inset 0 0 0 6px rgba(138, 124, 92, .35);
}
.topbar { position: relative; z-index: 3; display: flex; justify-content: space-between; align-items: center; padding: 34px 46px 0; }
.logo {
  display: flex; align-items: center; gap: 11px; cursor: pointer; border: 0; text-align: left;
  background: rgba(251, 247, 238, .82); padding: 8px 16px 8px 8px; border-radius: 12px;
  box-shadow: 0 2px 10px rgba(45, 30, 10, .08); backdrop-filter: blur(2px);
}
.seal {
  width: 42px; height: 42px; border-radius: 9px; display: grid; place-items: center;
  background: linear-gradient(160deg, #a8442f, #7a2b21); color: #f8ead9;
  font: 700 23px/1 var(--serif-cn); box-shadow: inset 0 0 0 2px rgba(248, 234, 217, .25);
}
.logo-t b { display: block; font: 700 19px/1.1 var(--serif-cn); color: var(--ink); letter-spacing: .06em; }
.logo-t small { display: block; font: 600 10.5px/1.3 var(--serif-en); letter-spacing: .24em; color: var(--muted); margin-top: 2px; }
.signin {
  font: 700 14.5px/1 var(--ui); color: var(--sumi);
  background: rgba(251, 247, 238, .82); border: 1px solid var(--border-strong);
  padding: 11px 18px; border-radius: var(--r-pill); display: flex; gap: 8px; align-items: center;
}
.signin .zh { font-weight: 600; font-size: 13px; color: var(--muted); }
.signin:hover { background: var(--card); border-color: var(--gold); }

.hero-inner {
  position: relative; z-index: 2; display: flex; gap: 34px; align-items: flex-start;
  margin-left: calc(50% - 340px); padding-top: 58px; max-width: 760px;
}
.vert {
  writing-mode: vertical-rl; font-family: var(--brush); font-size: 104px; line-height: 1;
  color: var(--ink); letter-spacing: .06em; text-shadow: 0 0 18px rgba(245, 239, 230, .9);
  position: relative; flex: none; margin-top: -6px;
}
.mini-seal {
  writing-mode: vertical-rl; position: absolute; left: -30px; bottom: 4px;
  font: 700 12px/1.15 var(--serif-cn); color: #f8ead9; background: var(--primary);
  padding: 6px 3px; border-radius: 3px; letter-spacing: .12em; text-shadow: none;
}
.anno { max-width: 560px; }
.anno h1 { font-family: var(--serif-en); font-weight: 600; color: var(--ink); font-size: 52px; line-height: 1.06; letter-spacing: -.005em; }
.anno h1 span { display: block; }
.sub { margin-top: 20px; font-size: 17.5px; line-height: 1.6; color: var(--sumi); max-width: 500px; }
.hero-cta { margin-top: 28px; display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
.hero-cta .link { font-size: 16px; }

/* album leaf over the band's bottom edge */
.below { position: relative; z-index: 4; }
.below .wrap { display: grid; grid-template-columns: 1fr 500px; gap: 72px; align-items: start; }
.leaf {
  margin-top: -112px; background: var(--card); padding: 14px 14px 12px;
  border: 1px solid var(--line); border-radius: 6px; box-shadow: var(--sh-pop); transform: rotate(.6deg);
}
.leaf-frame {
  position: relative; aspect-ratio: 16 / 9; border-radius: 3px; overflow: hidden;
  background: repeating-linear-gradient(135deg, rgba(138, 124, 92, .07) 0 10px, rgba(138, 124, 92, 0) 10px 20px), var(--soft);
  border: 1px dashed var(--border-strong); display: grid; place-items: center; text-align: center;
}
.leaf-frame.live { border-style: solid; background: #000; }
.leaf-frame.poster { border-style: solid; }
.poster-btn {
  position: absolute; inset: 0; border: 0; cursor: pointer; display: grid; place-content: center; text-align: center;
  background-size: cover; background-position: center 38%;
}
.poster-btn::before { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(245, 239, 230, .55), rgba(245, 239, 230, .82)); }
.poster-btn > * { position: relative; }
/* a real video frame as the poster: no paper wash over her face — the seal + label sit on the plain wall, left */
.poster-btn.photo { place-content: end start; padding: 0 0 22px 26px; text-align: left; background-position: center; }
.poster-btn.photo::before { background: linear-gradient(90deg, rgba(26, 18, 8, .38), rgba(26, 18, 8, 0) 45%); }
.poster-btn.photo .play { margin: 0 0 10px; width: 62px; height: 62px; }
.poster-btn.photo b { color: #fbf7ee; text-shadow: 0 1px 6px rgba(26, 18, 8, .5); }
.poster-btn.photo small { color: #f1e4c8; text-shadow: 0 1px 6px rgba(26, 18, 8, .5); }
.poster-btn .play { transition: transform .2s; }
.poster-btn:hover .play { transform: rotate(-4deg) scale(1.06); }
.leaf-cap a { color: var(--primary-strong); font-weight: 700; text-decoration: none; }
.leaf-cap a:hover { text-decoration: underline; }
.leaf-frame iframe, .leaf-frame video { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.play {
  width: 74px; height: 74px; border-radius: 12px; background: linear-gradient(160deg, #a8442f, #7a2b21);
  display: grid; place-items: center; box-shadow: 0 6px 18px rgba(139, 42, 31, .3); margin: 0 auto 14px; transform: rotate(-4deg);
}
.play svg { width: 30px; height: 30px; margin-left: 4px; }
.leaf-frame b { display: block; font: 700 15px/1.3 var(--ui); color: var(--sumi); }
.leaf-frame small { display: block; font: 500 13px/1.4 var(--serif-cn); color: var(--muted); margin-top: 4px; }
.leaf-cap { display: flex; justify-content: space-between; align-items: baseline; padding: 10px 4px 0; font-size: 13px; color: var(--muted); }
.colophon { padding-top: 34px; max-width: 520px; }
.zh-line { font: 600 22px/1.5 var(--serif-cn); color: var(--ink); letter-spacing: .04em; }
.colophon p { margin-top: 10px; font-size: 16px; }

/* ---------- 2. the path ---------- */
.journey { position: relative; padding: 70px 0 20px; }
.path { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.path svg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: visible; }

.milestone {
  position: absolute; z-index: 2; display: flex; white-space: nowrap; gap: 10px; align-items: center;
  font: 600 14px/1 var(--serif-cn); color: var(--gold-deep); letter-spacing: .16em;
}
.milestone i { width: 12px; height: 12px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 0 5px rgba(163, 63, 46, .15); }

/* stop 一: pavilion */
.pav { position: relative; z-index: 1; }
.pav-head { display: grid; grid-template-columns: 290px 1fr; gap: 36px; align-items: end; }
.pav-art { position: relative; height: 160px; }
.pav-art img { position: absolute; left: 0; bottom: -6px; width: 140px; }
.pav-art .milestone { left: 150px; top: 118px; }
.pav-head h2 { font: 600 44px/1.1 var(--serif-en); color: var(--ink); }
.pav-head h2 .zh { display: block; font: 600 16px/1 var(--serif-cn); color: var(--primary); letter-spacing: .3em; margin-bottom: 14px; }
.pav-head p { margin-top: 12px; font-size: 16.5px; max-width: 640px; }

.shelf-bar { display: flex; justify-content: space-between; align-items: center; margin-top: 26px; gap: 16px; }
.shelf-count { font-size: 14px; color: var(--muted); }
.shelf-count b { color: var(--sumi); font-weight: 700; }
.shelf-nav { display: flex; gap: 8px; flex: none; }
.shelf-nav button {
  width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border-strong); background: var(--card);
  color: var(--sumi); font: 600 24px/1 var(--serif-en); cursor: pointer; display: grid; place-items: center; padding-bottom: 3px;
}
.shelf-nav button:hover:not(:disabled) { border-color: var(--primary); color: var(--primary-strong); }
.shelf-nav button:disabled { opacity: .35; cursor: default; }
.shelf { margin-top: 12px; position: relative; padding: 0 0 18px; }
.shelf::after { /* the shelf board */
  content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 12px; border-radius: 3px;
  background: linear-gradient(180deg, #8a6a45, #5e4429); box-shadow: 0 8px 16px -6px rgba(45, 30, 10, .45);
}
.shelf-row {
  --fade-l: linear-gradient(90deg, #000 0, #000 calc(100% - 90px), transparent);
  display: flex; gap: 20px; align-items: flex-end; overflow-x: auto; scroll-snap-type: x proximity;
  padding: 14px 40px 8px 4px; scroll-padding-inline: 4px 40px; scrollbar-width: none;
  -webkit-mask-image: var(--fade-l); mask-image: var(--fade-l);
}
.shelf-row.mid { --fade-l: linear-gradient(90deg, transparent, #000 70px, #000 calc(100% - 90px), transparent); }
.shelf-row.end { --fade-l: linear-gradient(90deg, transparent, #000 70px); }
.shelf-row::-webkit-scrollbar { display: none; }

.cover {
  position: relative; flex: 0 0 140px; scroll-snap-align: start;
  border-radius: 4px 8px 8px 4px; aspect-ratio: 3 / 4.15; padding: 18px 14px 16px 24px;
  color: #fbeecf; overflow: hidden; display: flex; flex-direction: column; text-decoration: none;
  background-size: cover; background-position: center 30%;
  box-shadow: 0 10px 22px -10px rgba(45, 30, 10, .6), inset 0 0 0 1px rgba(255, 255, 255, .12);
  transition: transform .2s;
}
.cover:hover { transform: translateY(-6px); }
.cover::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 14px; background: linear-gradient(90deg, rgba(0, 0, 0, .32), rgba(0, 0, 0, .05) 60%, rgba(255, 255, 255, .14)); }
.cover::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(0, 0, 0, .12), transparent 26%, transparent 62%, rgba(0, 0, 0, .22)); }
.stitch { position: absolute; left: 6px; top: 22px; bottom: 22px; width: 2px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; z-index: 2; }
.stitch i { width: 4px; height: 4px; border-radius: 50%; background: rgba(251, 238, 207, .55); box-shadow: 0 0 0 1px rgba(0, 0, 0, .25); }
.frame { position: absolute; inset: 9px 9px 9px 18px; border: 1px solid rgba(251, 238, 207, .3); border-radius: 3px; pointer-events: none; }
.frame::after { content: ""; position: absolute; inset: 3px; border: 1px solid rgba(251, 238, 207, .15); border-radius: 2px; }
.cover .ser { position: relative; z-index: 2; font: 600 10.5px/1.3 var(--ui); letter-spacing: .14em; text-transform: uppercase; text-shadow: 0 1px 3px rgba(0, 0, 0, .55); opacity: .95; }
.seal-chip {
  position: absolute; z-index: 3; top: 14px; right: 13px; width: 22px; height: 22px; display: grid; place-items: center;
  border: 1px solid rgba(251, 238, 207, .75); border-radius: 3px; font: 700 12px/1 var(--serif-cn); color: #fbeecf;
  text-shadow: 0 1px 3px rgba(0, 0, 0, .5);
}
.cover .nm { position: relative; z-index: 2; margin-top: auto; font: 700 18px/1.2 var(--serif-cn); letter-spacing: .06em; text-shadow: 0 2px 8px rgba(0, 0, 0, .5); }
.cover .nm.long { font-size: 14.5px; letter-spacing: .02em; }
.cover .en { position: relative; z-index: 2; margin-top: 4px; font: 600 12px/1.2 var(--serif-en); opacity: .92; text-shadow: 0 1px 4px rgba(0, 0, 0, .5); }
.cover.rd { flex-basis: 118px; }
.cover.rd .nm { font-size: 15px; letter-spacing: .02em; }
.cover.rd .nm.long { font-size: 13.5px; letter-spacing: 0; text-wrap: balance; }
.lvl-tag { position: relative; z-index: 2; align-self: flex-start; font: 700 10.5px/1 var(--ui); background: var(--primary); color: #fbeecf; padding: 3px 5px; border-radius: 2px; }

.group-tag {
  flex: none; align-self: stretch; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 8px;
  padding: 0 4px 4px 18px; margin-left: 4px; border-left: 1px dashed var(--border-strong);
}
.group-tag b { writing-mode: vertical-rl; font: 700 17px/1 var(--serif-cn); color: var(--ink); letter-spacing: .3em; }
.group-tag span { writing-mode: vertical-rl; font: 600 12.5px/1 var(--ui); color: var(--muted); letter-spacing: .08em; }

/* the blank book: an uncovered volume standing at the end of the shelf */
.cover.ask-book {
  border: 0; text-align: left; cursor: pointer; padding: 14px 10px 12px 24px; color: var(--sumi);
  background-color: #f4ecdc; background-size: 260px; background-position: 0 0;
  box-shadow: 0 10px 22px -12px rgba(45, 30, 10, .5), inset 0 0 0 1px rgba(120, 90, 50, .18);
}
.cover.ask-book::before { width: 12px; background: linear-gradient(90deg, rgba(120, 90, 50, .18), rgba(120, 90, 50, .04) 70%, transparent); }
.cover.ask-book::after { display: none; }
.ask-book .stitch i { background: rgba(120, 90, 50, .45); box-shadow: none; }
.ask-book .frame { border: 1px dashed rgba(140, 105, 60, .55); }
.ask-book .frame::after { border: 1px dashed rgba(140, 105, 60, .28); }
.ab-top { position: relative; z-index: 2; display: flex; align-items: flex-start; gap: 8px; margin-top: 2px; }
.ab-slip {
  writing-mode: vertical-rl; white-space: nowrap; font: 700 14px/1 var(--serif-cn); letter-spacing: .14em; color: var(--ink);
  background: #fbf6ea; border: 1px solid rgba(140, 105, 60, .45);
  box-shadow: inset 0 0 0 2px #fbf6ea, inset 0 0 0 3px rgba(140, 105, 60, .22); padding: 8px 5px 6px; border-radius: 1px;
}
.ab-seal {
  margin-top: auto; align-self: flex-end; width: 24px; height: 24px; display: grid; place-items: center; border-radius: 3px;
  background: var(--primary); color: #fbeecf; font: 700 15px/1 var(--serif-cn); box-shadow: inset 0 0 0 1.5px rgba(251, 238, 207, .35); transform: rotate(-4deg);
}
.ab-copy { position: relative; z-index: 2; margin-top: auto; font: 600 14px/1.3 var(--serif-en); color: var(--sumi); }
.ab-link { position: relative; z-index: 2; margin-top: 5px; font: normal 800 11.5px/1.2 var(--ui); color: var(--primary-strong); white-space: nowrap; }
.cover.ask-book:hover { background-color: #f7f0e2; }
.cover.ask-book:hover .ab-link { text-decoration: underline; text-underline-offset: 3px; }

/* start where you are */
.fork { margin-top: 26px; text-align: center; }
.fork h3 { font: 600 34px/1.15 var(--serif-en); color: var(--ink); }
.fork h3 .zh { display: block; font: 600 16px/1 var(--serif-cn); color: var(--primary); letter-spacing: .3em; margin-bottom: 12px; }
.fork-svg { display: block; width: 100%; height: 40px; margin-top: 10px; }
.trails { list-style: none; display: grid; grid-template-columns: repeat(5, 1fr); gap: 22px; text-align: left; }
.trail { position: relative; padding-top: 18px; }
.trail::before { content: ""; position: absolute; left: 0; top: 0; width: 11px; height: 11px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 0 4px rgba(163, 63, 46, .14); }
.trail b { display: block; font: 700 20px/1.2 var(--serif-cn); color: var(--ink); letter-spacing: .04em; }
.trail .who { display: block; font: 600 16.5px/1.3 var(--serif-en); color: var(--sumi); margin-top: 3px; }
.trail .to { display: block; margin-top: 9px; font-size: 14.5px; line-height: 1.5; }
.trail .to::before { content: "→ "; color: var(--primary); font-weight: 700; }
.mix { margin-top: 14px; font-size: 16px; line-height: 1.8; color: var(--sumi); }
.mix .ask { font-size: 15px; color: var(--muted); }

/* flashcards + inside every lesson */
.pav-body {
  margin-top: 34px; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 56px; align-items: center;
  padding: 22px 28px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
}
.sub-h { font: 600 26px/1.15 var(--serif-en); color: var(--ink); }
.sub-h .zh { font: 600 16px var(--serif-cn); color: var(--muted); margin-left: 10px; white-space: nowrap; }
.sub-p { margin-top: 6px; font-size: 15.5px; }
.pb-cards { display: grid; grid-template-columns: 200px auto; gap: 6px 28px; align-items: center; }
.pb-cards .sub-h, .pb-cards .sub-p { grid-column: 1; }
.pb-cards .sub-h .zh { display: block; margin: 6px 0 0; }
.cards { grid-column: 2; grid-row: 1 / span 2; display: flex; gap: 18px; perspective: 1200px; }
.fc { flex: 0 0 132px; width: 132px; aspect-ratio: 3 / 4.1; cursor: pointer; position: relative; background: none; border: 0; padding: 0; text-align: center; }
.fc:nth-child(1) { transform: rotate(-3deg); }
.fc:nth-child(2) { transform: translateY(-10px); }
.fc:nth-child(3) { transform: rotate(3deg); }
.fc-in { position: absolute; inset: 0; transform-style: preserve-3d; transition: transform .5s cubic-bezier(.3, .7, .3, 1); }
.fc.flip .fc-in { transform: rotateY(180deg); }
/* same opacity-swap-at-midpoint trick as FlashCard.vue: backface-visibility alone bleeds through */
.fc-face {
  position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden;
  background: var(--card); border: 1px solid var(--line); border-radius: var(--r-md); box-shadow: var(--sh);
  display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px;
  transition: opacity 0s .22s;
}
.fc-face::before { content: ""; position: absolute; inset: 7px; border: 1px solid var(--line-soft); border-radius: 11px; pointer-events: none; }
.fc-back { transform: rotateY(180deg); opacity: 0; }
.fc.flip .fc-front { opacity: 0; }
.fc.flip .fc-back { opacity: 1; }
.fc-front .hz { font: 700 58px/1 var(--serif-cn); color: var(--ink); }
.fc-front .hz.two { font-size: 42px; }
.fc-front small { position: absolute; bottom: 11px; font-size: 11px; color: var(--muted-soft); }
.fc-back .pos { position: absolute; top: 10px; right: 10px; font: 700 10px/1 var(--ui); color: var(--gold-deep); background: var(--accent-soft); padding: 3px 6px; border-radius: 5px; }
.fc-back .py { font: 700 22px/1.1 var(--ui); }
.fc-back .mean { margin-top: 4px; font-size: 13px; line-height: 1.3; color: var(--sumi); }
.fc-back .eg { margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--line); width: 100%; }
.fc-back .eg b { display: block; font: 600 14px var(--serif-cn); color: var(--ink); }
.fc-back .eg span { display: block; font-size: 11.5px; color: var(--muted); }
.inside { list-style: none; margin-top: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 22px; }
.inside li { display: flex; align-items: baseline; gap: 10px; padding-bottom: 6px; border-bottom: 1px dashed var(--line); font-size: 15px; color: var(--muted); }
.inside li b { font: 700 17px var(--serif-cn); color: var(--ink); min-width: 72px; }
.disclaim { margin-top: 18px; font-size: 12.5px; color: var(--muted); text-align: center; }

/* free tools */
.free-head { text-align: center; margin-top: 48px; position: relative; z-index: 1; }
.zh-k { font: 600 15px/1 var(--serif-cn); color: var(--primary); letter-spacing: .32em; }
.free-head h2 { font: 600 38px/1.1 var(--serif-en); color: var(--ink); margin-top: 12px; }

.stop { position: relative; z-index: 1; display: grid; align-items: center; gap: 40px; margin-top: 20px; }
.stop.l { grid-template-columns: 460px 1fr; }
.stop.r { grid-template-columns: 1fr 460px; }
.stop.r .art { order: 2; }
.art { position: relative; height: 330px; }
.art img { position: absolute; }
.art .desk { right: 40px; top: 0; width: 250px; height: 330px; object-fit: cover; border-radius: 6px; box-shadow: var(--sh-pop); border: 10px solid var(--card); }
.art .cloud { left: 40px; top: 170px; width: 200px; opacity: .9; }
.art .cranes { left: 30px; top: -10px; width: 300px; }
.tool { min-width: 0; }
.tool h3 { display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap; }
.tool h3 .zh { font: 700 34px/1 var(--serif-cn); color: var(--ink); letter-spacing: .04em; }
.tool h3 .en { font: 600 32px/1 var(--serif-en); color: var(--sumi); }
.facts { margin-top: 12px; font: 700 13.5px/1.4 var(--ui); color: var(--gold-deep); letter-spacing: .06em; text-transform: uppercase; }
.tool > p { margin-top: 12px; font-size: 16.5px; max-width: 560px; }
.tool > p b { color: var(--ink); }
/* stop 五: a short handscroll (two rods, the poem in columns right to left) + a tap-to-hear 静夜思 */
.art-po { display: flex; align-items: center; justify-content: center; }
.hs { margin: 0; height: 290px; transform: rotate(-2deg); }
.hs > * { height: 100%; }
.hs-paper { position: relative; display: flex; flex-direction: row-reverse; gap: 14px; height: 100%; padding: 20px 26px 20px 52px; }
.hs-col { writing-mode: vertical-rl; font: 600 26px/1 var(--serif-cn); letter-spacing: 8px; color: var(--ink); }
.hs-title { writing-mode: vertical-rl; align-self: flex-end; font: 400 13px/1 var(--serif-cn); letter-spacing: 4px; color: var(--muted); margin-right: 6px; }
.hs-seal { position: absolute; left: 12px; top: 14px; width: 30px; height: 30px; display: grid; place-items: center; border-radius: 4px; background: linear-gradient(145deg, var(--cinnabar), var(--cinnabar-dk)); color: #fbeecf; font: 700 17px/1 var(--serif-cn); transform: rotate(-6deg); }
.po-top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
.po-t { font: 700 20px/1.2 var(--serif-cn); color: var(--ink); }
.po-t small { font: 600 13px var(--ui); color: var(--muted); margin-left: 10px; }
.po-tg { display: flex; gap: 6px; }
.po-tg button { font: 600 12.5px var(--ui); color: var(--muted); border: 1px solid var(--line); border-radius: var(--r-pill); padding: 3px 10px; background: transparent; cursor: pointer; }
.po-tg button.on { color: var(--primary-strong); border-color: var(--primary); background: var(--primary-soft); }
.po-line { display: flex; flex-direction: column; align-items: flex-start; width: 100%; text-align: left; padding: 6px 8px; margin: 0 -8px; border: 0; border-radius: 8px; background: transparent; cursor: pointer; }
.po-line:hover, .po-line.on { background: var(--soft); }
.po-py { font: 600 13px var(--ui); color: var(--gold-deep); letter-spacing: .02em; }
.po-zh { font: 600 21px/1.4 var(--serif-cn); color: var(--ink); letter-spacing: .08em; }
.po-zh .ting { font-style: normal; font-size: 11px; color: var(--primary); margin-left: 8px; opacity: 0; transition: opacity .2s; }
.po-line:hover .ting, .po-line.on .ting { opacity: 1; }
.po-en { font: 400 14.5px/1.45 var(--ui); color: var(--body); }
.po-img { margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--line); font-size: 14px; color: var(--body); }
.po-img b { display: inline-grid; place-items: center; width: 24px; height: 24px; margin-right: 6px; border-radius: 4px; background: var(--primary); color: #fbeecf; font: 700 14px/1 var(--serif-cn); }
.po-all { margin-left: 22px; }

.slip { margin-top: 16px; background: var(--card); border: 1px solid var(--line); border-radius: var(--r-md); padding: 16px 20px; box-shadow: var(--sh); max-width: 600px; position: relative; }
.go { margin-top: 20px; display: inline-block; }

/* grammar preview */
.search { display: flex; align-items: center; gap: 10px; border: 1px solid var(--border-strong); border-radius: var(--r-pill); padding: 10px 16px; background: #fdfaf3; margin-top: 10px; }
.search svg { width: 18px; height: 18px; flex: none; }
.search .q { font: 600 18px/1.2 var(--serif-cn); color: var(--ink); }
.caret { width: 1.5px; height: 20px; background: var(--primary); animation: blink 1.1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.try { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; font-size: 12.5px; color: var(--muted); }
.try button { font: 600 13px/1 var(--ui); color: var(--body); background: transparent; border: 1px solid var(--line); border-radius: var(--r-pill); padding: 6px 11px; cursor: pointer; }
.try button.on { border-color: var(--primary); color: var(--primary-strong); background: var(--primary-soft); }
.gp { margin-top: 14px; padding-top: 14px; border-top: 1px dashed var(--line); min-height: 150px; }
.gp-top { display: flex; align-items: baseline; gap: 6px 12px; flex-wrap: wrap; }
.gp-name { font: 700 20px/1.3 var(--serif-cn); color: var(--ink); }
.gp-py { font: 600 15px var(--ui); color: var(--tone4); }
.gp-tag { margin-left: auto; font: 700 11.5px/1 var(--ui); letter-spacing: .08em; color: var(--gold-deep); border: 1px solid var(--border-strong); padding: 5px 8px; border-radius: 6px; white-space: nowrap; }
.gp-en { font-size: 15px; color: var(--sumi); margin-top: 4px; }
.gp-struct { margin-top: 8px; font: 600 15px/1.5 var(--serif-cn); color: var(--ink); background: var(--soft); display: inline-block; padding: 5px 12px; border-radius: 8px; }
.gp-struct :deep(em) { font-style: normal; color: var(--primary-strong); }
.gp-eg { margin-top: 10px; font-size: 14.5px; line-height: 1.55; }
.gp-eg .zh { font-size: 17px; color: var(--ink); }
.gp-eg .p { color: var(--tone3); font-weight: 600; }
.gp-eg .e { color: var(--muted); }
.gp :deep(mark) { background: rgba(169, 121, 26, .22); color: inherit; border-radius: 3px; padding: 0 1px; }

/* song preview — a 青花 (blue-and-white) piece: fret-pattern bands, a porcelain title tile, word slips */
.song-slip {
  --qh: #2c5577; /* 青花 cobalt, the song's own colour — used only inside this card */
  overflow: hidden; padding-top: 26px; padding-bottom: 26px;
}
.song-slip::before, .song-slip::after {
  content: ""; position: absolute; left: 0; right: 0; height: 10px; opacity: .55;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='10' viewBox='0 0 20 10'%3E%3Cpath d='M0 9.5h4V1.5h8v6H8V4.5' fill='none' stroke='%232c5577' stroke-width='1.2'/%3E%3Cpath d='M12 9.5h8' stroke='%232c5577' stroke-width='1.2'/%3E%3C/svg%3E") repeat-x left center / 20px 10px;
}
.song-slip::before { top: 8px; }
.song-slip::after { bottom: 8px; transform: scaleY(-1); }
.song-wm {
  position: absolute; right: 18px; top: 18px; font: 400 92px/1 var(--brush); color: var(--qh); opacity: .07; pointer-events: none;
}
.song { display: grid; grid-template-columns: 92px 1fr; gap: 20px; align-items: center; position: relative; }
.tile {
  height: 128px; border-radius: 6px; position: relative; display: flex; justify-content: center; align-items: center; text-decoration: none;
  background: radial-gradient(ellipse at 30% 20%, #fbfcfb 0%, #eef2f1 55%, #dfe7e8 100%);
  border: 1px solid #b9c7cf; box-shadow: inset 0 0 0 4px #f6f8f7, inset 0 0 0 5px rgba(44, 85, 119, .55), 0 3px 10px rgba(44, 85, 119, .14);
  transition: transform .2s, box-shadow .2s;
}
.tile::before, .tile::after { /* 缠枝 corner flourishes — quarter rings, top-left + top-right */
  content: ""; position: absolute; width: 16px; height: 16px; border: 1.5px solid rgba(44, 85, 119, .5); border-radius: 50%;
}
.tile::before { top: 9px; left: 9px; border-right-color: transparent; border-bottom-color: transparent; }
.tile::after { top: 9px; right: 9px; border-left-color: transparent; border-bottom-color: transparent; }
.tile:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 4px #f6f8f7, inset 0 0 0 5px rgba(44, 85, 119, .7), 0 6px 16px rgba(44, 85, 119, .2); }
.tile-t { writing-mode: vertical-rl; font: 700 27px/1 var(--serif-cn); color: var(--qh); letter-spacing: .2em; }
.tile i { position: absolute; right: 7px; bottom: 7px; width: 22px; height: 22px; border-radius: 4px; background: var(--primary); display: grid; place-items: center; box-shadow: 0 1px 3px rgba(122, 43, 33, .35); }
.tile i svg { width: 10px; height: 10px; margin-left: 2px; }
.song-t { font: 700 22px/1.2 var(--serif-cn); color: var(--ink); }
.song-t small { font: 600 15px var(--ui); color: var(--muted); margin-left: 8px; }
.song-en { font-size: 15px; color: var(--sumi); }
.song-by { font-size: 13.5px; color: var(--muted); margin-top: 2px; }
.lyric { margin: 10px 0 0; padding-top: 9px; border-top: 1px dashed rgba(44, 85, 119, .3); }
.lyric blockquote { margin: 0; font: 400 22px/1.3 var(--brush); color: var(--qh); }
.lyric figcaption { margin-top: 3px; font: 500 14.5px/1.4 var(--serif-en); color: var(--muted); }
.chips { display: flex; gap: 8px; flex-wrap: nowrap; margin-top: 16px; position: relative; }
.chip {
  cursor: pointer; text-align: left; position: relative; color: var(--ink);
  background: #fdfaf2; border: 1px solid var(--line); border-radius: 4px; padding: 8px 12px;
  box-shadow: inset 0 0 0 3px #fdfaf2, inset 0 0 0 4px var(--line-soft);
  transition: border-color .15s, background .15s, box-shadow .15s;
}
.chip b { display: flex; align-items: center; gap: 7px; font: 700 17px/1.2 var(--serif-cn); }
.chip span { display: block; font-size: 12px; color: var(--muted); white-space: nowrap; }
.chip span em { font-style: normal; color: var(--tone3); font-weight: 700; margin-right: 4px; }
.chip .ting {
  width: 16px; height: 16px; border-radius: 3px; display: grid; place-items: center; margin-left: auto;
  font: 700 10.5px/1 var(--serif-cn); font-style: normal; color: #fbeee0; background: var(--primary); opacity: .82;
}
.chip:hover, .chip.on { border-color: var(--primary); background: var(--primary-soft); box-shadow: inset 0 0 0 3px var(--primary-soft), inset 0 0 0 4px rgba(163, 63, 46, .3); }
.chip.on .ting { opacity: 1; }

/* pinyin sheet */
.art-py { display: flex; align-items: center; justify-content: center; }
.py-sheet {
  position: relative; background: var(--card); border: 1px solid var(--line); border-radius: 6px; box-shadow: var(--sh-pop);
  padding: 26px 26px 18px; width: 460px; max-width: 100%; transform: rotate(-.8deg);
  display: grid; grid-template-columns: 130px 1fr; gap: 22px; align-items: center;
}
.py-sheet::before { content: ""; position: absolute; inset: 8px; border: 1px solid rgba(179, 165, 130, .5); border-radius: 3px; pointer-events: none; }
.tzg {
  position: relative; width: 130px; height: 130px; border: 1.5px solid rgba(163, 63, 46, .55); display: grid; place-items: center;
  background:
    linear-gradient(rgba(163, 63, 46, .28), rgba(163, 63, 46, .28)) center / 100% 1px no-repeat,
    linear-gradient(rgba(163, 63, 46, .28), rgba(163, 63, 46, .28)) center / 1px 100% no-repeat,
    linear-gradient(45deg, transparent calc(50% - .5px), rgba(163, 63, 46, .16) 50%, transparent calc(50% + .5px)),
    linear-gradient(-45deg, transparent calc(50% - .5px), rgba(163, 63, 46, .16) 50%, transparent calc(50% + .5px)),
    #fdfaf2;
}
.tzg-hz { font: 700 96px/1 var(--serif-cn); color: var(--ink); }
.staff-wrap { min-width: 0; }
.staff { width: 100%; height: auto; display: block; cursor: pointer; }
.cont { stroke-width: 7; opacity: .3; transition: opacity .2s, stroke-width .2s; }
.cont.on { opacity: 1; stroke-width: 9; }
.staff:hover .cont:not(.on) { opacity: .45; }
.hit { cursor: pointer; }
.py-labels { display: grid; grid-template-columns: 76fr 74fr 82fr 72fr; margin-left: 3%; margin-top: 4px; }
.py-labels button { font: 800 19px/1 var(--ui); text-align: center; background: none; border: 0; padding: 0; cursor: pointer; opacity: .45; transition: opacity .2s; }
.py-labels .t1 { color: var(--tone1); } .py-labels .t2 { color: var(--tone2); }
.py-labels .t3 { color: var(--tone3); } .py-labels .t4 { color: var(--tone4); }
.py-labels button.on { opacity: 1; }
.py-cap { grid-column: 1 / -1; border-top: 1px dashed var(--line); padding-top: 12px; font-size: 15px; color: var(--sumi); text-align: center; }
.py-cap b { font: 800 17px var(--ui); margin-right: 4px; }

/* ---------- 3. teacher ---------- */
.teacher { position: relative; margin-top: 56px; }
.teacher-grid { display: grid; grid-template-columns: 40% 60%; min-height: 520px; }
.bamboo {
  position: relative; background-position: center 60%; background-size: cover; background-repeat: no-repeat;
  border-radius: 0 var(--r-lg) var(--r-lg) 0;
}
.bamboo::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(90deg, rgba(26, 18, 8, 0) 55%, rgba(26, 18, 8, .18)); }
.poem {
  position: absolute; left: 44px; top: 46px; z-index: 2; writing-mode: vertical-rl;
  font: 600 20px/1.9 var(--serif-cn); letter-spacing: .3em; color: #f5efe6; text-shadow: 0 1px 10px rgba(26, 18, 8, .55);
}
.portrait {
  position: absolute; z-index: 3; right: -110px; top: 70px; width: 300px;
  background: var(--card); padding: 12px; border: 1px solid var(--line); border-radius: 6px; box-shadow: var(--sh-pop); transform: rotate(-1.2deg);
}
.portrait img { width: 100%; aspect-ratio: 3 / 4; object-fit: cover; border-radius: 3px; }
.ph-box {
  aspect-ratio: 3 / 4; border: 1px dashed var(--border-strong); border-radius: 3px; display: grid; place-items: center; text-align: center; padding: 20px;
  background: repeating-linear-gradient(135deg, rgba(138, 124, 92, .07) 0 10px, rgba(138, 124, 92, 0) 10px 20px), var(--soft);
}
.ph-box b { display: block; font: 700 15px var(--ui); color: var(--sumi); }
.ph-box small { display: block; font: 500 13px var(--serif-cn); color: var(--muted); margin-top: 4px; }
.t-body { padding: 36px 48px 30px 170px; min-width: 0; }
.t-kicker { font: 600 15px/1 var(--serif-cn); color: var(--primary); letter-spacing: .3em; }
.t-name { margin-top: 16px; font: 600 46px/1.1 var(--serif-en); color: var(--ink); }
.t-name .zh { font: 700 36px var(--serif-cn); margin-left: 6px; white-space: nowrap; }
.t-name .ph { background: rgba(169, 121, 26, .14); border-radius: 6px; padding: 0 8px; }
.t-role { margin-top: 8px; font-size: 16px; color: var(--muted); }
.sample { margin-top: 18px; padding-left: 22px; border-left: 1px solid var(--border-strong); }
.sample p { font-size: 16px; line-height: 1.7; color: var(--sumi); }
.sample p + p { margin-top: 12px; }
.sample .tag { display: inline-block; margin-bottom: 10px; font: 700 11.5px/1 var(--ui); letter-spacing: .1em; text-transform: uppercase; color: var(--gold-deep); background: var(--accent-soft); padding: 5px 8px; border-radius: 5px; }
.traits { margin-top: 16px; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.traits .lab { font-size: 13px; color: var(--muted); margin-right: 2px; }
.trait { font: 700 12.5px/1 var(--ui); color: var(--primary-strong); background: var(--primary-soft); border: 1px solid rgba(163,63,46,.18); padding: 6px 10px; border-radius: var(--r-pill); }
.quotes { margin-top: 20px; }
.quotes-h { font: 600 19px/1.2 var(--serif-en); color: var(--ink); }
.quotes-h .zh { font: 600 12.5px var(--han); color: var(--muted); margin-left: 8px; letter-spacing: .06em; }
.quotes { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px 16px; }
.quotes-h { grid-column: 1 / -1; }
.quote { margin: 0; padding: 12px 14px; background: var(--card); border: 1px solid var(--line-soft); border-radius: 10px; }
.quote blockquote { margin: 0; font: 500 16.5px/1.45 var(--serif-en); color: var(--sumi); }
.quote figcaption { margin-top: 6px; font-size: 12.5px; font-weight: 700; color: var(--gold-deep); }
.gate .proof { display: block; margin-top: 4px; font-size: 13.5px; font-weight: 700; color: var(--gold-deep); }
@media (max-width: 980px) { .quotes { grid-template-columns: 1fr; } }
.stats { margin-top: 16px; display: flex; align-items: stretch; flex-wrap: wrap; }
.stat { padding: 0 26px; border-left: 1px solid var(--line); }
.stat:first-child { padding-left: 0; border-left: 0; }
.stat b { display: block; font: 600 30px/1 var(--serif-en); color: var(--ink); }
.stat span { display: block; margin-top: 6px; font-size: 13.5px; color: var(--muted); }
.stats-src { margin-top: 12px; font-size: 12.5px; color: var(--muted-soft); }

/* the two gates */
.gates { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 30px; }
.gate {
  position: relative; background: var(--card); border: 1px solid var(--line); border-radius: var(--r-lg) var(--r-lg) var(--r-md) var(--r-md);
  padding: 34px 22px 22px; box-shadow: var(--sh); overflow: hidden;
}
.gate::before { /* lintel: double gold rule */
  content: ""; position: absolute; left: 0; right: 0; top: 0; height: 14px;
  border-bottom: 1px solid var(--gold-lt); background: linear-gradient(180deg, var(--strong), var(--soft));
}
.gate::after { content: ""; position: absolute; left: 0; right: 0; top: 18px; border-top: 1px solid rgba(179, 165, 130, .6); }
.gate-mark { position: absolute; right: 16px; top: 28px; font: 400 60px/1 var(--brush); color: rgba(163, 63, 46, .12); pointer-events: none; }
.gate h3 { font: 600 25px/1.1 var(--serif-en); color: var(--ink); }
.gate h3 .zh { display: block; font: 600 13.5px/1 var(--serif-cn); color: var(--primary); letter-spacing: .16em; margin-bottom: 8px; }
.gate p { margin-top: 8px; font-size: 15px; max-width: 420px; }
.gate ul { list-style: none; margin-top: 10px; display: grid; gap: 4px; }
.gate li { display: flex; gap: 12px; font-size: 14px; color: var(--sumi); align-items: baseline; }
.gate li b { width: 78px; flex: none; font-weight: 700; }
.c-off { color: var(--muted); }
.c-hint { margin: 0 0 14px; font-size: 13px; line-height: 1.5; color: var(--jade); }
.c-btn { font: 700 13.5px/1 var(--ui); color: var(--primary-strong); background: var(--primary-soft); border: 1px solid rgba(122, 43, 33, .25); border-radius: var(--r-pill); padding: 5px 11px; cursor: pointer; }
.c-btn:hover { border-color: var(--primary-strong); }
.gate .btn { margin-top: 18px; padding: 13px 18px; font-size: 15px; }
.url { display: block; margin-top: 12px; font-size: 12.5px; color: var(--muted); }

/* ---------- 4. students + footer ---------- */
.students { margin-top: 40px; }
.students-line {
  display: flex; justify-content: center; align-items: baseline; gap: 18px; flex-wrap: wrap;
  border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 20px;
}
.students-line h3 { font: 600 26px/1.2 var(--serif-en); color: var(--ink); }
.students-line h3 .zh { font: 600 16px var(--serif-cn); color: var(--muted); margin-left: 8px; }
.students-line .link { font-size: 16px; }
.foot { padding: 20px 40px 26px; text-align: center; font-size: 13px; color: var(--muted); }
.foot a { color: var(--muted); text-decoration: underline; }

/* ---------- responsive ---------- */
@media (max-width: 1180px) {
  .hero-inner { margin-left: calc(50% - 300px); }
  .below .wrap { grid-template-columns: 1fr 480px; }
  .t-body { padding-left: 160px; }
}
@media (max-width: 980px) {
  .band::before { background: linear-gradient(180deg, rgba(245, 239, 230, .8), rgba(245, 239, 230, .55) 70%, rgba(245, 239, 230, .75)); }
  .hero-inner { margin-left: auto; margin-right: auto; padding-left: 24px; padding-right: 24px; }
  .below .wrap { grid-template-columns: 1fr; gap: 0; }
  .leaf { margin-top: -90px; order: -1; }
  .colophon { padding-top: 30px; }
  .path, .milestone { display: none; }

  .pav-head { grid-template-columns: 1fr; gap: 0; }
  .pav-art { height: 150px; display: flex; justify-content: center; }
  .pav-art img { position: static; width: 130px; }

  .trails { grid-template-columns: 1fr; gap: 0; margin-top: 22px; margin-left: 6px; border-left: 1px dashed var(--gold-lt); }
  .fork-svg { display: none; }
  .trail { padding: 0 0 22px 24px; }
  .trail::before { left: -6px; top: 6px; }
  .trail .to { margin-top: 4px; }

  .pav-body { grid-template-columns: 1fr; padding: 22px 0; gap: 28px; }
  .pb-cards { grid-template-columns: 1fr; }
  .cards { grid-column: 1; grid-row: auto; margin-top: 12px; }

  .stop.l, .stop.r { grid-template-columns: 1fr; }
  .stop.r .art { order: 0; }
  .art { height: auto; display: flex; justify-content: center; }
  .art img { position: static; }
  .art .cloud { display: none; }
  .art .cranes { width: auto; height: 200px; }
  .art .desk { width: 100%; max-width: 520px; height: 220px; object-position: center 40%; }
  .art-py { padding: 20px 0; }

  .teacher-grid { grid-template-columns: 1fr; }
  .bamboo { min-height: 440px; border-radius: 0; }
  .portrait { right: 24px; top: auto; bottom: -120px; width: 200px; }
  .t-body { padding: 150px 24px 20px; }
  .gates { grid-template-columns: 1fr; }
}
@media (max-width: 620px) {
  .wrap { padding: 0 20px; }
  .band { min-height: 0; background-position: 22% 0; padding-bottom: 120px; }
  .band::after { inset: 8px; }
  .topbar { padding: 20px 18px 0; }
  .logo-t small { display: none; }
  .signin { padding: 9px 13px; }
  .hero-inner { padding-top: 30px; gap: 14px; }
  .vert { font-size: 64px; }
  .mini-seal { display: none; }
  .anno h1 { font-size: 34px; }
  .sub { font-size: 16px; margin-top: 14px; }
  .hero-cta { gap: 16px; }
  .hero-cta .btn .zh { display: none; }

  .journey { padding-top: 50px; }
  .pav-head h2 { font-size: 32px; }
  .pav-art { height: auto; padding-bottom: 10px; }
  .pav-art img { width: 96px; }
  .shelf-bar { align-items: flex-end; }
  .shelf { padding-bottom: 0; }
  .shelf::after { display: none; }
  .shelf-row { padding-right: 30px; }
  .cards { overflow-x: auto; scroll-snap-type: x mandatory; padding: 14px 20px 10px; margin: 12px -20px 0; }
  .fc { scroll-snap-align: center; }
  .inside { grid-template-columns: 1fr; }
  .free-head h2 { font-size: 30px; }

  .stop { gap: 10px; margin-top: 40px; }
  .tool h3 .zh { font-size: 28px; }
  .tool h3 .en { font-size: 26px; }
  .slip { padding: 16px; }
  .gp-tag { margin-left: 0; }
  .song { grid-template-columns: 72px 1fr; gap: 14px; align-items: start; }
  .tile { height: 104px; }
  .tile-t { font-size: 21px; }
  .lyric blockquote { font-size: 19px; }
  .chip { flex: 1 1 100%; }
  /* three stats always on one row: equal columns, smaller numbers */
  .stats { display: grid; grid-template-columns: repeat(3, auto); justify-content: start; }
  .stat { padding: 0 14px; }
  .stat b { font-size: 25px; }
  .stat span { font-size: 12px; line-height: 1.35; }
  .poster-btn.photo { padding: 0 0 14px 16px; }
  .poster-btn.photo .play { width: 46px; height: 46px; margin-bottom: 6px; }
  .poster-btn.photo .play svg { width: 20px; height: 20px; }
  .chips { flex-wrap: wrap; }
  .py-sheet { grid-template-columns: 92px 1fr; gap: 12px; padding: 20px 16px 14px; width: 100%; }
  .tzg { width: 92px; height: 92px; }
  .tzg-hz { font-size: 66px; }
  .py-labels button { font-size: 15px; }
  .py-cap { font-size: 14px; }

  .bamboo { min-height: 380px; }
  .t-name { font-size: 36px; }
  .t-name .zh { font-size: 28px; }
  .stat { padding: 0 16px; }
  .gate { padding: 40px 22px 26px; }
  .students-line h3 .zh { display: block; margin: 4px 0 0; text-align: center; }
}
</style>
