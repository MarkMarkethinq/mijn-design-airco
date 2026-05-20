"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MODELS, type ModelKey } from "@/lib/data";

interface AircoPreviewProps {
  selectedModel: ModelKey;
}

export default function AircoPreview({ selectedModel }: AircoPreviewProps) {
  const [visible, setVisible] = useState(true);
  const model = MODELS[selectedModel];

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, [selectedModel]);

  return (
    <div className="sticky top-24 p-2 bg-card border border-border rounded-[10px] shadow-[0_2px_12px_rgba(61,43,31,0.07)]">
      <div className="relative bg-gradient-to-b from-[#EFEDE7] to-[#E7E3DA] rounded-lg aspect-[4/3] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-x-[8%] bottom-[16%] h-2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(61,43,31,0.18),transparent_70%)] blur-[2px]" />
        <Image
          src={model.img}
          alt={`${model.name} — ${model.desc}`}
          width={400}
          height={300}
          className="max-w-[78%] max-h-[65%] object-contain drop-shadow-[0_8px_14px_rgba(61,43,31,0.18)] transition-all duration-[350ms] ease-in-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(6px)",
          }}
          priority
        />
      </div>
      <div className="pt-4.5 px-3.5 pb-3">
        <div className="font-medium text-[11px] tracking-[0.14em] uppercase text-mda-text-muted">
          Geselecteerd model
        </div>
        <div className="font-serif text-[30px] leading-[1.05] mt-1.5 mb-2 flex items-baseline gap-2.5 flex-wrap">
          <span>{model.name}</span>
          <em className="italic text-mda-text-muted text-lg">{model.jp}</em>
        </div>
        <p className="text-mda-text-muted text-sm mb-3.5">{model.desc}</p>
        <div className="flex gap-2">
          {model.swatches.map((color) => (
            <span
              key={color}
              className="w-[22px] h-[22px] rounded-full border border-border"
              style={{ background: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
