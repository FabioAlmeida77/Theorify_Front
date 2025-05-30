<template>
  <div id="caixa">
    <h2>Login</h2>
    
    <form @submit.prevent="fazerLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" />
      </div>
      <div>
        <label for="senha">Senha:</label>
        <input type="password" v-model="senha" id="senha" />
      </div>
      <button type="submit">Entrar</button>
      <p class="criar-conta-link">Não tem uma conta?
        <RouterLink to="/cadastro">Criar conta</RouterLink>
      </p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'login',
  data() {
    return {
      email: '',
      senha: ''
    };
  },
  methods: {
    async fazerLogin() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          email: this.email,
          senha: this.senha
        });

        const token = response.data.token;
        localStorage.setItem('token', token);

        alert('Login bem-sucedido!');
        this.$router.push('/hub');

      } catch (error) {
        console.error('Erro no login:', error);
        if (error.response && error.response.data && error.response.data.mensagem) {
          alert(error.response.data.mensagem);
        } else {
          alert('Erro ao fazer login');
        }
      }
    }
  }
};
</script>

<style>

body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f3f3;
  margin: 0;
  font-family: Arial, sans-serif;
}

#caixa {
  background-color: #ffffff;
  color: #333;
  padding: 30px 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  box-sizing: border-box;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

form div {
  margin-bottom: 15px;
}


label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007BFF;
  outline: none;
}

button {
  padding: 10px;
  background-color: #FFA500;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #FF8C00;
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

