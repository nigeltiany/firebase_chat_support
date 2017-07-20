<template>
  <v-app toolbar v-resize:debounce="windowResize">
    <v-navigation-drawer class="hidden-md-and-up" persistent fixed :clipped="clipped" v-model="drawer">
      <v-list>
        <v-list-tile v-for="(link, i) in drawerLinks" :key="i" :to="link.to">
          <v-list-tile-action>
            <v-icon v-html="link.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="link.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed style="z-index: 5">
      <v-toolbar-side-icon class="hidden-md-and-up" @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down" v-for="link in toolbarLinks" :key="link.name">
        <v-btn flat :to="link.route">{{ link.name }}</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <v-container>
        <nuxt />
      </v-container>
    </main>
    <chat :fullscreen="chatDialog.fullscreen"></chat>
  </v-app>
</template>

<script>
import chat from '../components/chat.vue'
import resize from 'vue-resize-directive'
import Firebase from 'firebase'

export default {
    directives: {
        resize,
    },
    components: {
        chat
    },
    created() {
        Firebase.initializeApp({
            apiKey: "AIzaSyA2qhaVfG2P7FlfZP7x80UysSiLrQr1ZZ4",
            authDomain: "lawn-care-5feaf.firebaseapp.com",
            databaseURL: "https://lawn-care-5feaf.firebaseio.com",
            projectId: "lawn-care-5feaf",
            storageBucket: "lawn-care-5feaf.appspot.com",
            messagingSenderId: "517689819608"
        })
    },
    data () {
        return {
            title: 'Lawn Care',
            clipped: true,
            drawer: false,
            fixed: true,
            drawerLinks: [
                { icon: 'apps', title: 'Welcome', to: '/' },
                { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
            ],
            toolbarLinks: [
                { name: 'Contact', route: '/' },
                { name: 'Services', route: '/services' },
                { name: 'Free Quote', route: '/quote' },
                { name: 'Sign Up/Sign In', route: '/app' }
            ],
            chatDialog: {
                fullscreen: false
            }
        }
    },
    mounted() {
        this.chatDialog.fullscreen = window.innerWidth < 1024;
    },
    methods: {
        windowResize() {
            this.chatDialog.fullscreen = window.innerWidth < 1024;
        }
    }
}
</script>