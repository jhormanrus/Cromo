import { Cromo } from '../src'
import { afterEach, describe, expect, it } from 'bun:test'

describe('Cromo', () => {
  let cromo: Cromo

  it('initialize with default options', async () => {
    cromo = new Cromo()
    cromo.start()

    const request = fetch('http://localhost:3000')
    const httpStatus = (await request).status

    expect(httpStatus).toBe(200)
  })

  it('initialize with custom options', async () => {
    const port = 5000
    const dir = './api/simple-handler'

    cromo = new Cromo({ port, dir })
    cromo.start()

    const request = fetch(`http://localhost:${port}`)
    const httpStatus = (await request).status

    expect(httpStatus).toBe(200)
  })

  it('run only valid handler', async () => {
    cromo = new Cromo()
    cromo.start()

    const request = fetch('http://localhost:3000/invalid-handler')
    const httpStatus = (await request).status

    expect(httpStatus).toBe(404)
  })

  afterEach(() => {
    cromo.stop(true)
  })
})
