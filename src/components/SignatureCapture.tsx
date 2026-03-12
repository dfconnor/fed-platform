'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SignatureCaptureProps {
  onSign: (signature: string, type: 'drawn' | 'typed') => void;
  name: string;
  disabled?: boolean;
  className?: string;
}

type SignatureMode = 'draw' | 'type';

interface Stroke {
  points: { x: number; y: number }[];
}

export default function SignatureCapture({
  onSign,
  name,
  disabled = false,
  className,
}: SignatureCaptureProps) {
  const [mode, setMode] = useState<SignatureMode>('draw');
  const [typedName, setTypedName] = useState(name);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── Canvas Drawing ──────────────────────────────────────────────────

  const getCanvasPoint = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      let clientX: number, clientY: number;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const redrawCanvas = useCallback(
    (allStrokes: Stroke[], active?: Stroke | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw guide line
      const guideY = canvas.height - 30;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, guideY);
      ctx.lineTo(canvas.width - 20, guideY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw label
      ctx.fillStyle = '#93c5fd';
      ctx.font = '11px sans-serif';
      ctx.fillText('Sign above this line', 20, canvas.height - 10);

      // Draw all strokes
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const drawStroke = (stroke: Stroke) => {
        if (stroke.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
      };

      for (const stroke of allStrokes) {
        drawStroke(stroke);
      }

      if (active) {
        drawStroke(active);
      }
    },
    []
  );

  // Redraw when strokes change
  useEffect(() => {
    if (mode === 'draw') {
      redrawCanvas(strokes);
    }
  }, [strokes, mode, redrawCanvas]);

  // Initialize canvas on mode switch
  useEffect(() => {
    if (mode === 'draw') {
      redrawCanvas(strokes);
    }
  }, [mode, strokes, redrawCanvas]);

  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return;
      e.preventDefault();
      const point = getCanvasPoint(e);
      setIsDrawing(true);
      setCurrentStroke({ points: [point] });
    },
    [disabled, getCanvasPoint]
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || disabled || !currentStroke) return;
      e.preventDefault();
      const point = getCanvasPoint(e);
      const updated = {
        points: [...currentStroke.points, point],
      };
      setCurrentStroke(updated);
      redrawCanvas(strokes, updated);
    },
    [isDrawing, disabled, currentStroke, getCanvasPoint, strokes, redrawCanvas]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawing || !currentStroke) return;
    setIsDrawing(false);
    if (currentStroke.points.length > 1) {
      setStrokes((prev) => [...prev, currentStroke]);
      setHasDrawn(true);
    }
    setCurrentStroke(null);
  }, [isDrawing, currentStroke]);

  const handleClear = useCallback(() => {
    setStrokes([]);
    setCurrentStroke(null);
    setHasDrawn(false);
    redrawCanvas([]);
  }, [redrawCanvas]);

  const handleUndo = useCallback(() => {
    setStrokes((prev) => {
      const updated = prev.slice(0, -1);
      if (updated.length === 0) setHasDrawn(false);
      redrawCanvas(updated);
      return updated;
    });
  }, [redrawCanvas]);

  // ─── Signing ─────────────────────────────────────────────────────────

  const handleSign = useCallback(() => {
    if (disabled) return;

    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) return;
      const dataUrl = canvas.toDataURL('image/png');
      onSign(dataUrl, 'drawn');
    } else {
      if (!typedName.trim()) return;
      onSign(typedName.trim(), 'typed');
    }
  }, [disabled, mode, hasDrawn, typedName, onSign]);

  const canSign =
    mode === 'draw' ? hasDrawn : typedName.trim().length > 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Mode Tabs */}
      <div className="flex border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setMode('draw')}
          disabled={disabled}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors',
            mode === 'draw'
              ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-600'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          )}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
          </svg>
          Draw
        </button>
        <button
          type="button"
          onClick={() => setMode('type')}
          disabled={disabled}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors',
            mode === 'type'
              ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-600'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          )}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.5 2A2.5 2.5 0 002 4.5v3.879a2.5 2.5 0 00.732 1.767l7.5 7.5a2.5 2.5 0 003.536 0l3.878-3.878a2.5 2.5 0 000-3.536l-7.5-7.5A2.5 2.5 0 008.38 2H4.5zM5 6a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          Type
        </button>
      </div>

      {/* Draw Mode */}
      {mode === 'draw' && (
        <div className="space-y-3">
          <div
            ref={containerRef}
            className={cn(
              'relative rounded-xl border-2 border-dashed bg-white overflow-hidden',
              disabled
                ? 'border-gray-200 opacity-60 cursor-not-allowed'
                : 'border-gray-300 hover:border-gray-400 cursor-crosshair'
            )}
          >
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              className="w-full h-[150px] sm:h-[180px] touch-none"
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled || strokes.length === 0}
              className="btn-ghost text-sm px-3 py-1.5 disabled:opacity-40"
            >
              <svg
                className="h-4 w-4 mr-1 inline-block"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5z"
                  clipRule="evenodd"
                />
              </svg>
              Clear
            </button>
            <button
              type="button"
              onClick={handleUndo}
              disabled={disabled || strokes.length === 0}
              className="btn-ghost text-sm px-3 py-1.5 disabled:opacity-40"
            >
              <svg
                className="h-4 w-4 mr-1 inline-block"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z"
                  clipRule="evenodd"
                />
              </svg>
              Undo
            </button>
          </div>
        </div>
      )}

      {/* Type Mode */}
      {mode === 'type' && (
        <div className="space-y-3">
          <div>
            <label
              htmlFor="typed-signature"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Type your full name
            </label>
            <input
              id="typed-signature"
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Enter your full name"
              disabled={disabled}
              className="input-field"
            />
          </div>
          {/* Signature Preview */}
          {typedName.trim() && (
            <div className="relative rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 flex items-end justify-center min-h-[120px]">
              <div className="text-center w-full">
                <p
                  className="text-3xl sm:text-4xl text-gray-900 pb-2"
                  style={{
                    fontFamily:
                      "'Brush Script MT', 'Segoe Script', 'Dancing Script', cursive",
                  }}
                >
                  {typedName}
                </p>
                <div className="border-b-2 border-dotted border-blue-300 w-full" />
                <p className="text-[11px] text-blue-400 mt-1">
                  Sign above this line
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legal Text */}
      <p className="text-xs text-gray-500 leading-relaxed">
        By signing, I agree this electronic signature is legally binding and
        has the same force and effect as a handwritten signature under the
        E-SIGN Act and UETA.
      </p>

      {/* Sign Button */}
      <button
        type="button"
        onClick={handleSign}
        disabled={disabled || !canSign}
        className="btn-primary w-full gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
        Sign &amp; Confirm
      </button>
    </div>
  );
}
