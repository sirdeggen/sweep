import { NextResponse } from "next/server";

export async function GET(request, context) {
    const { handle, pubkey } = context.params
    return NextResponse.json({
      bsvalias: '1.0',
      handle,
      pubkey,
      match: true
    }, { status: 200 })
}