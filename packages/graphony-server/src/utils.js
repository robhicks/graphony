import * as jwt from 'jsonwebtoken';

export const generateJWT = (user) => jwt.sign({
    data: { 
      _id: user.id,
      name: user.name,
      email: user.email
    }
  }, 'MySuP3R_z3kr3t.', { expiresIn: '6d' })

export const textType = { 'Content-Type': 'text/plain' };
export const jsonType = { 'Content-Type': 'application/json' };