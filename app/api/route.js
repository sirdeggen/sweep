import { PaymailClient } from '@bsv/paymail'

const pmc = new PaymailClient()

export async function POST(req) {
    try {
        const body = await req.json()
        const { paymail, method, data } = body
        console.log({ paymail, method, data })
        
        let response
        switch (method) {
            case 'outputs':
                response = await pmc.getP2pPaymentDestination(paymail, data.satoshis)
                break
            case 'send':
                response = await pmc.sendTransactionP2P(paymail, data.hex, data.reference)
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