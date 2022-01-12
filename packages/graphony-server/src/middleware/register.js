import { sha512 } from 'crypto-hash';
import { generateJWT, textType, jsonType } from '../utils'

const register = (req, res) => {
  const email = req?.body?.email;
  const password = req?.body?.password;
  const name = req?.body?.name;
  if (email && password) {
    req.ctx.get().get('users').get(email).once((user) => {
      if (user) {
        res.writeHead(400, textType);
        res.write('user exists');
        res.end();
      } else {
        (async() => {
          const pHash = await sha512(password);
          const setVal = {
            email,
            name,
            password: pHash
          };
          req.ctx.get().get('users').get(email).set(setVal).once((usr) => {
            res.writeHead(200, jsonType);
            res.write(JSON.stringify({
              user: usr,
              token: generateJWT(usr)
            }));
            res.end();
          })
        })()
      }
    })
  } else {
    res.writeHead(500, textType);
    res.write('email and/or password not provided in body');
    res.end();
  }
}

export default register;