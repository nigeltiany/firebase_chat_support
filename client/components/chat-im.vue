<template>
    <v-list id="chat-list" three-line :class="{ space_top: fullscreen, large_send_button: fullscreen }">
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
                        <span class='grey--text text--darken-2'>{{ commaSplit(message.participants) }}</span> — {{ message.message }} {{ message.message }}
                    </v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
        </template>

        <div style="position: absolute; bottom: 0; width: 100%; max-width: 767px;">
            <div style="position: relative; margin: 0 auto">
                <v-text-field id="messageInput" label="Message"
                    v-model="userMessage"
                    counter max="300"
                    full-width multi-line single-line auto-focus auto-grow rows="1"
                    v-on:blur="resizeTextArea(userMessage)">
                </v-text-field>
                <v-btn id="sendButton" fab :small="!fullscreen" class="cyan accent-2"
                       right absolute @click.native.stop="dialog = !dialog">
                    <v-icon>send</v-icon>
                </v-btn>
            </div>
        </div>

    </v-list>
</template>

<script>
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
        methods: {
            commaSplit(array) {
                return array ? array.join(', ') : 'Team'
            },
            resizeTextArea(text) {
                if(text.replace(/\s/g, "") === ""){
                    let input = document.getElementById('messageInput')
                    input.style.height = "42px"
                    input.value = input.value.trim()
                }
            }
        },
        watch: {
            userMessage(text) {
                this.resizeTextArea(text)
            }
        }
    }
</script>

<style lang="stylus">
    .space_top
        margin-top 64px !important
    .input-group--text-field label
        left unset
    .input-group--text-field.input-group--full-width
        position: absolute !important;
        background white
        max-width 768px
        bottom: 0;
    .input-group--text-field .input-group__counter
        margin-right: auto;
        margin-left unset

    #messageInput
        overflow-y hidden !important
    #sendButton
        z-index: 2;
        right 12px
        bottom 12px
</style>