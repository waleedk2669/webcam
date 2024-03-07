import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WebCam from './components/WebCam'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <WebCam />
    </>
  )
}

export default App
