import type { CSSProperties } from "react";
import Image from "next/image";
import type { ProcessesPageImage } from "@/content/feature-stories/processes.types";
import styles from "./Magnifier.module.css";

type MagnifierProps = {
  image: ProcessesPageImage;
  /** The lens centre and diameter, as percentages of the positioned parent. */
  placement?: { top: string; left: string; size: string };
  /** For a screenshot that is only a faint backdrop on narrow screens, where a lens would compete with the copy. */
  hideOnNarrow?: boolean;
};

export function Magnifier({ image, placement, hideOnNarrow = false }: MagnifierProps) {
  const style = placement ? ({ "--top": placement.top, "--left": placement.left, "--size": placement.size } as CSSProperties) : undefined;

  return (
    <span className={`${styles.magnifier} ${hideOnNarrow ? styles.hideOnNarrow : ""}`} data-arrives-last style={style}>
      <span className={styles.lens}>
        <Image alt={image.alt} className={styles.image} height={image.height} sizes="420px" src={image.src} width={image.width} />
      </span>
    </span>
  );
}
