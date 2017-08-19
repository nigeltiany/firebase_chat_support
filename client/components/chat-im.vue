<template>

        <v-list id="chat-messages" :class="{ space_top: fullscreen }" three-line>

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
                            <span class='grey--text text--darken-2'>{{ commaSplit(message.participants) }}</span> — {{ message.message }}
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider inset></v-divider>
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
            let textArea = document.getElementById('messageInput')
            textArea.setAttribute('wrap', 'hard')
            new TextAreaAutoGrow(textArea)
        },
        methods: {
            commaSplit(array) {
                return array ? array.join(', ') : 'Team'
            },
            sendMessage() {

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

</style>