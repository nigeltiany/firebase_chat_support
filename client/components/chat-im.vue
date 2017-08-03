<template>
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
                        <span class='grey--text text--darken-2'>{{ commaSplit(message.participants) }}</span> — {{ message.message }} {{ message.message }}
                    </v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
        </template>

        <v-text-field id="messageInput" label="Message" v-model="userMessage" counter max="300" full-width multi-line single-line auto-focus auto-grow rows="1"
            v-on:blur="resizeTextArea(userMessage)">
        </v-text-field>
        <v-btn id="sendButton" fab small class="cyan accent-2" bottom right absolute @click.native.stop="dialog = !dialog">
            <v-icon>send</v-icon>
        </v-btn>

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
                    input.style.height = "30px"
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
    #messageInput
        overflow-y hidden !important
    #sendButton
        bottom 6px

</style>