<template>
  <h1>Qr scanner prototype</h1>
  <video class="stream" width="300" height="300" ref="stream"></video>
  <div class="btn">
    <button class="start" @click="startScanning">Start scanning</button>
    <button class="stop" @click="startScanning">Stop scanning</button>
  </div>
</template>

<script>
import QrScanner from "qr-scanner";
import { ref } from "@vue/reactivity";
export default {
  name: "App",
  setup() {
    const stream = ref(null);
    const qrScanner = new QrScanner(stream.value, (result) =>
      console.log("decoded qr code:", result)
    );
    const startScanning = () => {
      qrScanner.start();
    };
    const startScanning = () => {
      qrScanner.stop();
    };
    return { stream, startScanning, startScanning };
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
.stop{
  background: crimson;
}
</style>
