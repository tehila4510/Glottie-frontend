export default function Landing({ onGetStarted, onLogin }) {
  return (
    <div className="landing-wrapper">
      <div className="landing-image">
        <img src="/your-image.png" alt="Welcome" /> 
      </div>
      <div className="landing-content">
        <h1>The fun, effective way to learn!</h1>
        <button className="btn-main" onClick={onGetStarted}>GET STARTED</button>
        <button className="btn-outline" onClick={onLogin}>I ALREADY HAVE AN ACCOUNT</button>
      </div>
    </div>
  );
}