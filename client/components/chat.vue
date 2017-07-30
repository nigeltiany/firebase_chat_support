<template>
    <div>
        <v-dialog v-model="dialog" persistent hide-overlay :fullscreen="fullscreen">
            <v-btn slot="activator" class="blue darken-2" fixed bottom right hover dark fab v-badge="{ value: messageCount, overlap: true, left: true }">
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
                    <template v-for="sender in userMessages()">
                        <v-list-tile avatar v-bind:key="sender">
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
                    <!--<chat-im>-->
                        <!--&lt;!&ndash; Message received from peer &ndash;&gt;-->
                        <!--<div class="chat-other">-->
                            <!--<div class="chat-user">-->
                                <!--<img src="assets/linux-avatar.png">-->
                            <!--</div>-->
                            <!--<div class="chat-date">-->
                                <!--7 minutes ago-->
                            <!--</div>-->
                            <!--<div class="chat-message">-->
                                <!--<p>-->
                                    <!--hey, if you type in your pw, it will show as stars-->
                                <!--</p>-->
                            <!--</div>-->
                        <!--</div>-->
                        <!--&lt;!&ndash; Message sent by you &ndash;&gt;-->
                        <!--<div class="chat-you">-->
                            <!--<div class="chat-user">-->
                                <!--<img src="assets/boy-avatar.png">-->
                            <!--</div>-->
                            <!--<div class="chat-date">-->
                                <!--4 minutes ago-->
                            <!--</div>-->
                            <!--<div class="chat-message">-->
                                <!--<p>-->
                                    <!--hunter2-->
                                <!--</p>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</chat-im>-->
                </v-list>
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
                        if (this.messages[message.recipients[1]]) {
                            this.messages[message.recipients[1]].push(message)
                        }
                        else {
                            this.messages[message.recipients[1]] = []
                            this.messages[message.recipients[1]].push(message)
                        }
                        this.messageCount += 1
                    })
                }
            })
        },
        methods: {
            commaSplit(array) {
                return array ? array.join(' ,') : 'Team'
            },
            userMessages() {
                return Object.keys(this.messages)
            },
            lastMessageBySender(sender) {
                return this.messages[sender][this.messages[sender].length-1]
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
        margin 0 auto
</style>