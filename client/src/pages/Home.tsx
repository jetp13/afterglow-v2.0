import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <img 
          src="/assets/afterglow-logo.png" 
          className="ag-logo" 
          alt="Afterglow Logo" 
        />
        
        {/* 中文標語 */}
        <p className="text-center text-lg mb-2" style={{ color: '#ccc' }}>
          讓夜裡的光有方向
        </p>
        
        {/* 英文標語 */}
        <p className="text-center text-sm mb-12" style={{ color: '#999' }}>
          STAY SAFE · CARE FOR YOURSELF · SEEK HELP
        </p>
        
        {/* Glow 雙膠囊按鈕 */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <a href="/menu.html" className="glow-button">
            開始冥想
          </a>
          <a href="/support.html" className="glow-button glow-button--secondary">
            緊急支援
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
