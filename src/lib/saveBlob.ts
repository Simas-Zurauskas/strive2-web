/**
 * Save a blob to the user's disk under a chosen name.
 *
 * The `download` attribute is not optional decoration here. A `blob:` URL
 * carries no `Content-Disposition`, so the filename the API took care to
 * sanitise and sign never reaches the browser — without `a.download` the
 * file lands as a bare UUID and all of that work is thrown away.
 *
 * The object URL is revoked on the next tick rather than immediately:
 * Safari cancels an in-flight download if the URL is revoked in the same
 * task as the click.
 */
export const saveBlob = ({ blob, filename }: { blob: Blob; filename: string }): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

/**
 * Trigger a download from a URL the server already marked as an attachment
 * (a presigned S3 link with `response-content-disposition`). No blob is
 * fetched — the browser streams it straight to disk.
 */
export const saveFromUrl = ({ url, filename }: { url: string; filename: string }): void => {
  const anchor = document.createElement('a');
  anchor.href = url;
  // Cross-origin, so the browser ignores this and honours the signed
  // Content-Disposition instead. Kept as a same-origin fallback.
  anchor.download = filename;
  anchor.rel = 'noopener';
  // Deliberately NOT `target="_blank"`. This is called from a mutation's
  // onSuccess — i.e. after an await — by which point the user-gesture token
  // has expired, and Safari (and Firefox in strict mode) block a popup
  // opened without one. The download would then silently do nothing, with
  // no error path to report. A same-tab navigation to a URL the server has
  // marked `Content-Disposition: attachment` downloads without navigating
  // away, and is not treated as a popup.
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

/**
 * Filename for a downloaded export, mirroring the API's `downloadFilename`
 * so the saved file matches what the server intended.
 *
 * Derived client-side from names already in the query cache rather than
 * read from a response header — reading `Content-Disposition` from a
 * cross-origin XHR would need `Access-Control-Expose-Headers` on every
 * response, which is a lot of surface for a filename.
 */
export const exportFilename = ({
  parts,
  extension,
  fallback,
}: {
  parts: (string | undefined | null)[];
  extension: string;
  fallback: string;
}): string => {
  const slug = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);

  const base = parts
    .map((p) => slug(p ?? ''))
    .filter(Boolean)
    .join('-')
    .slice(0, 120);

  return `${base || fallback}.${extension}`;
};
