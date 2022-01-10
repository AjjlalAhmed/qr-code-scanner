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
    <p>{{ qrResult }}</p>
  </div>
  <div class="result">
    <h1>Error</h1>
    <p>{{ qrError }}</p>
  </div>
</template>

<script>
import QrScanner from "qr-scanner";
QrScanner.WORKER_PATH = "../node_modules/qr-scanner/qr-scanner-worker.min.js";
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
export default {
  name: "App",
  setup() {
    const stream = ref(null);
    const qrResult = ref(null);
    const qrError = ref(null);
    const scanner = ref(null);
    const hasCamera = ref(false);
    onMounted(async () => {
      hasCamera.value = await QrScanner.hasCamera();
      if (!hasCamera.value) return (qrError.value = "Camera not found");
      scanner.value = new QrScanner(
        stream.value,
        (result) => (qrResult.value = result),
        (error) => (qrError.value = error)
      );
    });
    const startScanning = () => {
      if (!hasCamera.value)
        return alert("This device does not have any camera");
      scanner.value.start();
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
