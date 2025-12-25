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
 * 星空背景の生成
 */
const StarsBackground = {
  container: null,
  starCount: 100,

  /**
   * 初期化
   */
  init() {
    // アニメーション軽減モードの場合はスキップ
    if (Utils.prefersReducedMotion()) return;

    this.container = document.getElementById('stars');
    if (!this.container) return;

    this.createStars();
  },

  /**
   * 星を生成
   */
  createStars() {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < this.starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // ランダムな位置
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // ランダムなサイズ（1-3px）
      const size = Math.random() * 2 + 1;
      
      // ランダムなアニメーション設定
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.5 + 0.3;

      star.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        --star-duration: ${duration}s;
        --star-delay: ${delay}s;
        --star-opacity: ${opacity};
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


