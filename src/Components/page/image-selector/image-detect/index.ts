import { disposable } from "@/lib/disposable";
import cv from "@techstark/opencv-js";
import type { RefObject } from "react";
import { toast } from "sonner";
// import { createWorker } from 'tesseract.js';
const toDisposableCv = <T extends { delete(): void }>(mat: T) =>
  disposable(mat, m => m?.delete());

const fileToMat = (file: File) =>
  new Promise<cv.Mat>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const mat = cv.imread(img);
      resolve(mat);
      URL.revokeObjectURL(img.src);
      img.remove();
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

const createMatDebugRenderer = (
  canvasRef: RefObject<HTMLDivElement | null>,
) => {
  if (canvasRef?.current) {
    canvasRef.current.innerHTML = "";
  }
  return (mat: cv.Mat, tag: string) => {
    if (!canvasRef || !canvasRef.current) {
      console.error("No canvas available");
      return;
    }
    const itemWrapper = document.createElement("div");
    itemWrapper.className = "w-[450px]";
    if (tag) {
      const p = document.createElement("p");
      p.textContent = tag;
      itemWrapper.appendChild(p);
    }
    const canvas = document.createElement("canvas");
    canvas.className = "max-h-full max-w-full";
    itemWrapper.appendChild(canvas);
    cv.imshow(canvas, mat);

    canvasRef.current.appendChild(itemWrapper);
  };
};

export const imageDetect = async (
  image: string | HTMLElement | File | null | undefined,
  canvasWrapperRef: RefObject<HTMLDivElement | null>,
) => {
  if (!image) {
    console.error("No image provided");
    return;
  }
  const debugRenderer = createMatDebugRenderer(canvasWrapperRef);
  // Load the image
  using img = toDisposableCv(
    typeof image === "string" || image instanceof HTMLElement
      ? cv.imread(image)
      : await fileToMat(image),
  );
  debugRenderer(img, "Original Image");

  // Convert the image to grayscale
  using gray = toDisposableCv(new cv.Mat());
  cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY, 0);
  debugRenderer(gray, "Grayscale Image");

  // Apply adaptive thresholding to get a binary image
  using binary = toDisposableCv(new cv.Mat());
  cv.adaptiveThreshold(
    gray,
    binary,
    255,
    cv.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv.THRESH_BINARY_INV,
    11,
    2,
  );
  debugRenderer(binary, "Binary Image");

  // Detect horizontal and vertical lines
  const horizontal = binary.clone();
  const vertical = binary.clone();

  const scale = 20; // Adjust this value based on the size of the grid cells

  // Detect horizontal lines
  const horizontalsize = Math.floor(horizontal.cols / scale);
  const horizontalStructure = cv.getStructuringElement(
    cv.MORPH_RECT,
    new cv.Size(horizontalsize, 1),
  );
  cv.erode(
    horizontal,
    horizontal,
    horizontalStructure,
    new cv.Point(-1, -1),
    1,
  );
  cv.dilate(
    horizontal,
    horizontal,
    horizontalStructure,
    new cv.Point(-1, -1),
    1,
  );

  // Detect vertical lines
  const verticalsize = Math.floor(vertical.rows / scale);
  using verticalStructure = toDisposableCv(
    cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(1, verticalsize)),
  );
  cv.erode(vertical, vertical, verticalStructure, new cv.Point(-1, -1), 1);
  cv.dilate(vertical, vertical, verticalStructure, new cv.Point(-1, -1), 1);

  // Combine horizontal and vertical lines
  using grid = toDisposableCv(new cv.Mat());
  cv.addWeighted(horizontal, 0.5, vertical, 0.5, 0.0, grid);
  debugRenderer(grid, "Grid Image");

  // Find contours
  using contours = toDisposableCv(new cv.MatVector());
  using hierarchy = toDisposableCv(new cv.Mat());
  cv.findContours(
    grid,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE,
  );

  // Filter contours to find the outer grid
  let outerGrid = null;
  for (let i = 0; i < contours.size(); i++) {
    const contour = contours.get(i);
    const rect = cv.boundingRect(contour);
    if (rect.width > img.cols * 0.8 && rect.height > img.rows * 0.8) {
      outerGrid = rect;
      break;
    }
  }

  if (!outerGrid) {
    toast.error("Outer grid not found");
    return;
  }

  // Extract the outer grid region
  using outerGridROI = toDisposableCv(img.roi(outerGrid));

  // Detect internal grid cells
  using internalContours = toDisposableCv(new cv.MatVector());
  using internalHierarchy = toDisposableCv(new cv.Mat());
  cv.findContours(
    outerGridROI,
    internalContours,
    internalHierarchy,
    cv.RETR_TREE,
    cv.CHAIN_APPROX_SIMPLE,
  );

  // Count internal grid cells
  let internalGridCount = 0;
  for (let i = 0; i < internalContours.size(); i++) {
    const contour = internalContours.get(i);
    const rect = cv.boundingRect(contour);
    if (
      rect.width < outerGrid.width / 2 &&
      rect.height < outerGrid.height / 2
    ) {
      internalGridCount++;
    }
  }

  const gridSize = Math.sqrt(internalGridCount);

  console.log("Outer grid size:", outerGrid.width, outerGrid.height);
  console.log("Internal grid size:", gridSize, gridSize);

  toast.success("Detected grid size:", {
    description: `${gridSize} x ${gridSize}  (${internalGridCount} cells)`,
  });

  // // Detect item names and icons using OCR
  // const worker = createWorker();
  // await worker.load();
  // await worker.loadLanguage('eng');
  // await worker.initialize('eng');

  // for (let i = 0; i < internalContours.size(); i++) {
  //     const contour = internalContours.get(i);
  //     const rect = cv.boundingRect(contour);
  //     if (rect.width < outerGrid.width / 2 && rect.height < outerGrid.height / 2) {
  //         const cellROI = outerGridROI.roi(rect);
  //         const { data: { text } } = await worker.recognize(cellROI);
  //         console.log('Detected text:', text);
  //         cellROI.delete();
  //     }
  // }

  // await worker.terminate();
};
