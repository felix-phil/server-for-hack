const TokenGenerator = require("./utils/token-generator")

const jwt = require('jsonwebtoken');
const test = async () => {
  const tokenGenerator = new TokenGenerator('a', 'a', { algorithm: 'HS256', keyid: '1', noTimestamp: false, expiresIn: '2m', notBefore: '2s' })
  try {
    token = await tokenGenerator.sign({ myclaim: 'something' })
    console.log(token)
    setTimeout(function () {
      token2 = tokenGenerator.refresh(token, {})
      console.log(token2)
      console.log(jwt.decode(token, { complete: true }))
      console.log(jwt.decode(token2, { complete: true }))
    }, 2000)
  } catch (err) {
    console.log(err)
  }
}
test()
