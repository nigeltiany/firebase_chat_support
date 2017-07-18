<template>
  <v-app toolbar>
    <v-navigation-drawer class="hidden-sm-and-up" persistent :clipped="clipped" v-model="drawer">
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
    <v-toolbar fixed>
      <v-toolbar-side-icon class="hidden-sm-and-up" @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
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
  </v-app>
</template>

<script>
export default {
    data () {
        return {
            title: 'Lawn Care',
            clipped: true,
            drawer: false,
            fixed: false,
            drawerLinks: [
                { icon: 'apps', title: 'Welcome', to: '/' },
                { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
            ],
            toolbarLinks: [
                { name: 'Contact', route: '/' },
                { name: 'Services', route: '/services' },
                { name: 'Free Quote', route: '/quote' },
                { name: 'Sign Up/Sign In', route: '/app' }
            ]
        }
    }
}
</script>