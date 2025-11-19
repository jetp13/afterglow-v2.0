export default function Footer() {
  return (
    <footer className="ag-footer-v2">
      {/* 上排：四個連結 */}
      <nav className="ag-footer-v2__links">
        <a href="/privacy.html" className="ag-footer-v2__link">隱私權政策</a>
        <span className="ag-footer-v2__separator">·</span>
        <a href="/legal.html" className="ag-footer-v2__link">法律免責</a>
        <span className="ag-footer-v2__separator">·</span>
        <a href="/terms.html" className="ag-footer-v2__link">使用條款</a>
        <span className="ag-footer-v2__separator">·</span>
        <a href="/about.html" className="ag-footer-v2__link">關於 Afterglow</a>
      </nav>

      {/* 中間：即將上線訊息 */}
      <p className="ag-footer-v2__message">
        Afterglow 完整內容即將上線，敬請期待。
      </p>

      {/* 最下行：版權聲明 */}
      <p className="ag-footer-v2__copyright">
        © 2025 Afterglow. All rights reserved.
      </p>
    </footer>
  );
}
