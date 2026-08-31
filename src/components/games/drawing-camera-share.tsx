"use client";

import {
  Camera,
  Check,
  Download,
  ImagePlus,
  RefreshCw,
  Share2,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { wrapCanvasText } from "@/lib/game-utils";
import { BRAND_COLORS } from "@/lib/brand-colors";

type StoryDetail = {
  label: string;
  value: string;
};

type DrawingCameraShareProps = {
  enabled: boolean;
  game: "cups" | "cauldron";
  challengeTitle: string;
  details: StoryDetail[];
};

type FlowStep = "camera" | "photo" | "story";

const gameConfig = {
  cups: {
    label: "Personajes locos",
    accent: BRAND_COLORS.orange,
    secondary: BRAND_COLORS.cyan,
    character: "/images/web-2026/characters/martina-futbolista.png",
    filename: "mi-dibujo-personajes-locos-marta-moreno.png",
  },
  cauldron: {
    label: "Caldero mágico",
    accent: BRAND_COLORS.red,
    secondary: BRAND_COLORS.orange,
    character: "/images/web-2026/characters/perro-cocinero.png",
    filename: "mi-dibujo-caldero-magico-marta-moreno.png",
  },
} as const;

function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    image.src = src;
  });
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const sourceRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;

  if (sourceRatio > targetRatio) {
    sourceWidth = image.naturalHeight * targetRatio;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = image.naturalWidth / targetRatio;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
}

async function composePhotoStory({
  photoUrl,
  game,
  challengeTitle,
  details,
}: {
  photoUrl: string;
  game: DrawingCameraShareProps["game"];
  challengeTitle: string;
  details: StoryDetail[];
}) {
  const config = gameConfig[game];
  const [photo, brandMark, character] = await Promise.all([
    loadCanvasImage(photoUrl),
    loadCanvasImage("/images/web-2026/marta-illustration.png"),
    loadCanvasImage(config.character),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo preparar la Story");

  const rootStyle = getComputedStyle(document.documentElement);
  const bodyFont =
    rootStyle.getPropertyValue("--font-body").trim() || "sans-serif";
  const displayFont =
    rootStyle.getPropertyValue("--font-display").trim() || "sans-serif";

  context.fillStyle = BRAND_COLORS.paper;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(39, 32, 41, 0.07)";
  for (let index = 0; index < 160; index += 1) {
    context.beginPath();
    context.arc(
      (index * 83) % canvas.width,
      (index * 137) % canvas.height,
      index % 3 === 0 ? 1.3 : 0.7,
      0,
      Math.PI * 2,
    );
    context.fill();
  }

  context.fillStyle = config.secondary;
  context.beginPath();
  context.arc(1005, 90, 210, 0, Math.PI * 2);
  context.fill();

  context.drawImage(brandMark, 62, 45, 74, 74);
  context.fillStyle = BRAND_COLORS.ink;
  context.textAlign = "left";
  context.font = `800 30px ${displayFont}`;
  context.fillText("Marta Moreno", 150, 79);
  context.font = `900 16px ${bodyFont}`;
  context.letterSpacing = "2px";
  context.fillText("ILUSTRADORA INFANTIL", 151, 106);
  context.letterSpacing = "0px";

  context.fillStyle = config.accent;
  context.font = `900 20px ${bodyFont}`;
  context.textAlign = "right";
  context.fillText(`${config.label.toUpperCase()} · MI DIBUJO`, 1010, 104);

  context.save();
  context.beginPath();
  context.roundRect(55, 155, 970, 1245, 48);
  context.clip();
  drawImageCover(context, photo, 55, 155, 970, 1245);
  context.restore();
  context.strokeStyle = BRAND_COLORS.ink;
  context.lineWidth = 6;
  context.beginPath();
  context.roundRect(55, 155, 970, 1245, 48);
  context.stroke();

  context.fillStyle = "rgba(255, 253, 247, 0.94)";
  context.beginPath();
  context.roundRect(85, 1060, 910, 305, 36);
  context.fill();

  context.fillStyle = config.accent;
  context.textAlign = "left";
  context.font = `900 18px ${bodyFont}`;
  context.fillText("ESTA IDEA YA ESTÁ EN EL PAPEL", 120, 1110);

  context.fillStyle = BRAND_COLORS.ink;
  const titleSize = challengeTitle.length > 52 ? 43 : 51;
  context.font = `400 ${titleSize}px ${displayFont}`;
  const titleLines = wrapCanvasText(context, challengeTitle, 800).slice(0, 2);
  titleLines.forEach((line, index) => {
    context.fillText(line, 120, 1170 + index * titleSize * 0.94);
  });

  const detailsText = details.map((detail) => detail.value).join(" · ");
  context.font = `800 24px ${bodyFont}`;
  const detailLines = wrapCanvasText(context, detailsText, 800).slice(0, 3);
  const detailStart = 1285 - (detailLines.length - 1) * 6;
  detailLines.forEach((line, index) => {
    context.fillText(line, 120, detailStart + index * 33);
  });

  context.fillStyle = config.accent;
  context.beginPath();
  context.ellipse(955, 1510, 220, 165, -0.18, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = BRAND_COLORS.paper;
  context.strokeStyle = BRAND_COLORS.ink;
  context.lineWidth = 5;
  context.beginPath();
  context.roundRect(70, 1445, 720, 220, 34);
  context.fill();
  context.stroke();
  context.beginPath();
  context.moveTo(786, 1555);
  context.lineTo(838, 1583);
  context.lineTo(786, 1612);
  context.closePath();
  context.fill();
  context.stroke();

  context.fillStyle = BRAND_COLORS.ink;
  context.font = `400 50px ${displayFont}`;
  context.fillText("¡Mira lo que has creado!", 110, 1530);
  context.font = `800 27px ${bodyFont}`;
  const encouragement =
    game === "cups"
      ? "Cuatro pistas, una idea y tu manera de contarla."
      : "Tres ingredientes y una historia que solo podía ser tuya.";
  wrapCanvasText(context, encouragement, 620)
    .slice(0, 2)
    .forEach((line, index) => {
      context.fillText(line, 110, 1585 + index * 38);
    });

  context.drawImage(character, 815, 1435, 230, 230);

  context.fillStyle = BRAND_COLORS.ink;
  context.beginPath();
  context.roundRect(70, 1705, 940, 82, 999);
  context.fill();
  context.fillStyle = BRAND_COLORS.paper;
  context.textAlign = "center";
  context.font = `900 26px ${bodyFont}`;
  context.fillText("HECHO CON MARTA · @MARTAMORENO.ART", 540, 1757);

  context.fillStyle = config.accent;
  context.font = `400 48px ${displayFont}`;
  context.fillText("Dibujar también es celebrar", 540, 1860);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("No se pudo generar la Story"));
    }, "image/png");
  });
}

export function DrawingCameraShare({
  enabled,
  game,
  challengeTitle,
  details,
}: DrawingCameraShareProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [step, setStep] = useState<FlowStep>("camera");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [storyUrl, setStoryUrl] = useState<string | null>(null);
  const [storyBlob, setStoryBlob] = useState<Blob | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [useNativeCamera, setUseNativeCamera] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [sharing, setSharing] = useState(false);
  const config = gameConfig[game];

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  function clearGeneratedMedia() {
    if (storyUrl) URL.revokeObjectURL(storyUrl);
    setPhotoUrl(null);
    setStoryUrl(null);
    setStoryBlob(null);
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    return () => {
      if (storyUrl) URL.revokeObjectURL(storyUrl);
    };
  }, [storyUrl]);

  async function startCamera() {
    stopCamera();
    setCameraError(null);
    setUseNativeCamera(false);
    setStep("camera");

    if (!navigator.mediaDevices?.getUserMedia) {
      setUseNativeCamera(true);
      setCameraError(
        "Pulsa el botón rojo para abrir la cámara de tu móvil.",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1440 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setUseNativeCamera(true);
      setCameraError(
        "No hemos podido mostrar la cámara en directo. Pulsa el botón rojo para abrir la cámara de tu móvil.",
      );
    }
  }

  async function openFlow() {
    if (!enabled) return;
    clearGeneratedMedia();

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(null);
      nativeCameraInputRef.current?.click();
      return;
    }

    dialogRef.current?.showModal();
    await startCamera();
  }

  function closeFlow() {
    stopCamera();
    dialogRef.current?.close();
  }

  function applyPhotoBlob(blob: Blob) {
    stopCamera();
    if (storyUrl) URL.revokeObjectURL(storyUrl);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setPhotoUrl(reader.result);
      setStoryUrl(null);
      setStoryBlob(null);
      setStep("photo");
    };
    reader.onerror = () => {
      setCameraError("No hemos podido leer esta foto. Prueba con otra.");
    };
    reader.readAsDataURL(blob);
  }

  async function takePhoto() {
    const video = videoRef.current;
    if (!video?.videoWidth || !video.videoHeight) {
      setCameraError("La cámara todavía se está preparando. Inténtalo de nuevo.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) applyPhotoBlob(blob);
    }, "image/jpeg", 0.94);
  }

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    applyPhotoBlob(file);
    event.target.value = "";
  }

  function chooseNativeCameraPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    dialogRef.current?.showModal();
    applyPhotoBlob(file);
    event.target.value = "";
  }

  async function prepareStory() {
    if (!photoUrl) return;
    setPreparing(true);
    setCameraError(null);
    try {
      await document.fonts.ready;
      const blob = await composePhotoStory({
        photoUrl,
        game,
        challengeTitle,
        details,
      });
      if (storyUrl) URL.revokeObjectURL(storyUrl);
      setStoryBlob(blob);
      setStoryUrl(URL.createObjectURL(blob));
      setStep("story");
    } catch {
      setCameraError("No hemos podido preparar la Story. Prueba con otra foto.");
    } finally {
      setPreparing(false);
    }
  }

  function downloadStory() {
    if (!storyUrl) return;
    const anchor = document.createElement("a");
    anchor.href = storyUrl;
    anchor.download = config.filename;
    anchor.click();
  }

  async function shareStory() {
    if (!storyBlob) return;
    const file = new File([storyBlob], config.filename, { type: "image/png" });
    const shareData = {
      files: [file],
      title: `Mi dibujo · ${config.label}`,
      text: "He creado este dibujo jugando con Marta Moreno ✨",
    };

    if (!window.isSecureContext) {
      setCameraError(
        "Para abrir el menú de redes, esta página necesita HTTPS. Puedes guardar la imagen o abrir la web desde una dirección segura.",
      );
      return;
    }

    if (!navigator.share || !navigator.canShare?.(shareData)) {
      setCameraError(
        "Este navegador no permite compartir la imagen directamente. Puedes guardarla y compartirla desde tu galería.",
      );
      return;
    }

    setSharing(true);
    try {
      await navigator.share(shareData);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setCameraError("No se pudo abrir el menú para compartir. Puedes guardar la imagen.");
    } finally {
      setSharing(false);
    }
  }

  return (
    <>
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        aria-label="Abrir cámara del dispositivo"
        className="drawing-share__native-input"
        onChange={chooseNativeCameraPhoto}
      />
      <button
        type="button"
        onClick={openFlow}
        disabled={!enabled}
        className="game-action game-action--camera"
      >
        <Camera aria-hidden="true" className="size-5" />
        Fotografiar mi dibujo
      </button>

      <dialog
        ref={dialogRef}
        className="drawing-share"
        onClose={stopCamera}
        aria-labelledby="drawing-share-title"
      >
        <div className="drawing-share__shell">
          <header className="drawing-share__header">
            <div>
              <p>Tu dibujo, con la firma de Marta</p>
              <h2 id="drawing-share-title">
                {step === "camera"
                  ? "Encuadra tu creación"
                  : step === "photo"
                    ? "¿Te gusta esta foto?"
                    : "Tu Story está lista"}
              </h2>
            </div>
            <button type="button" onClick={closeFlow} aria-label="Cerrar cámara">
              <X aria-hidden="true" />
            </button>
          </header>

          <div className="drawing-share__stage">
            {step === "camera" && (
              <div className="drawing-share__camera">
                <video ref={videoRef} autoPlay muted playsInline />
                <span className="drawing-share__frame" aria-hidden="true" />
                <p>Acerca el papel y procura que tenga buena luz.</p>
              </div>
            )}

            {step === "photo" && photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="Fotografía de tu dibujo" />
            )}

            {step === "story" && storyUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={storyUrl} alt="Vista previa de tu Story terminada" />
            )}
          </div>

          {cameraError && (
            <p className="drawing-share__message" role="status">
              {cameraError}
            </p>
          )}

          <div className="drawing-share__actions">
            {step === "camera" && (
              <>
                {useNativeCamera ? (
                  <label className="drawing-share__shutter">
                    <span aria-hidden="true" />
                    <span className="sr-only">Abrir cámara del dispositivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      aria-label="Abrir cámara del dispositivo"
                      onChange={choosePhoto}
                    />
                  </label>
                ) : (
                  <button
                    type="button"
                    onClick={takePhoto}
                    className="drawing-share__shutter"
                  >
                    <span aria-hidden="true" />
                    <span className="sr-only">Hacer foto</span>
                  </button>
                )}
                <label className="game-action game-action--secondary">
                  <ImagePlus aria-hidden="true" className="size-5" />
                  Elegir de la galería
                  <input
                    type="file"
                    accept="image/*"
                    aria-label="Elegir una foto de la galería"
                    onChange={choosePhoto}
                  />
                </label>
              </>
            )}

            {step === "photo" && (
              <>
                <button
                  type="button"
                  onClick={startCamera}
                  className="game-action game-action--secondary"
                >
                  <RefreshCw aria-hidden="true" className="size-5" />
                  Repetir foto
                </button>
                <button
                  type="button"
                  onClick={prepareStory}
                  disabled={preparing}
                  className="game-action game-action--primary"
                >
                  <Check aria-hidden="true" className="size-5" />
                  {preparing ? "Preparando Story…" : "Usar esta foto"}
                </button>
              </>
            )}

            {step === "story" && (
              <>
                <button
                  type="button"
                  onClick={downloadStory}
                  className="game-action game-action--secondary"
                >
                  <Download aria-hidden="true" className="size-5" />
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={shareStory}
                  disabled={sharing}
                  className="game-action game-action--primary"
                >
                  <Share2 aria-hidden="true" className="size-5" />
                  {sharing ? "Abriendo redes…" : "Compartir en redes"}
                </button>
              </>
            )}
          </div>

          {step === "story" && (
            <p className="drawing-share__hint">
              En móvil se abrirá el menú para elegir Instagram, WhatsApp u otra red.
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
