import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import Guess from '../components/Guess'
import Querty from '../components/Qwerty'
import PuzzleStore from '../stores/PuzzleStore'
import DifficultySelector, { DifficultyProps } from '../components/DifficultySelector'

export default observer(function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const forceUpdate = useState({})[1];
  const store = PuzzleStore;
  useEffect(() => {
    const handleStoreChange = () => forceUpdate({});
    store.init()
    window.addEventListener('keyup', store.handleKeyup)

    return () => {
      window.removeEventListener('keyup', store.handleKeyup)
    }
  }, [])

  

  const startGame = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return <DifficultySelector onDifficultySet={startGame} />;
  }


  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-600">
      <h1 className="bg-gradient-to-br from-blue-400 to-green-400 bg-clip-text text-6xl font-bold uppercase text-transparent">
        Wordle
      </h1>
      <h2>Current Difficulty: {store.difficulty}</h2>
      <p>Max Guesses: {store.maxGuesses}</p>
      {/* {store.guesses.map((_, i) => (
        <Guess
          key={i}
          word={store.word}
          guess={store.guesses[i]}
          isGuessed={i < store.currentGuess}
        />
      ))} */}
      {Array.from({ length: store.maxGuesses }).map((_, i) => (
      <Guess
        key={i}
        word={store.word}
        guess={store.guesses[i] || ''}
        isGuessed={i < store.currentGuess}
      />
     ))}
      {store.won && <h1>You won!</h1>}
      {store.lost && <h1>You lost! The word was: {store.word}</h1>}
      {(store.won || store.lost) && (
        <button onClick={() => { store.init(); setGameStarted(false); forceUpdate({}); }} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Play Again</button>
      )}
      <Querty store={store} />
    </div>
  )
})


