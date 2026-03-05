const lenis = new Lenis({
  lerp: 0.15,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
function initflickity() {
  $(".main-carousel").flickity({
    // options
    cellAlign: "center",
    contain: true,
    wrapAround: true,
    draggable: true,
    arrowShape: "M67.37,100L28.195,50,67.37,0,71.8,5.5,37.581,50,71.8,94.5Z",
  });
}

requestAnimationFrame(raf);
function initArrowScroll() {
  const scrollBtn = document.getElementById("scroll-button");
  const target = document.getElementById("introduction");
  if (scrollBtn && target) {
    scrollBtn.addEventListener("click", function () {
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 0 },
        duration: 1,
        ease: "power2.inOut",
      });
    });
  }
}
function initScrollToTop() {
  $(document).ready(function () {
    // スクロールしたらボタン表示
    $(window).scroll(function () {
      if ($(this).scrollTop() > 200) {
        $("#scrollToTop").fadeIn();
      } else {
        $("#scrollToTop").fadeOut();
      }
    });

    // ボタン押下でトップへスムーズスクロール
    $("#scrollToTop").click(function () {
      $("html, body").animate({ scrollTop: 0 }, 500);
      return false;
    });
  });
}

function initCurrentHighlight() {
  const headerNavLink = document.querySelectorAll(".nav-link");
  const logoLink = document.querySelector(".navbar-brand");

  let currentPath = location.pathname;
  if (currentPath === "/") {
    currentPath = "/index.html";
  }

  headerNavLink.forEach((targetLink) => {
    const linkPath = new URL(targetLink.href).pathname;
    if (linkPath === currentPath) {
      targetLink.parentElement.classList.add("current");

      targetLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      targetLink.setAttribute("aria-disabled", "true");
    }
  });

  if (logoLink) {
    const logoPath = new URL(logoLink.href).pathname;
    if (logoPath === "/index.html" && currentPath === "/index.html") {
      logoLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      logoLink.setAttribute("aria-disabled", "true");
    }
  }
}

// ナビゲーション表示アニメーション
function initNavbar() {
  const $nav = document.querySelector(".navigation");
  if (!$nav) return;
  gsap.set($nav, { y: -60, opacity: 0, top: 0 });
  gsap.to($nav, {
    y: 0,
    opacity: 1,
    duration: 1.6,
    delay: 0.2,
    ease: "power2.inOut",
  });
}

function initBannerTextAnimation() {
  const $bannerText = document.querySelectorAll(".banner-h1, .banner-h2");
  const $bannerTextContainer = document.querySelector(".banner-text-container");
  const $transparentButton = document.querySelectorAll(".transparent-button");
  const $lastupdatedText = document.querySelectorAll(".last-updated-text");
  if (!$bannerText) return;
  gsap.set($bannerText, { y: 60, opacity: 0 });
  gsap.set($bannerTextContainer, { opacity: 0 });
  gsap.set($transparentButton, { y: 0, opacity: 0 });
  gsap.set($lastupdatedText, { y: 0, opacity: 0 });
  gsap.to($bannerText, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    delay: 0.8,
    ease: "power2.out",
  });
  gsap.to($bannerTextContainer, {
    opacity: 1,
    duration: 1.2,
    delay: 0.8,
    ease: "power2.out",
  });
  gsap.to($transparentButton, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    delay: 2.0,
    stagger: 0.2,
    ease: "power2.out",
  });
  gsap.to($lastupdatedText, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    delay: 2.0,
    stagger: 0.2,
    ease: "power2.out",
  });
}

// スクロールによるナビ透明切り替え
function updateNavTransparency() {
  const nav = document.querySelector(".navigation");
  const section = document.getElementById("top-banner");
  const offset = 200;
  if (!nav || !section) return;

  const scrollPos = window.scrollY;
  const sectionTop = section.offsetTop - offset;
  const sectionBottom = sectionTop + section.offsetHeight;

  if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
    nav.classList.add("transparent");
  } else {
    nav.classList.remove("transparent");
  }
}

function initNavTransparency() {
  window.removeEventListener("scroll", updateNavTransparency); // 重複防止
  window.addEventListener("scroll", updateNavTransparency);
  // ちらつき防止のために少し遅延して初期実行
  setTimeout(updateNavTransparency, 80);
}

// ハンバーガーメニューのトグル
function initMenuToggle() {
  const toggleBtn = document.getElementById("toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      this.classList.toggle("active");
      document.getElementById("overlay")?.classList.toggle("open");
    });
  }
}

function initSlider() {
  $(".slider").each(function () {
    // -----------------------------------------------------
    // 1. 効率化：要素を最初にキャッシュする
    // -----------------------------------------------------
    const $slider = $(this);
    const $slides = $slider.find(".slideList li");
    const $progress = $slider.find(".progressBar");
    const slideCount = $slides.length;

    // スライドが1枚以下の場合は何もしない
    if (slideCount <= 1) {
      $slides.show();
      return;
    }

    // -----------------------------------------------------
    // 2. 最適化：data属性から設定値を読み込む
    // -----------------------------------------------------
    const delay = $slider.data("delay") || 4500;
    const fadeSpeed = $slider.data("speed") || 300;

    let timerId;
    let imgNo = 0;

    // 重複バインド防止
    $slider.off("mouseenter mouseleave");

    $slider.hover(
      function () {
        // --- mouseenter (ホバー開始) ---

        // 1. まず現在表示されている画像(0番目と仮定)から
        //    次の画像(1番目)へ即座にアニメーションさせる

        // 0番目をフェードアウト
        $slides.eq(0).stop(true, true).fadeOut(fadeSpeed);

        // 1番目をフェードイン
        $slides.eq(1).stop(true, true).fadeIn(fadeSpeed);

        // 現在の番号を「1」にセット
        imgNo = 1;

        // プログレスバーを開始 (1 -> 2 への待機時間用)
        $progress
          .stop(true, true)
          .css("width", 0)
          .show()
          .animate({ width: "100%" }, delay, "linear");

        // 2. タイマーを開始 (次は imgNo が 2 になるところからループ)
        timerId = setInterval(function () {
          // 現在のスライドをフェードアウト
          $slides.eq(imgNo).stop(true, true).fadeOut(fadeSpeed);

          // 次のスライド番号を計算
          imgNo = (imgNo + 1) % slideCount;

          // 次のスライドをフェードイン
          $slides.eq(imgNo).stop(true, true).fadeIn(fadeSpeed);

          // プログレスバーをリセットして再開
          $progress.stop(true, true).css("width", 0).animate({ width: "100%" }, delay, "linear");
        }, delay);
      },
      function () {
        // --- mouseleave (ホバー終了) ---

        // タイマー停止
        clearInterval(timerId);

        // プログレスバー停止・非表示
        $progress.stop(true, true).hide().css("width", 0);

        // 現在表示中のスライドをフェードアウトさせ、0番目に戻す
        $slides.stop(true, true).fadeOut(fadeSpeed);
        $slides.eq(0).fadeIn(fadeSpeed);

        imgNo = 0; // 番号リセット
      },
    );
  });
}

function initVideoHover() {
  const items = document.querySelectorAll(".grid-item");

  items.forEach((item) => {
    const video = item.querySelector(".hover-video");
    let pauseTimeout; // タイマーIDを格納する変数

    item.addEventListener("mouseenter", async () => {
      // 1秒以内に再びホバーされた場合、停止・リセットのタイマーをキャンセルする
      clearTimeout(pauseTimeout);

      if (!video.src) {
        video.src = video.dataset.src;
        video.load();
        console.log("Video source loaded on hover.");
      }

      try {
        await video.play();
        item.classList.add("is-playing");
        console.log("Playback started. Thumbnail hidden.");
      } catch (error) {
        console.error("Playback failed. The browser might have blocked it.", error);
      }
    });

    item.addEventListener("mouseleave", () => {
      // 1. サムネイルはすぐに表示（フェードイン）を開始させる
      item.classList.remove("is-playing");

      // 2. 1秒後（1000ミリ秒後）に動画を停止し、最初のフレームに戻す
      pauseTimeout = setTimeout(() => {
        video.pause();
        video.currentTime = 0;
        console.log("Video paused and reset after delay.");
      }, 1000);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        // 動いているタイマーを強制キャンセル
        clearTimeout(pauseTimeout);

        // 動画を強制停止して最初のフレームに戻す
        video.pause();
        video.currentTime = 0;

        // サムネイルを強制的に再表示する
        item.classList.remove("is-playing");
        console.log("Tab hidden. Video and thumbnail state reset.");
      }
    });
  });
}

// すべての初期化関数をまとめて呼ぶ
function initAllScripts() {
  initCurrentHighlight();
  initNavbar();
  initScrollToTop();
  initBannerTextAnimation();
  initArrowScroll();
  initNavTransparency();
  initMenuToggle();
  initSlider();
  initflickity();
  initVideoHover();
  $(".masonry").masonry({
    itemSelector: ".masonry-item",
  });
}

// --------------------------
// Barba.js 初期化
// --------------------------
const progressBar = {
  el: document.getElementById("progress-bar"),
  start() {
    this.el.style.width = "0%";
    this.el.style.display = "block";
    gsap.to(this.el, { width: "100%", duration: 1, ease: "none" });
  },
  finish() {
    gsap.to(this.el, {
      width: "100%",
      duration: 0.2,
      onComplete: () => {
        gsap.to(this.el, {
          opacity: 0,
          duration: 0.15,
          onComplete: () => {
            this.el.style.display = "none";
            this.el.style.opacity = 1;
          },
        });
      },
    });
  },
};

if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}

barba.init({
  transitions: [
    {
      name: "slide-up",
      sync: true,

      before() {
        document.body.style.pointerEvents = "none";
        console.log("Transition started: Clicks disabled.");
      },

      leave({ current }) {
        progressBar.start();
        const scrollY = window.scrollY;

        // Scope to current container to avoid affecting the next page
        const currentNav = current.container.querySelector(".navigation");

        // Use timeline and return it. Barba automatically waits for it to complete.
        const tl = gsap.timeline();

        if (currentNav) {
          // Fix math error: scrollY - 500 (not "500px")
          gsap.set(currentNav, {
            top: scrollY - "500px",
            opacity: 1,
          });
          tl.to(
            currentNav,
            {
              top: -scrollY - "500px",
              opacity: 0,
              duration: 0.5,
              ease: "power2.inOut",
            },
            0,
          );
        }

        // Fix current container for scroll-up effect
        gsap.set(current.container, {
          position: "fixed",
          top: -scrollY,
          left: 0,
          width: "100%",
          zIndex: -5,
        });

        tl.to(
          current.container,
          {
            top: -scrollY - window.innerHeight * 0.5,
            duration: 1.2,
            ease: "power2.inOut",
          },
          0,
        );

        return tl;
      },

      beforeEnter({ next }) {
        // Scope to next container
        const nextNav = next.container.querySelector(".navigation");

        // Hide next navigation initially to prevent FOUC (Flash of Unstyled Content)
        if (nextNav) {
          gsap.set(nextNav, { opacity: 0 });
        }

        // Set initial position for next container (waiting at the bottom)
        gsap.set(next.container, {
          position: "fixed",
          top: window.innerHeight,
          left: 0,
          width: "100%",
          zIndex: 500,
        });
      },

      enter({ next }) {
        const nextNav = next.container.querySelector(".navigation");
        const tl = gsap.timeline();

        // Slide up the next container
        tl.to(
          next.container,
          {
            top: 0,
            duration: 1.2,
            ease: "power2.inOut",
          },
          0,
        );

        // Fade in the new navigation
        if (nextNav) {
          tl.to(
            nextNav,
            {
              opacity: 0,
              duration: 0.5,
              ease: "power2.inOut",
            },
            "-=0.5",
          );
        }

        return tl;
      },

      afterEnter({ current, next }) {
        // Cleanup styles for both containers
        gsap.set([current.container, next.container], {
          clearProps: "all",
        });

        // Restore scroll behavior
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";

        progressBar.finish();

        // Initialize scripts and Masonry with a slight delay
        setTimeout(() => {
          initAllScripts();

          // Ensure Masonry targets only elements in the next container
          const grid = next.container.querySelector(".masonry-item");

          if (grid) {
            imagesLoaded(grid, function () {
              const msnry = Masonry.data(grid);
              if (msnry) {
                msnry.layout();
              }
            });

            // Scope masonry item animation to next container
            const masonryItems = next.container.querySelectorAll(".masonry-item");
            gsap.to(masonryItems, {
              opacity: 1,
              duration: 0.5,
              ease: "power1.out",
              delay: 0.2,
              stagger: 0.15,
            });
          }
        }, 80);
      },
      after() {
        document.body.style.pointerEvents = "";
        console.log("Transition ended: Clicks enabled.");
      },
    },
  ],
});

document.addEventListener("DOMContentLoaded", () => {
  initAllScripts();
  gsap.to("body", {
    opacity: 1,
    duration: 2,
    ease: "power1.out",
  });
  gsap.to(".masonry-item", {
    opacity: 1,
    duration: 0.5, //
    ease: "power1.out",
    delay: 0.2, // 初期化処理の完了を待つためのごく僅かな遅延
    stagger: 0.15,
  });
});
