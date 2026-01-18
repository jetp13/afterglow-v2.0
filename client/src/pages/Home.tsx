import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Logo + Subtitle Block */}
      <header className="ag-home-header">
        <div className="ag-logo-block">
          <img 
            src="/assets/afterglow-logo.png" 
            className="ag-logo"
            alt="Afterglow Logo"
          />
          <div className="ag-subtitle-block">
            <p className="ag-subtitle-zh">讓夜裡的光有方向</p>
            <p className="ag-subtitle-en">STAY SAFE · CARE FOR YOURSELF · SEEK HELP</p>
          </div>
        </div>
      </header>

      {/* Glow Capsule Buttons */}
      <main className="ag-home-main">
        <div className="ag-button-group">
          <a href="/menu.html" className="ag-glow-capsule ag-glow-capsule--primary">
            開始冥想
          </a>
          <a href="/support.html" className="ag-glow-capsule ag-glow-capsule--secondary">
            緊急支援
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
