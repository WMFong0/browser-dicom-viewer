"use strict";

const elements = {
  viewport: document.querySelector("#dicomViewport"),
  stage: document.querySelector("#dicomStage"),
  emptyState: document.querySelector("#emptyState"),
  loadingState: document.querySelector("#loadingState"),
  dropZone: document.querySelector("#dropZone"),
  fileInput: document.querySelector("#fileInput"),
  folderInput: document.querySelector("#folderInput"),
  selectFiles: document.querySelector("#selectFilesButton"),
  selectFolder: document.querySelector("#selectFolderButton"),
  fileCount: document.querySelector("#fileCount"),
  sliceRange: document.querySelector("#sliceRange"),
  sliceOutput: document.querySelector("#sliceOutput"),
  previousSlice: document.querySelector("#previousSlice"),
  nextSlice: document.querySelector("#nextSlice"),
  clearSeries: document.querySelector("#clearSeries"),
  zoomIn: document.querySelector("#zoomIn"),
  zoomOut: document.querySelector("#zoomOut"),
  invertImage: document.querySelector("#invertImage"),
  resetViewport: document.querySelector("#resetViewport"),
  saveSnapshot: document.querySelector("#saveSnapshot"),
  fullscreen: document.querySelector("#fullscreenButton"),
  toast: document.querySelector("#toast"),
  metaModality: document.querySelector("#metaModality"),
  metaSeries: document.querySelector("#metaSeries"),
  metaDimensions: document.querySelector("#metaDimensions"),
  metaThickness: document.querySelector("#metaThickness"),
  metaFile: document.querySelector("#metaFile"),
  overlayModality: document.querySelector("#overlayModality"),
  overlaySeries: document.querySelector("#overlaySeries"),
  overlayWindow: document.querySelector("#overlayWindow"),
  overlayZoom: document.querySelector("#overlayZoom"),
  overlaySlice: document.querySelector("#overlaySlice")
};

const state = {
  files: [],
  imageIds: [],
  index: 0,
  image: null,
  loadToken: 0,
  dragging: false,
  pointer: null,
  toastTimer: null
};

const requiredLibraries = ["cornerstone", "dicomParser", "cornerstoneWADOImageLoader"];
const librariesReady = requiredLibraries.every((name) => Boolean(window[name]));

if (librariesReady) {
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstone.enable(elements.viewport);
} else {
  showToast("The DICOM decoder could not load. Check your internet connection and refresh.", 8000);
}

function showToast(message, duration = 3600) {
  clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  state.toastTimer = setTimeout(() => { elements.toast.hidden = true; }, duration);
}

function naturalFileSort(left, right) {
  return left.name.localeCompare(right.name, undefined, { numeric: true, sensitivity: "base" });
}

function isPotentialDicom(file) {
  return file.name.toLowerCase().endsWith(".dcm") || file.type === "application/dicom" || file.type === "";
}

async function loadFiles(fileList) {
  if (!librariesReady) return;
  const files = Array.from(fileList).filter(isPotentialDicom).sort(naturalFileSort);
  if (!files.length) {
    showToast("No DICOM files were found in that selection.");
    return;
  }

  clearSession(false);
  state.files = files;
  state.imageIds = files.map((file) => cornerstoneWADOImageLoader.wadouri.fileManager.add(file));
  state.index = 0;

  elements.fileCount.textContent = `${files.length} ${files.length === 1 ? "slice" : "slices"}`;
  elements.sliceRange.max = String(Math.max(0, files.length - 1));
  elements.sliceRange.value = "0";
  [elements.sliceRange, elements.previousSlice, elements.nextSlice, elements.clearSeries].forEach((control) => { control.disabled = false; });
  elements.saveSnapshot.disabled = true;
  elements.emptyState.hidden = true;

  await displaySlice(0);
}

async function displaySlice(index) {
  if (!state.imageIds.length) return;
  const boundedIndex = Math.max(0, Math.min(index, state.imageIds.length - 1));
  const token = ++state.loadToken;
  elements.loadingState.hidden = false;

  try {
    const image = await cornerstone.loadAndCacheImage(state.imageIds[boundedIndex]);
    if (token !== state.loadToken) return;
    state.index = boundedIndex;
    state.image = image;
    cornerstone.displayImage(elements.viewport, image);
    updateSeriesUi();
    updateMetadata(image);
    elements.saveSnapshot.disabled = false;
  } catch (error) {
    console.error(error);
    showToast(`Unable to decode ${state.files[boundedIndex]?.name || "this file"}.`);
  } finally {
    if (token === state.loadToken) elements.loadingState.hidden = true;
  }
}

function updateSeriesUi() {
  const current = state.index + 1;
  const total = state.imageIds.length;
  elements.sliceRange.value = String(state.index);
  elements.sliceOutput.textContent = `${current} / ${total}`;
  elements.overlaySlice.textContent = `Slice ${current} / ${total}`;
  elements.previousSlice.disabled = state.index <= 0;
  elements.nextSlice.disabled = state.index >= total - 1;
  updateViewportOverlay();
}

function dicomString(data, tag, fallback = "—") {
  try { return data?.string(tag)?.trim() || fallback; } catch { return fallback; }
}

function updateMetadata(image) {
  const data = image.data;
  const modality = dicomString(data, "x00080060", "DICOM");
  const series = dicomString(data, "x0008103e", "Unnamed series");
  const thickness = dicomString(data, "x00180050");

  elements.metaModality.textContent = modality;
  elements.metaSeries.textContent = series;
  elements.metaDimensions.textContent = `${image.columns} × ${image.rows}`;
  elements.metaThickness.textContent = thickness === "—" ? thickness : `${thickness} mm`;
  elements.metaFile.textContent = state.files[state.index]?.name || "—";
  elements.overlayModality.textContent = modality;
  elements.overlaySeries.textContent = series;
}

function updateViewportOverlay() {
  if (!state.image) return;
  const viewport = cornerstone.getViewport(elements.viewport);
  elements.overlayWindow.textContent = `W ${Math.round(viewport.voi.windowWidth)} / L ${Math.round(viewport.voi.windowCenter)}`;
  elements.overlayZoom.textContent = `Zoom ${viewport.scale.toFixed(2)}×`;
}

function changeSlice(delta) {
  displaySlice(state.index + delta);
}

function mutateViewport(mutator) {
  if (!state.image) return;
  const viewport = cornerstone.getViewport(elements.viewport);
  mutator(viewport);
  cornerstone.setViewport(elements.viewport, viewport);
  updateViewportOverlay();
}

function clearSession(notify = true) {
  ++state.loadToken;
  state.files = [];
  state.imageIds = [];
  state.index = 0;
  state.image = null;

  try { cornerstone.imageCache.purgeCache(); } catch { /* library may be unavailable */ }
  try { cornerstoneWADOImageLoader.wadouri.fileManager.purge(); } catch { /* older loader */ }
  if (librariesReady) {
    try { cornerstone.disable(elements.viewport); } catch { /* already disabled */ }
    cornerstone.enable(elements.viewport);
  }

  elements.emptyState.hidden = false;
  elements.loadingState.hidden = true;
  elements.fileCount.textContent = "0 slices";
  elements.sliceOutput.textContent = "— / —";
  elements.overlaySlice.textContent = "Slice — / —";
  elements.overlayModality.textContent = "DICOM";
  elements.overlaySeries.textContent = "Local series";
  elements.overlayWindow.textContent = "W — / L —";
  elements.overlayZoom.textContent = "Zoom —";
  elements.sliceRange.value = "0";
  elements.sliceRange.max = "0";
  [elements.sliceRange, elements.previousSlice, elements.nextSlice, elements.clearSeries, elements.saveSnapshot].forEach((control) => { control.disabled = true; });
  [elements.metaModality, elements.metaSeries, elements.metaDimensions, elements.metaThickness, elements.metaFile].forEach((item) => { item.textContent = "—"; });
  elements.fileInput.value = "";
  elements.folderInput.value = "";
  if (notify) showToast("Local series cleared from this session.");
}

elements.selectFiles.addEventListener("click", () => elements.fileInput.click());
elements.selectFolder.addEventListener("click", () => elements.folderInput.click());
elements.fileInput.addEventListener("change", (event) => loadFiles(event.target.files));
elements.folderInput.addEventListener("change", (event) => loadFiles(event.target.files));
elements.clearSeries.addEventListener("click", () => clearSession());
elements.previousSlice.addEventListener("click", () => changeSlice(-1));
elements.nextSlice.addEventListener("click", () => changeSlice(1));
elements.sliceRange.addEventListener("input", (event) => displaySlice(Number(event.target.value)));

["dragenter", "dragover"].forEach((type) => elements.dropZone.addEventListener(type, (event) => {
  event.preventDefault();
  elements.dropZone.classList.add("dragging");
}));

["dragleave", "drop"].forEach((type) => elements.dropZone.addEventListener(type, (event) => {
  event.preventDefault();
  elements.dropZone.classList.remove("dragging");
}));

elements.dropZone.addEventListener("drop", (event) => loadFiles(event.dataTransfer.files));

elements.stage.addEventListener("wheel", (event) => {
  if (!state.imageIds.length) return;
  event.preventDefault();
  changeSlice(event.deltaY > 0 ? 1 : -1);
}, { passive: false });

elements.stage.addEventListener("pointerdown", (event) => {
  if (!state.image) return;
  state.dragging = true;
  state.pointer = { x: event.clientX, y: event.clientY };
  elements.stage.setPointerCapture(event.pointerId);
});

elements.stage.addEventListener("pointermove", (event) => {
  if (!state.dragging || !state.pointer) return;
  const deltaX = event.clientX - state.pointer.x;
  const deltaY = event.clientY - state.pointer.y;
  state.pointer = { x: event.clientX, y: event.clientY };
  mutateViewport((viewport) => {
    viewport.voi.windowWidth = Math.max(1, viewport.voi.windowWidth + deltaX * 2);
    viewport.voi.windowCenter += deltaY * 2;
  });
});

function stopDragging() {
  state.dragging = false;
  state.pointer = null;
}

elements.stage.addEventListener("pointerup", stopDragging);
elements.stage.addEventListener("pointercancel", stopDragging);
elements.zoomIn.addEventListener("click", () => mutateViewport((viewport) => { viewport.scale *= 1.15; }));
elements.zoomOut.addEventListener("click", () => mutateViewport((viewport) => { viewport.scale /= 1.15; }));
elements.invertImage.addEventListener("click", () => mutateViewport((viewport) => {
  viewport.invert = !viewport.invert;
  elements.invertImage.setAttribute("aria-pressed", String(viewport.invert));
}));

elements.resetViewport.addEventListener("click", () => {
  if (!state.image) return;
  const viewport = cornerstone.getDefaultViewportForImage(elements.viewport, state.image);
  cornerstone.setViewport(elements.viewport, viewport);
  elements.invertImage.setAttribute("aria-pressed", "false");
  updateViewportOverlay();
});

elements.fullscreen.addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await elements.viewport.closest(".viewport-panel").requestFullscreen();
  } catch { showToast("Fullscreen is unavailable in this browser."); }
});

elements.saveSnapshot.addEventListener("click", () => {
  const canvas = elements.viewport.querySelector("canvas");
  if (!canvas) return;
  const link = document.createElement("a");
  link.download = `${(state.files[state.index]?.name || "dicom-slice").replace(/\.dcm$/i, "")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
});

document.addEventListener("keydown", (event) => {
  if (["INPUT", "BUTTON"].includes(document.activeElement?.tagName)) return;
  if (event.key === "ArrowLeft") changeSlice(-1);
  if (event.key === "ArrowRight") changeSlice(1);
  if (event.key.toLowerCase() === "r") elements.resetViewport.click();
  if (event.key.toLowerCase() === "i") elements.invertImage.click();
});

window.addEventListener("resize", () => {
  if (librariesReady && state.image) cornerstone.resize(elements.viewport, true);
});

window.addEventListener("beforeunload", () => clearSession(false));
