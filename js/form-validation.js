/**
 * ==========================================================================
 * フォームバリデーション - 合同会社Space Lab
 * お問い合わせフォームのバリデーション機能
 * ==========================================================================
 */

'use strict';

/**
 * フォームバリデーションクラス
 */
class FormValidator {
  /**
   * コンストラクタ
   * @param {string} formId - フォームのID
   */
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;

    this.submitBtn = document.getElementById('submit-btn');
    this.thanksMessage = document.getElementById('thanks-message');
    this.isSubmitting = false;

    this.init();
  }

  /**
   * 初期化
   */
  init() {
    // フォーム送信イベント
    this.form.addEventListener('submit', (e) => {
      this.handleSubmit(e);
    });

    // リアルタイムバリデーション
    this.setupRealtimeValidation();

    // 文字数カウンター
    this.setupCharacterCounter();
  }

  /**
   * リアルタイムバリデーションの設定
   */
  setupRealtimeValidation() {
    const inputs = this.form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // フォーカスが外れた時にバリデーション
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      // 入力中にエラーをクリア
      input.addEventListener('input', () => {
        const group = input.closest('.form__group');
        if (group && group.classList.contains('error')) {
          group.classList.remove('error');
        }
      });
    });

    // チェックボックスの変更時
    const checkbox = this.form.querySelector('input[type="checkbox"][name="privacy"]');
    if (checkbox) {
      checkbox.addEventListener('change', () => {
        this.validateField(checkbox);
      });
    }
  }

  /**
   * 文字数カウンターの設定
   */
  setupCharacterCounter() {
    const textarea = this.form.querySelector('#message');
    const counter = document.getElementById('message-count');
    
    if (!textarea || !counter) return;

    const maxLength = parseInt(textarea.getAttribute('maxlength') || '2000', 10);

    textarea.addEventListener('input', () => {
      const currentLength = textarea.value.length;
      counter.textContent = `${currentLength} / ${maxLength}文字`;

      // 上限に近づいたら警告色
      if (currentLength > maxLength * 0.9) {
        counter.style.color = '#FF6B6B';
      } else {
        counter.style.color = '';
      }
    });
  }

  /**
   * フィールドのバリデーション
   * @param {HTMLElement} field - 入力フィールド
   * @returns {boolean} - バリデーション結果
   */
  validateField(field) {
    const group = field.closest('.form__group');
    if (!group) return true;

    const validateType = group.dataset.validate;
    if (!validateType) return true;

    let isValid = true;
    const value = field.value.trim();

    switch (validateType) {
      case 'required':
        isValid = this.validateRequired(value);
        break;
      case 'email':
        isValid = this.validateEmail(value);
        break;
      case 'tel':
        isValid = this.validateTel(value);
        break;
      case 'checkbox':
        isValid = this.validateCheckbox(field);
        break;
      default:
        isValid = true;
    }

    // エラー状態の更新
    if (isValid) {
      group.classList.remove('error');
    } else {
      group.classList.add('error');
    }

    return isValid;
  }

  /**
   * 必須チェック
   * @param {string} value - 値
   * @returns {boolean} - バリデーション結果
   */
  validateRequired(value) {
    return value.length > 0;
  }

  /**
   * メールアドレスチェック
   * @param {string} value - 値
   * @returns {boolean} - バリデーション結果
   */
  validateEmail(value) {
    if (value.length === 0) return false;
    // 基本的なメールアドレスのパターン
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  }

  /**
   * 電話番号チェック
   * @param {string} value - 値
   * @returns {boolean} - バリデーション結果
   */
  validateTel(value) {
    if (value.length === 0) return false;
    // 日本の電話番号パターン（ハイフンあり/なし両対応）
    const telPattern = /^[0-9\-+()]{10,}$/;
    return telPattern.test(value.replace(/\s/g, ''));
  }

  /**
   * チェックボックスチェック
   * @param {HTMLElement} field - チェックボックス要素
   * @returns {boolean} - バリデーション結果
   */
  validateCheckbox(field) {
    return field.checked;
  }

  /**
   * 全フィールドのバリデーション
   * @returns {boolean} - バリデーション結果
   */
  validateAll() {
    let isValid = true;
    const groups = this.form.querySelectorAll('.form__group[data-validate]');

    groups.forEach(group => {
      const input = group.querySelector('input, select, textarea');
      if (input && !this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * フォーム送信処理
   * @param {Event} e - 送信イベント
   */
  handleSubmit(e) {
    e.preventDefault();

    // 二重送信防止
    if (this.isSubmitting) return;

    // バリデーション
    if (!this.validateAll()) {
      // 最初のエラーフィールドにフォーカス
      const firstError = this.form.querySelector('.form__group.error input, .form__group.error select, .form__group.error textarea');
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    // 送信処理
    this.submitForm();
  }

  /**
   * フォーム送信
   */
  submitForm() {
    this.isSubmitting = true;
    this.showLoading(true);

    // フォームデータの収集
    const formData = new FormData(this.form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // 実際のAPIエンドポイントがある場合はここでfetchを使用
    // 今回はデモ用にタイムアウトでシミュレーション
    setTimeout(() => {
      this.handleSuccess();
    }, 1500);
  }

  /**
   * 送信成功時の処理
   */
  handleSuccess() {
    this.isSubmitting = false;
    this.showLoading(false);

    // フォームを非表示にしてサンクスメッセージを表示
    this.form.style.display = 'none';
    if (this.thanksMessage) {
      this.thanksMessage.classList.add('active');
    }

    // ページトップへスクロール
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * 送信エラー時の処理
   * @param {string} message - エラーメッセージ
   */
  handleError(message) {
    this.isSubmitting = false;
    this.showLoading(false);
    
    // エラーメッセージを表示（実装時にはより適切なUI表示を検討）
    alert(message || '送信に失敗しました。時間をおいて再度お試しください。');
  }

  /**
   * ローディング表示の切り替え
   * @param {boolean} show - 表示/非表示
   */
  showLoading(show) {
    if (!this.submitBtn) return;

    const btnText = this.submitBtn.querySelector('.btn__text');
    const btnLoading = this.submitBtn.querySelector('.btn__loading');

    if (show) {
      this.submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline';
    } else {
      this.submitBtn.disabled = false;
      if (btnText) btnText.style.display = 'inline';
      if (btnLoading) btnLoading.style.display = 'none';
    }
  }
}

// フォームがある場合のみ初期化
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    new FormValidator('contact-form');
  }
});


