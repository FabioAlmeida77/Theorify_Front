<template>

  <div class="hub-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-content">
        <div class="user-info">
          <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Usuário" class="user-avatar" />
          <p class="user-name">{{ name_tag }}</p>
        </div>

        <nav class="menu">
          <button class="menu-button" @click="filtrarPorCategoria('Todos')">Todos</button>
          <button class="menu-button" @click="filtrarPorCategoria('Filmes')">Filmes</button>
          <button class="menu-button" @click="filtrarPorCategoria('Séries')">Séries</button>
          <button class="menu-button" @click="filtrarPorCategoria('Jogos')">Jogos</button>
          <button class="menu-button" @click="filtrarPorCategoria('Novelas')">Novelas</button>
        </nav>
      </div>

      <div class="logout">
        <button class="logout-button" @click="sair">⎋ Sair</button>
      </div>
    </aside>

    <!-- Conteúdo principal -->
    <main class="main-content">
      

      <!-- Barra de busca -->
      <input
        v-model="termoBusca"
        placeholder="Buscar por título ou descrição..."
        class="search-bar"
      />

      <section>
        <h2 class="section-title">Teorias da Comunidade</h2>

        <div v-if="boardsFiltrados.length === 0" class="empty-message">
          <p>Nenhum board encontrado.</p>
        </div>

        <div v-else class="boards-grid">
          <div
            v-for="board in boardsFiltrados"
            :key="board.id"
            class="board-card"
            @click="abrirBoard(board.id)"
          >
            <h3 class="board-title">{{ board.title }}</h3>
            <p><strong>Descrição:</strong> {{ board.descricao }}</p>
            <p><strong>Categoria:</strong> {{ board.categoria }}</p>
            <p class="board-author">Criado por: {{ board.User?.name_tag || 'Anônimo' }}</p>
          </div>
        </div>
      </section>
    </main>

    <!-- Formulário flutuante no canto inferior direito -->
    <div class="floating-form">
      <input v-model="novoTitulo" placeholder="Título do board" />
      <input v-model="novaDescricao" placeholder="Descrição" />
      <select v-model="novaCategoria">
        <option disabled value="">Selecione a categoria</option>
        <option v-for="categoria in categoriasDisponiveis" :key="categoria" :value="categoria">
          {{ categoria }}
        </option>
      </select>
      <button @click="criarBoard">Criar Board</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name_tag: '',
      boardsPublicos: [],
      todosBoards: [],
      novoTitulo: '',
      novaDescricao: '',
      novaCategoria: '',
      termoBusca: '',
      categoriasDisponiveis: ['Filmes', 'Séries', 'Jogos', 'Novelas']
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
        this.todosBoards = response.data;
        this.boardsPublicos = response.data;
      } catch (error) {
        console.error('Erro ao buscar boards públicos:', error);
      }
    },
    filtrarPorCategoria(categoria) {
      if (categoria === 'Todos') {
        this.boardsPublicos = this.todosBoards;
      } else {
        this.boardsPublicos = this.todosBoards.filter(
          board => board.categoria === categoria
        );
      }
      this.termoBusca = ''; // limpa busca ao filtrar categoria
    },
    async criarBoard() {
      const title = this.novoTitulo.trim();
      const descricao = this.novaDescricao.trim();
      const categoria = this.novaCategoria;

      if (!title || !descricao || !categoria) {
        alert("Título, descrição e categoria não podem estar vazios.");
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
          { title, descricao, categoria },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('Board criado com sucesso:', response.data);
        this.$router.push({ name: 'CrimeBoard', params: { id: response.data.id } });
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
  },
  computed: {
    boardsFiltrados() {
      const termo = this.termoBusca.toLowerCase().trim();
      if (!termo) return this.boardsPublicos;

      return this.boardsPublicos.filter(board =>
        board.title.toLowerCase().includes(termo) ||
        board.descricao.toLowerCase().includes(termo)
      );
    }
  }
};
</script>

<style scoped>
/* Layout principal */
.hub-container {
  display: flex;
  height: 100vh;
  width: 100%;
  font-family: Arial, sans-serif;
  position: fixed;
  top: 0;
  left: 0;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  width: 250px;
  background-color: rgba(70, 46, 16, 0.85);
  height: 100vh;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.user-info {
  text-align: center;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.user-name {
  margin-top: 10px;
  font-weight: bold;
  color: white;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

/* Conteúdo principal */
.main-content {
  flex: 1;
  padding: 40px;
  background: linear-gradient(135deg, #f4f4f4, #e0e0e0);
  color: #333;
  overflow-y: auto;
}

.intro-text {
  margin-top: 8px;
  font-size: 1.1em;
  color: #555;
}

.section-title {
  margin-top: 30px;
  margin-bottom: 16px;
  font-size: 1.4em;
  color: #444;
}

.empty-message {
  background-color: #fff3cd;
  color: #856404;
  padding: 16px;
  border-radius: 6px;
  max-width: 300px;
}

/* Cards dos boards */
.boards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.board-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  padding: 16px;
  width: 240px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.3s;
}

.board-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}

.board-title {
  font-size: 1.2em;
  color: #2e2e4d;
  margin-bottom: 8px;
}

.board-author {
  margin-top: 10px;
  font-size: 0.9em;
  color: #777;
}

/* Barra de busca */
.search-bar {
  width: 100%;
  max-width: 600px;
  padding: 8px 16px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.search-bar::placeholder {
  color: #888;
}

.search-bar:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.4); /* similar à cor #ffc107 */
}

/* Formulário flutuante */
.floating-form {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(70, 46, 16, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 280px;
  color: white;
}

.floating-form input,
.floating-form select {
  padding: 10px;
  border-radius: 8px;
  border: none;
  font-size: 1em;
}

.floating-form select {
  cursor: pointer;
}

.floating-form button {
  background-color: #ff4d4d;
  border: none;
  padding: 12px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.floating-form button:hover {
  background-color: #ff1a1a;
}

</style>
