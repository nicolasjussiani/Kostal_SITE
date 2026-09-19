# Scroll-driven product experience

The opening uses three existing catalogue meshes: combined stalk 12270239,
window module 10020532, and airbag clock spring 10094738. It does not generate
new assets or expand the one-product-per-category catalogue scope.

## Interaction and rendering

- A sticky stage moves and rotates actual GLB meshes as the user scrolls.
- Chapter buttons navigate directly to Command, Connection and Movement.
- Pause freezes the motion while keeping page scrolling available.
- Reduced-motion preferences replace the long scroll sequence with one static
  viewport and manual chapter selection.
- One lazily initialized WebGL canvas serves all three meshes. Rendering is
  scheduled on scroll/resize only, with a 1.5 device-pixel-ratio cap.
- Offscreen/hidden pages do not render the scene. Fetches are aborted and GPU
  resources released on unmount; late model results are also disposed.
- Source photographs remain visible until the scene is ready, and on failure.
- The pre-existing video scrub engine remains intact, in a shorter engineering
  film section after the product catalogue.

## Interface

The design adds a light product stage, technical reference rings, chapter
navigation, page progress, image thumbnails in the catalogue, progressive
section entrances, and responsive navigation. The logo uses its original
colours so its white background is not flattened by an inversion filter.

## Texture loading

GLTFLoader reads embedded images through temporary Blob URLs. The CSP allows
these in `img-src` and `connect-src`, alongside the existing WebAssembly
decoding permission. Without this, meshes loaded but rendered without texture.

## Validation

TypeScript and a production build using `VERCEL=1`. Browser checks cover the
three chapter transitions, pause/resume, the mobile menu, catalogue photo/3D
switching, textured rendering and horizontal overflow on mobile. Automatic
reduced-motion handling is implemented through `matchMedia` and CSS.
