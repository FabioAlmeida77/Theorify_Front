<template>
  <div>
    <h1>Bem-vindo ao Hub Principal</h1>
    <button @click="sair">Sair</button>
  </div>
</template>

<script>
export default {
  methods: {
    sair() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
};
</script>