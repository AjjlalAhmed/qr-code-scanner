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
    <video width="300" height="300" class="video"></video>
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
import adapter from "webrtc-adapter";
import jsQR from "jsqr";
export default {
  name: "App",
  setup() {
    const video = ref(null);
    const showCanvas = ref(false);
    const outputData = ref(undefined);
    const canvas = ref(null);
    const ctx = ref(null);

    onMounted(() => {
      video.value = document.querySelector(".video");
      canvas.value = document.createElement("canvas");
      ctx.value = canvas.getContext("2d");
    });

    const tick = (data) => {
      ctx.clearRect(0, 0, 400, 400);
      ctx.drawImage(video.value, 0, 0, 400, 400);
      var data = ctx.getImageData(0, 0, 400, 400).data;
      const code = jsQR(data, width, height);

      if (code) {
        console.log("Found QR code", code);
      }
    };

    const openScan = () => {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "environment",
          },
        })
        .then((stream) => {
          video.value.srcObject = stream;
          requestAnimationFrame(tick);
        })
        .catch(console.error);
    };

    return {
      openScan,
      showCanvas,
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
