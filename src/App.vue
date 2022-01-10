<template>
  <h1>Qr scanner prototype</h1>
  <div class="container">
    <video class="stream" ref="stream"></video>
  </div>
  <div class="btns">
    <button class="start" @click="startScanning">Start scanning</button>
  </div>
  <div class="result">
    <h1>Result</h1>
    <div v-html="qrResult"></div>
  </div>
  <div class="result">
    <h1>Error</h1>
    <p>{{ qrError }}</p>
  </div>
</template>

<script>
import QrScanner from "./assets/js/qr-scanner.min.js";
QrScanner.WORKER_PATH = "./assets/js/qr-scanner-worker.min.js";
import { ref } from "@vue/reactivity";
// import { onMounted } from "@vue/runtime-core";
export default {
  name: "App",
  setup() {
    const stream = ref(null);
    const qrResult = ref(null);
    const qrError = ref(null);
    const scanner = ref(null);
    const hasCamera = ref(false);
    // onMounted(async () => {
    //   hasCamera.value = await QrScanner.hasCamera();
    //   if (!hasCamera.value) return (qrError.value = "Camera not found");
    //   const videoTag = document.querySelector(".stream");
    //   scanner.value = new QrScanner(
    //     videoTag,
    //     (result) => (qrResult.value = result),
    //     (error) => (qrError.value = error)
    //   );
    // });
    let count = 0;
    const tick = () => {
      count++;
      const canvas = document.createElement("canvas");
      canvas
        .getContext("2d")
        .drawImage(stream.value, 0, 0, canvas.width, canvas.height);
      let image_data_url = canvas.toDataURL("image/jpeg");

      function dataURItoBlob(dataURI) {
        var binary = atob(dataURI.split(",")[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
      }
      // var image = new Image();
      // image.src = image_data_url;
      var blob = dataURItoBlob(image_data_url);
      qrResult.value = blob;
      // qrResult.value = `<img src="${image.src}" />`;
      QrScanner.scanImage(blob)
        .then((result) => (qrResult.value = result))
        .catch((error) => {
          qrError.value = error + count;
          requestAnimationFrame(tick);
        });
    };

    const startScanning = async () => {
      // if (!hasCamera.value)
      //   return alert("This device does not have any camera");
      // await scanner.value.start();
      stream.value.style.width = document.width + "px";
      stream.value.style.height = document.height + "px";
      stream.value.setAttribute("autoplay", "");
      stream.value.setAttribute("muted", "");
      stream.value.setAttribute("playsinline", "");
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { facingMode: "environment" },
        })
        .then((streamData) => {
          stream.value.srcObject = streamData;
          requestAnimationFrame(tick);
        });

      // stream.value.play();
      // requestAnimationFrame(tick);
    };
    return { stream, startScanning, qrResult, qrError };
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
