import admin from "firebase-admin"
import { readFileSync } from "fs"

const serviceAccount = JSON.parse(
  readFileSync("D:\\ITILabs\\Project-Node\\project-node\\backend\\Database\\node-project-fde06-firebase-adminsdk-fbsvc-d342d7a0df.json", "utf-8")
)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

export default db
