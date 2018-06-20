import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import db from '../api/firestoreInit'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    appTitle: 'My Awesome App',
    user: null,
    error: null,
    loading: false,
    docId: null,
    docRef: null,
    updated: false
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setDocId (state, payload) {
      state.docId = payload
    },
    setDocRef (state, payload) {
      state.docRef = db.collection('users').doc(payload)
    },
    setUpdated (state, payload) {
      state.updated = payload
    }
  },
  actions: {
    userSignUp ({commit, dispatch}, payload) {
      commit('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(firebaseUser => {
        commit('setUser', {
          email: firebaseUser.user.email,
          userId: firebaseUser.user.uid,
          name: {
            first: '',
            last: ''
          },
          phone: ''
        })
        commit('setLoading', false)
        dispatch('addUserToCollection')
      })
      .catch(error => {
        commit('setError', error.message)
        commit('setLoading', false)
      })
    },
    userSignIn ({commit, dispatch}, payload) {
      commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(firebaseUser => {
        commit('setUser', {email: firebaseUser.user.email, userId: firebaseUser.user.uid})
        commit('setLoading', false)
        commit('setError', null)
        dispatch('findDocId', firebaseUser.user.uid)
        router.push('/home')
      })
      .catch(error => {
        commit('setError', error.message)
        commit('setLoading', false)
      })
    },
    autoSignIn ({commit, dispatch}, payload) {
      commit('setUser', {email: payload.email, userId: payload.uid})
      dispatch('findDocId', payload.uid)
    },
    userSignOut ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
      router.replace('/')
    },
    addUserToCollection ({commit, state}) {
      db.collection('users').add(state.user)
        .then(function (docRef) {
          commit('setDocId', docRef.id)
          router.push('/home')
        })
        .catch(error => {
          commit('setError', error.message)
          commit('setLoading', false)
        })
    },
    findDocId ({commit}, uid) {
      db.collection('users').where('userId', '==', uid)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            commit('setDocId', doc.id)
            // router.push('/home')
          })
        })
        .catch(error => {
          commit('setError', error.message)
          commit('setLoading', false)
        })
    },
    updateProfile ({commit, state}, payload) {
      commit('setLoading', true)
      state.docRef.set(payload, { merge: true })
        .then(doc => {
          state.updated = true
          commit('setLoading', false)
        })
        .catch(error => {
          commit('setError', error.message)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    isAuthenticated (state) {
      return state.user !== null && state.user !== undefined
    },
    getDocId (state) {
      return state.docId
    }
  }
})
