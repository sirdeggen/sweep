import { PaymailClient } from '@bsv/paymail'
import { PrivateKey } from '@bsv/sdk'
const routes = [publicProfileRoute, pkiRoute, p2pDestinationsRoute, receiveTransactionRoute]

const pmc = new PaymailClient()

export async function POST(req) {
    try {
        const body = await req.json()
        const { paymail, method, data } = body
        console.log({ paymail, method, data })
        
        const pk = PrivateKey.fromRandom()
        const publicKey = pk.toPublicKey()
        const metadata = {
            sender: 'sweep@sweep.xn--nda.network',
            pubkey: publicKey.toString(),
            signature: client.createP2PSignature(tx.id('hex'), pk),
            note: 'hello world'
        }
        
        let response
        switch (method) {
            case 'outputs':
                response = await pmc.getP2pPaymentDestination(paymail, data.satoshis)
                break
            case 'send':
                response = await pmc.sendTransactionP2P(paymail, data.hex, data.reference, metadata)
                break
            case 'pki':
            default:
                response = await pmc.getPki(paymail)
                break
        }

        return Response.json(response, { status: 200 })
    } catch (error) {
        console.log({ error })
        return Response.json({ error: error.message }, { status: 400 })
    }
}