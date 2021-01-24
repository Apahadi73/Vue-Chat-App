import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import Filter from 'bad-words'
import { ref, onUnmounted, computed } from 'vue'

// our firebase config object
const firebaseConfig = {
  apiKey: 'AIzaSyDwmzZn-mgrQGd9C1Ydoi07aWXHhg9j4Sc',
  authDomain: 'vue-chat-app-76b67.firebaseapp.com',
  projectId: 'vue-chat-app-76b67',
  storageBucket: 'vue-chat-app-76b67.appspot.com',
  messagingSenderId: '910152142967',
  appId: '1:910152142967:web:0f8c0bfc7001a60a9d3672',
  measurementId: 'G-G2EL0HNMGP'
}

// initializes our firebase app
firebase.initializeApp(firebaseConfig)

// creates firebase authentication object
const auth = firebase.auth()

// authentication hook
export function useAuth() {
  // stores user property
  const user = ref(null)

  // deletes userinfo when the app gets unmounted
  const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user))
  onUnmounted(unsubscribe)

  // stores whether user is logged in or not
  const isLogin = computed(() => user.value !== null)

  // calls firebase to sign in
  const signIn = async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider()
    await auth.signInWithPopup(googleProvider)
  }
  // signs user out of the app
  const signOut = () => auth.signOut()

  return { user, isLogin, signIn, signOut }
}

// creates firestore object
const firestore = firebase.firestore()

// gets messages collection in the firestore
const messagesCollection = firestore.collection('messages')
// queries last 100 messages
const messagesQuery = messagesCollection.orderBy('createdAt', 'desc').limit(100)

// chat hook
export function useChat() {
  // we will use this filter object to filter out the bad words from the messages
  const filter = new Filter()

  // stores our array of messages
  const messages = ref([])

  // deletes all the mesages after the user signs out
  const unsubscribe = messagesQuery.onSnapshot(snapshot => {
    messages.value = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .reverse()
  })
  onUnmounted(unsubscribe)

  const { user, isLogin } = useAuth()

  // sends messages if the user is logged in
  const sendMessage = text => {
    // returns if user is not logged in
    if (!isLogin.value) return

    // extracts user properties from user object obtained from useAuth hook
    const { photoURL, uid, displayName } = user.value
    messagesCollection.add({
      userName: displayName,
      userId: uid,
      userPhotoURL: photoURL,
      text: filter.clean(text),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  return { messages, sendMessage }
}
