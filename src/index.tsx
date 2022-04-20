import { useState } from 'react'
import ReactDOM from 'react-dom'
import * as esbuild from 'esbuild-wasm'

const App = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

  const startService = async () => {
    const service = await esbuild.startService({
      woder: true,
      wasmURL: '/esbuild.wasm',
    })
  }

  const onClick = () => {
    console.log('input: ', input)
  }

  return (
    <div>
      <textarea
        value={input}
        name=''
        id=''
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
