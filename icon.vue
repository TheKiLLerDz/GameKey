<template>
  <span class="gamekeyicon" slot="myheader" :class="type">
    <span>GK</span>
  </span>
</template>
<style>
  .gamekeyicon {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: default;
    display: inline-block;
    font-family: 'Verdana', cursive, sans-serif;
    text-align: center;
    color: #fff;
    font-weight: bold;
    font-size: auto;
    vertical-align: middle;
    background-image: linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%);
    box-shadow: 0px 3px 10px rgba(0, 0, 0, .25);
  }

  .theme--blue .gamekeyicon.sync {
    background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
  }

  .theme--red .gamekeyicon.sync {
    background-image: linear-gradient(160deg, rgb(233, 0, 31) 0%, rgb(149, 25, 25) 100%);
  }

  .theme--green .gamekeyicon.sync {
    background-image: linear-gradient(0deg, #08AEEA 0%, #2AF598 100%);
  }

  .theme--orange .gamekeyicon.sync {
    background-image: linear-gradient(90deg, #FAD961 0%, #F76B1C 100%);
  }
</style>
<script>
  module.exports = {
    props: ["type"]
  }
</script>