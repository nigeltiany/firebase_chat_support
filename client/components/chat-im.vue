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
        methods: {
            commaSplit(array) {
                return array ? array.join(', ') : 'Team'
            }
        }
    }
</script>

<style lang="stylus">
    .space_top
        margin-top 64px !important
</style>