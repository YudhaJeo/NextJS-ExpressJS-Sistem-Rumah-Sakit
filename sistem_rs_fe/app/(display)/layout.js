import '../globals.css';

export default function DisplayLayout({ children }) {
  return (
    <div 
      className="
        surface-ground 
        text-color 
        flex 
        flex-column 
        surface-section 
        overflow-hidden
      "
    >
      <main className="flex-grow-1">
        {children}
      </main>
    </div>
  );
}
