import { NavLink, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage.tsx";
import AddWordPage from "./pages/AddWordPage.tsx";
import LibraryPage from "./pages/LibraryPage.tsx";
import GamePage from "./pages/GamePage.tsx";

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="logoDot" />
          <div>
            <h1 className="title">Verba</h1>
            <div className="subtitle">Slang library + quiz game</div>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Welcome</NavLink>
          <NavLink to="/library" className={({ isActive }) => (isActive ? "active" : "")}>Library</NavLink>
          <NavLink to="/add" className={({ isActive }) => (isActive ? "active" : "")}>Add Word</NavLink>
          <NavLink to="/game" className={({ isActive }) => (isActive ? "active" : "")}>Game</NavLink>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/add" element={<AddWordPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </main>
    </div>
  );
}
