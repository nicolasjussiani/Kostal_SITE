# Product visualization assets

The five existing GLB files are preserved. Three additional assets were exported from the user's supplied Tripo Studio account and optimized locally with glTF Transform 4.5.0. No paid generation was submitted.

| Asset | Tripo project | Original bytes | Web bytes | Treatment |
| --- | --- | --- | --- | --- |
| window-switch.glb | 41c0e82e-0240-44a6-8da6-108f6fed7875 | 3590244 | 171936 | Meshopt, WebP 1024, preserve geometry |
| multifunction-stalk.glb | f8bf789b-1c91-4646-845b-e3fc630f64c4 | 57051572 | 908876 | Meshopt, WebP 2048, simplify ratio .04 / error .001 |
| signal-stalk.glb | e2bbf51a-52db-477d-abe4-84839b1dcaa0 | 56988700 | 1409156 | Meshopt, WebP 2048, simplify ratio .08 / error .001 |

The two steering-column stalks are representations of the same product family, explicitly presented as a variant. The window-switch asset depicts the cap and mounting interface side by side. Illustrative meshes are not dimensional CAD files or application-compatibility records; the interface links users to the official catalogue for those details.

Viewer verification: TypeScript, production build and binary GLB structural checks. Dynamic Three.js imports load only when the product viewport approaches the screen. Existing cinematic video and posters remain in place, with the journey shortened to 2.4 viewport lengths.
