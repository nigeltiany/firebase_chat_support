<template>
    <div>
        <v-dialog v-model="dialog" persistent hide-overlay :fullscreen="fullscreen">
            <v-btn slot="activator" class="blue darken-2" fixed bottom right hover dark fab v-badge="{ value: messageCount, overlap: true, left: true }">
                <v-icon>chat</v-icon>
                <v-icon>close</v-icon>
            </v-btn>
            <v-card id="chat-dialog">
                <v-toolbar dark class="primary" :fixed="fullscreen">
                    <v-btn icon @click.native="viewAllMessages = true" dark :class="{ hidden: viewAllMessages }">
                        <v-icon>arrow_back</v-icon>
                    </v-btn>
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
                <v-list id="chat-list" three-line :class="{ space_top: fullscreen }" v-if="viewAllMessages">
                    <template v-for="sender in userMessages()">
                        <v-list-tile avatar v-bind:key="sender" @click.native="viewSenderMessages(sender)">
                            <v-list-tile-avatar>
                                <img v-bind:src="lastMessageBySender(sender).avatar"/>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ lastMessageBySender(sender).title}} <span v-if="lastMessageBySender(sender).replies_meta" class="grey--text text--lighten-1">{{ lastMessageBySender(sender).replies_meta }}</span>
                                </v-list-tile-title>
                                <v-list-tile-sub-title>
                                    <span class='grey--text text--darken-2'>{{ commaSplit(lastMessageBySender(sender).participants) }}</span> — {{ lastMessageBySender(sender).message }}
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-divider inset></v-divider>
                    </template>
                    <div class="text-xs-center compose-btn">
                        <v-btn small round primary dark>
                            <v-icon small dark left>create</v-icon>New Chat
                        </v-btn>
                    </div>
                </v-list>
                <chat-im v-else :fullscreen="fullscreen" :messages="senderMessages"></chat-im>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

    import firebase from '../firebase'
    import _unionBy from 'lodash.unionby'
    import chatIm from '../components/chat-im.vue'
    import ChatIm from "./chat-im";

    export default {
        components: {ChatIm},
        data: () => ({
            dialog: false,
            messageCount: 0,
            viewAllMessages: true,
            senderMessages: [],
            messages: {}
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
                        uid: user.uid
                    });

                    firebase.onNewMessage((message) => {
                        if (this.messages[message.conversation_id]) {
                            this.messages[message.conversation_id].push(message)
                        }
                        else {
                            this.messages[message.conversation_id] = []
                            this.messages[message.conversation_id].push(message)
                        }
                        this.messageCount += 1
                    })
                }
            })
        },
        methods: {
            commaSplit(array) {
                return array ? array.join(', ') : 'Team'
            },
            userMessages() {
                return Object.keys(this.messages)
            },
            lastMessageBySender(sender) {
                return this.messages[sender][this.messages[sender].length-1]
            },
            viewSenderMessages(sender) {
                this.senderMessages = this.messages[sender]
                this.viewAllMessages = false
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
        margin 0 auto 52px auto
    .compose-btn
        position: absolute;
        left: 0;
        bottom: 12px;
        right: 0;
</style>