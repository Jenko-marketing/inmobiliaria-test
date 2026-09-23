"use client";

import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    pannellum?: {
      viewer: (
        target: string,
        config: Record<string, unknown>,
      ) => { destroy: () => void };
    };
  }
}

const PANNELLUM_JS = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
const PANNELLUM_CSS = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";

let scriptPromise: Promise<void> | null = null;
function loadPannellum(): Promise<void> {
  if (window.pannellum) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PANNELLUM_JS;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar el visor 360°"));
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export function PanoramaViewer({
  panoramaUrl,
  title,
}: {
  panoramaUrl: string;
  title?: string;
}) {
  const id = useId().replace(/[:]/g, "");
  const viewerRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadPannellum().then(() => {
      if (cancelled || !window.pannellum) return;
      viewerRef.current = window.pannellum.viewer(`panorama-${id}`, {
        type: "equirectangular",
        panorama: panoramaUrl,
        autoLoad: true,
        showZoomCtrl: true,
        compass: false,
        title: title ?? "Recorrido 360°",
        hotSpotDebug: false,
      });
    });
    return () => {
      cancelled = true;
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [id, panoramaUrl, title]);

  return (
    <>
      <link rel="stylesheet" href={PANNELLUM_CSS} />
      <div
        id={`panorama-${id}`}
        className="w-full overflow-hidden rounded-xl bg-brand-gray-900"
        style={{ height: 420 }}
      />
    </>
  );
}
