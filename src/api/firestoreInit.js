import firebase from 'firebase/app'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig'
const firebaseApp = firebase.initializeApp(firebaseConfig)
const settings = {timestampsInSnapshots: true}
const firestore = firebaseApp.firestore()
firestore.settings(settings)
export default firestore
