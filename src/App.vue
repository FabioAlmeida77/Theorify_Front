<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import login from './components/Login.vue'
import Cadastro from './components/Cadastro.vue';
import Hub from './components/Hub.vue';
import Feed from './components/Feed.vue';

export default {
  name: 'App',
  components:{
    Cadastro,
    login,
    Hub,
    Feed
  }
}
</script>

<style>
 
</style>

