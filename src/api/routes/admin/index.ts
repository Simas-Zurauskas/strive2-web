import { paths } from '@/api/_generated';
import { client } from '@/api/client';

// ── Send promotional test email ─────────────────────────────

type SendPromotionalTestEmailBody =
  paths['/api/admin/email/send-promotional-test']['post']['requestBody']['content']['application/json'];
type SendPromotionalTestEmailResponse =
  paths['/api/admin/email/send-promotional-test']['post']['responses']['200']['content']['application/json'];

// Surfaced from the OpenAPI enum so adding a template on the server
// flows automatically into the admin UI's `<select>`.
export type PromotionalTemplateKey = SendPromotionalTestEmailBody['template'];

export const sendPromotionalTestEmail = (params: SendPromotionalTestEmailBody) => {
  return client<SendPromotionalTestEmailResponse>({
    url: '/admin/email/send-promotional-test',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

// ── Promotional campaigns ──────────────────────────────────

type SendMarketingCampaignBody =
  paths['/api/admin/marketing/send']['post']['requestBody']['content']['application/json'];
type SendMarketingCampaignResponse =
  paths['/api/admin/marketing/send']['post']['responses']['200']['content']['application/json'];

/** Closed set of campaign keys the server will accept. */
export type MarketingCampaignKey = SendMarketingCampaignBody['campaignKey'];
export type MarketingSendResult = SendMarketingCampaignResponse['data']['results'][number];
export type MarketingSendBatch = SendMarketingCampaignResponse['data'];

export const sendMarketingCampaign = (params: SendMarketingCampaignBody) => {
  return client<SendMarketingCampaignResponse>({
    url: '/admin/marketing/send',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

type MarketingClaimsQuery = paths['/api/admin/marketing/claims']['get']['parameters']['query'];
type MarketingClaimsResponse =
  paths['/api/admin/marketing/claims']['get']['responses']['200']['content']['application/json'];

export type MarketingCampaignStatus = MarketingClaimsResponse['data'];
export type MarketingStrandedClaim = MarketingClaimsResponse['data']['strandedClaims'][number];

export const getMarketingCampaignStatus = (params: MarketingClaimsQuery) => {
  return client<MarketingClaimsResponse>({
    url: '/admin/marketing/claims',
    method: 'GET',
    params,
  }).then((res) => res.data.data);
};

type ReclaimMarketingBody =
  paths['/api/admin/marketing/reclaim']['post']['requestBody']['content']['application/json'];
type ReclaimMarketingResponse =
  paths['/api/admin/marketing/reclaim']['post']['responses']['200']['content']['application/json'];

export const reclaimMarketingClaims = (params: ReclaimMarketingBody) => {
  return client<ReclaimMarketingResponse>({
    url: '/admin/marketing/reclaim',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};
