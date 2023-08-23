import { Cromo } from '../src'
import { afterEach, describe, expect, it } from 'bun:test'
import { DummyApi } from './test-utils'

describe('Cromo initialization', () => {
  let cromo: Cromo
  const dummyApi = new DummyApi()
  
  it('initialize with default options', async () => {
    await dummyApi.init()

    cromo = new Cromo()
    cromo.start()

    const request = fetch('http://localhost:3000')
    const httpStatus = (await request).status

    expect(httpStatus).toBe(200)
  })

  it('initialize with custom options', async () => {
    const port = 5000
    const dir = './example'

    await dummyApi.init(dir)

    cromo = new Cromo({ port, dir })
    cromo.start()

    const request = fetch(`http://localhost:${port}`)
    const httpStatus = (await request).status

    expect(httpStatus).toBe(200)
  })

  afterEach(() => {
    cromo.stop()
    dummyApi.clean()
  })
})
