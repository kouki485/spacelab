/**
 * ==========================================================================
 * メインJavaScript - 合同会社Space Lab
 * 共通機能の実装
 * ==========================================================================
 */

'use strict';

/**
 * ユーティリティ関数
 */
const Utils = {
  /**
   * デバウンス関数 - 連続的なイベント発火を制御
   * @param {Function} func - 実行する関数
   * @param {number} wait - 待機時間（ミリ秒）
   * @returns {Function} - デバウンスされた関数
   */
  debounce(func, wait) {
    let timeout = null;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        func(...args);
      };
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * スロットル関数 - 一定間隔での実行を保証
   * @param {Function} func - 実行する関数
   * @param {number} limit - 間隔（ミリ秒）
   * @returns {Function} - スロットルされた関数
   */
  throttle(func, limit) {
    let inThrottle = false;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  },

  /**
   * アニメーション軽減設定を確認
   * @returns {boolean} - 軽減モードか否か
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};

/**
 * ローディング画面の制御
 */
const LoadingScreen = {
  element: null,

  /**
   * 初期化
   */
  init() {
    this.element = document.getElementById('loading');
    if (!this.element) return;

    // ページ読み込み完了後にローディングを非表示
    window.addEventListener('load', () => {
      this.hide();
    });

    // フォールバック: 3秒後に強制的に非表示
    setTimeout(() => {
      this.hide();
    }, 3000);
  },

  /**
   * ローディング画面を非表示
   */
  hide() {
    if (!this.element) return;

    // アニメーション軽減モードの場合は即座に非表示
    if (Utils.prefersReducedMotion()) {
      this.element.style.display = 'none';
      return;
    }

    this.element.classList.add('hidden');

    // トランジション完了後にDOMから削除
    setTimeout(() => {
      if (this.element && this.element.parentNode) {
        this.element.style.display = 'none';
      }
    }, 500);
  }
};

/**
 * 没入型宇宙×自然背景の生成
 */
const StarsBackground = {
  container: null,
  config: {
    starsBack: 100,
    starsMiddle: 70,
    starsFront: 50,
    shootingStars: 0,  // 流れ星なし
    leaves: 12,
    natureParticles: 20,
    spaceParticles: 25
  },

  /**
   * 初期化
   */
  init() {
    if (Utils.prefersReducedMotion()) {
      this.createSimpleBackground();
      return;
    }

    this.container = document.getElementById('stars');
    if (!this.container) return;

    this.createImmersiveBackground();
  },

  /**
   * 没入型背景を生成
   */
  createImmersiveBackground() {
    const fragment = document.createDocumentFragment();

    // ベース背景
    const cosmicBg = document.createElement('div');
    cosmicBg.className = 'cosmic-bg';
    fragment.appendChild(cosmicBg);

    // 自然側のオーラ（左）
    const natureGlow = document.createElement('div');
    natureGlow.className = 'nature-glow';
    fragment.appendChild(natureGlow);

    // 銀河（右）
    const galaxy = document.createElement('div');
    galaxy.className = 'galaxy';
    fragment.appendChild(galaxy);

    // 渦巻き銀河
    const spiralGalaxy = document.createElement('div');
    spiralGalaxy.className = 'spiral-galaxy';
    fragment.appendChild(spiralGalaxy);

    // 惑星
    this.createPlanets(fragment);

    // つながりの光線
    this.createConnectionBeams(fragment);

    // 星レイヤー
    fragment.appendChild(this.createStarsLayer('back', this.config.starsBack, 0.5, 1.5));
    fragment.appendChild(this.createStarsLayer('middle', this.config.starsMiddle, 1, 2.5));
    fragment.appendChild(this.createStarsLayer('front', this.config.starsFront, 2, 4));

    // 流れ星
    this.createShootingStars(fragment);

    // 自然の葉っぱ（左側）
    this.createLeaves(fragment);

    // 自然の粒子（左側）
    this.createNatureParticles(fragment);

    // 宇宙の粒子（右側）
    this.createSpaceParticles(fragment);

    this.container.appendChild(fragment);
  },

  /**
   * 惑星を生成
   */
  createPlanets(fragment) {
    const sizes = ['large', 'medium', 'small'];
    sizes.forEach(size => {
      const planet = document.createElement('div');
      planet.className = `planet planet--${size}`;
      fragment.appendChild(planet);
    });
  },

  /**
   * つながりの光線を生成
   */
  createConnectionBeams(fragment) {
    for (let i = 0; i < 3; i++) {
      const beam = document.createElement('div');
      beam.className = 'connection-beam';
      fragment.appendChild(beam);
    }
  },

  /**
   * 星レイヤーを生成
   */
  createStarsLayer(layerName, count, minSize, maxSize) {
    const layer = document.createElement('div');
    layer.className = `stars-layer stars-layer--${layerName}`;

    const colors = ['#ffffff', '#4A9EFF', '#B8A7E8', '#95D5B2', '#FFD700'];

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');

      // 右側に多く配置（宇宙側）
      const x = Math.random() * 200;
      const y = Math.random() * 200;
      const size = Math.random() * (maxSize - minSize) + minSize;
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.5 + 0.5;

      const isColored = Math.random() > 0.8;
      const isBright = Math.random() > 0.85;

      let className = 'star';
      if (isBright) className += ' star--bright';
      if (isColored) className += ' star--colored';

      star.className = className;

      let style = `
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        --star-duration: ${duration}s;
        --star-delay: ${delay}s;
        --star-opacity: ${opacity};
      `;

      if (isColored) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        style += `--star-color: ${color};`;
      }

      star.style.cssText = style;
      layer.appendChild(star);
    }

    return layer;
  },

  /**
     * 流れ星を生成（ゆっくり）
     */
  createShootingStars(fragment) {
    for (let i = 0; i < this.config.shootingStars; i++) {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';

      const x = Math.random() * 60 + 30;
      const y = Math.random() * 40;
      const duration = Math.random() * 4 + 8; // 8〜12秒（ゆっくり）
      const delay = Math.random() * 30 + i * 6;

      shootingStar.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        --shooting-duration: ${duration}s;
        --shooting-delay: ${delay}s;
      `;

      fragment.appendChild(shootingStar);
    }
  },

  /**
   * 葉っぱを生成（左側）
   */
  createLeaves(fragment) {
    for (let i = 0; i < this.config.leaves; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';

      const x = Math.random() * 35;
      const y = Math.random() * 100;
      const size = Math.random() * 40 + 20;
      const rotation = Math.random() * 360;
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 8;
      const opacity = Math.random() * 0.3 + 0.2;

      leaf.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        --leaf-size: ${size}px;
        --leaf-rotation: ${rotation}deg;
        --leaf-duration: ${duration}s;
        --leaf-delay: ${delay}s;
        --leaf-opacity: ${opacity};
      `;

      fragment.appendChild(leaf);
    }
  },

  /**
   * 自然の粒子を生成（左側）
   */
  createNatureParticles(fragment) {
    for (let i = 0; i < this.config.natureParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'nature-particle';

      const x = Math.random() * 40;
      const y = Math.random() * 100;
      const size = Math.random() * 10 + 5;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 10;

      particle.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        --particle-size: ${size}px;
        --float-duration: ${duration}s;
        --float-delay: ${delay}s;
      `;

      fragment.appendChild(particle);
    }
  },

  /**
   * 宇宙の粒子を生成（右側）
   */
  createSpaceParticles(fragment) {
    for (let i = 0; i < this.config.spaceParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'space-particle';

      const x = Math.random() * 50;
      const y = Math.random() * 100;
      const size = Math.random() * 8 + 4;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 12;

      particle.style.cssText = `
        right: ${x}%;
        top: ${y}%;
        --particle-size: ${size}px;
        --float-duration: ${duration}s;
        --float-delay: ${delay}s;
      `;

      fragment.appendChild(particle);
    }
  },

  /**
   * 簡易版背景
   */
  createSimpleBackground() {
    this.container = document.getElementById('stars');
    if (!this.container) return;

    const fragment = document.createDocumentFragment();

    // シンプルな背景
    const bg = document.createElement('div');
    bg.className = 'cosmic-bg';
    fragment.appendChild(bg);

    // 静的な星
    for (let i = 0; i < 80; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${Math.random() * 2 + 1}px;
        height: ${Math.random() * 2 + 1}px;
        opacity: ${Math.random() * 0.6 + 0.3};
      `;
      fragment.appendChild(star);
    }

    this.container.appendChild(fragment);
  }
};

/**
 * ヘッダーのスクロール制御
 */
const Header = {
  element: null,
  scrollThreshold: 50,

  /**
   * 初期化
   */
  init() {
    this.element = document.getElementById('header');
    if (!this.element) return;

    // スクロールイベントをスロットルで最適化
    window.addEventListener('scroll', Utils.throttle(() => {
      this.handleScroll();
    }, 100));

    // 初期状態を設定
    this.handleScroll();
  },

  /**
   * スクロール時の処理
   */
  handleScroll() {
    if (!this.element) return;

    if (window.scrollY > this.scrollThreshold) {
      this.element.classList.add('scrolled');
    } else {
      this.element.classList.remove('scrolled');
    }
  }
};

/**
 * モバイルナビゲーションの制御
 */
const MobileNav = {
  hamburger: null,
  nav: null,
  overlay: null,
  isOpen: false,

  /**
   * 初期化
   */
  init() {
    this.hamburger = document.getElementById('hamburger');
    this.nav = document.getElementById('mobile-nav');
    this.overlay = document.getElementById('mobile-nav-overlay');

    if (!this.hamburger || !this.nav) return;

    // ハンバーガーボタンのクリックイベント
    this.hamburger.addEventListener('click', () => {
      this.toggle();
    });

    // オーバーレイのクリックで閉じる
    if (this.overlay) {
      this.overlay.addEventListener('click', () => {
        this.close();
      });
    }

    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // リンクをクリックしたら閉じる
    const links = this.nav.querySelectorAll('.mobile-nav__link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        this.close();
      });
    });
  },

  /**
   * メニューの開閉を切り替え
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  /**
   * メニューを開く
   */
  open() {
    if (!this.hamburger || !this.nav) return;

    this.isOpen = true;
    this.hamburger.classList.add('active');
    this.hamburger.setAttribute('aria-expanded', 'true');
    this.nav.classList.add('active');

    if (this.overlay) {
      this.overlay.classList.add('active');
    }

    // スクロールを無効化
    document.body.style.overflow = 'hidden';
  },

  /**
   * メニューを閉じる
   */
  close() {
    if (!this.hamburger || !this.nav) return;

    this.isOpen = false;
    this.hamburger.classList.remove('active');
    this.hamburger.setAttribute('aria-expanded', 'false');
    this.nav.classList.remove('active');

    if (this.overlay) {
      this.overlay.classList.remove('active');
    }

    // スクロールを有効化
    document.body.style.overflow = '';
  }
};

/**
 * スクロールアニメーション（フェードイン）
 */
const ScrollAnimation = {
  elements: [],
  observer: null,

  /**
   * 初期化
   */
  init() {
    // アニメーション軽減モードの場合は即座に表示
    if (Utils.prefersReducedMotion()) {
      this.showAllElements();
      return;
    }

    this.elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    if (this.elements.length === 0) return;

    // Intersection Observerの設定
    const options = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      this.handleIntersection(entries);
    }, options);

    // 要素を監視
    this.elements.forEach(element => {
      this.observer.observe(element);
    });
  },

  /**
   * 交差時の処理
   * @param {IntersectionObserverEntry[]} entries - 交差エントリー
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // 一度表示したら監視を解除
        if (this.observer) {
          this.observer.unobserve(entry.target);
        }
      }
    });
  },

  /**
   * 全要素を即座に表示（アクセシビリティ対応）
   */
  showAllElements() {
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(element => {
      element.classList.add('visible');
    });
  }
};

/**
 * スムーススクロール
 */
const SmoothScroll = {
  /**
   * 初期化
   */
  init() {
    // アニメーション軽減モードの場合はスキップ
    if (Utils.prefersReducedMotion()) return;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        this.handleClick(e);
      });
    });
  },

  /**
   * クリック時の処理
   * @param {Event} e - クリックイベント
   */
  handleClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const headerHeight = document.getElementById('header')?.offsetHeight ?? 0;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * 現在のページのナビゲーションをハイライト
 */
const ActiveNavigation = {
  /**
   * 初期化
   */
  init() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // デスクトップナビゲーション
    document.querySelectorAll('.nav__link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // モバイルナビゲーション
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
};

/**
 * パララックス効果（軽微）
 */
const Parallax = {
  elements: [],

  /**
   * 初期化
   */
  init() {
    // アニメーション軽減モードの場合はスキップ
    if (Utils.prefersReducedMotion()) return;

    this.elements = document.querySelectorAll('.hero__bg');
    if (this.elements.length === 0) return;

    window.addEventListener('scroll', Utils.throttle(() => {
      this.handleScroll();
    }, 16));
  },

  /**
   * スクロール時の処理
   */
  handleScroll() {
    const scrollY = window.scrollY;

    this.elements.forEach(element => {
      const speed = 0.3;
      const yPos = scrollY * speed;
      element.style.transform = `translateY(${yPos}px)`;
    });
  }
};

/**
 * 画像の遅延読み込み
 */
const LazyLoad = {
  /**
   * 初期化
   */
  init() {
    // ネイティブのlazy loadingをサポートしていない場合のフォールバック
    if ('loading' in HTMLImageElement.prototype) return;

    const images = document.querySelectorAll('img[loading="lazy"]');
    if (images.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
          }
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      imageObserver.observe(img);
    });
  }
};

/**
 * アプリケーションの初期化
 */
const App = {
  /**
   * 初期化
   */
  init() {
    // DOM読み込み完了後に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initModules();
      });
    } else {
      this.initModules();
    }
  },

  /**
   * 各モジュールの初期化
   */
  initModules() {
    // ローディング画面
    LoadingScreen.init();

    // 星空背景
    StarsBackground.init();

    // ヘッダー
    Header.init();

    // モバイルナビゲーション
    MobileNav.init();

    // スクロールアニメーション
    ScrollAnimation.init();

    // スムーススクロール
    SmoothScroll.init();

    // ナビゲーションのアクティブ状態
    ActiveNavigation.init();

    // パララックス
    Parallax.init();

    // 遅延読み込み
    LazyLoad.init();
  }
};

// アプリケーション開始
App.init();



