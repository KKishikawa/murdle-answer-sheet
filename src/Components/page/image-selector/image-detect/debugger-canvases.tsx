import { forwardRef, useRef } from "react";

export const createDebuggerCanvasesRef = () => useRef<HTMLDivElement>(null);

export const DebuggerCanvases = forwardRef<HTMLDivElement>((_, ref) => (
  <div className="flex flex-wrap gap-4" ref={ref} />
));
