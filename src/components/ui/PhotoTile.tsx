"use client";

import { useRef, useState } from "react";
import { ShelfScanLocation } from "@/lib/types";

export default function PhotoTile({ location }: { location: ShelfScanLocation }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-2xl text-slate-400"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={`${location} photo`} className="h-full w-full object-cover" />
        ) : (
          "📷"
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setPreviewUrl(URL.createObjectURL(file));
        }}
      />
      <span className="text-xs font-medium text-slate-500">{location}</span>
    </div>
  );
}
