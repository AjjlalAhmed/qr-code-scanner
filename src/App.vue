<template>
  <h1>Qr-scanner prototype</h1>
  <div id="reader" width="600px"></div>
  <p class="result">{{ result }}</p>
</template>

<script>
import { Html5QrcodeScanner } from "html5-qrcode";
import { onMounted, ref } from "@vue/runtime-core";

export default {
  name: "App",
  setup() {
    const result = ref(null);

    onMounted(() => {
      let html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    });
    function onScanSuccess(decodedText, decodedResult) {
      // handle the scanned code as you like, for example:
      console.log(`Code matched = ${decodedText}`, decodedResult);
      result.value = decodedResult;
    }

    function onScanFailure(error) {
      // handle scan failure, usually better to ignore and keep scanning.
      // for example:
      console.warn(`Code scan error = ${error}`);
      result.value = error;
    }
    return { result };
  },
};
</script>

<style></style>
