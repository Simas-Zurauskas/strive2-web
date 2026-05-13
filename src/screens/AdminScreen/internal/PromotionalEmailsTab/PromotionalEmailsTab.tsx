'use client';

import { useState } from 'react';
import { sendPromotionalTestEmail, type PromotionalTemplateKey } from '@/api/routes/admin';
import { Button } from '@/components';
import * as S from './PromotionalEmailsTab.styles';

// One entry per template the backdoor route accepts. Adding a new
// template here is the only client-side change needed once the API
// `PromotionalTemplateKey` enum + builder are in place.
const TEMPLATES: { key: PromotionalTemplateKey; label: string; description: string }[] = [
  {
    key: 'old_user_relaunch',
    label: 'Old user — relaunch announcement',
    description:
      'Sent to addresses that signed up for the original Strive, letting them know the rebuilt version is live.',
  },
  {
    key: 'old_paying_user_thanks',
    label: 'Old paying user — thanks + apology',
    description:
      'Founder-voiced thank-you + apology for users who paid for the original Strive. Use for the curated paying-user subset.',
  },
];

type Status = { kind: 'success'; message: string } | { kind: 'error'; message: string } | null;

export const PromotionalEmailsTab: React.FC = () => {
  const [to, setTo] = useState('');
  const [template, setTemplate] = useState<PromotionalTemplateKey>(TEMPLATES[0].key);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim() || sending) return;

    setSending(true);
    setStatus(null);
    try {
      await sendPromotionalTestEmail({ to: to.trim(), template });
      setStatus({ kind: 'success', message: `Sent ${template} to ${to.trim()}.` });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Send failed.';
      setStatus({ kind: 'error', message });
    } finally {
      setSending(false);
    }
  };

  const activeTemplate = TEMPLATES.find((t) => t.key === template);

  return (
    <S.Card as="form" onSubmit={onSubmit}>
      <S.SectionTitle>Send a test promotional email</S.SectionTitle>
      <S.Description>
        Sends the selected template synchronously via Mailjet to the address below, regardless of
        whether it&apos;s a registered user. Use sparingly against real inboxes — Mailjet quota and
        sender reputation apply.
      </S.Description>

      <S.Field>
        <S.FieldLabel>Recipient email</S.FieldLabel>
        <S.Input
          type="email"
          required
          autoComplete="off"
          placeholder="someone@example.com"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          disabled={sending}
        />
      </S.Field>

      <S.Field>
        <S.FieldLabel>Template</S.FieldLabel>
        <S.Select
          value={template}
          onChange={(e) => setTemplate(e.target.value as PromotionalTemplateKey)}
          disabled={sending}
        >
          {TEMPLATES.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </S.Select>
        {activeTemplate && <S.Description>{activeTemplate.description}</S.Description>}
      </S.Field>

      <S.Actions>
        <Button type="submit" disabled={sending || !to.trim()}>
          {sending ? 'Sending…' : 'Send test email'}
        </Button>
        {status && <S.StatusLine $kind={status.kind}>{status.message}</S.StatusLine>}
      </S.Actions>
    </S.Card>
  );
};
