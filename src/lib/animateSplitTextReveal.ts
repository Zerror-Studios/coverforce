import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SplitText } from "@/lib/SplitText";

gsap.registerPlugin(ScrollTrigger);

const WAVE_TOTAL = 14;
const WAVE_SETTLE = 4.5;
const WAVE_PEAK = 4.2;
const WAVE_SPREAD = 4.6;

export type SplitTextColorTheme = "light" | "dark";

export const SPLIT_TEXT_WAVE_COLOR = "#151f4d";
export const SPLIT_TEXT_FILL_COLOR = "#3D3D3D";

export const COLOR_THEMES: Record<
    SplitTextColorTheme,
    { idle: string; active: string; done: string }
> = {
    light: {
        idle: "#BCC5D6",
        active: SPLIT_TEXT_WAVE_COLOR,
        done: SPLIT_TEXT_FILL_COLOR,
    },
    dark: {
        idle: "#9AA8BC",
        active: "#E8EEF6",
        done: "#FFFFFF",
    },
};

export type SplitTextRevealOptions = {
    trigger?: HTMLElement;
    start?: string;
    end?: string;
    theme?: SplitTextColorTheme;
    colors?: { idle: string; active: string; done: string };
    splitSelf?: boolean;
    scrub?: boolean;
    sequentialTargets?: boolean;
    charsClass?: string;
    wordsClass?: string;
};

export type SplitTextWaveTimelineOptions = {
    theme?: SplitTextColorTheme;
    colors?: { idle: string; active: string; done: string };
    duration?: number;
    delay?: number;
    charsClass?: string;
    wordsClass?: string;
};

export function applyWaveToChars(
    chars: HTMLSpanElement[],
    progress: number,
    colors: { idle: string; active: string; done: string },
) {
    const waveSpan = chars.length + WAVE_TOTAL + WAVE_SETTLE;
    const head = smootherstep(progress) * waveSpan;

    chars.forEach((char, index) => {
        char.style.color = waveColor(head - index, colors);
    });
}

export function animateSplitTextWaveTimeline(
    root: HTMLElement,
    options: SplitTextWaveTimelineOptions = {},
): () => void {
    const {
        theme = "light",
        colors = COLOR_THEMES[theme],
        duration = 1.85,
        delay = 0,
        charsClass = "split-reveal-char",
        wordsClass = "split-reveal-word",
    } = options;

    const split = new SplitText(root, { type: "chars", charsClass, wordsClass });
    const { chars } = split;

    if (!chars.length) {
        split.revert();
        return () => {};
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(chars, { color: colors.done, opacity: 1 });
        return () => split.revert();
    }

    gsap.set(chars, { color: colors.idle, opacity: 1 });

    const progress = { value: 0 };
    const tween = gsap.to(progress, {
        value: 1,
        duration,
        delay,
        ease: "none",
        onUpdate: () => applyWaveToChars(chars, progress.value, colors),
        onComplete: () => applyWaveToChars(chars, 1, colors),
    });

    return () => {
        tween.kill();
        split.revert();
    };
}

function normalizeSplitLayout(chars: HTMLSpanElement[], words: HTMLSpanElement[]) {
    chars.forEach((char) => {
        char.style.display = "inline";
    });
    words.forEach((word) => {
        word.style.display = "inline";
        word.style.whiteSpace = "normal";
    });
}

/** Wave fill per word - keeps spaces between mask wrappers untouched */
export function animateLoaderWordsWave(
    line: HTMLElement,
    options: SplitTextWaveTimelineOptions = {},
): () => void {
    const {
        theme = "light",
        colors = COLOR_THEMES[theme],
        duration = 1.85,
        delay = 0,
        charsClass = "loader-wave-char",
        wordsClass = "loader-wave-word",
    } = options;

    const wordEls = Array.from(
        line.querySelectorAll<HTMLElement>("[data-loader-word-inner]"),
    );
    if (!wordEls.length) return () => {};

    const splits: SplitText[] = [];
    const chars: HTMLSpanElement[] = [];

    wordEls.forEach((wordEl) => {
        const split = new SplitText(wordEl, { type: "chars", charsClass, wordsClass });
        splits.push(split);
        normalizeSplitLayout(split.chars, split.words);
        chars.push(...split.chars);
    });

    if (!chars.length) {
        splits.forEach((split) => split.revert());
        return () => {};
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(chars, { color: colors.done, opacity: 1 });
        return () => splits.forEach((split) => split.revert());
    }

    gsap.set(chars, { color: colors.idle, opacity: 1 });

    const progress = { value: 0 };
    const tween = gsap.to(progress, {
        value: 1,
        duration,
        delay,
        ease: "none",
        onUpdate: () => applyWaveToChars(chars, progress.value, colors),
        onComplete: () => applyWaveToChars(chars, 1, colors),
    });

    return () => {
        tween.kill();
        splits.forEach((split) => split.revert());
    };
}

function smootherstep(t: number): number {
    const x = Math.max(0, Math.min(1, t));
    return x * x * x * (x * (x * 6 - 15) + 10);
}

function waveColor(
    dist: number,
    colors: { idle: string; active: string; done: string },
): string {
    if (dist <= 0) return colors.idle;

    const waveEnd = WAVE_TOTAL + WAVE_SETTLE;
    if (dist >= waveEnd) return colors.done;

    const bell = Math.exp(-0.5 * Math.pow((dist - WAVE_PEAK) / WAVE_SPREAD, 2));
    const lit = gsap.utils.interpolate(colors.idle, colors.active, bell) as string;

    const doneMix = smootherstep(Math.max(0, (dist - WAVE_TOTAL) / WAVE_SETTLE));
    if (doneMix <= 0) return lit;

    return gsap.utils.interpolate(lit, colors.done, doneMix) as string;
}

export function animateSplitTextReveal(
    root: HTMLElement,
    options: SplitTextRevealOptions = {},
): () => void {
    const {
        trigger = root,
        start = "top bottom",
        end = "top 40%",
        theme = "light",
        colors = COLOR_THEMES[theme],
        splitSelf = false,
        scrub = false,
        sequentialTargets = false,
        charsClass = "split-reveal-char",
        wordsClass = "split-reveal-word",
    } = options;

    const targets = splitSelf
        ? [root]
        : Array.from(root.querySelectorAll<HTMLElement>("[data-split]"));

    if (!targets.length) return () => {};

    const splits: SplitText[] = [];
    const chars: HTMLSpanElement[] = [];
    const charGroups: HTMLSpanElement[][] = [];

    targets.forEach((el) => {
        const split = new SplitText(el, { type: "chars", charsClass, wordsClass });
        splits.push(split);
        charGroups.push(split.chars);
        chars.push(...split.chars);
    });

    if (!chars.length) return () => {};

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(chars, { color: colors.done, opacity: 1 });
        return () => splits.forEach((split) => split.revert());
    }

    gsap.set(chars, { color: colors.idle, opacity: 1 });

    const waveSpan = chars.length + WAVE_TOTAL + WAVE_SETTLE;

    const updateWave = (progress: number) => {
        if (sequentialTargets && charGroups.length > 1) {
            const groupedProgress = progress * charGroups.length;
            charGroups.forEach((group, index) => {
                applyWaveToChars(
                    group,
                    gsap.utils.clamp(0, 1, groupedProgress - index),
                    colors,
                );
            });
            return;
        }

        const head = progress * waveSpan;

        chars.forEach((char, index) => {
            char.style.color = waveColor(head - index, colors);
        });
    };

    let maxProgress = 0;
    let completed = false;
    let st: ScrollTrigger | null = null;

    const finish = () => {
        if (completed) return;
        completed = true;
        updateWave(1);
        st?.kill();
    };

    st = ScrollTrigger.create({
        trigger,
        start,
        end,
        onUpdate: (self) => {
            if (scrub) {
                updateWave(smootherstep(self.progress));
                return;
            }

            if (completed) return;

            maxProgress = Math.max(maxProgress, self.progress);
            updateWave(smootherstep(maxProgress));

            if (maxProgress >= 1) finish();
        },
    });

    if (scrub) {
        updateWave(smootherstep(st.progress));
    } else if (st.progress >= 1) {
        finish();
    } else {
        updateWave(smootherstep(maxProgress));
    }

    const lenis = window.lenis;
    const onLenisScroll = () => ScrollTrigger.update();
    lenis?.on("scroll", onLenisScroll);

    return () => {
        lenis?.off("scroll", onLenisScroll);
        st.kill();
        splits.forEach((split) => split.revert());
    };
}
