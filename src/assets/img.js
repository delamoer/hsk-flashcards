// Central image registry — import once here so Vite hashes + base-rewrites every URL
// (required for GitHub Pages sub-path hosting; do NOT reference public/ with absolute
// /img/... paths). Source images live in assets/ (gitignored, descriptively named) and
// are optimized into src/assets/img/ by scripts/optimize_assets.py. Re-run that script
// after adding art, then wire new outputs here.

import heroMain from "./img/hero/hero-main.webp";
import bandHsk from "./img/hero/band-hsk.webp";
import bandNewhsk3 from "./img/hero/band-newhsk3.webp";
import bandHuihua360 from "./img/hero/band-huihua360.webp";
import bandSurvival from "./img/hero/band-survival.webp";

import coverHsk from "./img/books/cover-hsk.webp";
import coverNewhsk3 from "./img/books/cover-newhsk3.webp";
import coverHuihua360 from "./img/books/cover-huihua360.webp";
import coverSurvival from "./img/books/cover-survival.webp";

import photoBamboo from "./img/photos/bamboo.webp";
import photoPlumDesk from "./img/photos/plum-desk.webp";
import photoDesk from "./img/photos/desk.webp";

import motifPlum from "./img/motif/plum-branch.webp";
import motifPlum2 from "./img/motif/plum-branch-2.webp";
import motifCranes from "./img/motif/cranes-fly.webp";
import motifSwallows from "./img/motif/swallows.webp";
import motifPavilion from "./img/motif/pavilion.webp";
import motifSeals from "./img/motif/seals.webp";
import motifPine from "./img/motif/pine.webp";
import motifBamboo from "./img/motif/bamboo.webp";
import motifMountainFar from "./img/motif/mountain-far.webp";
import motifCloud from "./img/motif/cloud.webp";
import motifBoat from "./img/motif/boat.webp";
import motifRock from "./img/motif/rock.webp";

import wmBooks from "./img/watermark/wm-books.webp";
import wmPinyin from "./img/watermark/wm-pinyin.webp";
import wmWords from "./img/watermark/wm-words.webp";

export {
  heroMain,
  photoBamboo, photoPlumDesk, photoDesk,
  motifPlum, motifPlum2, motifCranes, motifSwallows, motifPavilion, motifSeals,
  motifPine, motifBamboo, motifMountainFar, motifCloud, motifBoat, motifRock,
};

// per-series 山水横幅 (inner-page hero backgrounds)
export const seriesBand = {
  hsk: bandHsk,
  newhsk3: bandNewhsk3,
  huihua360: bandHuihua360,
  survival: bandSurvival,
};

// per-series 书封 (home 教材 section covers)
export const bookCover = {
  hsk: coverHsk,
  newhsk3: coverNewhsk3,
  huihua360: coverHuihua360,
  survival: coverSurvival,
};

// 仙鹤立轴 —— 板块隐约水印
export const watermark = {
  books: wmBooks,
  pinyin: wmPinyin,
  words: wmWords,
};

// 非课程页统一的山水横幅 hero 底（图 + 纸色 scrim，保证文字可读）。
// 用法：<header class="hero" :style="pageHeroBg()">，配合 hero 盒样式（圆角/描边/内边距）。
export function pageHeroBg(img = heroMain) {
  return {
    backgroundImage: `linear-gradient(180deg, rgba(250,244,233,.80), rgba(241,231,212,.93)), url(${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center 38%",
    backgroundRepeat: "no-repeat",
  };
}
