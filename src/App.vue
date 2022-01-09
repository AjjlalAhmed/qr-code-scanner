<template>
  <h1>Qr scanner prototype</h1>
  <video class="stream" width="300" height="300" ref="stream"></video>
  <button class="start">Start</button>
</template>

<script>
import QrScanner from "qr-scanner";
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
export default {
  name: "App",
  setup() {
    const stream = ref(null);
    const startScaning = () => {
      const qrScanner = new QrScanner(stream.value, (result) =>
        console.log("decoded qr code:", result)
      );
      qrScanner.start();
    };
    return { stream, startScaning };
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
}
.start {
  width: 90%;
  margin: 20px auto;
  background: dodgerblue;
  border: 0px;
  border-radius: 5px;
  text-transform: capitalize;
  font-size: 1.5rem;
  color: white;
}
</style>
