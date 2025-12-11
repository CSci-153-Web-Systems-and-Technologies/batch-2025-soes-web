"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ZoomIn, ZoomOut } from "lucide-react";

interface AvatarCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImage: Blob) => void;
  imageSrc: string;
  isLoading?: boolean;
}

export default function AvatarCropModal({
  isOpen,
  onClose,
  onSave,
  imageSrc,
  isLoading = false,
}: AvatarCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const drawCropPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || !image.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const containerSize = 300;
    canvas.width = containerSize;
    canvas.height = containerSize;

    // Calculate dimensions to fit image in container
    const scale = Math.max(
      containerSize / image.width,
      containerSize / image.height
    );
    const scaledWidth = image.width * scale * zoom;
    const scaledHeight = image.height * scale * zoom;

    // Draw the image
    ctx.clearRect(0, 0, containerSize, containerSize);
    ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight);

    // Draw crop circle overlay
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      containerSize / 2,
      containerSize / 2,
      containerSize / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.stroke();

    // Darken outside circle
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, containerSize, containerSize);
    ctx.clearRect(0, 0, containerSize, containerSize);
    ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight);
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      containerSize / 2,
      containerSize / 2,
      containerSize / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.clip();
    ctx.restore();
  }, [zoom, offsetX, offsetY]);

  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    const image = new Image();
    image.onload = () => {
      if (imageRef.current) {
        imageRef.current.src = imageSrc;
      }
      drawCropPreview();
    };
    image.src = imageSrc;
  }, [isOpen, imageSrc, drawCropPreview]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setOffsetX(offsetX + deltaX);
    setOffsetY(offsetY + deltaY);
    setDragStart({ x: e.clientX, y: e.clientY });
    drawCropPreview();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(Math.max(1, zoom + delta));
    drawCropPreview();
  };

  const handleZoomChange = (direction: "in" | "out") => {
    const newZoom = direction === "in" ? zoom + 0.2 : zoom - 0.2;
    setZoom(Math.max(1, newZoom));
    drawCropPreview();
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a circular crop
    const size = 300;
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = size;
    croppedCanvas.height = size;

    const ctx = croppedCanvas.getContext("2d");
    if (!ctx) return;

    // Draw circular mask
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.clip();

    // Draw the cropped image
    ctx.drawImage(canvas, 0, 0);

    croppedCanvas.toBlob((blob) => {
      if (blob) {
        onSave(blob);
      }
    }, "image/png");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Your Avatar</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              className="max-w-full h-auto cursor-move border border-gray-300 rounded"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              style={{ display: "none" }}
            />
          </div>

          <p className="text-xs text-gray-500">Drag to move • Scroll to zoom</p>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleZoomChange("out")}
              disabled={zoom <= 1}
              className="flex-1"
            >
              <ZoomOut size={16} />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleZoomChange("in")}
              className="flex-1"
            >
              <ZoomIn size={16} />
            </Button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-green-700 hover:bg-green-900 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Avatar"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
