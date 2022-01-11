<template>
  <h1>Qr-scanner prototype</h1>
  <div id="reader" width="400px" style="min-height: 50vh"></div>
  <p class="result">
    Logs :
    <br />
    <span>{{ result }}</span>
  </p>
</template>

<script>
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { onMounted, ref } from "@vue/runtime-core";

export default {
  name: "App",
  setup() {
    const result = ref(null);
    const html5QrCode = ref(null);
    onMounted(() => {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { facingMode: { exact: "environment" } },
        })
        .then(function (stream) {
          if (stream.getVideoTracks().length > 0) {
            html5QrCode.value = new Html5Qrcode("reader");
            const qrCodeSuccessCallback = (decodedText, decodedResult) => {
              result.value = decodedText;
            };
            const config = { fps: 10, qrbox: { width: 250, height: 250 } };
            html5QrCode.value.start(
              { facingMode: { exact: "environment" } },
              config,
              qrCodeSuccessCallback,
              (error) => {
                result.value = error;
              }
            );
          }
        })
        .catch(function (error) {
          if (error.message == "Requested device not found") {
            alert("No camera founded");
            console.log(error.message);
          }
        });
    });

    return { result };
  },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
h1 {
  font-size: 1.5rem;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  text-align: center;
  background: dodgerblue;
  color: #fff;
  padding: 10px;
  text-transform: capitalize;
}
P {
  font-size: 1.5rem;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  padding: 10px;
}
span {
  font-size: 1rem;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
</style>
