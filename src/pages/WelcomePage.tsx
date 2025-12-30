import { Link } from "react-router-dom";

export default function WelcomePage() {
  return (
    <div className="card">
      <h2>Welcome</h2>
      <p>
        This is a slang word library + quiz game. Learn new words, add your own, and test yourself.
      </p>
      <div className="row">
        <Link className="btn" to="/game">Play the Game</Link>
        <Link className="btn secondary" to="/library">Browse Library</Link>
      </div>
    </div>
  );
}
