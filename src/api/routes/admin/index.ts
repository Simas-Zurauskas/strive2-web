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
