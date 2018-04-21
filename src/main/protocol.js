import { protocol } from 'electron'

export const schemeName = 'haven'

export function setupProtocolHandler () {
  console.log('registering')
  protocol.registerHttpProtocol(schemeName, (request, callback) => {
    console.log(request)
  })
}
