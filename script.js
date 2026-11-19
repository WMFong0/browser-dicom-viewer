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
  heroOpenFiles: document.querySelector("#heroOpenFiles"),
  fileCount: document.querySelector("#fileCount"),
  sliceRange: document.querySelector("#sliceRange"),
  sliceOutput: document.querySelector("#sliceOutput"),
  previousSlice: document.querySelector("#previousSlice"),
  nextSlice: document.querySelector("#nextSlice"),
  clearSeries: document.querySelector("#clearSeries"),
  windowTool: document.querySelector("#windowTool"),
  panTool: document.querySelector("#panTool"),
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
  overlaySlice: document.querySelector("#overlaySlice"),
  errorState: document.querySelector("#errorState"),
  errorMessage: document.querySelector("#errorMessage"),
  retryFile: document.querySelector("#retryFile"),
  chooseAnother: document.querySelector("#chooseAnother"),
  clearAfterError: document.querySelector("#clearAfterError")
};

const state = {
  files: [],
  imageIds: [],
  index: 0,
  image: null,
  loadToken: 0,
  activeTool: "window",
  dragging: false,
  pointer: null,
  toastTimer: null
};

const requiredLibraries = ["cornerstone", "dicomParser", "cornerstoneWADOImageLoader"];
const librariesReady = requiredLibraries.every((name) => Boolean(window[name]));
const PAN_WHEEL_ZOOM_RATE = 0.005448007021502821;

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
  elements.errorState.hidden = true;

  await displaySlice(0);
}

async function displaySlice(index) {
  if (!state.imageIds.length) return;
  const boundedIndex = Math.max(0, Math.min(index, state.imageIds.length - 1));
  const token = ++state.loadToken;
  elements.loadingState.hidden = false;
  elements.errorState.hidden = true;

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
    const filename = state.files[boundedIndex]?.name || "This file";
    elements.errorMessage.textContent = `${filename} may be malformed or use an unsupported transfer syntax.`;
    elements.errorState.hidden = false;
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

/**
 * Selects the primary drag interaction and synchronizes its visual, semantic,
 * and pointer-cursor state without changing the rendered image.
 *
 * Args:
 *     tool (string): Supported interaction identifier, either `window` or `pan`.
 *
 * Returns:
 *     void: Updates the shared interaction state and both mode controls.
 */
function setActiveTool(tool) {
  if (!["window", "pan"].includes(tool)) return;
  state.activeTool = tool;
  [[elements.windowTool, tool === "window"], [elements.panTool, tool === "pan"]].forEach(([control, active]) => {
    control.classList.toggle("active", active);
    control.setAttribute("aria-pressed", String(active));
  });
  elements.stage.dataset.tool = tool;
  stopDragging();
}

/**
 * Converts pointer movement into Cornerstone image-space translation while
 * preserving physical pixel-spacing ratios for anisotropic images.
 *
 * Args:
 *     viewport (Object): Mutable Cornerstone viewport containing scale and translation state.
 *     deltaX (number): Horizontal pointer displacement measured in CSS pixels.
 *     deltaY (number): Vertical pointer displacement measured in CSS pixels.
 *
 * Returns:
 *     void: Mutates the supplied viewport translation in image coordinates.
 */
function panViewport(viewport, deltaX, deltaY) {
  const rowSpacing = Number(state.image?.rowPixelSpacing) || 1;
  const columnSpacing = Number(state.image?.columnPixelSpacing) || 1;
  const widthScale = viewport.scale * (rowSpacing < columnSpacing ? columnSpacing / rowSpacing : 1);
  const heightScale = viewport.scale * (columnSpacing < rowSpacing ? rowSpacing / columnSpacing : 1);
  viewport.translation ||= { x: 0, y: 0 };
  viewport.translation.x += deltaX / widthScale;
  viewport.translation.y += deltaY / heightScale;
}

/**
 * Applies bounded multiplicative zoom so wheel, trackpad, and toolbar actions
 * share identical limits without allowing an unusable zero-scale viewport.
 *
 * Args:
 *     viewport (Object): Mutable Cornerstone viewport containing the current scale.
 *     factor (number): Positive zoom multiplier, above one to enlarge and below one to reduce.
 *
 * Returns:
 *     void: Mutates the supplied viewport scale within the supported range.
 */
function zoomViewport(viewport, factor) {
  viewport.scale = Math.min(20, Math.max(0.05, viewport.scale * factor));
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
  elements.errorState.hidden = true;
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
  setActiveTool("window");
  if (notify) showToast("Local series cleared from this session.");
}

elements.selectFiles.addEventListener("click", () => elements.fileInput.click());
elements.selectFolder.addEventListener("click", () => elements.folderInput.click());
elements.heroOpenFiles.addEventListener("click", () => elements.fileInput.click());
elements.fileInput.addEventListener("change", (event) => loadFiles(event.target.files));
elements.folderInput.addEventListener("change", (event) => loadFiles(event.target.files));
elements.clearSeries.addEventListener("click", () => clearSession());
elements.retryFile.addEventListener("click", () => displaySlice(state.index));
elements.chooseAnother.addEventListener("click", () => elements.fileInput.click());
elements.clearAfterError.addEventListener("click", () => clearSession());
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
  if (state.activeTool === "pan") {
    const boundedDelta = Math.max(-100, Math.min(100, event.deltaY));
    mutateViewport((viewport) => zoomViewport(viewport, Math.exp(-boundedDelta * PAN_WHEEL_ZOOM_RATE)));
    return;
  }
  changeSlice(event.deltaY > 0 ? 1 : -1);
}, { passive: false });

elements.stage.addEventListener("pointerdown", (event) => {
  if (!state.image || state.dragging || (event.pointerType === "mouse" && event.button !== 0)) return;
  event.preventDefault();
  state.dragging = true;
  state.pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
  elements.stage.classList.add("is-dragging");
  elements.stage.setPointerCapture(event.pointerId);
});

elements.stage.addEventListener("pointermove", (event) => {
  if (!state.dragging || !state.pointer || state.pointer.id !== event.pointerId) return;
  const deltaX = event.clientX - state.pointer.x;
  const deltaY = event.clientY - state.pointer.y;
  state.pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
  mutateViewport((viewport) => {
    if (state.activeTool === "pan") {
      panViewport(viewport, deltaX, deltaY);
      return;
    }
    viewport.voi.windowWidth = Math.max(1, viewport.voi.windowWidth + deltaX * 2);
    viewport.voi.windowCenter += deltaY * 2;
  });
});

function stopDragging(event) {
  if (event?.pointerId != null && state.pointer?.id !== event.pointerId) return;
  state.dragging = false;
  state.pointer = null;
  elements.stage.classList.remove("is-dragging");
}

elements.stage.addEventListener("pointerup", stopDragging);
elements.stage.addEventListener("pointercancel", stopDragging);
elements.stage.addEventListener("lostpointercapture", stopDragging);
elements.windowTool.addEventListener("click", () => setActiveTool("window"));
elements.panTool.addEventListener("click", () => setActiveTool("pan"));
elements.zoomIn.addEventListener("click", () => mutateViewport((viewport) => zoomViewport(viewport, 1.15)));
elements.zoomOut.addEventListener("click", () => mutateViewport((viewport) => zoomViewport(viewport, 1 / 1.15)));
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
  if (event.key.toLowerCase() === "w") elements.windowTool.click();
  if (event.key.toLowerCase() === "p") elements.panTool.click();
  if (event.key.toLowerCase() === "r") elements.resetViewport.click();
  if (event.key.toLowerCase() === "i") elements.invertImage.click();
});

window.addEventListener("resize", () => {
  if (librariesReady && state.image) cornerstone.resize(elements.viewport, true);
});

window.addEventListener("beforeunload", () => clearSession(false));

document.querySelectorAll("[data-accordion] .accordion-item > button").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedItem = button.closest(".accordion-item");
    document.querySelectorAll("[data-accordion] .accordion-item").forEach((item) => {
      const expanded = item === selectedItem && !item.classList.contains("expanded");
      item.classList.toggle("expanded", expanded);
      item.querySelector("button").setAttribute("aria-expanded", String(expanded));
    });
  });
});

/**
 * Establishes the page's single motion system: an opening reveal, a viewport
 * arrival, and a scrubbed privacy statement. Content remains visible when
 * GSAP is absent or motion is reduced.
 *
 * Returns:
 *     void: Registers and schedules motion against the current document.
 */
function initializeMotion() {
  if (!window.gsap || !window.ScrollTrigger || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".hero-copy-block > *", { y: 26, opacity: 0, duration: .9, stagger: .09, ease: "expo.out" });
  gsap.from(".viewer-shell", { y: 42, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".viewer-shell", start: "top 88%", once: true } });
  gsap.fromTo(".scrub-copy span", { opacity: .16 }, { opacity: 1, stagger: .12, ease: "none", scrollTrigger: { trigger: ".scrub-copy", start: "top 78%", end: "bottom 52%", scrub: true } });
}

initializeMotion();
