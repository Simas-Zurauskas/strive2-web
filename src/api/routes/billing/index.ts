import { paths } from '@/api/_generated';
import { client } from '@/api/client';

// ── Public: plan catalog ─────────────────────────────────────

type GetBillingPlansResponse = paths['/api/billing/plans']['get']['responses']['200']['content']['application/json'];

export const getBillingPlans = () => {
  return client<GetBillingPlansResponse>({
    url: '/billing/plans',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Authed: current plan + credits ───────────────────────────

type GetBillingSummaryResponse = paths['/api/billing/summary']['get']['responses']['200']['content']['application/json'];

export const getBillingSummary = () => {
  return client<GetBillingSummaryResponse>({
    url: '/billing/summary',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Authed: credit ledger (paginated) ────────────────────────

type GetBillingLedgerResponse = paths['/api/billing/ledger']['get']['responses']['200']['content']['application/json'];

export const getBillingLedger = (params?: { limit?: number; before?: string }) => {
  return client<GetBillingLedgerResponse>({
    url: '/billing/ledger',
    method: 'GET',
    params,
  }).then((res) => res.data.data);
};

// ── Checkout: subscription ───────────────────────────────────

type StartCheckoutBody = paths['/api/billing/checkout']['post']['requestBody']['content']['application/json'];
type StartCheckoutResponse = paths['/api/billing/checkout']['post']['responses']['200']['content']['application/json'];

export const startCheckout = (params: StartCheckoutBody) => {
  return client<StartCheckoutResponse>({
    url: '/billing/checkout',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

// ── Checkout: top-up ─────────────────────────────────────────

type StartTopupBody = paths['/api/billing/topup']['post']['requestBody']['content']['application/json'];
type StartTopupResponse = paths['/api/billing/topup']['post']['responses']['200']['content']['application/json'];

export const startTopup = (params: StartTopupBody) => {
  return client<StartTopupResponse>({
    url: '/billing/topup',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

// ── Customer Portal (manage subscription) ────────────────────

type StartPortalResponse = paths['/api/billing/portal']['post']['responses']['200']['content']['application/json'];

export const startPortal = () => {
  return client<StartPortalResponse>({
    url: '/billing/portal',
    method: 'POST',
  }).then((res) => res.data.data);
};

// ── Schedule downgrade (no charge, at period end) ────────────

type ScheduleDowngradeBody =
  paths['/api/billing/downgrade']['post']['requestBody']['content']['application/json'];
type ScheduleDowngradeResponse =
  paths['/api/billing/downgrade']['post']['responses']['200']['content']['application/json'];

export const scheduleDowngrade = (params: ScheduleDowngradeBody) => {
  return client<ScheduleDowngradeResponse>({
    url: '/billing/downgrade',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

// ── Schedule cancellation (no refund, at period end) ─────────

type CancelSubscriptionResponse =
  paths['/api/billing/cancel']['post']['responses']['200']['content']['application/json'];

export const cancelSubscription = () => {
  return client<CancelSubscriptionResponse>({
    url: '/billing/cancel',
    method: 'POST',
  }).then((res) => res.data.data);
};
