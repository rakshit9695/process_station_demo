# 3D PLC model

The PLC page renders a **procedural, license-free Siemens S7-1200-style model**
built directly in `react-three-fiber`
(`frontend/components/PLC3D.jsx`). It was chosen over a downloaded CAD/GLB file
because:

- it carries **no licensing ambiguity** (many "free" S7-1200 models are
  non-commercial / attribution-restricted),
- it is **lightweight** (no multi-MB asset to ship), and
- its **status + output LEDs animate live** with the simulation.

## Want to use a real extracted model instead?

1. Get an open-licensed S7-1200 model (`.glb`/`.gltf`) — e.g. from GrabCAD,
   Sketchfab (CC-BY), or by exporting Siemens' STEP to glTF in Blender.
2. Save it as `frontend/public/models/plc.glb`.
3. In `frontend/components/PLC3D.jsx`, replace the `<PlcModel/>` contents with:

   ```jsx
   import { useGLTF } from "@react-three/drei";
   function PlcModel() {
     const { scene } = useGLTF("/models/plc.glb");
     return <primitive object={scene} />;
   }
   ```

The rest of the page (panel, ladder, transport) is independent of the 3D asset.
