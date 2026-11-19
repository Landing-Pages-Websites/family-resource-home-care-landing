import Image from "next/image";
import type { ReactElement } from "react";
import type { MarketImage } from "../images";

interface SectionBackdropProps {
  image: MarketImage;
  /** Tailwind opacity class for the dimmed photo, e.g. "opacity-[0.18]". */
  opacity: string;
  priority?: boolean;
}

/**
 * A dimmed full-section photo under a navy wash. From 1024px it covers the section; below that
 * it is a band at the photo's own proportions that fades into the navy, so a tall stacked
 * section never stretches the source past its pixels. From 1024px the cover crop can be
 * height-bound (about 1.35x the viewport width at 1024x768), hence 140vw.
 */
export function SectionBackdrop({ image, opacity, priority = false }: SectionBackdropProps): ReactElement {
  return (
    <div
      aria-hidden
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
      className="absolute inset-x-0 top-0 lg:!aspect-auto lg:bottom-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black_55%,transparent)] lg:[mask-image:none]"
    >
      <Image src={image.src} alt="" fill priority={priority} fetchPriority={priority ? "high" : undefined} sizes="(min-width: 1024px) 140vw, 100vw" className={`object-cover object-center ${opacity}`} />
    </div>
  );
}
