# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML, CSS, and JavaScript deployed on GitHub Pages. Cornerstone and dicom-parser provide in-browser DICOM decoding.

## Users

People who need to inspect a local DICOM image or series without installing a desktop viewer or uploading clinical files to a server.

## Product Purpose

Open local `.dcm` files, navigate a series, inspect non-identifying metadata, adjust the viewport, and export a PNG snapshot. Success means a selected series becomes inspectable quickly while remaining on the user's device.

## Positioning

The viewer performs decoding and interaction entirely inside the current browser tab. It requires no account, backend, cloud upload, or persistent browser storage.

## Operating Context

Users select individual DICOM files or a folder, navigate slices with direct controls or a keyboard, switch between window/level and pan drag modes, and clear the session when finished.

## Capabilities and Constraints

- Supports DICOM transfer syntaxes handled by the pinned Cornerstone WADO image loader.
- Handles single files and multi-file series without assumptions about the reference dataset's size or filenames.
- Shows modality, series description, dimensions, slice thickness, and filename; it does not display patient identity fields.
- Files and decoded images exist only in browser memory and are purged on explicit clear or page exit.
- This educational viewer is not a certified medical device and must not be used for diagnosis or treatment decisions.

## Evidence on Hand

- The existing application and README define the working feature set and privacy boundary.
- A 399-slice local CT series has been used for functional verification but is excluded from the repository.
- No testimonials, clinical claims, performance benchmarks, or certification evidence exist and none may be fabricated.

## Product Principles

- Make loading a scan the unmistakable primary action.
- Keep the image viewport visually dominant once a series is loaded.
- Preserve familiar imaging controls and visible system state.
- Minimize visual and cognitive noise around the clinical image.
- Keep all image data local and make cleanup explicit.

## Accessibility & Inclusion

Use semantic HTML, keyboard-operable controls, visible focus states, high contrast, reduced-motion support, and responsive layouts for desktop and mobile browsers.
