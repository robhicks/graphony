import { sha512 } from 'crypto-hash';
import { generateJWT, textType, jsonType } from '../utils'

const login = (req, res) => {
  const email = req?.body?.email;
  const password = req?.body?.password;
  if (email && password) {
    req.ctx.get().get('users').get(email).once((user) => {
      if (!user) {
        res.writeHead(401, textType);
        res.write('credentials failed');
        res.end();
      } else {
        (async() => {
          const pHash = await sha512(password);
          if (user.password === pHash) {
            res.writeHead(200, jsonType);
            res.write(JSON.stringify({token: generateJWT(user)}))
            res.end();
          } else {
            res.writeHead(401, textType);
            res.write('credentials failed');
            res.end();
          }
        })()
      }
    })
  } else {
    res.writeHead(500, textType);
    res.write('email and/or password not provided in body');
    res.end();
  }
}

export default login;