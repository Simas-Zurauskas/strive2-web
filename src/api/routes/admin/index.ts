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

// ── Old-user relaunch campaign ─────────────────────────────

type ListRelaunchRecipientsQuery =
  paths['/api/admin/relaunch/recipients']['get']['parameters']['query'];
type ListRelaunchRecipientsResponse =
  paths['/api/admin/relaunch/recipients']['get']['responses']['200']['content']['application/json'];

export type RelaunchRecipient = ListRelaunchRecipientsResponse['data']['recipients'][number];
export type RelaunchRecipientStatusFilter = NonNullable<
  NonNullable<ListRelaunchRecipientsQuery>['status']
>;

export const listRelaunchRecipients = (params: NonNullable<ListRelaunchRecipientsQuery>) => {
  return client<ListRelaunchRecipientsResponse>({
    url: '/admin/relaunch/recipients',
    method: 'GET',
    params,
  }).then((res) => res.data.data);
};

type SendRelaunchBatchBody =
  paths['/api/admin/relaunch/send']['post']['requestBody']['content']['application/json'];
type SendRelaunchBatchResponse =
  paths['/api/admin/relaunch/send']['post']['responses']['200']['content']['application/json'];

export type RelaunchBatchResult = SendRelaunchBatchResponse['data']['results'][number];

export const sendRelaunchBatch = (params: SendRelaunchBatchBody) => {
  return client<SendRelaunchBatchResponse>({
    url: '/admin/relaunch/send',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

type AddRelaunchRecipientBody =
  paths['/api/admin/relaunch/recipients']['post']['requestBody']['content']['application/json'];
type AddRelaunchRecipientResponse =
  paths['/api/admin/relaunch/recipients']['post']['responses']['200']['content']['application/json'];

export const addRelaunchRecipient = (params: AddRelaunchRecipientBody) => {
  return client<AddRelaunchRecipientResponse>({
    url: '/admin/relaunch/recipients',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

type DeleteRelaunchRecipientResponse =
  paths['/api/admin/relaunch/recipients']['delete']['responses']['200']['content']['application/json'];

export const deleteRelaunchRecipient = (email: string) => {
  return client<DeleteRelaunchRecipientResponse>({
    url: '/admin/relaunch/recipients',
    method: 'DELETE',
    params: { email },
  }).then((res) => res.data.data);
};

type UpdateGrantBody =
  paths['/api/admin/relaunch/recipients/grant']['patch']['requestBody']['content']['application/json'];
type UpdateGrantResponse =
  paths['/api/admin/relaunch/recipients/grant']['patch']['responses']['200']['content']['application/json'];

export const updateRelaunchGrant = (params: UpdateGrantBody) => {
  return client<UpdateGrantResponse>({
    url: '/admin/relaunch/recipients/grant',
    method: 'PATCH',
    data: params,
  }).then((res) => res.data.data);
};

type UpdatePayingBody =
  paths['/api/admin/relaunch/recipients/paying']['patch']['requestBody']['content']['application/json'];
type UpdatePayingResponse =
  paths['/api/admin/relaunch/recipients/paying']['patch']['responses']['200']['content']['application/json'];

export const updateRelaunchPaying = (params: UpdatePayingBody) => {
  return client<UpdatePayingResponse>({
    url: '/admin/relaunch/recipients/paying',
    method: 'PATCH',
    data: params,
  }).then((res) => res.data.data);
};
