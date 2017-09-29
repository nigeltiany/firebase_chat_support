<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <span class="_brand_intro">
        <h3 class="text-xs-center">
          The easiest & most trusted brand in lawn care.
        </h3>
        <p class="text-xs-center">Get an easy free estimate</p>
        <v-text-field label="Enter Address" single-line append-icon="search"></v-text-field>
      </span>
    </v-flex>
  </v-layout>
</template>

<script lang="stylus">
  ._brand_intro
    position absolute
    top 24.3%
    -webkit-transform: translate(-50%, 0);
    transform: translate(-50%, 0);
    left: 50%;
    h1
      font-size 3em
    p
      color #757575
      font-size 18px
      font-weight 300
      line-height 26px
      margin 20px auto
      max-width 500px
</script>
