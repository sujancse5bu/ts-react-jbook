import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Container, Button, Form, Spinner } from 'react-bootstrap'
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'

const App = () => {
  const [input, setInput] = useState('import \'bulma@0.5.3/css/bulma.css\';')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState({
    status: true,
    message: 'Initializing ESBuild'
  })

  useEffect(() => {
    startService()
  }, [])

  const startService = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/browse/esbuild-wasm@0.11.12/esbuild.wasm',
    })
    setLoading({
      status: false,
      message: ''
    })
    // console.log(esbuild)
  }

  const onClick = async () => {
    setLoading({
      status: true,
      message: 'Generating Code. Please wait!!'
    })
    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [
        unpkgPathPlugin(),
        fetchPlugin(input)
      ],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      }
    })
    setCode(result.outputFiles[0].text)
    setLoading({
      status: false,
      message: ''
    })
    // console.log('result.outputFiles[0].text: ', result.outputFiles[0].text)
  }

  return (
    <Container>
      {loading.status ? (
        <div className='mt-3'>
          {loading.message}{' '}
          <Spinner animation="border" size="sm" />
        </div>
      ) : (
        <div>
          <Form>
            <Form.Group className="my-3">
              <Form.Label>Enter JavaScript Code</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Form.Group>
          </Form>
          <div>
            <Button onClick={onClick}>Submit</Button>
          </div>
          <pre>{code}</pre>
        </div>
      )}
    </Container>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
