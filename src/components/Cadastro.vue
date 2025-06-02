<template>
  <div id="caixa">
    <form id="cadastro" @submit.prevent="cadastrar">
      <input v-model="name_tag" type="text" id="name_tag" placeholder="Digite o nome do usuário" required>
      <input v-model="email" type="email" id="email" placeholder="Digite o email" required>
      <input v-model="senha" type="password" id="senha" placeholder="Digite a senha" required>
      <input type="submit" value="Cadastrar">
      <p class="criar-conta-link">Já tem conta?
        <RouterLink to="/Login">Fazer Login</RouterLink>
      </p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name_tag: '',
      email: '',
      senha: ''
    };
  },
  methods: {
    async cadastrar() {
      try {
        const response = await axios.post('http://localhost:3000/user/cad', {
          name_tag: this.name_tag,
          email: this.email,
          senha: this.senha
        });

        alert('Usuário cadastrado com sucesso!');
        localStorage.setItem('name_tag', this.name_tag);
        this.name_tag = '';
        this.email = '';
        this.senha = '';
      } catch (error) {
        console.error('Erro na requisição:', error);
        if (error.response && error.response.data && error.response.data.mensagem) {
          alert(error.response.data.mensagem);
        } else {
          alert('Erro ao cadastrar usuário');
        }
      }
    }
  }
};
</script>


<style scoped>
body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea, #764ba2);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

#caixa {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    width: 100%;
    max-width: 400px;
    animation: fadeIn 0.6s ease-in-out;
}

#cadastro {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

#cadastro input[type="text"],
#cadastro input[type="password"] {
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: #f0f0f0;
    font-size: 15px;
    transition: background 0.3s;
}

#cadastro input[type="text"]:focus,
#cadastro input[type="password"]:focus {
    background: #e0e0e0;
    outline: none;
}

#cadastro input[type="submit"] {
    background-color: #FF8C00;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

#cadastro input[type="submit"]:hover {
    background-color: #FF4500;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

.criar-conta-link {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}
.criar-conta-link a {
  color: #007BFF;
  text-decoration: none;
  font-weight: bold;
}

.criar-conta-link a:hover {
  text-decoration: underline;
}
</style>


