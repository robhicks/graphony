export const bodyParser = (req, res, next) => {
  let data  = '';
  req.on('data', (chunk) => {
    data += chunk
  });
  req.on('end', () => {
    try {
      data = JSON.parse(data);
      req.body = req.body || {};
      Object.assign(req.body, data);
      next()
    } catch (error) {
      next(error)      
    }
  })
}