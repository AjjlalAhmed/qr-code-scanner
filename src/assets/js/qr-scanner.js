class f {
    static hasCamera() { return f.listCameras(!1).then(a => !!a.length).catch(() => !1) }
    static listCameras(a = !1) {
        if (!navigator.mediaDevices) return Promise.resolve([]);
        let b = null;
        return (a ? navigator.mediaDevices.getUserMedia({ audio: !1, video: !0 }).then(a => b = a).catch(() => {}) : Promise.resolve()).then(() => navigator.mediaDevices.enumerateDevices()).then(a => a.filter(a => "videoinput" === a.kind).map((a, b) => ({ id: a.deviceId, label: a.label || (0 === b ? "Default Camera" : `Camera ${b+1}`) }))).finally(() => {
            if (b)
                for (let a of b.getTracks()) a.stop(),
                    b.removeTrack(a)
        })
    }
    constructor(a, b, c = this._onDecodeError, d = this._calculateScanRegion, g = "environment") {
        this.$video = a;
        this.$canvas = document.createElement("canvas");
        this._onDecode = b;
        this._legacyCanvasSize = f.DEFAULT_CANVAS_SIZE;
        this._preferredCamera = g;
        this._flashOn = this._paused = this._active = !1;
        "number" === typeof c ? (this._legacyCanvasSize = c, console.warn("You're using a deprecated version of the QrScanner constructor which will be removed in the future")) : this._onDecodeError = c;
        "number" === typeof d ? (this._legacyCanvasSize =
            d, console.warn("You're using a deprecated version of the QrScanner constructor which will be removed in the future")) : this._calculateScanRegion = d;
        this._scanRegion = this._calculateScanRegion(a);
        this._onPlay = this._onPlay.bind(this);
        this._onLoadedMetaData = this._onLoadedMetaData.bind(this);
        this._onVisibilityChange = this._onVisibilityChange.bind(this);
        a.disablePictureInPicture = !0;
        a.playsInline = !0;
        a.muted = !0;
        let h = !1;
        a.hidden && (a.hidden = !1, h = !0);
        document.body.contains(a) || (document.body.appendChild(a), h = !0);
        requestAnimationFrame(() => { let b = window.getComputedStyle(a); "none" === b.display && (a.style.setProperty("display", "block", "important"), h = !0); "visible" !== b.visibility && (a.style.setProperty("visibility", "visible", "important"), h = !0);
            h && (console.warn("QrScanner has overwritten the video hiding style to avoid Safari stopping the playback."), a.style.opacity = 0, a.style.width = 0, a.style.height = 0) });
        a.addEventListener("play", this._onPlay);
        a.addEventListener("loadedmetadata", this._onLoadedMetaData);
        document.addEventListener("visibilitychange",
            this._onVisibilityChange);
        this._qrEnginePromise = f.createQrEngine()
    }
    hasFlash() { let a = null; return (this.$video.srcObject ? Promise.resolve(this.$video.srcObject.getVideoTracks()[0]) : this._getCameraStream().then(({ stream: b }) => { console.warn("Call hasFlash after successfully starting the scanner to avoid creating a temporary video stream");
            a = b; return b.getVideoTracks()[0] })).then(a => "torch" in a.getSettings()).catch(() => !1).finally(() => { if (a)
                for (let b of a.getTracks()) b.stop(), a.removeTrack(b) }) }
    isFlashOn() { return this._flashOn }
    toggleFlash() {
        return this._flashOn ?
            this.turnFlashOff() : this.turnFlashOn()
    }
    turnFlashOn() { if (this._flashOn) return Promise.resolve();
        this._flashOn = !0; return !this._active || this._paused ? Promise.resolve() : this.hasFlash().then(a => a ? this.$video.srcObject.getVideoTracks()[0].applyConstraints({ advanced: [{ torch: !0 }] }) : Promise.reject("No flash available")).catch(() => { this._flashOn = !1; throw e; }) }
    turnFlashOff() { if (this._flashOn) return this._flashOn = !1, this._restartVideoStream() }
    destroy() {
        this.$video.removeEventListener("loadedmetadata", this._onLoadedMetaData);
        this.$video.removeEventListener("play", this._onPlay);
        document.removeEventListener("visibilitychange", this._onVisibilityChange);
        this.stop();
        f._postWorkerMessage(this._qrEnginePromise, "close")
    }
    start() {
        if (this._active && !this._paused) return Promise.resolve();
        "https:" !== window.location.protocol && console.warn("The camera stream is only accessible if the page is transferred via https.");
        this._active = !0;
        if (document.hidden) return Promise.resolve();
        this._paused = !1;
        return this.$video.srcObject ? (this.$video.play(),
            Promise.resolve()) : this._getCameraStream().then(({ stream: a, facingMode: b }) => { this.$video.srcObject = a;
            this.$video.play();
            this._setVideoMirror(b);
            this._flashOn && (this._flashOn = !1, this.turnFlashOn().catch(() => {})) }).catch(a => { this._active = !1; throw a; })
    }
    stop() { this.pause();
        this._active = !1 }
    pause(a = !1) {
        this._paused = !0;
        if (!this._active) return Promise.resolve(!0);
        this.$video.pause();
        let b = () => {
            const a = this.$video.srcObject ? this.$video.srcObject.getTracks() : [];
            for (const b of a) b.stop(), this.$video.srcObject.removeTrack(b);
            this.$video.srcObject = null
        };
        return a ? (b(), Promise.resolve(!0)) : (new Promise(a => setTimeout(a, 300))).then(() => { if (!this._paused) return !1;
            b(); return !0 })
    }
    setCamera(a) { if (a === this._preferredCamera) return Promise.resolve();
        this._preferredCamera = a; return this._restartVideoStream() }
    static scanImage(a, b = null, c = null, d = null, g = !1, h = !1) {
        let k = c instanceof Worker,
            l = Promise.all([c || f.createQrEngine(), f._loadImage(a)]).then(([a, h]) => {
                c = a;
                let l;
                [d, l] = this._drawToCanvas(h, b, d, g);
                return c instanceof Worker ? (k || c.postMessage({
                    type: "inversionMode",
                    data: "both"
                }), new Promise((a, b) => {
                    let g, h, k;
                    h = d => { "qrResult" === d.data.type && (c.removeEventListener("message", h), c.removeEventListener("error", k), clearTimeout(g), null !== d.data.data ? a(d.data.data) : b(f.NO_QR_CODE_FOUND)) };
                    k = a => { c.removeEventListener("message", h);
                        c.removeEventListener("error", k);
                        clearTimeout(g);
                        b("Scanner error: " + (a ? a.message || a : "Unknown Error")) };
                    c.addEventListener("message", h);
                    c.addEventListener("error", k);
                    g = setTimeout(() => k("timeout"), 1E4);
                    let m = l.getImageData(0, 0, d.width, d.height);
                    c.postMessage({ type: "decode", data: m }, [m.data.buffer])
                })) : new Promise((a, b) => { let g = setTimeout(() => b("Scanner error: timeout"), 1E4);
                    c.detect(d).then(c => { c.length ? a(c[0].rawValue) : b(f.NO_QR_CODE_FOUND) }).catch(a => b("Scanner error: " + (a.message || a))).finally(() => clearTimeout(g)) })
            });
        b && h && (l = l.catch(() => f.scanImage(a, null, c, d, g)));
        return l = l.finally(() => { k || f._postWorkerMessage(c, "close") })
    }
    setGrayscaleWeights(a, b, c, d = !0) {
        f._postWorkerMessage(this._qrEnginePromise, "grayscaleWeights", {
            red: a,
            green: b,
            blue: c,
            useIntegerApproximation: d
        })
    }
    setInversionMode(a) { f._postWorkerMessage(this._qrEnginePromise, "inversionMode", a) }
    static createQrEngine(a = f.WORKER_PATH) { return ("BarcodeDetector" in window && BarcodeDetector.getSupportedFormats ? BarcodeDetector.getSupportedFormats() : Promise.resolve([])).then(b => -1 !== b.indexOf("qr_code") ? new BarcodeDetector({ formats: ["qr_code"] }) : new Worker(a)) }
    _onPlay() { this._scanRegion = this._calculateScanRegion(this.$video);
        this._scanFrame() }
    _onLoadedMetaData() { this._scanRegion = this._calculateScanRegion(this.$video) }
    _onVisibilityChange() {
        document.hidden ?
            this.pause() : this._active && this.start()
    }
    _calculateScanRegion(a) { let b = Math.round(2 / 3 * Math.min(a.videoWidth, a.videoHeight)); return { x: Math.round((a.videoWidth - b) / 2), y: Math.round((a.videoHeight - b) / 2), width: b, height: b, downScaledWidth: this._legacyCanvasSize, downScaledHeight: this._legacyCanvasSize } }
    _scanFrame() {
        if (!this._active || this.$video.paused || this.$video.ended) return !1;
        requestAnimationFrame(() => {
            1 >= this.$video.readyState ? this._scanFrame() : this._qrEnginePromise.then(a => f.scanImage(this.$video, this._scanRegion,
                a, this.$canvas)).then(this._onDecode, a => { this._active && (-1 !== (a.message || a).indexOf("service unavailable") && (this._qrEnginePromise = f.createQrEngine()), this._onDecodeError(a)) }).then(() => this._scanFrame())
        })
    }
    _onDecodeError(a) { a !== f.NO_QR_CODE_FOUND && console.log(a) }
    _getCameraStream() {
        if (!navigator.mediaDevices) return Promise.reject("Camera not found.");
        let a = "environment" === this._preferredCamera || "user" === this._preferredCamera ? "facingMode" : "deviceId",
            b = [{ width: { min: 1024 } }, { width: { min: 768 } }, {}];
        return [...b.map(b =>
            Object.assign({}, b, {
                [a]: { exact: this._preferredCamera } })), ...b].reduceRight((a, b) => () => navigator.mediaDevices.getUserMedia({ video: b, audio: !1 }).then(a => ({ stream: a, facingMode: this._getFacingMode(a) || (b.facingMode ? this._preferredCamera : "environment" === this._preferredCamera ? "user" : "environment") })).catch(a), () => Promise.reject("Camera not found."))()
    }
    _restartVideoStream() { let a = this._paused; return this.pause(!0).then(b => { if (b && !a && this._active) return this.start() }) }
    _setVideoMirror(a) {
        this.$video.style.transform =
            "scaleX(" + ("user" === a ? -1 : 1) + ")"
    }
    _getFacingMode(a) { return (a = a.getVideoTracks()[0]) ? /rear|back|environment/i.test(a.label) ? "environment" : /front|user|face/i.test(a.label) ? "user" : null : null }
    static _drawToCanvas(a, b = null, c = null, d = !1) {
        c = c || document.createElement("canvas");
        let g = b && b.x ? b.x : 0,
            h = b && b.y ? b.y : 0,
            k = b && b.width ? b.width : a.width || a.videoWidth,
            l = b && b.height ? b.height : a.height || a.videoHeight;
        d || (d = b && b.downScaledWidth ? b.downScaledWidth : k, b = b && b.downScaledHeight ? b.downScaledHeight : l, c.width !== d && (c.width =
            d), c.height !== b && (c.height = b));
        b = c.getContext("2d", { alpha: !1 });
        b.imageSmoothingEnabled = !1;
        b.drawImage(a, g, h, k, l, 0, 0, c.width, c.height);
        return [c, b]
    }
    static _loadImage(a) {
        if (a instanceof HTMLCanvasElement || a instanceof HTMLVideoElement || window.ImageBitmap && a instanceof window.ImageBitmap || window.OffscreenCanvas && a instanceof window.OffscreenCanvas) return Promise.resolve(a);
        if (a instanceof Image) return f._awaitImageLoad(a).then(() => a);
        if (a instanceof File || a instanceof Blob || a instanceof URL || "string" ===
            typeof a) { let b = new Image;
            b.src = a instanceof File || a instanceof Blob ? URL.createObjectURL(a) : a; return f._awaitImageLoad(b).then(() => {
                (a instanceof File || a instanceof Blob) && URL.revokeObjectURL(b.src); return b }) }
        return Promise.reject("Unsupported image type.")
    }
    static _awaitImageLoad(a) {
        return new Promise((b, c) => {
            if (a.complete && 0 !== a.naturalWidth) b();
            else {
                let d, g;
                d = () => { a.removeEventListener("load", d);
                    a.removeEventListener("error", g);
                    b() };
                g = () => {
                    a.removeEventListener("load", d);
                    a.removeEventListener("error",
                        g);
                    c("Image load error")
                };
                a.addEventListener("load", d);
                a.addEventListener("error", g)
            }
        })
    }
    static _postWorkerMessage(a, b, c) { return Promise.resolve(a).then(a => { a instanceof Worker && a.postMessage({ type: b, data: c }) }) }
}
f.DEFAULT_CANVAS_SIZE = 400;
f.NO_QR_CODE_FOUND = "No QR code found";
f.WORKER_PATH = "qr-scanner-worker.min.js";
export default f
//# sourceMappingURL=qr-scanner.min.js.map