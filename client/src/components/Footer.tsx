export default function Footer() {
  return (
    <footer className="ag-footer">
      <div className="ag-footer__inner">

        {/* 可選提示訊息 */}
        <p className="ag-footer__message">
          Afterglow 完整內容即將上線，敬請期待。
        </p>

        {/* 法律與資訊連結 */}
        <nav className="ag-footer__links" aria-label="Legal and info links">
          <a href="/privacy.html" className="ag-footer__link">隱私權政策</a>
          <span className="ag-footer__separator">•</span>
          <a href="/legal.html" className="ag-footer__link">法律免責</a>
          <span className="ag-footer__separator">•</span>
          <a href="/terms.html" className="ag-footer__link">使用條款</a>
          <span className="ag-footer__separator">•</span>
          <a href="/about.html" className="ag-footer__link">關於 Afterglow</a>
        </nav>

        <p className="ag-footer__copyright">
          © 2025 Afterglow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
