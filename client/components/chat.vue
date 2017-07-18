<template>
    <div>
        <v-dialog v-model="dialog" persistent hide-overlay :fullscreen="fullscreen">
            <v-btn slot="activator" class="blue darken-2" fixed bottom right hover dark fab v-badge="{ value: items.length, overlap: true, left: true }">
                <v-icon>chat</v-icon>
                <v-icon>close</v-icon>
            </v-btn>
            <v-card id="chat-dialog">
                <v-toolbar dark class="primary" :fixed="fullscreen">
                    <v-toolbar-title>Chat with us</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn id="fullscreen-btn" icon @click.native="fullscreen = true" dark class="hidden-sm-and-down">
                        <v-icon>launch</v-icon>
                    </v-btn>
                    <v-btn id="tiny-chat-btn" icon @click.native="fullscreen = false" dark class="hidden-sm-and-down" :class="{ hidden: !fullscreen }">
                        <v-icon>branding_watermark</v-icon>
                    </v-btn>
                    <v-btn icon @click.native="dialog = false" dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-list id="chat-list" two-line :class="{ space_top: fullscreen }">
                    <template v-for="item in items">
                        <v-list-tile avatar v-bind:key="item.title">
                            <v-list-tile-avatar>
                                <img v-bind:src="item.avatar"/>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-divider inset></v-divider>
                    </template>
                </v-list>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

    export default {
        data: () => ({
            dialog: false,
            items: [
                { avatar: '/static/doc-images/lists/1.jpg', title: 'Brunch this weekend?', subtitle: "<span class='grey--text text--darken-2'>Ali Connors</span> — I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
                { avatar: '/static/doc-images/lists/2.jpg', title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='grey--text text--darken-2'>to Alex, Scott, Jennifer</span> — Wish I could come, but I'm out of town this weekend." },
                { avatar: '/static/doc-images/lists/3.jpg', title: 'Oui oui', subtitle: "<span class='grey--text text--darken-2'>Sandra Adams</span> — Do you have Paris recommendations? Have you ever been?" },
                { avatar: '/static/doc-images/lists/4.jpg', title: 'Birthday gift', subtitle: "<span class='grey--text text--darken-2'>Trevor Hansen</span> — Have any ideas about what we should get Heidi for her birthday? Thanks" },
                { avatar: '/static/doc-images/lists/5.jpg', title: 'Recipe to try', subtitle: "<span class='grey--text text--darken-2'>Britta Holt</span> — We should eat this: Grate, Squash, Corn, and tomatillo Tacos." },
                { avatar: '/static/doc-images/lists/1.jpg', title: 'Brunch this weekend?', subtitle: "<span class='grey--text text--darken-2'>Ali Connors</span> — I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
                { avatar: '/static/doc-images/lists/2.jpg', title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='grey--text text--darken-2'>to Alex, Scott, Jennifer</span> — Wish I could come, but I'm out of town this weekend." },
                { avatar: '/static/doc-images/lists/3.jpg', title: 'Oui oui', subtitle: "<span class='grey--text text--darken-2'>Sandra Adams</span> — Do you have Paris recommendations? Have you ever been?" },
                { avatar: '/static/doc-images/lists/4.jpg', title: 'Birthday gift', subtitle: "<span class='grey--text text--darken-2'>Trevor Hansen</span> — Have any ideas about what we should get Heidi for her birthday? Thanks" },
                { avatar: '/static/doc-images/lists/5.jpg', title: 'Recipe to try', subtitle: "<span class='grey--text text--darken-2'>Britta Holt</span> — We should eat this: Grate, Squash, Corn, and tomatillo Tacos." },
            ]
        }),
        props: {
            fullscreen: {
                type: Boolean
            }
        }
    }

</script>

<style lang="stylus">
    .hidden
        display none
    .dialog__content
        z-index 6
        display unset
    #chat-dialog
        position relative
    .space_top
        margin-top 48px !important
    .dialog--persistent
        box-shadow unset !important
        #chat-dialog
            right: 16px;
            bottom: 85px;
            width: 350px;
            position: absolute;
            max-height: 80vh;
            overflow-y: auto;
    .dialog--fullscreen
        #chat-dialog
            top: 0;
            right 0
            bottom: 85px;
            width: 350px;
            position: absolute;
        #fullscreen-btn
            display none
    #chat-list
        max-width 768px
        margin 0 auto
</style>