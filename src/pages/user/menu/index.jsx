// MenuPage.jsx — with ProductModal + PopularSlideshow wired in

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMenu } from "../../../hooks";
import LoadingSpinner from "../../../components/user/LoadingSpinner";
import ErrorMessage from "../../../components/user/ErrorMessage";
import CategoryTabs from "../../../components/user/CategoryTabs";
import CategorySection from "../../../components/user/CategorySection";
import ModifierModal from "../../../components/user/ModifierModal";
import ProductModal from "../../../components/user/ProductModal";
import PopularSlideshow from "../../../components/user/PopularSlideShow";
import CartBar from "../../../components/user/CartBar";
import CartPage from "../cart";
import BottomNavBar from "../../../components/user/BottomNavBar";
import { Icon } from "@iconify/react";
// import Background from "../../../components/
// Background"; // Import the background component

const HEADER_HEIGHT = 67;

// components/Background.jsx
function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#f8fafc]">
      {/* Gradient Background - slightly more blue */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4fa] via-[#ffffff] to-[#f5f7fc]"></div>

      {/* Blurred Circles - slightly increased opacity for more presence */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#007aff] opacity-[0.08] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#5856d6] opacity-[0.06] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#007aff] via-[#5856d6] to-[#ff2d55] opacity-[0.03] rounded-full blur-3xl"></div>
      </div>

      {/* Noise Texture - kept the same */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      ></div>

      {/* Grid Pattern - increased opacity slightly */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 122, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 122, 255, 0.04) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      ></div>
    </div>
  );
}
function normaliseMenuData(raw) {
  if (!raw) return null;
  const payload = raw.data ?? raw.menu ?? raw;
  return {
    restaurant_name: payload?.rest_id?.name ?? "Our Menu",
    categories: Array.isArray(payload.categories) ? payload.categories : [],
  };
}

export default function MenuPage() {
  const { rest_id } = useParams();
  const { data: rawData,isLoading, isError, error } = useMenu(rest_id, "USER");
  const menuData = normaliseMenuData(rawData);

  const [selectedItem,  setSelectedItem]  = useState(null);
  const [detailItem,    setDetailItem]    = useState(null);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [searchText,    setSearchText]    = useState("");
  const [headerVisible, setHeaderVisible] = useState(true);
  const [cartOpen,      setCartOpen]      = useState(false);

  const lastScrollY          = useRef(0);
  const searchInputRef       = useRef(null);
  const stickyNavRef         = useRef(null);
  const isProgrammaticScroll = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (searchOpen || isProgrammaticScroll.current) { setHeaderVisible(true); return; }
      const y = window.scrollY;
      if (y < 10) setHeaderVisible(true);
      else if (y > lastScrollY.current) setHeaderVisible(false);
      else setHeaderVisible(true);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [searchOpen]);

  const lockHeader      = () => { isProgrammaticScroll.current = true; setHeaderVisible(true); };
  const unlockHeader    = () => { isProgrammaticScroll.current = false; };
  const handleOpenSearch  = () => { setHeaderVisible(true); setSearchOpen(true); };
  const handleCloseSearch = () => { setSearchOpen(false); setSearchText(""); searchInputRef.current?.blur(); };
  const handleSearchKeyDown = (e) => { if (e.key === "Enter") { e.preventDefault(); searchInputRef.current?.blur(); } };

  if (isLoading) return <LoadingSpinner />;
  if (isError)   return <ErrorMessage message={error?.message ?? error?.error ?? "Failed to load the menu."} />;
  if (!menuData || menuData.categories.length === 0)
    return <ErrorMessage message="No menu items found for this restaurant." />;

  const filteredCategories = menuData.categories
    .map((cat) => ({ ...cat, items: cat.items.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase())) }))
    .filter((cat) => cat.items.length > 0 || searchText === "");

  return (
    <>
      {cartOpen && <CartPage onBack={() => setCartOpen(false)} />}
      
      {/* Add the background here */}
      <Background />
      
      <div className="max-w-xl mx-auto pb-24 min-h-screen relative">
        {/* Note: Removed bg-[#F5F6F8] from the container since background now handles it */}

        {/* sticky nav */}
        <div ref={stickyNavRef} className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl"
          style={{ 
            transform: headerVisible ? "translateY(0)" : `translateY(-${HEADER_HEIGHT}px)`, 
            transition: "transform 280ms cubic-bezier(0.25,0.46,0.45,0.94)", 
            willChange: "transform",
            boxShadow: '0 4px 20px -8px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.8) inset'
          }}>
          <header className="px-4 border-b bg-white/80 backdrop-blur-xl flex items-center" style={{ height: `${HEADER_HEIGHT}px` }}>
            {!searchOpen && (
              <div className="flex justify-between items-center w-full">
                <h1 className="text-lg font-bold flex items-center gap-2">
                  <Icon icon="fluent:food-24-filled" width={22} className="text-emerald-600" />
                  {menuData.restaurant_name}
                </h1>
                <button onClick={handleOpenSearch} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">🔍</button>
              </div>
            )}
            {searchOpen && (
              <div className="flex items-center gap-2 w-full">
                <input ref={searchInputRef} type="text" placeholder="Search dishes..." value={searchText}
                  onChange={(e) => setSearchText(e.target.value)} onKeyDown={handleSearchKeyDown}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all bg-white/80 backdrop-blur-xl"
                  inputMode="search" enterKeyHint="search" autoFocus />
                <button onClick={handleCloseSearch}>
                  <Icon icon="fluent:dismiss-24-filled" width={22} className="text-zinc-400 hover:text-zinc-600 cursor-pointer" />
                </button>
              </div>
            )}
          </header>
          <CategoryTabs categories={menuData.categories} stickyNavRef={stickyNavRef} lockHeader={lockHeader} unlockHeader={unlockHeader} />
        </div>

        {/* body */}
        <div className="p-4">
          {!searchText && (
            <PopularSlideshow categories={menuData.categories} onDetails={setDetailItem} onCustomize={setSelectedItem} />
          )}
          {filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Icon icon="fluent:search-24-filled" width={40} className="mb-3 opacity-40" />
              <p className="text-base font-medium">No results for "{searchText}"</p>
              <p className="text-sm mt-1">Try a different dish name</p>
            </div>
          ) : (
            filteredCategories.map((cat, i) => (
              <CategorySection key={i} category={cat} onCustomize={setSelectedItem} onDetails={setDetailItem} />
            ))
          )}
        </div>

        {selectedItem && <ModifierModal item={selectedItem} close={() => setSelectedItem(null)} />}
        {detailItem   && <ProductModal  item={detailItem}   close={() => setDetailItem(null)}   />}

        <BottomNavBar activeTab="menu" />
        <CartBar onViewCart={() => setCartOpen(true)} />
      </div>
    </>
  );
}