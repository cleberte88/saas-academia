'use client'

export default function MobileMenu() {
  return (
    <div className="md:hidden flex items-center">
      <button 
        type="button"
        onClick={() => alert('O botão funcionou no celular!')}
        className="relative z-50 p-3 bg-red-600 text-white font-bold rounded-xl shadow-lg cursor-pointer"
      >
        MENU
      </button>
    </div>
  )
}