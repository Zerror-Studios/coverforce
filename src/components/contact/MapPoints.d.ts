import type { FC } from "react";

export declare function MobileOfficePopup(props: {
  office: string | null;
  onClose: () => void;
}): React.ReactElement | null;

declare const MapPoints: FC<{
  activeOffice?: string | null;
  onActiveOfficeChange?: (office: string | null) => void;
}>;

export default MapPoints;
