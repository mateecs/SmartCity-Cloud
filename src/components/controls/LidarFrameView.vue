<!--
  Displays individual frames of an image sequence (IMG_SEQ) sensor
-->

<template>
  <div class="lidar-container">
    <b-spinner v-if="initalizing" type="grow" size="sm" class="padding: 1rem;" />
    <div v-show="!initalizing" class="lidar-controls">
      <!-- <b-button size="sm">Ego-View</b-button>
      <b-button  size="sm">Top-View</b-button> -->

      <b-form-group v-slot="{ ariaDescribedby }">
        <b-form-radio-group
          v-model="selectedView"
          :aria-describedby="ariaDescribedby"
        >
          <b-form-radio value="ego">Ego-View</b-form-radio>
          <b-form-radio value="top">Top-View</b-form-radio>
        </b-form-radio-group>
      </b-form-group>

    </div>
    <div v-show="!initalizing" class="three-container" ref="threeContainer"></div>
  </div>
</template>

<style scoped>
.lidar-container {
  position: relative;

  display: flex;
  flex-direction: column;
}

.lidar-controls {
  padding-bottom: 1rem;
}
.lidar-controls > * {
  margin: 0 0.25rem;
}

.three-container {
  flex: 1;
  min-height: 450px;
  margin: 0 -18px -18px;
  /* hack: remove spacing from parent */
}
</style>

<script>
import TestDriveRepository from 'repo/TestDriveRepository'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// FPS Stats
// import Stats from 'three/examples/jsm/libs/stats.module.js'
import dayjs from 'dayjs'

const POINT_SIZE = 0.25 // m
const POINT_SIZE_TOP_VIEW = 3.5 // m
const BUFFER_SIZE = 10 // s
const FRAMES_PER_REQUEST = 1 // 16 // batch loading disabled in api
const PARSING_WORKERS = 4

export default {
  name: 'LidarFrameView',
  props: {
    testDriveId: String,
    sensorId: String,
    position: Number,
    isPlaying: Boolean,
    playbackSpeed: Number
  },
  watch: {
    position: async function (position) {
      const diff = Math.abs(position - this.internPosition)
      if (diff > 500) {
        console.warn('positions not identical enough; diff=', diff)
        this.internPosition = position

        this.updateCurrentFrameIndex()

        if (this.isLoadingBuffer) {
          // wait for cancelation of updateBuffer()
          while (this.isLoadingBuffer) { await new Promise(resolve => setTimeout(resolve, 1)) }
        }
      }

      this.updateBuffer()
    },
    playbackSpeed: function (val, oldVal) {
      if (val < oldVal) {
        this.skippedFrameCount = 0
      }
    },
    modOfBuffer: function (newVal, oldVal) {
      if (newVal > oldVal && this.waitAfterModOfBufferInc === false) {
        this.waitAfterModOfBufferInc = true
        setTimeout(() => {
          this.waitAfterModOfBufferInc = false
        }, 2000 * this.playbackSpeedFactor)
      }
    },
    selectedView: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setCamera()
      }
    }
  },
  computed: {
    modOfBuffer () {
      return Math.pow(2, Math.round((this.skippedFrameCount / (FRAMES_PER_REQUEST + 1)) - 0.5))
    },
    playbackSpeedFactor () {
      return (this.playbackSpeed / 1000)
    }
  },
  data: () => {
    return {
      initalizing: true,
      destroyed: false,
      isLoading: false,
      isLoadingBuffer: false,
      selectedView: 'ego',
      font: null,
      camera: null,
      container: null,
      resizeObserver: null,
      scene: null,
      grid: null,
      stats: null,
      controls: null,
      internPosition: 0,
      currentFrameIndex: 0,
      availableTimestamps: [],
      frameBuffer: [],
      speed: 10,
      workers: [],
      nextWorker: 0,
      workerResolvers: {},
      skippedFrameCount: 0,
      waitAfterModOfBufferInc: false,
      retryAfterPlaceholderTimeout: null
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    this.destroyed = true
    this.renderer.setAnimationLoop(null)
    this.renderer.dispose()
    this.renderer = null
    this.scene = null
    this.destroyWorker()
    // this.resizeObserver.disconnect()
    this.resizeObserver = null
  },
  methods: {
    async init () {
      this.initalizing = true

      this.initWorker()
      this.initWebGl()

      const response = await TestDriveRepository.getTimestamps(this.testDriveId, this.sensorId)
      this.availableTimestamps = response.data.values.map(v => dayjs(v.timestamp).valueOf())

      this.internPosition = this.position
      this.updateCurrentFrameIndex()

      this.frameBuffer = this.availableTimestamps.map(() => null)

      await this.updateBuffer()
      await this.loadFrameFromBuffer(this.currentFrameIndex)

      this.initalizing = false
    },
    initWebGl () {
      // todo: new version of THREE: FontLoader is not exported
      // new THREE.FontLoader().loadAsync('/fonts/helvetiker_regular.typeface.json').then((font) => { this.font = font })

      this.container = this.$refs.threeContainer

      const containerSize = this.container.getBoundingClientRect()

      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xffffff)
      this.scene.fog = new THREE.Fog(0xeeeeee, 150, 300)

      this.setCamera()

      this.grid = new THREE.GridHelper(400, 80, 0x000000, 0x000000)
      this.grid.position.z = 0
      this.grid.material.opacity = 0.05
      this.grid.material.depthWrite = false
      this.grid.material.transparent = true
      this.scene.add(this.grid)

      const groundGeometry = new THREE.PlaneGeometry(400, 400)
      const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, opacity: 0.05, transparent: true, side: THREE.DoubleSide })
      const ground = new THREE.Mesh(groundGeometry, groundMaterial)
      ground.rotateX(Math.PI / 2)
      // this.scene.add(ground)

      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setSize(containerSize.width, containerSize.height)
      this.renderer.setAnimationLoop(this.animate)

      // FPS Stats
      // this.stats = new Stats()
      // this.stats.dom.style.position = 'absolute'
      // this.container.appendChild(this.stats.dom)

      this.container.appendChild(this.renderer.domElement)

      this.resizeObserver = new ResizeObserver(this.changeSize).observe(
        this.container
      )
    },
    setCamera () {
      const containerSize = this.container.getBoundingClientRect()

      let setOrbitControls = false
      let pointSize = POINT_SIZE

      // clean labels
      const oldLabels = this.scene.getObjectByName('Labels')
      if (oldLabels) {
        this.scene.remove(oldLabels)
      }

      if (this.selectedView === 'top') {
        const frustumHeight = 150
        const ratio = (containerSize.width / containerSize.height)
        this.camera = new THREE.OrthographicCamera(
          -ratio * frustumHeight / 2,
          ratio * frustumHeight / 2,
          frustumHeight / 2,
          -frustumHeight / 2,
          0,
          1000
        )
        this.camera.position.y = 25
        this.camera.position.z = -frustumHeight / 2
        this.camera.position.x = 0

        this.camera.lookAt(0, 0, -frustumHeight / 2)

        // Labels
        const labels = new THREE.Object3D()
        labels.name = 'Labels'
        const gridCountX = ratio * frustumHeight / 20
        for (let i = 0; i < gridCountX; i++) {
          const pos = (i - Math.round(gridCountX / 2)) * 20

          const shapes = this.font.generateShapes(pos.toString(), 4)
          const geometry = new THREE.ShapeGeometry(shapes)
          geometry.computeBoundingBox()
          const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
          geometry.translate(xMid, 0, 0)
          const label = new THREE.Mesh(geometry, new THREE.LineBasicMaterial({
            color: '#000000',
            side: THREE.DoubleSide
          }))
          label.position.set(pos, 0, -(frustumHeight - 5))
          label.rotateX(-90)
          labels.add(label)
        }
        const gridCountY = frustumHeight / 20
        for (let i = 0; i < gridCountY; i++) {
          const pos = i * 20

          const shapes = this.font.generateShapes(pos.toString(), 4)
          const geometry = new THREE.ShapeGeometry(shapes)
          geometry.computeBoundingBox()
          const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
          geometry.translate(xMid, 0, 0)
          const label = new THREE.Mesh(geometry, new THREE.LineBasicMaterial({
            color: '#000000',
            side: THREE.DoubleSide
          }))
          label.position.set(ratio * frustumHeight / 2 - 5, 0, -pos)
          // label.rotateY(-180)
          label.rotateX(-90)

          // const label = this.makeTextSprite(i, { fontsize: 5 })
          // label.position.set(pos, 0, 0)
          labels.add(label)
        }
        this.scene.add(labels)

        pointSize = POINT_SIZE_TOP_VIEW
      } else {
        this.camera = new THREE.PerspectiveCamera(
          75,
          containerSize.width / containerSize.height,
          0.1,
          1000
        )
        this.camera.position.y = 1.5
        this.camera.position.z = 1.5
        this.camera.position.x = 0

        setOrbitControls = true
      }

      const mesh = this.scene.getObjectByName('PointCloud')
      if (mesh) {
        this.scene.remove(mesh)
        mesh.material = new THREE.PointsMaterial({ size: pointSize, vertexColors: true })
        this.scene.add(mesh)
      }

      this.camera.updateProjectionMatrix()
      if (this.camera) {
        this.scene.remove(this.camera)
      }
      this.scene.add(this.camera)

      if (this.controls) {
        this.controls.dispose()
        this.controls = null
      }
      if (setOrbitControls) {
        this.controls = new OrbitControls(this.camera, this.container)
        this.controls.target.set(0, 1.5, -20)
        this.controls.update()
      }
    },
    initWorker () {
      for (let i = 0; i < PARSING_WORKERS; i++) {
        const worker = new Worker('@/workers/LidarPointCloudMeshLoader.worker.js', { type: 'module' })
        worker.onmessage = e => {
          const { timestamp, meshBuffers } = e.data
          if (this.workerResolvers[timestamp]) {
            for (const resolve of this.workerResolvers[timestamp]) {
              resolve(meshBuffers)
            }
            delete this.workerResolvers[timestamp]
          }
        }
        this.workers.push(worker)
      }
    },
    parseOnWorker (data) {
      if (this.destroyed) { return }
      this.workers[this.nextWorker++].postMessage(data)
      if (this.nextWorker >= PARSING_WORKERS) {
        this.nextWorker = 0
      }
    },
    destroyWorker () {
      for (const worker of this.workers) {
        worker.terminate()
      }
      this.workers = []
    },
    changeSize () {
      if (this.destroyed) { return }
      const containerSize = this.container.getBoundingClientRect()

      this.renderer.setSize(containerSize.width, containerSize.height)

      this.setCamera()
      // this.camera.aspect = containerSize.width / containerSize.height
      // this.camera.updateProjectionMatrix()

      // this.controls.handleResize()
    },
    animate () {
      if (this.destroyed) { return }

      const renderTime = performance.now() / 1000 // in s
      const dt = renderTime - this.lastRenderTime
      this.lastRenderTime = renderTime

      if (this.isPlaying) {
        // const ds = this.speed * dt * this.playbackSpeedFactor
        // this.grid.position.z = (this.grid.position.z + ds) % 5

        this.internPosition += dt * 1000 * this.playbackSpeedFactor

        if (this.updateCurrentFrameIndex()) {
          this.loadFrameFromBuffer(this.currentFrameIndex)
        }
      }

      this.updateBuffer()

      if (this.controls) {
        this.controls.update()
      }

      this.renderer.render(this.scene, this.camera)

      // FPS Stats
      // this.stats.update()
    },
    getIndexByPosition (position) {
      const posTs = dayjs(position).valueOf()
      for (let i = 0; i < this.availableTimestamps.length; i++) {
        if (posTs < this.availableTimestamps[i]) {
          return Math.max(0, i - 1)
        }
      }
      return this.availableTimestamps.length - 1
    },
    updateCurrentFrameIndex () {
      const newIndex = this.getIndexByPosition(this.internPosition)

      if (this.currentFrameIndex !== newIndex) {
        this.currentFrameIndex = newIndex
        return true
      }
      return false
    },
    async retrieveFrame (position) {
      try {
        const frame = await TestDriveRepository.getFrameDirect(this.testDriveId, this.sensorId, dayjs(position).valueOf())
        return { data: await frame.data.arrayBuffer(), shape: JSON.parse(frame.headers.shape) }
      } catch (e) {
        console.error(e)
      }
    },
    async retrieveFrames (positions) {
      // Load frames in Batches (disabled in API)
      // try {
      //   return (await TestDriveRepository.getFramesDirect(this.testDriveId, this.sensorId, positions.map(p => dayjs(p).valueOf()))).data.values
      // } catch (e) {
      //   console.error(e)
      // }
      const frames = []
      for (const p of positions) {
        frames.push(await this.retrieveFrame(p))
      }
      return frames
    },
    async retrieveFrameToBufferByIndex (indexArray) {
      if (!Array.isArray(indexArray)) {
        indexArray = [indexArray]
      }

      const positions = indexArray.map(i => this.availableTimestamps[i])

      const frames = await this.retrieveFrames(positions)

      for (let i = 0; i < frames.length; i++) {
        const bufferIndex = indexArray[i]
        const f = frames[i]

        const webWorkerTask = new Promise(resolve => {
          if (this.workerResolvers[f.timestamp]) {
            this.workerResolvers[f.timestamp].push(resolve)
          } else {
            this.workerResolvers[f.timestamp] = [resolve]
          }
        })

        // Placeholder: will replaced by parsed points
        const placeholder = new THREE.Points()
        placeholder.name = 'placeholder'
        this.frameBuffer[bufferIndex] = placeholder

        webWorkerTask.then((buffer) => {
          const geometry = new THREE.BufferGeometry()
          geometry.setAttribute('position', new THREE.Float32BufferAttribute(buffer.vertices, 3))
          geometry.setAttribute('color', new THREE.Float32BufferAttribute(buffer.colors, 3))
          geometry.computeBoundingSphere()

          const material = new THREE.PointsMaterial({ size: POINT_SIZE, vertexColors: true })
          // material.color.setHex(0x000000)

          const pointCloudMesh = new THREE.Points(geometry, material)
          pointCloudMesh.name = 'PointCloud'

          this.frameBuffer[bufferIndex] = pointCloudMesh
        })

        this.parseOnWorker(f)
      }
    },
    async updateBuffer () {
      if (this.isLoadingBuffer) {
        return
      }
      this.isLoadingBuffer = true

      try {
        const taskIndices = []
        for (let i = 0; i < this.availableTimestamps.length; i++) {
          if (i < this.currentFrameIndex) {
            if (i < (this.currentFrameIndex - 16) && this.frameBuffer[i] !== null) {
              // del old (keep 16 old frames)
              this.frameBuffer[i].geometry.dispose()
              this.frameBuffer[i].material.dispose()
              this.frameBuffer[i] = null
            }
          } else if (this.frameBuffer[i] === null && (i % this.modOfBuffer) === 0) {
            // load new
            const dt = this.availableTimestamps[i] - this.availableTimestamps[this.currentFrameIndex]

            if (dt < (BUFFER_SIZE * 1000) * this.playbackSpeedFactor) {
              taskIndices.push(i)

              if (taskIndices.length >= FRAMES_PER_REQUEST) {
                break
              }
            }
          }
        }

        if (taskIndices.length > 0) {
          console.log(`buffer ${taskIndices.length} frame(s); buffer length = ${this.frameBuffer.filter(b => b !== null).length}`)
          await this.retrieveFrameToBufferByIndex(taskIndices)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoadingBuffer = false
      }
    },
    async loadFrameFromBuffer (index, incSkippedFrameCount = true) {
      let mesh = null

      if (this.retryAfterPlaceholderTimeout !== null) {
        clearTimeout(this.retryAfterPlaceholderTimeout)
        this.retryAfterPlaceholderTimeout = null
      }

      if (this.frameBuffer.length > index && this.frameBuffer[index] !== null) {
        mesh = this.frameBuffer[index]
        if (mesh.name === 'placeholder') {
          mesh = null
          console.warn('hit placeholder')
          this.retryAfterPlaceholderTimeout = setTimeout(() => this.loadFrameFromBuffer(index, false), 50)
        }
      }

      if (incSkippedFrameCount && mesh === null && index % this.modOfBuffer === 0) {
        if (!this.waitAfterModOfBufferInc) {
          this.skippedFrameCount++
          console.warn('skip frame (not in buffer); inc skippedFrameCount =', this.skippedFrameCount)
        } else {
          console.warn('skip frame; but wait a second; modOfBuffer = ', this.modOfBuffer)
        }
        return
      }

      if (mesh !== null) {
        this.scene.remove(this.scene.getObjectByName('PointCloud'))

        if (this.selectedView === 'top') {
          mesh.material = new THREE.PointsMaterial({ size: POINT_SIZE_TOP_VIEW, vertexColors: true })
        }

        this.scene.add(mesh)
      }
    }
  }
}
</script>
