export default function logger(req, res, next) {
  // eslint-disable-next-line no-console
  console.log('req.method', req.method, `req.url`, req.url);
  next();
}