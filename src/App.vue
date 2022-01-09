<template>
  <h1>Qr scanner prototype</h1>
  <video ref="stream"></video>
</template>

<script>
import QrScanner from "qr-scanner";
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
export default {
  name: "App",
  setup() {
    const stream = ref(null);
    onMounted(() => {
      const qrScanner = new QrScanner(stream.value, (result) =>
        console.log("decoded qr code:", result)
      );
      qrScanner.start();
    });
    return { stream };
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
</style>
