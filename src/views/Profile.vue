<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Profile page</h1>
      </v-flex>
      <v-flex xs12 class="text-xs-center" mt-3>
        <p>Welcome, {{$store.state.user.email}}</p>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <form @submit.prevent="updateProfile">
          <v-layout column>
            <v-flex>
              <v-alert :type="alertType" dismissible v-model="alert">
                {{ updatedMsg || error }}
              </v-alert>
            </v-flex>
            <v-flex>
              <v-text-field
                name="email"
                label="Email"
                id="email"
                type="email"
                v-model="user.email"
                readonly></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                name="firstName"
                label="First Name"
                id="firstName"
                type="text"
                v-model="user.name.first"
                ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                name="lastName"
                label="Last Name"
                id="lastName"
                type="text"
                v-model="user.name.last"
                ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                name="phone"
                label="Phone"
                id="phone"
                type="text"
                v-model="user.phone"
                ></v-text-field>
            </v-flex>
            <v-flex class="text-xs-center" mt-5>
              <v-btn color="primary" type="submit" :disabled="loading">Update</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'profile',
  data () {
    return {
      user: {
        email: null,
        name: {
          first: null,
          last: null
        },
        phone: null
      },
      updatedMsg: 'profile successfully updated',
      alert: false
    }
  },
  computed: {
    ...mapState([
      // map this.count to store.state.count
      'error',
      'updated',
      'loading'
    ]),
    alertType () {
      return this.error ? 'error' : 'success'
    }
  },
  methods: {
    updateProfile () {
      this.$store.dispatch('updateProfile', {
        email: this.user.email,
        name: {
          first: this.user.name.first,
          last: this.user.name.last
        },
        phone: this.user.phone
      })
    }
  },
  watch: {
    error (value) {
      if (value) {
        this.alert = true
        this.$store.commit('setUpdated', null)
      }
    },
    updated (value) {
      if (value) {
        this.alert = true
        this.$store.commit('setUpdated', null)
      }
    },
    alert (value) {
      if (!value) {
        this.$store.commit('setError', null)
      }
    }
  },
  beforeCreate () {
    this.$store.commit('setDocRef', this.$route.params.docId)
    this.$store.state.docRef
      .get().then(snapshot => {
        this.user.email = snapshot.data().email
        this.user.name.last = snapshot.data().name.last
        this.user.name.first = snapshot.data().name.first
        this.user.phone = snapshot.data().phone
      })
      .catch(error => {
        console.log('Error getting document:', error)
      })
  }
}
</script>
