import { useState } from 'react';
import LandingPhase from './components/LandingPhase';
import QuizPhase from './components/QuizPhase';
import GridPhase from './components/GridPhase';

function App() {
  const [phase, setPhase] = useState('landing'); 
  const [userAnswers, setUserAnswers] = useState({});

  const handleStart = () => {
    setPhase('quiz');
  };

  const handleQuizComplete = (answers) => {
    setUserAnswers(answers);
    setPhase('grid');
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col relative bg-pattern">
      {/* Snowflakes */}
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="snowflake">
          {i % 2 === 0 ? '❅' : '❆'}
        </div>
      ))}

      {phase === 'landing' && <LandingPhase onStart={handleStart} />}
      {phase === 'quiz' && <QuizPhase onComplete={handleQuizComplete} />}
      {phase === 'grid' && <GridPhase answers={userAnswers} />}
    </div>
  );
}

export default App;





