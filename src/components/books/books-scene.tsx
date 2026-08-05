"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { Book } from "@/lib/books-data";

export type LibraryMode = "shelf" | "inspect" | "reading";

type TurnState = { id: number; direction: -1 | 1 };

type BooksSceneProps = {
  books: readonly Book[];
  mode: LibraryMode;
  selectedIndex: number;
  spreadIndex: number;
  spreads: readonly string[];
  turn: TurnState;
  reducedMotion: boolean;
  canOpen: boolean;
  onSelect: (index: number) => void;
  onOpen: () => void;
  onClose: () => void;
  onReturnToShelf: () => void;
  onTurnPage: (direction: -1 | 1) => void;
  onFallback: () => void;
};

type TexturePair = { left: THREE.Texture; right: THREE.Texture };

const PAGE_WIDTH = 2.45;
const PAGE_HEIGHT = 3.2;
const SPREAD_HEIGHT_PX = 1340;
const COVER_HEIGHT_PX = 1440;
const textureLoader = new THREE.TextureLoader();

function easeOutQuint(value: number) {
  return 1 - Math.pow(1 - value, 5);
}

function colorTexture(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");

  if (context) {
    context.fillStyle = color;
    context.fillRect(0, 0, 64, 64);
    context.globalAlpha = 0.13;
    context.fillStyle = "#fff8e8";
    for (let index = 0; index < 90; index += 1) {
      context.fillRect((index * 23) % 64, (index * 41) % 64, 1, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function configureTexture(texture: THREE.Texture, anisotropy: number) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function drawContained(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  x: number,
  y: number,
  width: number,
  height: number,
  padding = 0,
) {
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;
  const scale = Math.min(availableWidth / sourceWidth, availableHeight / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  context.drawImage(
    image,
    x + (width - drawWidth) / 2,
    y + (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );
}

function wrapText(
  context: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = value.split(" ");
  let line = "";
  let cursorY = y;

  for (const word of words) {
    const candidate = `${line}${word} `;
    if (context.measureText(candidate).width > maxWidth && line) {
      context.fillText(line.trim(), x, cursorY);
      line = `${word} `;
      cursorY += lineHeight;
    } else {
      line = candidate;
    }
  }
  context.fillText(line.trim(), x, cursorY);
}

async function normalizedCover(book: Book, anisotropy: number) {
  const sourceTexture = await textureLoader.loadAsync(book.cover);
  const image = sourceTexture.image as HTMLImageElement;
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = book.coverAspect;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(COVER_HEIGHT_PX * targetRatio);
  canvas.height = COVER_HEIGHT_PX;
  const context = canvas.getContext("2d");

  if (context) {
    context.fillStyle = "#f4ecdc";
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (book.coverTreatment === "archive-artwork") {
      context.fillStyle = book.accent;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#fff5e7";
      context.font = "700 112px Georgia, serif";
      context.fillText(book.title, 72, 160);
      context.font = "700 25px Arial, sans-serif";
      context.letterSpacing = "5px";
      context.fillText("MARTA MORENO · ILUSTRACIÓN", 76, 220);

      const artworkY = 286;
      const artworkHeight = Math.round(canvas.width / sourceRatio);
      context.drawImage(image, 0, artworkY, canvas.width, artworkHeight);
      context.fillStyle = "#fff5e7";
      context.font = "italic 34px Georgia, serif";
      wrapText(context, book.eyebrow, 76, artworkY + artworkHeight + 100, canvas.width - 152, 48);
      context.font = "700 22px Arial, sans-serif";
      context.letterSpacing = "4px";
      context.fillText(`ARCHIVO · ${book.numberLabel}`, 76, canvas.height - 74);
    } else if (book.coverCrop) {
      const crop = book.coverCrop;
      context.drawImage(
        image,
        sourceWidth * crop.x,
        sourceHeight * crop.y,
        sourceWidth * crop.width,
        sourceHeight * crop.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    } else if (sourceRatio > targetRatio * 1.12) {
      const cropWidth = Math.min(sourceWidth, sourceHeight * targetRatio);
      const cropX = (sourceWidth - cropWidth) / 2;
      context.drawImage(image, cropX, 0, cropWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    } else {
      drawContained(context, image, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height, 24);
    }
  }

  sourceTexture.dispose();
  return configureTexture(new THREE.CanvasTexture(canvas), anisotropy);
}

async function loadTexture(source: string, book: Book, anisotropy: number) {
  const sourceTexture = await textureLoader.loadAsync(source);
  const image = sourceTexture.image as HTMLImageElement;
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const sourceRatio = sourceWidth / sourceHeight;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(SPREAD_HEIGHT_PX * book.coverAspect * 2);
  canvas.height = SPREAD_HEIGHT_PX;
  const context = canvas.getContext("2d");

  if (context) {
    context.fillStyle = "#fffaf0";
    context.fillRect(0, 0, canvas.width, SPREAD_HEIGHT_PX);

    if (sourceRatio < 1.15) {
      drawContained(
        context,
        image,
        sourceWidth,
        sourceHeight,
        canvas.width / 2,
        0,
        canvas.width / 2,
        SPREAD_HEIGHT_PX,
        58,
      );
    } else {
      drawContained(context, image, sourceWidth, sourceHeight, 0, 0, canvas.width, SPREAD_HEIGHT_PX, 34);
    }
  }

  sourceTexture.dispose();
  return configureTexture(new THREE.CanvasTexture(canvas), anisotropy);
}

async function texturePair(source: string, book: Book, anisotropy: number): Promise<TexturePair> {
  const base = await loadTexture(source, book, anisotropy);
  const left = base.clone();
  const right = base.clone();

  for (const texture of [left, right]) {
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.repeat.set(0.5, 1);
    texture.needsUpdate = true;
  }
  left.offset.set(0, 0);
  right.offset.set(0.5, 0);
  base.dispose();
  return { left, right };
}

function setMap(material: THREE.MeshStandardMaterial, map: THREE.Texture) {
  if (material.map && material.map !== map) material.map.dispose();
  material.map = map;
  material.needsUpdate = true;
}

function mirrorTextureForBackFace(texture: THREE.Texture) {
  const mirrored = texture.clone();
  mirrored.wrapS = THREE.ClampToEdgeWrapping;
  mirrored.repeat.set(-texture.repeat.x, texture.repeat.y);
  mirrored.offset.set(texture.offset.x + texture.repeat.x, texture.offset.y);
  mirrored.needsUpdate = true;
  return mirrored;
}

export function BooksScene({
  books,
  mode,
  selectedIndex,
  spreadIndex,
  spreads,
  turn,
  reducedMotion,
  canOpen,
  onSelect,
  onOpen,
  onClose,
  onReturnToShelf,
  onTurnPage,
  onFallback,
}: BooksSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ mode, selectedIndex, spreadIndex, spreads, turn, reducedMotion, canOpen });
  const selectRef = useRef(onSelect);
  const openRef = useRef(onOpen);
  const closeRef = useRef(onClose);
  const returnToShelfRef = useRef(onReturnToShelf);
  const turnPageRef = useRef(onTurnPage);
  const fallbackRef = useRef(onFallback);

  useEffect(() => {
    stateRef.current = { mode, selectedIndex, spreadIndex, spreads, turn, reducedMotion, canOpen };
  }, [canOpen, mode, reducedMotion, selectedIndex, spreadIndex, spreads, turn]);

  useEffect(() => {
    selectRef.current = onSelect;
    openRef.current = onOpen;
    closeRef.current = onClose;
    returnToShelfRef.current = onReturnToShelf;
    turnPageRef.current = onTurnPage;
    fallbackRef.current = onFallback;
  }, [onClose, onFallback, onOpen, onReturnToShelf, onSelect, onTurnPage]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const hostElement = host;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      fallbackRef.current();
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.className = "library-scene__canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    hostElement.appendChild(renderer.domElement);
    const anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    let disposed = false;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xe8ded0, 0.009);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
    camera.position.set(0, -2, 22);

    scene.add(new THREE.HemisphereLight(0xfff8ec, 0x796b60, 2.8));
    const keyLight = new THREE.DirectionalLight(0xfff2d9, 4.1);
    keyLight.position.set(-5, 7, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xe77d68, 9, 20);
    rimLight.position.set(6, 1, 5);
    scene.add(rimLight);

    const room = new THREE.Group();
    scene.add(room);
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 15),
      new THREE.MeshStandardMaterial({ color: 0xe8ded0, roughness: 0.97 }),
    );
    wall.position.z = -1.65;
    wall.receiveShadow = true;
    room.add(wall);

    const wood = new THREE.MeshStandardMaterial({ color: 0x6f4937, roughness: 0.76, metalness: 0.01 });
    for (const shelfY of [3.15, -0.35, -3.85]) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(14.6, 0.22, 1.28), wood);
      shelf.position.set(0, shelfY - 1.65, -0.25);
      shelf.castShadow = true;
      shelf.receiveShadow = true;
      room.add(shelf);
    }

    const bookGroups: THREE.Group[] = [];
    const bookMaterials: THREE.MeshStandardMaterial[][] = [];
    const raycastTargets: THREE.Object3D[] = [];

    const bookDimensions = books.map((book) => {
      const height = 2.18 * book.shelfScale;
      return { height, width: height * book.coverAspect };
    });
    const bookPositions = new Map<number, number>();
    for (const [row, rowIndexes] of [[0, [0, 1, 2, 3, 4, 5, 6]], [1, [7, 8, 9, 10, 11, 12, 13]], [2, [14, 15, 16, 17, 18]]] as const) {
      const gap = row === 2 ? 0.3 : 0.2;
      const rowWidth = rowIndexes.reduce<number>((sum, index) => sum + (bookDimensions[index]?.width ?? 0), 0) + gap * (rowIndexes.length - 1);
      let cursor = -rowWidth / 2;
      for (const index of rowIndexes) {
        const width = bookDimensions[index]?.width ?? 1;
        bookPositions.set(index, cursor + width / 2);
        cursor += width + gap;
      }
    }

    books.forEach((book, index) => {
      const row = Math.floor(index / 7);
      const { height, width } = bookDimensions[index] ?? { height: 2.18, width: 1.5 };
      const x = bookPositions.get(index) ?? 0;
      const y = 3.15 - row * 3.5 - 1.65 + height / 2 + 0.13;
      const group = new THREE.Group();
      group.position.set(x, y, 0);
      group.rotation.y = ((index % 3) - 1) * 0.035;
      group.userData.home = group.position.clone();
      group.userData.homeRotation = group.rotation.y;
      group.userData.bookIndex = index;

      const coverMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(book.accent),
        roughness: 0.58,
        metalness: 0.02,
      });
      const pageMaterial = new THREE.MeshStandardMaterial({ color: 0xf3ead8, roughness: 0.92 });
      const pageBlock = new THREE.Mesh(new THREE.BoxGeometry(width - 0.08, height - 0.1, 0.22), pageMaterial);
      pageBlock.castShadow = true;
      pageBlock.receiveShadow = true;
      pageBlock.userData.bookIndex = index;

      const frontBoard = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.045), coverMaterial);
      frontBoard.position.z = 0.135;
      frontBoard.castShadow = true;
      frontBoard.userData.bookIndex = index;
      const backBoard = frontBoard.clone();
      backBoard.position.z = -0.135;
      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.07, height, 0.3), coverMaterial);
      spine.position.x = -width / 2 + 0.035;
      group.add(pageBlock, frontBoard, backBoard, spine);
      raycastTargets.push(frontBoard, pageBlock);

      const frontMaterial = new THREE.MeshStandardMaterial({ roughness: 0.62, polygonOffset: true, polygonOffsetFactor: -2 });
      const front = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.96, height * 0.97), frontMaterial);
      front.position.z = 0.159;
      front.userData.bookIndex = index;
      group.add(front);
      raycastTargets.push(front);
      bookMaterials.push([coverMaterial, pageMaterial, frontMaterial]);
      bookGroups.push(group);
      room.add(group);

      normalizedCover(book, anisotropy).then((texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        setMap(frontMaterial, texture);
      });
    });

    const openBook = new THREE.Group();
    openBook.visible = false;
    openBook.position.set(0, -0.15, 2.2);
    openBook.rotation.x = -0.08;
    scene.add(openBook);

    const currentBook = books[stateRef.current.selectedIndex] ?? books[0];
    const paperMaterialLeft = new THREE.MeshStandardMaterial({ color: 0xfffcf4, roughness: 0.88, side: THREE.DoubleSide });
    const paperMaterialRight = paperMaterialLeft.clone();
    const leftPaperGeometry = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT, 20, 2);
    leftPaperGeometry.translate(-PAGE_WIDTH / 2, 0, 0);
    const rightPaperGeometry = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT, 20, 2);
    rightPaperGeometry.translate(PAGE_WIDTH / 2, 0, 0);
    const leftPage = new THREE.Mesh(leftPaperGeometry, paperMaterialLeft);
    leftPage.position.z = 0.035;
    const rightPage = new THREE.Mesh(rightPaperGeometry, paperMaterialRight);
    rightPage.position.z = 0.04;
    openBook.add(leftPage, rightPage);

    const coverTexture = colorTexture(currentBook?.accent ?? "#bd4a53");
    const backCoverMaterial = new THREE.MeshStandardMaterial({ map: coverTexture, roughness: 0.64, side: THREE.DoubleSide });
    const leftCover = new THREE.Mesh(new THREE.BoxGeometry(PAGE_WIDTH + 0.1, PAGE_HEIGHT + 0.14, 0.09), backCoverMaterial);
    leftCover.position.set(-PAGE_WIDTH / 2, 0, -0.06);
    const rightCover = leftCover.clone();
    rightCover.position.x = PAGE_WIDTH / 2;
    openBook.add(leftCover, rightCover);

    const frontPivot = new THREE.Group();
    const frontCoverShellMaterial = new THREE.MeshStandardMaterial({ color: currentBook?.accent, roughness: 0.62 });
    const frontCoverImageMaterial = new THREE.MeshStandardMaterial({ roughness: 0.58, side: THREE.FrontSide });
    const frontCover = new THREE.Mesh(new THREE.BoxGeometry(PAGE_WIDTH + 0.1, PAGE_HEIGHT + 0.14, 0.09), frontCoverShellMaterial);
    frontCover.position.x = PAGE_WIDTH / 2;
    const frontCoverImage = new THREE.Mesh(new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT), frontCoverImageMaterial);
    frontCoverImage.position.set(PAGE_WIDTH / 2, 0, 0.046);
    frontPivot.add(frontCover, frontCoverImage);
    frontPivot.position.z = 0.12;
    openBook.add(frontPivot);

    const leafGeometry = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT, 28, 2);
    leafGeometry.translate(PAGE_WIDTH / 2, 0, 0);
    const leafFrontMaterial = new THREE.MeshStandardMaterial({ color: 0xfffcf4, roughness: 0.86, side: THREE.FrontSide });
    const leafBackMaterial = new THREE.MeshStandardMaterial({ color: 0xfffcf4, roughness: 0.86, side: THREE.BackSide });
    const leafFront = new THREE.Mesh(leafGeometry, leafFrontMaterial);
    const leafBack = new THREE.Mesh(leafGeometry, leafBackMaterial);
    const leafPivot = new THREE.Group();
    leafPivot.add(leafFront, leafBack);
    leafPivot.position.z = 0.085;
    leafPivot.visible = false;
    openBook.add(leafPivot);
    const readerHitTargets = [leftPage, rightPage, leftCover, rightCover, frontCover, frontCoverImage];
    const originalLeafPositions = leafGeometry.attributes.position.array.slice();

    let openProgress = 0;
    let activeTurnId = 0;
    let turnStartedAt = 0;
    let lastSpreadKey = "";
    let lastCoverIndex = -1;
    let raf = 0;
    const timer = new THREE.Timer();
    timer.connect(document);

    async function applyBookTextures() {
      const current = stateRef.current;
      const book = books[current.selectedIndex] ?? books[0];
      const spread = current.spreads[current.spreadIndex];
      if (!book || !spread) return;
      const key = `${book.slug}:${spread}`;

      if (lastCoverIndex !== current.selectedIndex) {
        lastCoverIndex = current.selectedIndex;
        const texture = await normalizedCover(book, anisotropy);
        if (disposed || lastCoverIndex !== current.selectedIndex) {
          texture.dispose();
          return;
        }
        setMap(frontCoverImageMaterial, texture);
        frontCoverShellMaterial.color.set(book.accent);
        backCoverMaterial.map = colorTexture(book.accent);
        backCoverMaterial.needsUpdate = true;
      }

      if (lastSpreadKey === key) return;
      lastSpreadKey = key;
      const pair = await texturePair(spread, book, anisotropy);
      if (disposed || lastSpreadKey !== key) {
        pair.left.dispose();
        pair.right.dispose();
        return;
      }
      setMap(paperMaterialLeft, pair.left);
      setMap(paperMaterialRight, pair.right);
    }

    function startTurnIfNeeded(time: number) {
      const current = stateRef.current;
      if (current.turn.id === activeTurnId || current.mode !== "reading") return;
      activeTurnId = current.turn.id;
      turnStartedAt = time;
      leafPivot.visible = false;
      const book = books[current.selectedIndex] ?? books[0];
      const previousIndex = THREE.MathUtils.clamp(
        current.spreadIndex - current.turn.direction,
        0,
        current.spreads.length - 1,
      );
      const previousSource = current.spreads[previousIndex];
      const currentSource = current.spreads[current.spreadIndex];
      if (book && previousSource && currentSource) {
        Promise.all([
          texturePair(previousSource, book, anisotropy),
          texturePair(currentSource, book, anisotropy),
        ]).then(([previous, next]) => {
          if (disposed || activeTurnId !== current.turn.id) {
            previous.left.dispose();
            previous.right.dispose();
            next.left.dispose();
            next.right.dispose();
            return;
          }
          const frontTexture = current.turn.direction === 1 ? previous.right : next.right;
          const backSource = current.turn.direction === 1 ? next.left : previous.left;
          const backTexture = mirrorTextureForBackFace(backSource);
          setMap(leafFrontMaterial, frontTexture);
          setMap(leafBackMaterial, backTexture);

          for (const texture of [previous.left, previous.right, next.left, next.right]) {
            if (texture !== frontTexture) texture.dispose();
          }

          turnStartedAt = performance.now();
          leafPivot.rotation.y = current.turn.direction === 1 ? 0 : -Math.PI;
          leafPivot.visible = !current.reducedMotion;
        });
      }
    }

    function deformLeaf(progress: number) {
      const positions = leafGeometry.attributes.position;
      const curve = Math.sin(progress * Math.PI) * 0.34;
      for (let index = 0; index < positions.count; index += 1) {
        const sourceX = originalLeafPositions[index * 3] as number;
        const sourceY = originalLeafPositions[index * 3 + 1] as number;
        const normalized = sourceX / PAGE_WIDTH;
        positions.setXYZ(index, sourceX, sourceY, Math.sin(normalized * Math.PI) * curve);
      }
      positions.needsUpdate = true;
      leafGeometry.computeVertexNormals();
    }

    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let gestureStart: { x: number; y: number; pointerId: number } | null = null;
    function handlePointerDown(event: PointerEvent) {
      gestureStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
      if (stateRef.current.mode === "reading") {
        renderer.domElement.setPointerCapture(event.pointerId);
        renderer.domElement.classList.add("is-dragging");
      }
    }

    function handlePointerUp(event: PointerEvent) {
      if (stateRef.current.mode === "reading") {
        const start = gestureStart;
        gestureStart = null;
        renderer.domElement.classList.remove("is-dragging");
        if (!start || start.pointerId !== event.pointerId) return;
        const deltaX = event.clientX - start.x;
        const deltaY = event.clientY - start.y;
        if (Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
          turnPageRef.current(deltaX < 0 ? 1 : -1);
          return;
        }
        if (Math.hypot(deltaX, deltaY) <= 12) {
          const bounds = renderer.domElement.getBoundingClientRect();
          pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
          pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);
          const touchedBook = raycaster.intersectObjects(readerHitTargets, false).length > 0;
          if (!touchedBook) closeRef.current();
        }
        return;
      }

      const start = gestureStart;
      gestureStart = null;
      if (!start || start.pointerId !== event.pointerId) return;
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12) return;

      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(raycastTargets, false)[0];
      const index = hit?.object.userData.bookIndex;
      if (typeof index === "number") {
        const current = stateRef.current;
        if (current.mode === "inspect" && current.canOpen && index === current.selectedIndex) {
          openRef.current();
        } else {
          selectRef.current(index);
        }
      } else if (stateRef.current.mode === "inspect") {
        returnToShelfRef.current();
      }
    }
    function handlePointerCancel() {
      gestureStart = null;
      renderer.domElement.classList.remove("is-dragging");
    }
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointercancel", handlePointerCancel);

    const inspectTarget = new THREE.Vector3(-1.65, 0.05, 5.35);
    const inspectScale = new THREE.Vector3(1.42, 1.42, 1.42);
    const homeScale = new THREE.Vector3(1, 1, 1);
    let readerIsNarrow = false;
    let readerVisibleWidth = 1;
    let readerVisibleHeight = 1;
    let shelfCameraZ = 22;
    let shelfCameraY = -2;
    let focusCameraZ = 13.5;
    let readerCameraZ = 13.5;

    function resize() {
      const width = Math.max(hostElement.clientWidth, 1);
      const height = Math.max(hostElement.clientHeight, 1);
      const isNarrow = width < 720;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const halfVerticalView = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const distanceForHeight = 13.4 / (2 * halfVerticalView);
      const distanceForWidth = 15.6 / (2 * halfVerticalView * camera.aspect);
      shelfCameraZ = Math.max(distanceForHeight, distanceForWidth);
      shelfCameraY = isNarrow ? -2.4 : -2;
      focusCameraZ = isNarrow ? 14.2 : 13.5;
      readerCameraZ = isNarrow ? 12.8 : 13.5;
      inspectTarget.set(isNarrow ? 0 : -1.65, isNarrow ? 0.72 : 0.05, isNarrow ? 4.65 : 5.35);
      inspectScale.setScalar(isNarrow ? 1.18 : 1.42);
      readerIsNarrow = isNarrow;
      readerVisibleHeight = 2 * halfVerticalView * (readerCameraZ - openBook.position.z);
      readerVisibleWidth = readerVisibleHeight * camera.aspect;
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hostElement);
    resize();

    function render(time: number) {
      timer.update(time);
      const delta = Math.min(timer.getDelta(), 0.05);
      const current = stateRef.current;
      const selected = bookGroups[current.selectedIndex];
      const targetOpen = current.mode === "reading" ? 1 : 0;
      const motionRate = current.reducedMotion ? 1 : Math.min(1, delta * 3.6);
      openProgress = THREE.MathUtils.lerp(openProgress, targetOpen, motionRate);
      if (Math.abs(openProgress - targetOpen) < 0.002) openProgress = targetOpen;

      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        current.mode === "shelf" ? shelfCameraZ : current.mode === "reading" ? readerCameraZ : focusCameraZ,
        motionRate,
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        current.mode === "shelf" ? shelfCameraY : 0.25,
        motionRate,
      );

      const roomDepth = current.mode === "shelf" ? 0 : current.mode === "reading" ? -8.5 : -4.8;
      room.position.z = THREE.MathUtils.lerp(room.position.z, roomDepth, motionRate);
      room.rotation.x = THREE.MathUtils.lerp(room.rotation.x, current.mode === "shelf" ? 0 : -0.025, motionRate);
      openBook.position.y = THREE.MathUtils.lerp(
        openBook.position.y,
        current.mode === "reading" ? (readerIsNarrow ? 0.55 : 0.25) : -0.15,
        motionRate,
      );

      bookGroups.forEach((group, index) => {
        const home = group.userData.home as THREE.Vector3;
        const isSelected = index === current.selectedIndex;
        const isInspecting = isSelected && current.mode === "inspect";
        const target = isInspecting ? inspectTarget : home;
        group.position.lerp(target, motionRate);
        group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, isInspecting ? 0 : group.userData.homeRotation, motionRate);
        group.scale.lerp(isInspecting ? inspectScale : homeScale, motionRate);
        group.visible = !(isSelected && (current.mode === "reading" || openProgress > 0.015));
        for (const material of bookMaterials[index] ?? []) {
          material.transparent = current.mode !== "shelf" && !isSelected;
          material.opacity = current.mode !== "shelf" && !isSelected ? 0.2 : 1;
        }
      });

      openBook.visible = current.mode === "reading" || openProgress > 0.015;
      renderer.domElement.classList.toggle("can-open", current.mode === "inspect" && current.canOpen);
      const readerAspectScale = (books[current.selectedIndex]?.coverAspect ?? 0.72) / (PAGE_WIDTH / PAGE_HEIGHT);
      const widthFit = readerVisibleWidth * (readerIsNarrow ? 0.9 : 0.72) / (PAGE_WIDTH * 2 * readerAspectScale);
      const heightFit = readerVisibleHeight * (readerIsNarrow ? 0.72 : 0.78) / PAGE_HEIGHT;
      const readerViewportScale = Math.min(widthFit, heightFit, readerIsNarrow ? 1.08 : 1);
      const readerScale = (0.72 + openProgress * 0.28) * readerViewportScale;
      openBook.scale.set(readerScale * readerAspectScale, readerScale, readerScale);
      openBook.rotation.z = THREE.MathUtils.lerp(0.05, 0, openProgress);
      frontPivot.rotation.y = -Math.PI * easeOutQuint(openProgress);
      frontPivot.position.z = THREE.MathUtils.lerp(0.12, -0.12, openProgress);
      leftPage.visible = openProgress > 0.52;
      rightPage.visible = openProgress > 0.08;
      applyBookTextures();
      startTurnIfNeeded(time);

      if (leafPivot.visible) {
        const duration = current.reducedMotion ? 1 : 780;
        const raw = Math.min(1, (time - turnStartedAt) / duration);
        const progress = easeOutQuint(raw);
        leafPivot.rotation.y = current.turn.direction === 1 ? -Math.PI * progress : -Math.PI * (1 - progress);
        deformLeaf(progress);
        if (raw >= 1) leafPivot.visible = false;
      }

      if (selected && current.mode === "shelf") {
        selected.rotation.z = Math.sin(time * 0.0012 + current.selectedIndex) * 0.008;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      fallbackRef.current();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      timer.dispose();
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointercancel", handlePointerCancel);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          for (const material of materials) material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [books]);

  return <div ref={hostRef} className="library-scene" data-testid="library-3d-scene" />;
}
