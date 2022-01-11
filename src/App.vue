<template>
  <h1>Qr-scanner prototype</h1>
  <div id="reader" width="600px"></div>
  <p class="result">{{ result }}</p>
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
        .getUserMedia({ audio: true, video: true })
        .then(function (stream) {
          if (stream.getVideoTracks().length > 0) {
            html5QrCode.value = new Html5Qrcode("reader");

            Html5Qrcode
              .getCameras()
              .then((devices) => {
                /**
                 * devices would be an array of objects of type:
                 * { id: "id", label: "label" }
                 */
                result.value = devices
                if (devices && devices.length) {
                  var cameraId = devices[0].id;
                  result.value = cameraId
                  // .. use this to start scanning.
                }
              })
              .catch((err) => {
                // handle err
                result.value = err
              });

            // html5QrCode.value
            //   .start(
            //     cameraId,
            //     {
            //       fps: 10, // Optional, frame per seconds for qr code scanning
            //       qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
            //     },
            //     (decodedText, decodedResult) => {
            //       result.value = decodedResult;
            //     },
            //     (errorMessage) => {
            //       result.value = errorMessage;
            //     }
            //   )
            //   .catch((err) => {
            //     result.value = err;
            //   });
          }
        })
        .catch(function (error) {
          if (error.message == "Requested device not found") {
            alert("No camera founded");
            console.log(error.message);
          }
        });
    });

    // onMounted(() => {
    //   let html5QrcodeScanner = new Html5QrcodeScanner(
    //     "reader",
    //     { fps: 10, qrbox: { width: 250, height: 250 } },
    //     /* verbose= */ false
    //   );
    //   html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    // });
    // function onScanSuccess(decodedText, decodedResult) {
    //   // handle the scanned code as you like, for example:
    //   console.log(`Code matched = ${decodedText}`, decodedResult);
    //   result.value = decodedResult;
    // }

    // function onScanFailure(error) {
    //   // handle scan failure, usually better to ignore and keep scanning.
    //   // for example:
    //   console.warn(`Code scan error = ${error}`);
    //   result.value = error;
    // }
    return { result };
  },
};
</script>

<style></style>
