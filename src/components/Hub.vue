<template>
  <div class="hub-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div>
        <div class="user-info">
          <img src="https://via.placeholder.com/80" alt="Usuário" class="user-avatar" />
          <p class="user-name">{{ name_tag }}</p>
        </div>

        <nav class="menu">
          <button class="menu-button">Todos</button>
          <button class="menu-button">Filmes</button>
          <button class="menu-button">Séries</button>
          <button class="menu-button">Jogos</button>
          <button class="menu-button">Novelas</button>
        </nav>

        <div class="logout">
          <button class="logout-button" @click="sair" title="Sair">⎋ Sair</button>
        </div>
      </div>
    </aside>

    <!-- Conteúdo principal -->
    <main class="main-content">
      <h1>Bem-vindo ao Hub Principal</h1>
      <p>Aqui você pode navegar entre diferentes tópicos e descobrir novas teorias incríveis!</p>
    </main>
  </div>
</template>

<script>
    export default {
      data() {
        return {
          name_tag: ''
        };
      },
      mounted() {
        this.name_tag = localStorage.getItem('name_tag') || 'Usuário';
      },
      methods: {
        sair() {
          localStorage.removeItem('token');
          localStorage.removeItem('name_tag');
          this.$router.push('/login');
        }
      }
    };
</script>

<style scoped>
.hub-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
  position: fixed;
  left: 0px;
  top: 0px;
  padding: 0px;
}

.sidebar {
  width: 250px;
  background-color: #1e1e2f;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  height: 100vh;
}

.user-info {
  text-align: center;
  margin-top: 20px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.user-name {
  margin-top: 10px;
  font-weight: bold;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;
}

.menu-button {
  background-color: #2e2e4d;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-button:hover {
  background-color: #3f3f6b;
}

.logout {
  padding-top: 30px;
  margin-top:50vh;
} 

.logout-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #ff1a1a;
}

.main-content {
  flex: 1;
  padding: 40px;
  background-color: #f4f4f4;
  color: #333;
}
.top-section {
  display: flex;
  flex-direction: column;
  gap: 30px; /* Espaçamento entre avatar e menu */
}


</style>
