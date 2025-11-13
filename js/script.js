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

var $grid = $(".masonry").masonry({
  itemSelector: ".masonry-item",
});

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
    delay: 0.6,
    ease: "power2.inOut",
  });
}

function initBannerTextAnimation() {
  const $bannerText = document.querySelectorAll(".banner-h1, .banner-h2");
  const $bannerTextContainer = document.querySelector(".banner-text-container");
  const $transparentButton = document.querySelectorAll(".transparent-button");
  if (!$bannerText) return;
  gsap.set($bannerText, { y: 60, opacity: 0 });
  gsap.set($bannerTextContainer, { opacity: 0 });
  gsap.set($transparentButton, { y: 60, opacity: 0 });
  gsap.to($bannerText, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    delay: 2.0,
    stagger: 0.2,
    ease: "power2.out",
  });
  gsap.to($bannerTextContainer, {
    opacity: 1,
    duration: 1.2,
    delay: 2.0,
    ease: "power2.out",
  });
  gsap.to($transparentButton, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    delay: 3.7,
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
    const $slider = $(this); // 現在のスライダー
    const $slides = $slider.find(".slideList li");
    const $progress = $slider.find(".progressBar");
    const slideCount = $slides.length;

    // スライドが1枚以下の場合は何もしない
    if (slideCount <= 1) {
      $slides.show(); // 1枚だけなら表示して終わり
      return; // .each() の次のループへ
    }

    // -----------------------------------------------------
    // 2. 最適化：data属性から設定値を読み込む
    // -----------------------------------------------------
    // HTML側で <div class="slider" data-delay="3000" data-speed="500"> のように指定可能
    const delay = $slider.data("delay") || 4500;
    const fadeSpeed = $slider.data("speed") || 600;

    let timerId;
    let imgNo = 0; // 現在のスライド番号も外側で管理

    // 念のため重複バインドを防止
    $slider.off("mouseenter mouseleave");

    $slider.hover(
      function () {
        // --- mouseenter (ホバー開始) ---

        // ホバー時に常に0番目から開始
        imgNo = 0;
        $slides.hide().eq(imgNo).show();

        // プログレスバーを開始
        $progress
          .stop(true, true)
          .css("width", 0)
          .show()
          .animate({ width: "100%" }, delay, "linear");

        // タイマーを開始
        timerId = setInterval(function () {
          // 現在のスライドをフェードアウト
          $slides.eq(imgNo).fadeOut(fadeSpeed);

          // 次のスライド番号を計算
          imgNo = (imgNo + 1) % slideCount;

          // 次のスライドをフェードイン
          $slides.eq(imgNo).fadeIn(fadeSpeed);

          // プログレスバーをリセットして再開
          $progress.stop(true, true).css("width", 0).animate({ width: "100%" }, delay, "linear");
        }, delay);
      },
      function () {
        // --- mouseleave (ホバー終了) ---

        // タイマーを停止
        clearInterval(timerId);

        // アニメーションをすべて停止し、プログレスバーを隠す
        $progress.stop(true, true).hide().css("width", 0);

        // スライドを0番目に戻す（アニメーション付き）
        $slides.stop(true, true).fadeOut(fadeSpeed);
        $slides.eq(0).fadeIn(fadeSpeed);
        imgNo = 0; // 番号をリセット
      }
    );
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
  $grid.imagesLoaded().progress(function () {
    $grid.masonry("layout");
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
      leave({ current, next }) {
        progressBar.start();
        const done = this.async();
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        console.log(scrollY);
        gsap.set(".navigation", {
          top: scrollY - "500px",
          opacity: 1,
        });
        gsap.to(".navigation", {
          top: -scrollY - "500px",
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        });
        gsap.set(current.container, {
          position: "fixed",
          top: -scrollY,
          left: 0,
          width: "100%",
          zIndex: -5,
        });
        gsap.set(next.container, {
          position: "fixed",
          top: window.innerHeight,
          left: 0,
          width: "100%",
          zIndex: 500,
        });

        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set([current.container, next.container], {
              clearProps: "all",
            });

            // 念のためスクロール復元
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";

            progressBar.finish();
            done();
          },
        });

        tl.to(
          current.container,
          {
            top: -scrollY - window.innerHeight * 0.5,
            duration: 1.2,
            ease: "power2.inOut",
          },
          0
        );

        tl.to(
          next.container,
          {
            top: 0,
            duration: 1.2,
            ease: "power2.inOut",
          },
          0
        );

        return tl;
      },
      afterEnter() {
        setTimeout(() => {
          initAllScripts();
        }, 80);
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
});
