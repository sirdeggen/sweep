import { PaymailClient } from '@bsv/paymail'
import { PrivateKey, Transaction } from '@bsv/sdk'

const pmc = new PaymailClient()


const key = PrivateKey.fromWif(process.env.WIF)
const pubkey = key.toPublicKey().toString()

export async function POST(req) {
    try {
        const body = await req.json()
        const { paymail, method, data } = body
        console.log({ paymail, method, data })
        
        const tx = Transaction.fromHex(data.hex)
        const metadata = {
            sender: 'sweep@sweep.xn--nda.network',
            pubkey,
            signature: pmc.createP2PSignature(tx.id('hex'), key),
            note: 'hello world'
        }
        
        let response
        switch (method) {
            case 'outputs':
                response = await pmc.getP2pPaymentDestination(paymail, data.satoshis)
                break
            case 'send':
                console.log(JSON.stringify({ hex: data.hex, reference: data.reference, metadata }))
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