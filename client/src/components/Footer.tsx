export default function Footer() {
  return (
    <footer className="ag-footer">
      <div className="ag-footer__links">
        <a href="privacy.html" className="ag-footer__link">隱私權政策</a> |{" "}
        <a href="legal.html" className="ag-footer__link">法律免責</a> |{" "}
        <a href="terms.html" className="ag-footer__link">使用條款</a> |{" "}
        <a href="about.html" className="ag-footer__link">關於 Afterglow</a>
      </div>
      <div className="ag-footer__copyright">
        © 2025 Afterglow. All rights reserved.
      </div>
    </footer>
  );
}
