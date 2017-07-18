<template>
    <div>
        <v-dialog v-model="dialog" persistent hide-overlay class="hidden-sm-and-down">
            <v-btn slot="activator" class="blue darken-2" fixed bottom right hover dark fab v-badge="{ value: '1', overlap: true, left: true }">
                <v-icon>chat</v-icon>
                <v-icon>close</v-icon>
            </v-btn>
            <v-card id="chat-dialog">
                <v-card-title>
                    <div class="headline">Use Google's location service?</div>
                </v-card-title>
                <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="green--text darken-1" flat="flat" @click.native="dialog = false">Disagree</v-btn>
                    <v-btn class="green--text darken-1" flat="flat" @click.native="dialog = false">Agree</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogFS" persistent fullscreen class="hidden-md-and-up">
            <v-btn slot="activator" class="blue darken-2" fixed bottom right hover dark fab v-badge="{ value: '1', overlap: true, left: true }">
                <v-icon>chat</v-icon>
                <v-icon>close</v-icon>
            </v-btn>
            <v-card id="chat-dialog-fs">
                <v-card-title>
                    <div class="headline">Use Google's location service?</div>
                </v-card-title>
                <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="green--text darken-1" flat="flat" @click.native="dialogFS = false">Disagree</v-btn>
                    <v-btn class="green--text darken-1" flat="flat" @click.native="dialogFS = false">Agree</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

    export default {
        data: () => ({
            dialog: false,
            dialogFS: false
        })
    }

</script>

<style lang="stylus">
    .dialog__content
        z-index 6
    .dialog__content:nth-child(2)
        display unset
    .dialog--persistent
        box-shadow unset !important
    #chat-dialog
        right: 16px;
        bottom: 85px;
        width: 350px;
        position: absolute;
</style>