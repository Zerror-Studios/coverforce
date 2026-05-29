import { siteSideBorders } from "./containerStyles";

const SiteGuideBorders = () => {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-full max-w-7xl -translate-x-1/2"
      style={siteSideBorders}
      aria-hidden
    />
  );
};

export default SiteGuideBorders;
