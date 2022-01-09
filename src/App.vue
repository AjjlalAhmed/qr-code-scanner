<template>
  <h1>Qr scanner prototype</h1>
  <video class="stream" width="300" height="300" ref="stream"></video>
  <div class="btns">
    <button class="start" @click="startScanning">Start scanning</button>
  </div>
  <div class="result">{{ result }}</div>
</template>

<script>
import QrScanner from "qr-scanner";
import { ref } from "@vue/reactivity";
export default {
  name: "App",
  setup() {
    const stream = ref(null);
    const result = ref(null);
    const startScanning = () => {
      const qrScanner = new QrScanner(stream.value, (data) => {
        result.value = data;
        qrScanner.stop();
      });
      qrScanner.start();
    };

    return { stream, startScanning, stopScanning, result };
  },
};
</script>

<style>
h1 {
  font-size: 2em;
  text-align: center;
  padding: 20px;
  font-family: monospace;
}
.stream {
  border: 0px;
  border-radius: 5px;
  margin: 0 auto;
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
