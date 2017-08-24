<template>
    <div class="message-item" avatar :class="{ 'grey lighten-4': message.__response || message.auto }">
        <v-list-tile-avatar class="message-avatar">
            <img v-bind:src="message.avatar"/>
        </v-list-tile-avatar>
        <div class="message-sender">
            {{ message.sender === 'Anonymous'? 'You' : message.sender }}
        </div>
        <div class="message-content">
            {{ message.message }}
        </div>
        <div class="message-timestamp caption">
            <v-icon v-if="!timestamp" @click="toggleMessageTimeStamp()">more_horiz</v-icon>
            <span v-else @click="toggleMessageTimeStamp()">{{ timeAgo(message.deliveredAt) }}</span>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    export default {
        data(){
            return {
                timestamp: false
            }
        },
        props: {
            message: {
                type: Object
            }
        },
        methods: {
            timeAgo(time){
                if(time){
                    return moment(time).fromNow()
                }
            },
            toggleMessageTimeStamp() {
                this.timestamp ? this.timestamp = false : this.timestamp = true
            }
        }
    }

</script>

<style lang="stylus">
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