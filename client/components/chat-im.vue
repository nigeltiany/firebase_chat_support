<template>

        <v-list id="chat-messages" :class="{ space_top: fullscreen }" three-line>

            <template v-for="(message, index) in messages" v-if="messages.length">
                <div class="message-item" avatar v-bind:key="index">
                    <v-list-tile-avatar class="message-avatar">
                        <img v-bind:src="message.avatar"/>
                    </v-list-tile-avatar>
                    <div class="message-sender">
                        {{ message.sender }}
                    </div>
                    <div class="message-content">
                        {{ message.message }}
                    </div>
                    <div class="message-timestamp caption">
                        9:50am
                    </div>
                </div>
            </template>

            <div style="position: absolute; bottom: 0; max-width: 768px; width: 100%; padding-top: 8px; background: #fff;">

                <v-text-field id="messageInput" label="Message"
                    :class="{
                        with_large_button_space: fullscreen,
                        with_small_button_space: !fullscreen
                    }"
                    v-model="userMessage"
                    counter max="300"
                    full-width textarea multi-line single-line auto-focus rows="1">
                </v-text-field>

                <v-btn id="sendButton" fab :small="!fullscreen" class="cyan accent-2"
                       right absolute @click.native.stop="sendMessage()">
                    <v-icon>send</v-icon>
                </v-btn>

            </div>

        </v-list>

</template>

<script>

    import TextAreaAutoGrow from 'textarea-autogrow'
    import Firebase from '../firebase'

    export default {
        name: 'chat-im',
        props: {
            messages: {
                type: Array
            },
            fullscreen: {
                type: Boolean
            }
        },
        data () {
            return {
                userMessage: ""
            }
        },
        mounted () {
            new TextAreaAutoGrow(document.getElementById('messageInput'))
        },
        methods: {
            commaSplit(array) {
                return array ? array.join(', ') : 'Team'
            },
            sendMessage() {
                if(this.userMessage === "" || this.messages.length === 0){
                   return
                }
                Firebase.sendMessageReply({
                    conversation_id: this.messages[0].conversation_id,
                    message: this.userMessage
                })
                this.userMessage = ""
            }
        }
    }
</script>

<style lang="stylus">
    .space_top
        margin-top 56px !important

    .dialog--fullscreen > #chat-dialog > #chat-messages > li:first-child
        margin-top 56px

    .padding_bottom
        padding-bottom 64px

    .input-group--text-field label
        left unset

    .input-group--text-field .input-group__counter
        margin-right: auto;
        margin-left unset

    .dialog--persistent
        #chat-messages
            max-height: calc(80vh - 48px);

    .dialog--fullscreen
        #chat-messages
            max-height: calc(100% - 56px);

    #chat-messages
        height: calc(100% - 48px);
        margin-right -17px
        overflow-y: scroll;
        width unset
        min-height: 176px;
        li
            width 100%
            max-width 767px
        li:last-of-type
            padding-bottom: 60px

    #messageInput
        width 100%

    #sendButton
        z-index: 2;
        right 12px
        bottom 12px

    .with_large_button_space > .input-group__input
        textarea
            padding-right: 70px !important;
    .with_small_button_space > .input-group__input
        textarea
            padding-right: 46px !important;

    .message-item
        position relative
        padding 16px
        box-sizing content-box
        overflow hidden
        .message-avatar
            float left
            display inline
        .message-sender
            margin-left 56px
        .message-content
            margin-top 2px
            margin-left 56px
            margin-right 56px
        .message-timestamp
            position absolute
            right 16px
            top 16px
</style>