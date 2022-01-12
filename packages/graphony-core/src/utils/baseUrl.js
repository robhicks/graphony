/* eslint-disable import/prefer-default-export */
export function baseUrl(trailingSlash = false) {
  const getUrl = window.location;
  const { protocol, host, pathname } = getUrl;
  let base = `${protocol}//${host}/${pathname.split('/')[1]}`;
  if (!trailingSlash) base = base.replace(/\/$/, '');
  return base;
}
