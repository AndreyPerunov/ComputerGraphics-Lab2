"use client"

import { OrbitControls, PerspectiveCamera, useTexture } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Header } from "./Header"

const initialStates = {
  zoom: 1,
  dirLight: 1.4,
  pointLight: 0.6,
  spotLight: 0.8,
  dirLightAngle: 2
}

export const Scene3D = () => {
  const [resetKey, setResetKey] = useState(0)
  const [zoom, setZoom] = useState(initialStates.zoom)

  const [dirLight, setDirLight] = useState(initialStates.dirLight)
  const [pointLight, setPointLight] = useState(initialStates.pointLight)
  const [spotLight, setSpotLight] = useState(initialStates.spotLight)

  const [dirLightAngle, setDirLightAngle] = useState(initialStates.dirLightAngle)

  const selectedRef = useRef<THREE.Mesh | null>(null)
  const boxHelperRef = useRef<THREE.Mesh | null>(null)

  function handleReset() {
    setZoom(initialStates.zoom)
    setDirLight(initialStates.dirLight)
    setPointLight(initialStates.pointLight)
    setSpotLight(initialStates.spotLight)
    setDirLightAngle(initialStates.dirLightAngle)
    setResetKey(k => k + 1)
  }

  return (
    <div className="rounded border border-cyan-200 overflow-hidden w-[80vw] h-[70vh] relative">
      <Header handleReset={handleReset} zoom={zoom} setZoom={setZoom} dirLight={dirLight} setDirLight={setDirLight} pointLight={pointLight} setPointLight={setPointLight} spotLight={spotLight} setSpotLight={setSpotLight} dirLightAngle={dirLightAngle} setDirLightAngle={setDirLightAngle} />
      <Canvas
        shadows
        key={resetKey}
        onPointerMissed={() => {
          if (boxHelperRef.current) {
            boxHelperRef.current.removeFromParent()
            boxHelperRef.current = null
          }
          selectedRef.current = null
        }}
      >
        <PerspectiveCamera makeDefault position={[6, 6, 10]} fov={50} near={0.1} far={100} zoom={zoom} />
        <OrbitControls enablePan enableZoom enableRotate />
        <Scene dirLight={dirLight} pointLight={pointLight} spotLight={spotLight} selectedRef={selectedRef} boxHelperRef={boxHelperRef} dirLightAngle={dirLightAngle} />
      </Canvas>
    </div>
  )
}

type SceneProps = {
  dirLight: number
  pointLight: number
  spotLight: number
  selectedRef: React.RefObject<THREE.Mesh | null>
  boxHelperRef: React.RefObject<THREE.Mesh | null>
  dirLightAngle: number
}

function Scene({ dirLight, pointLight, spotLight, selectedRef, boxHelperRef, dirLightAngle }: SceneProps) {
  // TEXTURES
  const metalTexture = useTexture("/textures/metal.jpg", texture => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 2)
    texture.rotation = Math.PI / 4
    texture.center.set(0.5, 0.5)
  })
  const woodTexture = useTexture("/textures/wood.jpg", texture => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(3, 1)
  })
  const plasterTexture = useTexture("/textures/plaster.jpg", texture => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 2)
    texture.offset.set(0.25, 0)
  })
  const gridTexture = useTexture("/textures/grid.jpg", texture => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(10, 10)
    texture.anisotropy = 16
  })

  // CONTROLS
  const keys = useKeyboard()
  const SCALE_SPEED = 1.5
  useFrame((_, delta) => {
    if (!selectedRef.current) return

    // Move forward/backward
    if (keys.current["w"] || keys.current["W"] || keys.current["ц"] || keys.current["Ц"]) selectedRef.current.position.z -= delta * 3
    if (keys.current["s"] || keys.current["S"] || keys.current["ы"] || keys.current["Ы"]) selectedRef.current.position.z += delta * 3

    // Move left/right
    if (keys.current["a"] || keys.current["A"] || keys.current["ф"] || keys.current["Ф"]) selectedRef.current.position.x -= delta * 3
    if (keys.current["d"] || keys.current["D"] || keys.current["в"] || keys.current["В"]) selectedRef.current.position.x += delta * 3

    // Rotate left/right
    if (keys.current["q"] || keys.current["Q"] || keys.current["й"] || keys.current["Й"]) selectedRef.current.rotation.y += delta * 2
    if (keys.current["e"] || keys.current["E"] || keys.current["у"] || keys.current["У"]) selectedRef.current.rotation.y -= delta * 2
    // Move top/bottom
    if (keys.current["arrowup"]) selectedRef.current.position.y += delta * 2
    if (keys.current["arrowdown"]) selectedRef.current.position.y -= delta * 2

    // rotate up/down
    if (keys.current["arrowleft"]) selectedRef.current.rotation.z += delta * 2
    if (keys.current["arrowright"]) selectedRef.current.rotation.z -= delta * 2

    // Scaling
    if (keys.current["="] || keys.current["+"]) selectedRef.current.scale.multiplyScalar(1 + delta * SCALE_SPEED)
    if (keys.current["-"] || keys.current["_"]) selectedRef.current.scale.multiplyScalar(1 - delta * SCALE_SPEED)
  })

  // Handle object selection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onClick = (e: any, color: string) => {
    e.stopPropagation()

    selectedRef.current = e.object

    if (boxHelperRef.current) {
      boxHelperRef.current.removeFromParent()
      boxHelperRef.current = null
    }

    const box = createSelectionBox(e.object, parseInt(color))
    boxHelperRef.current = box
  }

  // Handle Hover
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPointerOver = (e: any) => {
    e.stopPropagation()
    document.body.style.cursor = "pointer"
  }

  const onPointerOut = () => {
    document.body.style.cursor = "default"
  }

  // Compute light positions based on angle
  const radius = 15

  const dirLightPosition: [number, number, number] = [
    Math.cos(dirLightAngle) * radius,
    10, // fixed height
    Math.sin(dirLightAngle) * radius
  ]
  return (
    <>
      {/* Lightning */}
      <ambientLight intensity={0.3} />
      <directionalLight intensity={dirLight} position={[dirLightPosition[0], dirLightPosition[1], dirLightPosition[2] * -1]} color={"magenta"} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-50} shadow-camera-right={50} shadow-camera-top={50} shadow-camera-bottom={-50} shadow-camera-near={1} shadow-camera-far={50} />
      <directionalLight intensity={dirLight} position={[dirLightPosition[0] * -1, dirLightPosition[1], dirLightPosition[2] * -1]} color={"yellow"} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-50} shadow-camera-right={50} shadow-camera-top={50} shadow-camera-bottom={-50} shadow-camera-near={1} shadow-camera-far={50} />
      <directionalLight intensity={dirLight} position={[dirLightPosition[0] * -1, dirLightPosition[1], dirLightPosition[2]]} color={"cyan"} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-50} shadow-camera-right={50} shadow-camera-top={50} shadow-camera-bottom={-50} shadow-camera-near={1} shadow-camera-far={50} />
      <pointLight position={[-5, 5, 5]} intensity={pointLight} />
      <spotLight position={[0, 8, -8]} intensity={spotLight} angle={0.3} penumbra={0.5} />

      {/* Objects */}
      {/* Sphere */}
      <mesh position={[-4, 0.5, 0]} castShadow receiveShadow onClick={e => onClick(e, "0x22d3ee")} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial map={metalTexture} />
      </mesh>
      {/* Torus */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 4, 0, 0]} castShadow receiveShadow onClick={e => onClick(e, "0xfee685")} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
        <torusGeometry args={[1.2, 0.4, 24, 64]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>
      {/* Cylinder */}
      <mesh position={[4, 0.5, 0]} castShadow receiveShadow onClick={e => onClick(e, "0xa4f4cf")} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
        <cylinderGeometry args={[1, 1, 2.5, 32]} />
        <meshStandardMaterial map={plasterTexture} />
      </mesh>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial map={gridTexture} />
      </mesh>
    </>
  )
}

function createSelectionBox(mesh: THREE.Mesh, color: number) {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({
    color,
    wireframe: true,
    depthTest: false
  })

  const box = new THREE.Mesh(geometry, material)

  mesh.geometry.computeBoundingBox()
  const bbox = mesh.geometry.boundingBox!

  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  bbox.getSize(size)
  bbox.getCenter(center)

  box.scale.copy(size)
  box.position.copy(center)

  mesh.add(box)

  return box
}

function useKeyboard() {
  const keys = useRef<Record<string, boolean>>({})

  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = true)
    const up = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = false)

    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)

    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [])

  return keys
}
