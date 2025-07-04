import '../globals.css';

export default function DisplayLayout({ children }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-800 h-screen overflow-hidden">
      {children}
    </div>
  );
}
