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

        <input v-model="novoTitulo" placeholder="Digite o título do board" />
        <button @click="criarBoard">Criar novo board</button>

        <div class="logout">
          <button id="sair" class="logout-button" @click="sair" title="Sair">⎋ Sair</button>
        </div>
      </div>
    </aside>

    <!-- Conteúdo principal -->
    <main class="main-content">
      <h1>Bem-vindo ao Hub Principal</h1>
      <p>Aqui você pode navegar entre diferentes tópicos e descobrir novas teorias incríveis!</p>

      <section>
        <h2>Teorias da Comunidade</h2>

        <div v-if="boardsPublicos.length === 0">
          <p>Nenhum board público encontrado.</p>
        </div>

        <div v-else class="boards-grid">
          <div 
            v-for="board in boardsPublicos" 
            :key="board.id" 
            class="board-card"
            @click="abrirBoard(board.id)"
          >
            <h3>{{ board.title }}</h3>
            <p>Criado por: {{ board.User?.name_tag || 'Anônimo' }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name_tag: '',
      boardsPublicos: [],
      novoTitulo: ''
    };
  },
  mounted() {
    this.name_tag = localStorage.getItem('name_tag') || 'Usuário';
    this.buscarBoardsPublicos();
  },
  methods: {
    async buscarBoardsPublicos() {
      try {
        const response = await axios.get('http://localhost:3000/boards/public');
        this.boardsPublicos = response.data;
      } catch (error) {
        console.error('Erro ao buscar boards públicos:', error);
      }
    },

    async criarBoard() {
      const title = this.novoTitulo.trim();
      if (!title) {
        alert("Título não pode estar vazio");
        return;
      }
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token ausente');
          return;
        }

        const response = await axios.post(
          'http://localhost:3000/boards/create',
          { title },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log('Board criado com sucesso:', response.data);

        const boardId = response.data.id;
        this.$router.push({ name: 'CrimeBoard', params: { id: boardId } });
      } catch (err) {
        console.error('Erro ao criar board:', err);
      }
    },

    abrirBoard(id) {
      this.$router.push(`/CrimeBoard/${id}`);
    },

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
  margin-top: 50vh;
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

/* Estilo dos cards dos boards */
.boards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 20px;
}

.board-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  padding: 16px;
  width: 220px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.board-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}

#sair{
  margin-top: -200vh;
}
</style>
