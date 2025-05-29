<template>
  <div class="feed">
    <h1>Feed de Teorias</h1>

    <div v-if="carregando">
      <p>Carregando teorias...</p>
    </div>

    <div v-else-if="teorias.length === 0">
      <p>Nenhuma teoria publicada ainda.</p>
    </div>

    <div v-else>
      <div v-for="teoria in teorias" :key="teoria.id" class="teoria">
        <h3>{{ teoria.titulo }}</h3>
        <p>{{ teoria.conteudo }}</p>
        <small>Por: {{ teoria.name_tag }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Feed',
  data() {
    return {
      teorias: [],
      carregando: true // novo estado
    };
  },
  mounted() {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:3000/teorias', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      this.teorias = response.data;
    })
    .catch(error => {
      console.error('Erro ao buscar teorias:', error);
    })
    .finally(() => {
      this.carregando = false;
    });
  }
};
</script>

<style>
.feed-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
.teoria-card {
  background: #fff;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
}
.autor {
  font-size: 0.9em;
  color: #666;
}
.conteudo {
  margin: 10px 0;
}
.data {
  font-size: 0.8em;
  color: #999;
}
</style>