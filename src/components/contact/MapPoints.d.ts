import type { FC, ReactElement } from "react";

export declare function MobileOfficePopup(props: {
  office: string | null;
  onClose: () => void;
}): ReactElement | null;

export declare function OfficeCardBody(props: {
  office: string;
  largeImage?: boolean;
}): ReactElement | null;

export declare function MobileOfficeAddresses(): ReactElement;

declare const MapPoints: FC<{
  activeOffice?: string | null;
  onActiveOfficeChange?: (office: string | null) => void;
}>;

export default MapPoints;
