<template>
    <div>
        <v-dialog v-model="dialog" persistent hide-overlay :fullscreen="fullscreen">
            <v-btn slot="activator" class="blue darken-2" fixed bottom right hover dark fab v-badge="{ value: messages.length, overlap: true, left: true }">
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
                <v-list id="chat-list" three-line :class="{ space_top: fullscreen }">
                    <template v-for="message in messages" v-if="messages.length">
                        <v-list-tile avatar v-bind:key="message.title">
                            <v-list-tile-avatar>
                                <img v-bind:src="message.avatar"/>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{message.title}} <span v-if="message.replies_meta" class="grey--text text--lighten-1">{{message.replies_meta}}</span>
                                </v-list-tile-title>
                                <v-list-tile-sub-title>
                                    <span class='grey--text text--darken-2'>{{message.sender}}</span> — {{message.message}}
                                </v-list-tile-sub-title>
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

    import firebase from '../firebase'

    export default {
        data: () => ({
            dialog: false,
            messages: []
        }),
        props: {
            fullscreen: {
                type: Boolean
            }
        },
        created() {
            firebase.signInAnonymously()
            firebase.authStateChanged((user, database) => {
                if (user) {
                    database.ref('users/' + user.uid).set({
                        userID: user.uid
                    });

                    firebase.onNewMessage((message) => {
                        this.messages.push(message.val())
                    })
                }
            })
        },
        methods: {
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
        margin-top 64px !important
    .list__tile__sub-title
        overflow-y hidden
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