import { Info, Keyboard, MousePointerClick, Move3d, RefreshCcw, SlidersHorizontal } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"

type HeaderProps = {
  handleReset: () => void
  zoom: number
  setZoom: (value: number) => void
  dirLight: number
  setDirLight: (value: number) => void
  pointLight: number
  setPointLight: (value: number) => void
  spotLight: number
  setSpotLight: (value: number) => void
  dirLightAngle: number
  setDirLightAngle: (value: number) => void
}

export const Header = ({ handleReset, zoom, setZoom, dirLight, setDirLight, pointLight, setPointLight, spotLight, setSpotLight, dirLightAngle, setDirLightAngle }: HeaderProps) => {
  return (
    <div className="items-center m-4 gap-4 absolute top-0 left-0 z-50 hidden md:flex">
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1 border border-cyan-200 rounded hover:bg-cyan-200/20 transition">
              <Info className="text-cyan-200" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="rounded">
            <h1 className="text-xl">Controls Guide</h1>
            <div className="space-y-2">
              <p>
                Select an object by clicking on it. Click away to deselect. <MousePointerClick />
              </p>
              <p>
                Move selected object:
                <Keyboard />
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Forward/Backward: <Kbd>W</Kbd> / <Kbd>S</Kbd>
                </li>
                <li>
                  Left/Right: <Kbd>A</Kbd> / <Kbd>D</Kbd>
                </li>
                <li>
                  Up/Down: <Kbd>↑</Kbd> / <Kbd>↓</Kbd>
                </li>
                <li>
                  Rotate around Y: <Kbd>Q</Kbd> / <Kbd>E</Kbd>
                </li>
                <li>
                  Rotate around Z: <Kbd>←</Kbd> / <Kbd>→</Kbd>
                </li>
              </ul>
              <p>
                Navigate the scene using mouse controls.
                <Move3d />
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Rotate: <Kbd>Left Click</Kbd> + <Kbd>Drag</Kbd>
                </li>
                <li>
                  Zoom: <Kbd>Mouse Wheel</Kbd>
                </li>
                <li>
                  Pan: <Kbd>Right Click</Kbd> + <Kbd>Drag</Kbd>
                </li>
              </ul>
              <p>
                Button controls: <SlidersHorizontal />
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Reset scene to initial state using the <span className="text-cyan-400 font-bold">Reset</span> button.
                </li>
                <li>Adjust zoom and lighting using the sliders.</li>
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
        <button onClick={handleReset} className="px-3 py-1 border border-cyan-200 rounded hover:bg-cyan-200/20 transition cursor-pointer flex gap-2 text-cyan-200 items-center group">
          Reset
          <RefreshCcw className="group-hover:rotate-180 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <label className="flex flex-col gap-1">
          Zoom ({zoom.toFixed(1)}){/* Cyan color sliders */}
          <input type="range" min={0.5} max={2} step={0.1} value={zoom} onChange={e => setZoom(Number(e.target.value))} className="accent-cyan-400 cursor-pointer" />
        </label>
        <label className="flex flex-col gap-1">
          Directional Light ({dirLight.toFixed(1)})
          <input type="range" min={0} max={2} step={0.1} value={dirLight} onChange={e => setDirLight(Number(e.target.value))} className="accent-cyan-400 cursor-pointer" />
        </label>

        <label className="flex flex-col gap-1">
          Point Light ({pointLight.toFixed(1)})
          <input type="range" min={0} max={2} step={0.1} value={pointLight} onChange={e => setPointLight(Number(e.target.value))} className="accent-cyan-400 cursor-pointer" />
        </label>

        <label className="flex flex-col gap-1">
          Spot Light ({spotLight.toFixed(1)})
          <input type="range" min={0} max={2} step={0.1} value={spotLight} onChange={e => setSpotLight(Number(e.target.value))} className="accent-cyan-400 cursor-pointer" />
        </label>
        <label className="flex flex-col gap-1">
          Directional Light Angle ({dirLightAngle.toFixed(2)} rad)
          <input type="range" min={0} max={Math.PI * 2} step={0.01} value={dirLightAngle} onChange={e => setDirLightAngle(Number(e.target.value))} className="accent-cyan-400 cursor-pointer" />
        </label>
      </div>
    </div>
  )
}
