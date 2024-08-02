import { NextResponse } from "next/server"
import { PrivateKey } from '@bsv/sdk'


const key = PrivateKey.fromWif(process.env.WIF)
const pubkey = key.toPublicKey().toString()

export async function GET(req) {
    return NextResponse.json({
      bsvalias: '1.0',
      handle: `sweep@sweep.xn--nda.network`,
      pubkey
    }, { status: 200 })
}