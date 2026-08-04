import Image from "next/image";
import type { ReactNode } from "react";

export type CharacterName =
  | "anton-pinon"
  | "cocodrilo"
  | "gatita"
  | "girafa"
  | "leon"
  | "martina-futbolista"
  | "mono"
  | "perro-cocinero";

export function CharacterGuide({
  character,
  children,
  className = "",
}: {
  character: CharacterName;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`brand-guide brand-guide--${character} ${className}`}>
      <p className="brand-guide__bubble">{children}</p>
      <Image
        src={`/images/web-2026/characters/${character}.png`}
        alt=""
        width={709}
        height={709}
        sizes="(max-width: 768px) 130px, 190px"
        className="brand-guide__character"
      />
    </div>
  );
}
