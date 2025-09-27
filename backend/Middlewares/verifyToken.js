import jwt from "jsonwebtoken"

const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization
  if (!token) return res.status(401).send({ error: "No token provided" })

  jwt.verify(token, "test-key", (err, decoded) => {
    if (err) return res.status(401).send({ error: "Invalid Token" })
    req.user = decoded 
    next()
  })
}

export default verifyToken


