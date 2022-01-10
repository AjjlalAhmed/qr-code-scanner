<template>
  <!-- <h1>Qr scanner prototype</h1>
  <div class="container">
    <video class="stream" ref="stream"></video>
  </div>
  <div class="btns">
    <button class="start" @click="startScanning">Start scanning</button>
  </div>
  <div class="result">
    <h1>Result</h1>
    <p>{{ qrResult }}</p>
  </div>
  <div class="result">
    <h1>Error</h1>
    <p>{{ qrError }}</p>
  </div> -->
  <div class="jsqr">
    <h1>Qr scanner prototype</h1>

    <canvas
      :width="canvasWidth"
      :height="canvasHeight"
      id="canvas"
      v-show="showCanvas"
      ref="canvasElement"
    ></canvas>

    <div id="output" v-if="showCanvas">
      <div v-if="!outputData">No QR code detected.</div>
      <div v-else>
        <b>Data:</b>
        <span id="outputData">{{ outputData }}</span>
      </div>
    </div>
    <button @click="openScan">start</button>
  </div>
</template>

<script>
// import QrScanner from "./assets/js/qr-scanner";
// QrScanner.WORKER_PATH = "./assets/js/qr-scanner.worker";
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
export default {
  name: "App",
  setup() {
    const video = ref(null);
    const showCanvas = ref(false);
    const canvas2d = ref(undefined);
    const outputData = ref(undefined);
    const canvasWidth = ref(320);
    const canvasHeight = ref(480);
    const canvasElement = ref(null);

    onMounted(() => {
      video.value = document.createElement("video");
    });

    const tick = () => {
      if (video.value.readyState === video.value.HAVE_ENOUGH_DATA) {
        showCanvas.value = true;
        canvasHeight.value = video.value.videoHeight;
        canvasWidth.value = video.value.videoWidth;
        !canvas2d.value &&
          (canvas2d.value = canvasHeight.value.getContext("2d"));
        canvas2d.value.drawImage(
          video.value,
          0,
          0,
          canvasWidth.value,
          canvasHeight.value
        );
        var imageData = canvas2d.value.getImageData(
          0,
          0,
          canvasWidth.value,
          canvasHeight.value
        );
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        console.log(code);
        if (code) video.value.srcObject = null;
        if (code) showCanvas.value = false;
      }
      requestAnimationFrame(tick());
    };

    const openScan = () => {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.value.srcObject = stream;
        video.value.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.value.play();
        requestAnimationFrame(tick());
      });
    };

    return {
      openScan,
      showCanvas,
      canvasWidth,
      canvasHeight,
      canvasElement,
      outputData,
    };

    // const stream = ref(null);
    // const qrResult = ref(null);
    // const qrError = ref(null);
    // const scanner = ref(null);
    // const hasCamera = ref(false);
    // onMounted(async () => {
    //   hasCamera.value = await QrScanner.hasCamera();
    //   if (!hasCamera.value) return (qrError.value = "Camera not found");
    //   const videoTag = document.querySelector(".stream")
    //   scanner.value = new QrScanner(
    //     videoTag,
    //     (result) => (qrResult.value = result),
    //     (error) => (qrError.value = error)
    //   );
    // });
    // const startScanning = async () => {
    //   if (!hasCamera.value)
    //     return alert("This device does not have any camera");
    //   await scanner.value.start();
    // };
    // return { stream, startScanning, qrResult, qrError };
  },
};
</script>

<style>
h1 {
  font-size: 1.5em;
  text-align: center;
  padding: 10px;
  font-family: monospace;
}
p {
  font-size: 1.2em;
  text-align: center;
  font-family: monospace;
  border: 1px solid #2222;
  min-height: 20px;
  padding: 10px;
  margin: 0px 20px;
}
.container {
  width: 90%;
  margin: 10px auto;
}
.stream {
  border: 1px solid #2222;
  border-radius: 5px;
  width: 100%;
  height: 200px;
}
.btns {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: center;
}
.btns > button {
  width: 100%;
  padding: 10px;
  background: dodgerblue;
  border: 0px;
  border-radius: 5px;
  text-transform: capitalize;
  font-size: 1.5rem;
  color: white;
}
</style>
