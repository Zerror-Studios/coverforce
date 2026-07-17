export type CardBackground =
  | "accent"
  | "light"
  | "developer"
  | "wholesaler"
  | "broker"
  | "startup"
  | "carrier";

export type SolutionTheme = Exclude<CardBackground, "accent" | "light">;

type GradientStop = {
  hex: string;
  pos: number;
};

export type GradFlowRgb = {
  r: number;
  g: number;
  b: number;
};

export type GradFlowColors = {
  color1: GradFlowRgb;
  color2: GradFlowRgb;
  color3: GradFlowRgb;
};

const SOLUTION_GRADIENT_DEFS = {
  developer: [
    { hex: "190780", pos: 0 },
    { hex: "1D02B8", pos: 20 },
    { hex: "430AFF", pos: 40 },
    { hex: "2800FF", pos: 60 },
    { hex: "3A00FF", pos: 80 },
    { hex: "210D7C", pos: 100 },
  ],
  wholesaler: [
    { hex: "0045FF", pos: 0 },
    { hex: "008EFF", pos: 25 },
    { hex: "008EFF", pos: 50 },
    { hex: "8FD7FF", pos: 75 },
    { hex: "C3EBFF", pos: 100 },
  ],
  broker: [
    { hex: "322696", pos: 0 },
    { hex: "7F44FF", pos: 25 },
    { hex: "B482FF", pos: 50 },
    { hex: "A975FF", pos: 75 },
    { hex: "8E46FF", pos: 100 },
  ],
  startup: [
    { hex: "30DF71", pos: 0 },
    { hex: "1ED5B3", pos: 33 },
    { hex: "00DCF1", pos: 66 },
    { hex: "00DEFA", pos: 100 },
  ],
  carrier: [
    { hex: "E25E2F", pos: 0 },
    { hex: "DE5943", pos: 25 },
    { hex: "FC976B", pos: 50 },
    { hex: "FC976B", pos: 75 },
    { hex: "FDAB77", pos: 100 },
  ],
} as const satisfies Record<SolutionTheme, readonly GradientStop[]>;

function hexToRgb(hex: string): GradFlowRgb {
  const normalized = hex.replace("#", "");
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function buildGradientStyle(stops: readonly GradientStop[]): string {
  const body = stops.map(({ hex, pos }) => `#${hex} ${pos}%`).join(", ");
  return `linear-gradient(45deg, ${body})`;
}

/** Dark→mid slice of a card wash — for pills, CTAs, and ticks (avoids pale/white ends). */
function buildUiChromeGradient(stops: readonly GradientStop[]): string {
  const midIndex = Math.max(1, Math.floor((stops.length - 1) / 2));
  const slice = stops.slice(0, midIndex + 1);
  const remapped = slice.map((stop, index) => ({
    hex: stop.hex,
    pos: slice.length === 1 ? 0 : (index / (slice.length - 1)) * 100,
  }));
  return buildGradientStyle(remapped);
}

function gradFlowFromStops(stops: readonly GradientStop[]): GradFlowColors {
  const mid = stops[Math.floor((stops.length - 1) / 2)];

  return {
    color1: hexToRgb(stops[0].hex),
    color2: hexToRgb(mid.hex),
    color3: hexToRgb(stops[stops.length - 1].hex),
  };
}

export const SOLUTION_GRAD_FLOW: Record<SolutionTheme, GradFlowColors> = {
  developer: gradFlowFromStops(SOLUTION_GRADIENT_DEFS.developer),
  wholesaler: gradFlowFromStops(SOLUTION_GRADIENT_DEFS.wholesaler),
  broker: gradFlowFromStops(SOLUTION_GRADIENT_DEFS.broker),
  startup: gradFlowFromStops(SOLUTION_GRADIENT_DEFS.startup),
  carrier: gradFlowFromStops(SOLUTION_GRADIENT_DEFS.carrier),
};

export const CARD_BACKGROUND_STYLES: Record<CardBackground, string> = {
  accent: "linear-gradient(135deg, #4541CD 0%, #352D93 38%, #121C49 100%)",
  light: "linear-gradient(135deg, #DADEF5 0%, #F8F0FC 55%, #FFFFFF 100%)",
  developer: buildGradientStyle(SOLUTION_GRADIENT_DEFS.developer),
  wholesaler: buildGradientStyle(SOLUTION_GRADIENT_DEFS.wholesaler),
  broker: buildGradientStyle(SOLUTION_GRADIENT_DEFS.broker),
  startup: buildGradientStyle(SOLUTION_GRADIENT_DEFS.startup),
  carrier: buildGradientStyle(SOLUTION_GRADIENT_DEFS.carrier),
};

/**
 * Saturated dark→mid gradients for modal chrome (tags, primary buttons, check ticks).
 * Matches each card's palette without the washed-out light end of the full card background.
 */
export const CARD_UI_GRADIENT_STYLES: Record<CardBackground, string> = {
  accent: "linear-gradient(135deg, #121C49 0%, #352D93 55%, #4541CD 100%)",
  light: "linear-gradient(135deg, #2A2680 0%, #413CC0 100%)",
  developer: buildUiChromeGradient(SOLUTION_GRADIENT_DEFS.developer),
  wholesaler: buildUiChromeGradient(SOLUTION_GRADIENT_DEFS.wholesaler),
  broker: buildUiChromeGradient(SOLUTION_GRADIENT_DEFS.broker),
  startup: buildUiChromeGradient(SOLUTION_GRADIENT_DEFS.startup),
  carrier: buildUiChromeGradient(SOLUTION_GRADIENT_DEFS.carrier),
};

/** Primary accent sampled from each card gradient (pill dot, check ticks). */
export const CARD_ACCENT_COLORS: Record<CardBackground, string> = {
  accent: "#4541CD",
  light: "#413CC0",
  developer: `#${SOLUTION_GRADIENT_DEFS.developer[2]!.hex}`,
  wholesaler: `#${SOLUTION_GRADIENT_DEFS.wholesaler[0]!.hex}`,
  broker: `#${SOLUTION_GRADIENT_DEFS.broker[1]!.hex}`,
  startup: `#${SOLUTION_GRADIENT_DEFS.startup[1]!.hex}`,
  carrier: `#${SOLUTION_GRADIENT_DEFS.carrier[0]!.hex}`,
};

export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex.replace("#", ""));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
