'use client'
import { useState } from 'react'
import { PrivateKey, Transaction, ARC, P2PKH } from '@bsv/sdk'
import { PaymailClient } from '@bsv/paymail'

const pmc = new PaymailClient()

const arc = new ARC('https://arc.taal.com', process.env.API_KEY)

class WocClient {
    constructor() {
        this.api = 'https://api.whatsonchain.com'
        this.key = process.env.API_KEY
        return this
    }

    async get(route) {
        return await (await fetch(this.api + route, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                "Authorization": 'Bearer ' + this.key
            },
        })).json()
    }

    async post(route, body) {
        return await (await fetch(this.api + route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Authorization": 'Bearer ' + this.key
            },
            body: JSON.stringify(body)
        })).json()
    }

    async getUtxos(address) {
        return this.get(`/main/utxos/address/${address}`, )
    }

    async getTx(txid) {
        return this.get(`/main/txid/${txid}`)
    }

    async getMerklePath(txid) {
        return this.get(`/main/merkleproof/${txid}/tsc`)
    }
}

const wc = new WocClient()

export default function Home() {
    const [error, setError] = useState('')
    const [inputPaymail, setInputPaymail] = useState('')
    const [paymail, setPaymail] = useState('')
    const [wif, setWif] = useState('')
    const [sats, setSats] = useState(0)

    const checkPaymail = async (p) => {
        try {
            const pki = await pmc.getPki(p)
            console.log({ pki })
            setPaymail(p)
        } catch (error) {
            setError(String(error))
            console.log({ error })
        }
    }

    const sweepFunds = async (w) => {
        try {
            // app requests utxos at a specific address
            const privKey = PrivateKey.fromWif(w)
            const address = privKey.toAddress()
            const utxos = await wc.getUtxos(address)
            const satoshis = utxos.reduce((a, b) => a + b.satoshis, 0) 

            const outputs = await pmc.getP2POutputs(satoshis)

            const tx = new Transaction()
            const template = new P2PKH()
            await Promise.all(utxos.map(async utxo => {
                // gets each sourceTransaction in full
                const sourceOutputIndex = utxo.vout
                const rawtx = await wc.getTx(utxo.txid)
                const sourceTransaction = Transaction.fromHex(rawtx)
                addInput({ sourceTransaction, sourceOutputIndex, unlockingScriptTemplate: template.unlock(privKey) })
            }))
            
            // gets a merkle path for each (later)
            
            // builds a new tx paying to a paymail as specified using a paymail client
            outputs.map(output => tx.addOutput({ change: true, lockingScript: Script.fromHex(output.script) }))

            await tx.fees()
            await tx.sign()

            // sends that transaction to the paymail recipient
            const response = await pmc.sendP2PTransaction(tx.toHex())
            if (!!response.error) throw response.error

            // responds with txid
            return response.txid
        } catch (error) {
            console.log({ error })
            setError(JSON.stringify(error ?? {}))
        }
    }

    console.log({ error, paymail, wif, txid })

    if (error !== '') return <>
        <p>{error}</p>
    </>

    if (paymail === '' || paymail === undefined) return <>
        <p>1. Set your destination Paymail</p>
        <input type='text' onChange={e => setInputPaymail(e.value)}/>
        <button idx={inputPaymail} onClick={() => checkPaymail(inputPaymail)} />
    </>

    if (wif === '') return <>
        <p>1. All funds will be swept to {paymail} ✅</p>
        <p>2. Scan or enter a private key.</p>
        <input type='text' onChange={e => setWif(e.value)}/>
        <button idx={wif} onClick={() => sweepFunds(wif)} />
    </>

    if (txid === '') return <>
        <p>1. All funds will be swept to {paymail} ✅</p>
        <p>2. {wif} will be used to sign transaction ✅</p>
        <p>3. Sweeping...</p>
    </>

    return <>
        <p>1. All funds will be swept to {paymail} ✅</p>
        <p>2. {wif} will be used to sign transaction ✅</p>
        <p>3. Swept {sats.toLocaleString(['en'], { maximumFractionDigits: 0, minimumFractionDigits: 0 })} satoshis ✅</p>
    </>
}