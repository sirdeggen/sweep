
export async function GET() {
    return Response.json({ 
        bsvalias: '1.0',
        capabilities: {
            "6745385c3fc0":false,
            "pki":"https://sweep.xn--nda.network/api/paymail/pki/{alias}@{domain.tld}",
            "f12f968c92d6":"https://sweep.xn--nda.network/api/paymail/profile/{alias}@{domain.tld}",
            "a9f510c16bde":"https://sweep.xn--nda.network/api/paymail/verify/{alias}@{domain.tld}/{pubKey}",
        }
     }, { status: 200 })
}