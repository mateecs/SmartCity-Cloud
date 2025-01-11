/* eslint-disable */
import Color from 'color'

function decodeAndReshape(frameDirectResponse) {
  //const value = frameDirectResponse.value
  //const base64 = value // value.substring(2, value.length - 2)
  //const blob = atob(base64)
  //const valByte = Uint8Array.from(blob, c => c.charCodeAt(0))
  //const buffer = valByte.buffer

  const buffer = frameDirectResponse.data

  let result = null

  // TODO: support other dtypes
  const arr1D = new Float32Array(buffer)
  // console.log(arr1D)

  // const cols = frameDirectResponse.cols
  const shape = frameDirectResponse.shape

  if (shape.length === 2) {
    const rows = Number.parseInt(shape[0])
    const cols = Number.parseInt(shape[1])
    let offset = 0

    const arr = Array(rows)
    
    for (let i = 0; i < rows; i++) {
      const subArr = new Float32Array(cols)
      for (let j = 0; j < cols; j++) {
        subArr[j] = arr1D[offset + j]
      }
      arr[i] = subArr
      offset += cols
    }
    result = arr
  } else if (shape.length === 1) {
    result = arr1D
  } else {
    console.error('max 2d shape supported')
  }

  return result
}

function loadMeshArrayBuffers (pointCloud) {
  let iv = 0
  let ic = 0
  const vertices = new Array(pointCloud.length * 3)
  const colors = new Array(pointCloud.length * 3)

  for (const p of pointCloud) {
    vertices[iv++] = p[0] // x
    vertices[iv++] = p[2] // y
    vertices[iv++] = -p[1] // z

    const c = Color.hsl(Math.abs(p[1] * 25) % 360, 100, 20)
    colors[ic++] = c.red() / 255
    colors[ic++] = c.green() / 255
    colors[ic++] = c.blue() / 255
  }

  return  {vertices, colors}
}

addEventListener('message', event => {
  // var start = performance.now()

  const encodedFrameResponse = event.data

  const frameData = decodeAndReshape(encodedFrameResponse)
  const meshBuffers = loadMeshArrayBuffers(frameData);

  // console.log('worker time: ', performance.now() - start, 'ms')

  postMessage({ timestamp: encodedFrameResponse.timestamp, meshBuffers })
})
