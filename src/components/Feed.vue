<template>
  <div class="feed feed-container">
    <h1>Apresentação do Projeto</h1>

    <div class="teoria-card">
      <h3>📌 Objetivo do Projeto</h3>
      <p>
        Este projeto foi desenvolvido como um quadro interativo estilo "crime board", com cartões arrastáveis,
        mídias e comentários. Ele serve para organizar e visualizar ideias de forma dinâmica e intuitiva.
      </p>
    </div>

    <div class="teoria-card">
      <h3>🛠️ Tecnologias Utilizadas</h3>
      <p>
        - Vue.js 2 com Vue CLI<br>
        - Node.js (backend)<br>
        - Express + JWT para autenticação<br>
        - Axios para comunicação entre front-end e API<br>
        - CSS puro com uso de fontes customizadas e textura de fundo<br>
        - LocalStorage para controle de sessão
      </p>
    </div>

    <div class="teoria-card">
      <h3>📂 Organização do Código</h3>
      <p>
        O sistema é dividido em componentes como: quadro, cartões, formulários de mídia e comentários, conexão visual
        entre os cards com canvas, etc.
      </p>
    </div>

    <div class="teoria-card">
      <h3>🔗 Repositório no GitHub</h3>
      <p>
        Você pode acessar o código completo e contribuir através do repositório:
        <a href="https://github.com/seu-usuario/seu-projeto" target="_blank">github.com/seu-usuario/seu-projeto</a>
      </p>
    </div>

    <div class="teoria-card">
      <h3>💬 Considerações Finais</h3>
      <p>
        Este projeto foi uma ótima oportunidade para aplicar conhecimentos de front-end, lógica de interação e design
        de interface. Também permitiu explorar controle de estado e manipulação direta do DOM via canvas.
      </p>
    </div>
  </div>
</template>


<style>
.feed-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.teoria-card {
  background: #fffdfa;
  color: #333;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0,0,0,0.15);
  font-family: 'Special Elite', monospace;
  line-height: 1.6;
}

.teoria-card h3 {
  margin-top: 0;
  color: #222;
}

.teoria-card a {
  color: #4caf50;
  text-decoration: none;
}

.teoria-card a:hover {
  text-decoration: underline;
}
.feed h1 {
  color: #222;
  font-size: 28px;
  margin-bottom: 20px;
  font-family: 'Special Elite', monospace;
}
</style>