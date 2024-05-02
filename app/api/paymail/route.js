import { PaymailRouter, PublicKeyInfrastructureRoute, PublicProfileRoute, RequestSenderValidationCapability } from '@bsv/paymail'
import { NextResponse } from 'next/server'

const routes = [PublicKeyInfrastructureRoute, PublicProfileRoute]
const s = new PaymailRouter({
    baseUrl: 'https://sweep.xn--nda.network',
    basePath: '/api/paymail',
    routes
})

export async function POST(req) {
    const capabilities = routes.reduce((map, route) => {
        const endpoint = route.getEndpoint().replace(/:paymail/g, '{alias}@{domain.tld}').replace(/:pubkey/g, '{pubkey}')
        map[route.getCode()] = this.joinUrl(this.baseUrl, this.getBasePath(), endpoint)
        return map
      }, {})
    capabilities[RequestSenderValidationCapability.getCode()] = false
    return NextResponse.json({
        bsvalias: '1.0',
        capabilities
    })
}