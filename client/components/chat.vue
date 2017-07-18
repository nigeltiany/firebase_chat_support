<template>
    <div>
        <v-speed-dial :fixed="true" :bottom="true" :right="true" :direction="'left'">
            <v-btn slot="activator" class="blue darken-2" dark fab v-badge="{ value: '1', overlap: true, left: true }">
                <v-icon>chat</v-icon>
                <v-icon>close</v-icon>
            </v-btn>
            <v-btn fab dark small class="green">
                <v-icon>edit</v-icon>
            </v-btn>
        </v-speed-dial>
    </div>
</template>

<script>

    export default {}

</script>

<style>

</style>