const demoPage = document.getElementById("demoPage");
const galleryPage = document.getElementById("galleryPage");
const tabs = document.querySelectorAll(".tab");

const uploadBox = document.getElementById("uploadBox");
const uploadPreview = document.getElementById("uploadPreview");
const uploadSuccess = document.getElementById("uploadSuccess");
const resultBox = document.getElementById("resultBox");
const runButton = document.getElementById("runButton");
const inputGallery = document.getElementById("inputGallery");

runButton.disabled = true;
let selectedItem = null;
let draggedItem = null;
let generationTimeout = null;
let isGenerating = false;


const demoItems = [
  {
    id: 1,
    image: "https://picsum.photos/500/700?1",
    video: "https://pub-48fbb90e45824b998ff07604d5b10bbc.r2.dev/nbafun.MP4",
  },
  {
    id: 2,
    image: "https://picsum.photos/500/700?2",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 3,
    image: "https://picsum.photos/500/700?3",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 4,
    image: "https://picsum.photos/500/700?4",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 5,
    image: "https://picsum.photos/500/700?5",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 6,
    image: "https://picsum.photos/500/700?6",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 7,
    image: "https://picsum.photos/500/700?6",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 8,
    image: "https://picsum.photos/500/700?6",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 9,
    image: "https://picsum.photos/500/700?6",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];

const mainPage = document.getElementById("mainPage");

const homeLink = document.getElementById("homeLink");
const demoTab = document.getElementById("demoTab");
const galleryTab = document.getElementById("galleryTab");
const tryDemoBtn = document.getElementById("tryDemoBtn");
const demoSection = document.getElementById("demoSection");

function setActiveTab(tabName) {
  demoTab.classList.toggle("active", tabName === "demo");
  galleryTab.classList.toggle("active", tabName === "gallery");
}

function showMainPage(scrollToDemo = false) {
  mainPage.style.display = "block";
  galleryPage.style.display = "none";
  setActiveTab("demo");

  if (scrollToDemo) {
    demoSection.scrollIntoView({ behavior: "smooth" });
  }
}

function showGalleryPage() {
  mainPage.style.display = "none";
  galleryPage.style.display = "block";
  setActiveTab("gallery");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

homeLink.addEventListener("click", () => {
  mainPage.style.display = "block";
  galleryPage.style.display = "none";
  setActiveTab("demo");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

demoTab.addEventListener("click", () => {
  showMainPage(true);
});

tryDemoBtn.addEventListener("click", () => {
  showMainPage(true);
});

galleryTab.addEventListener("click", () => {
  showGalleryPage();
});

function renderInputGallery() {
  inputGallery.innerHTML = "";

  demoItems.forEach((item) => {
    const img = document.createElement("img");
    img.src = item.image;
    img.draggable = true;

    img.addEventListener("click", () => {
      selectedItem = item;
      updateSelectedThumb();
      showUploadedImage(item.image);
    });

    img.addEventListener("dragstart", () => {
      draggedItem = item;
    });

    inputGallery.appendChild(img);
  });
}

function updateSelectedThumb() {
  const thumbs = inputGallery.querySelectorAll("img");

  thumbs.forEach((img, index) => {
    img.classList.toggle("selected", demoItems[index].id === selectedItem?.id);
  });
}

function showUploadedImage(src) {
  uploadPreview.src = src;
  uploadBox.classList.add("has-image");

  uploadSuccess.classList.remove("show");
  void uploadSuccess.offsetWidth;
  uploadSuccess.classList.add("show");
}


function showLoadingState() {
  resultBox.innerHTML = `
    <div class="result-loading">
      <div class="result-loading-spinner"></div>
      <div>Generating video...</div>
    </div>
  `;
}

function showResultVideo(videoUrl) {
  resultBox.innerHTML = `
    <video class="result-video" controls autoplay muted playsinline>
      <source src="${videoUrl}" type="video/mp4" />
    </video>
  `;
}

function resetResultBox() {
  resultBox.innerHTML = `<div class="result-placeholder">Result</div>`;
}

uploadBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadBox.classList.add("drag-over");
});

uploadBox.addEventListener("dragleave", () => {
  uploadBox.classList.remove("drag-over");
});

uploadBox.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadBox.classList.remove("drag-over");

  if (draggedItem) {
    selectedItem = draggedItem;
    updateSelectedThumb();
    showUploadedImage(draggedItem.image);
    runButton.disabled = false;
  }
});

runButton.addEventListener("click", () => {
    if (!selectedItem || isGenerating) return;
  
    isGenerating = true;
    runButton.disabled = true;
    clearButton.disabled = false;
  
    showLoadingState();
  
    generationTimeout = setTimeout(() => {
      if (selectedItem) {
        showResultVideo(selectedItem.video);
      } else {
        resetResultBox();
      }
  
      isGenerating = false;
      runButton.disabled = !selectedItem;
      generationTimeout = null;
    }, 2000);
  });

const clearButton = document.getElementById("clearButton");

clearButton.addEventListener("click", () => {
    // 如果还在生成，先取消
    if (generationTimeout) {
      clearTimeout(generationTimeout);
      generationTimeout = null;
    }
  
    isGenerating = false;
  
    // 清数据
    selectedItem = null;
    draggedItem = null;
  
    // 清 Upload
    uploadPreview.src = "";
    uploadBox.classList.remove("has-image");
    uploadBox.classList.remove("drag-over");
  
    // 清 Result
    resetResultBox();
  
    // 清选中状态
    const imgs = inputGallery.querySelectorAll("img");
    imgs.forEach((img) => img.classList.remove("selected"));
  
    // 按钮状态恢复
    runButton.disabled = true;
  });


  function initHeroParticles() {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas) return;
  
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let animationId = null;
  
    const backgroundDots = [];
    const waveDots = [];
  
    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
  
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
      buildParticles();
    }
  
    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    function buildParticles() {
        const waveParticleCount = Math.floor(width * 1.2);

const flows = [
  {
    baseY: height * 0.54,
    amp: height * 0.08,
    freq: 1.2,
    phase: rand(0, Math.PI * 2),
    alpha: 0.18,
    thickness: 300,
  },
  {
    baseY: height * 0.7,
    amp: height * 0.11,
    freq: 0.95,
    phase: rand(0, Math.PI * 2),
    alpha: 0.16,
    thickness: 200,
  },
  {
    baseY: height * 0.92,
    amp: height * 0.09,
    freq: 1.35,
    phase: rand(0, Math.PI * 2),
    alpha: 0.14,
    thickness: 150,
  },
];

for (let i = 0; i < waveParticleCount; i++) {
  const flow = flows[Math.floor(Math.random() * flows.length)];

  // 粒子沿着整条流带随机分布，不再规则采样 t
  const t = Math.random();

  const centerY =
    flow.baseY +
    Math.sin(t * Math.PI * 2 * flow.freq + flow.phase) * flow.amp;

  // 核心：不是“层”，而是云状偏移
  // 用平方增强中心聚集，让边缘更 sparse
  const spread =
    (Math.random() * 2 - 1) *
    flow.thickness *
    Math.pow(Math.random(), 0.65);

  // 局部段落密度变化，避免一整条都平均
  const densityMask =
    0.55 +
    0.45 * Math.sin(t * Math.PI * 3 + flow.phase * 0.7);

  if (Math.random() > densityMask) continue;

  waveDots.push({
    flow,
    t,
    x: t * width + rand(-12, 12),
    baseY: centerY,
    spread,
    r: rand(0.7, 2.1),
    alpha: rand(flow.alpha * 0.35, flow.alpha),
    driftX: rand(-0.35, 0.35),
    driftY: rand(-0.25, 0.25),
    twinkle: rand(0.6, 1.8),
  });
}
    }
  
    function drawGlow() {
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.88,
        0,
        width * 0.5,
        height * 0.88,
        height * 0.6
      );
      gradient.addColorStop(0, "rgba(58, 110, 255, 0.34)");
      gradient.addColorStop(0.55, "rgba(58, 110, 255, 0.1)");
      gradient.addColorStop(1, "rgba(58, 110, 255, 0)");
  
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
  
    function animate(time) {
      ctx.clearRect(0, 0, width, height);
  
      drawGlow();
  
      const t = time * 0.001;
  
      // 画背景散点
      backgroundDots.forEach((dot) => {
        dot.x += dot.driftX;
        dot.y += dot.driftY;
  
        if (dot.x < -5) dot.x = width + 5;
        if (dot.x > width + 5) dot.x = -5;
        if (dot.y < -5) dot.y = height + 5;
        if (dot.y > height + 5) dot.y = -5;
  
        const flicker = 0.5 + 0.5 * Math.sin(t * 2 + dot.x * 0.01);
        const alpha = dot.alpha * (0.75 + flicker * 0.35);
  
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      });
  
      // 画流线粒子
      waveDots.forEach((dot) => {
        const x =
          dot.x +
          Math.sin(t * 0.3 + dot.t * 10) * dot.driftX * 200;
      
        const y =
          dot.baseY +
          dot.spread +
          Math.sin(t * 0.52 + dot.t * 12) * dot.driftY * 100;
      
        // 中心更亮，边缘更淡
        const edgeFade =
          1 - Math.min(Math.abs(dot.spread) / dot.flow.thickness, 1);
      
        const flicker =
          0.75 + 0.25 * Math.sin(t * dot.twinkle + dot.t * 30);
      
        // const alpha = dot.alpha * edgeFade * flicker;
        const alpha = dot.alpha * edgeFade * flicker * 10;
      
        ctx.beginPath();
        ctx.fillStyle =
          dot.flow.baseY < height * 0.4
            ? `rgba(220,230,255,${alpha})`
            : dot.flow.baseY < height * 0.62
            ? `rgba(170,190,255,${alpha})`
            : `rgba(255,255,255,${alpha * 0.9})`;
      
        ctx.arc(x, y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      });
  
      animationId = requestAnimationFrame(animate);
    }
  
    resizeCanvas();
    animate(0);
  
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 120);
    });
  
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }

  const galleryItems = [
    {
      cover: "https://picsum.photos/500/700?21",
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    {
      cover: "https://picsum.photos/500/900?22",
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    {
      cover: "https://picsum.photos/500/650?23",
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    {
      cover: "https://picsum.photos/500/820?24",
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    {
      cover: "https://picsum.photos/500/760?25",
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    {
      cover: "https://picsum.photos/500/600?26",
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    {
      cover: "https://picsum.photos/500/820?24",
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    {
      cover: "https://picsum.photos/500/760?25",
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    {
      cover: "https://picsum.photos/500/600?26",
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    {
      cover: "https://picsum.photos/500/820?24",
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    {
      cover: "https://picsum.photos/500/760?25",
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    {
      cover: "https://picsum.photos/500/600?26",
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },

  ];
  
  const masonryGallery = document.getElementById("masonryGallery");
  
  function renderGallery() {
    masonryGallery.innerHTML = "";
  
    galleryItems.forEach((item) => {
      const card = document.createElement("div");
      card.className = "gallery-card";
  
      const cover = document.createElement("img");
      cover.className = "gallery-cover";
      cover.src = item.cover;
      cover.alt = "Gallery cover";
  
      const video = document.createElement("video");
      video.className = "gallery-video";
      video.src = item.video;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "none";
  
      card.appendChild(cover);
      card.appendChild(video);
  
      card.addEventListener("mouseenter", () => {
        video.play().catch(() => {});
      });
  
      card.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
      });
  
      masonryGallery.appendChild(card);
    });
  }
  
  renderGallery();
initHeroParticles();
renderInputGallery();
resetResultBox();