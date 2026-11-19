# Medical Image Viewer

A static, browser-only DICOM series viewer built for GitHub Pages. Local files are decoded in memory and are never uploaded or persisted by the application.

## Features

- Multi-file and folder selection
- Generic `.dcm` support with no dataset-specific assumptions
- Slice navigation by slider, mouse wheel, buttons, and arrow keys
- Switchable window/level and pan drag modes, with wheel or trackpad zoom while panning
- Zoom, invert, reset, fullscreen, and PNG snapshot export
- Basic non-identifying DICOM metadata
- Explicit session cleanup
- Mobile-first responsive interface

## Run locally

Serve the repository with any static HTTP server. For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

In the GitHub repository, open **Settings → Pages**, select **Deploy from a branch**, and choose the `main` branch and `/ (root)` directory.

## Privacy

The application does not upload DICOM files and does not use cookies, analytics, localStorage, IndexedDB, or a backend database. Selected files exist only in the current browser session. Do not add clinical DICOM files to this repository.

## Disclaimer

This educational viewer is not a certified medical device and must not be used for diagnosis or treatment decisions.

Compatibility depends on the transfer syntaxes supported by the bundled Cornerstone WADO image loader. Unsupported or malformed DICOM files are rejected locally.
