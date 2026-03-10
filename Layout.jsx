export default function Layout({ children }) {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Inter', 'Segoe UI', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #444; }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      `}</style>
      {children}
    </div>
  );
}