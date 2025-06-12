<template>
  <div class="board" ref="board" @click="clearSelection">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="card"
      :class="{ selected: selectedCard === index }"
      :style="{ top: item.y + 'px', left: item.x + 'px' }"
      @mousedown="startDrag($event, index)"
      @click.stop="selectCard(index)"
    >
      <div class="card-top-line"></div>
      <div class="card-content">
        <div>{{ item.name }}</div>
        <div v-if="item.media && item.media.length" class="media-gallery">
          <div
            v-for="(media, mIndex) in item.media"
            :key="mIndex"
            class="media-item"
          >
            <img
              v-if="media.type === 'image'"
              :src="media.url"
              alt="Imagem"
              @click.stop="openModal(media.url)"
            />
            <video
              v-else-if="media.type === 'video'"
              :src="media.url"
              controls
              @click.stop
            ></video>
          </div>
        </div>
      </div>
      <button @click.stop="removeCard(index)" class="remove-card-btn">🗑️</button>
    </div>
    

    <canvas ref="canvas" class="canvas"></canvas>

    <div class="add-card-form">
      <input v-model="newCardName" placeholder="Novo card..." />
      <input type="file" multiple @change="handleMediaUpload" ref="fileInput" />
      <button @click="addCard">Adicionar Card</button>
      <RouterLink to="/hub">Ir para o HUB</RouterLink>
    </div>

    <!-- Modal para maximizar imagem -->
    <div v-if="modalImageUrl" class="modal" @click="closeModal">
      <img :src="modalImageUrl" alt="Imagem ampliada" />
      <button class="modal-close-btn" @click.stop="closeModal">✖</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
const route = useRoute(); 
const boardId = route.params.id;

watch(() => boardId, (newId) => {
  console.log('ID mudou para:', newId);
  // fazer algo com newId
});
function loadBoardContent(id) {
  console.log('Carregando board com ID:', id);
  // Aqui você faz a requisição para buscar os cards, por exemplo
}

watch(boardId, (id) => {
  if (id) {
    loadBoardContent(id);
  } else {
    console.warn('boardId não encontrado na rota.');
  }
}, { immediate: true });

defineOptions({ name: 'CrimeBoard' });
const items = ref([

]);

const newCardName = ref('');
const mediaFiles = ref([]);
const board = ref(null);
const canvas = ref(null);
const fileInput = ref(null);

let dragging = null;
let connections = ref([]);
let selectedCard = ref(null);

// Modal para imagem maximizada
const modalImageUrl = ref(null);

// Desenha as linhas entre cards conectados
const drawLines = () => {
  const ctx = canvas.value.getContext('2d');
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  const cardElements = board.value.querySelectorAll('.card');
  const boardRect = board.value.getBoundingClientRect();

  connections.value.forEach(([startIndex, endIndex]) => {
    const startEl = cardElements[startIndex];
    const endEl = cardElements[endIndex];

    if (!startEl || !endEl) return;

    const startRect = startEl.getBoundingClientRect();
    const endRect = endEl.getBoundingClientRect();

    // Calcula posição da tachinha (centro horizontal e 6px acima do topo)
    const startX = startRect.left + startRect.width / 2 - boardRect.left;
    const startY = startRect.top - 6 - boardRect.top;

    const endX = endRect.left + endRect.width / 2 - boardRect.left;
    const endY = endRect.top - 6 - boardRect.top;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#c62828';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  });
};

// Acumula arquivos de mídia
const handleMediaUpload = (event) => {
  const files = Array.from(event.target.files);
  const newMedia = files.map((file) => ({
    url: URL.createObjectURL(file),
    type: file.type.startsWith('video') ? 'video' : 'image',
    file: file, // importante para enviar depois
  }));
  mediaFiles.value = [...mediaFiles.value, ...newMedia];
  fileInput.value.value = null;
};

// Adiciona novo card
const addCard = async () => {
  if (newCardName.value.trim() !== '') {
    const formData = new FormData();
    formData.append('nome_card', newCardName.value); // API espera "nome_card"

      if (!boardId) {
      alert('ID do quadro (boardId) está ausente. Não é possível criar o card.');
      return;
    }

    formData.append('boardId', boardId);

    // Separa a imagem e o vídeo dos arquivos de mídia
    const imagem = mediaFiles.value.find(file => file.type === 'image');
    const video = mediaFiles.value.find(file => file.type === 'video');

    if (imagem && imagem.file) {
      formData.append('foto', imagem.file); // API espera "foto"
    }

    if (video && video.file) {
      formData.append('video', video.file); // API espera "video"
    }

    try {
      
      const token = localStorage.getItem('token'); // ou onde você guarda o token
      const response = await axios.post('http://localhost:3000/teorias/cad', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const newCardData = response.data;

      items.value.push({
        id: newCardData.id,                      // ID vindo do banco (essencial pro PUT)
        name: newCardData.nome_card,            // Nome do card
        x: newCardData.x,                       // Posição inicial do banco (pode ser 0)
        y: newCardData.y,
        foto: newCardData.foto,                 // Caminho da imagem no servidor
        video: newCardData.video,               // Caminho do vídeo no servidor
        media: [...mediaFiles.value],           // Mantém a mídia no board, se necessário
    });

      newCardName.value = '';
      mediaFiles.value = [];
    } catch (error) {
      console.error('Erro ao salvar card:', error);
    }
  }
};

// Remove card e suas conexões
const token = localStorage.getItem('token');

const removeCard = async (index) => {
  const card = items.value[index];
  console.log("Card a remover:", card);
  const id = card.id; // ← ID do banco de dados

  if (!id) {
    console.warn('ID não encontrado para o card');
    return;
  }

  if (!confirm(`Deseja excluir o card ?`)) return;

  try {
    await axios.delete(`http://localhost:3000/teorias/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Se sucesso, remove localmente
    items.value.splice(index, 1);

    connections.value = connections.value
      .filter(([s, e]) => s !== index && e !== index)
      .map(([s, e]) => [
        s > index ? s - 1 : s,
        e > index ? e - 1 : e,
      ]);

    drawLines();
    alert('Card deletado com sucesso!');
  } catch (error) {
    console.error("Erro ao deletar card:", error);
    alert("Erro ao deletar card");
    console.error("Erro ao deletar teoria:", error.message, error.stack);
  }
};

// Conecta dois cards
const connectCards = (startIndex, endIndex) => {
  if (
    startIndex !== endIndex &&
    !connections.value.some(
      ([s, e]) =>
        (s === startIndex && e === endIndex) ||
        (s === endIndex && e === startIndex)
    )
  ) {
    connections.value.push([startIndex, endIndex]);
    drawLines();
  }
};

// Desconecta cards
const disconnectCards = (startIndex, endIndex) => {
  connections.value = connections.value.filter(
    ([s, e]) =>
      !(
        (s === startIndex && e === endIndex) ||
        (s === endIndex && e === startIndex)
      )
  );
  drawLines();
};

// Seleciona card e conecta/desconecta
const selectCard = (index) => {
  if (selectedCard.value === null) {
    selectedCard.value = index;
  } else {
    const alreadyConnected = connections.value.some(
      ([s, e]) =>
        (s === selectedCard.value && e === index) ||
        (s === index && e === selectedCard.value)
    );

    if (alreadyConnected) {
      disconnectCards(selectedCard.value, index);
    } else {
      connectCards(selectedCard.value, index);
    }

    selectedCard.value = null;
  }
};

const clearSelection = () => {
  selectedCard.value = null;
};

// Funções para drag & drop dos cards
const startDrag = (event, index) => {
  dragging = { index, offsetX: event.offsetX, offsetY: event.offsetY };
  window.addEventListener('mousemove', drag);
  window.addEventListener('mouseup', stopDrag);
};

const drag = (event) => {
  if (dragging !== null) {
    const { index, offsetX, offsetY } = dragging;
    items.value[index].x = event.clientX - offsetX;
    items.value[index].y = event.clientY - offsetY;
    drawLines();
  }
};

const stopDrag = async () => {
  window.removeEventListener('mousemove', drag);
  window.removeEventListener('mouseup', stopDrag);

  if (dragging !== null) {
    const movedItem = items.value[dragging.index];

    if (!movedItem.id) {
      console.warn('Card sem ID, não pode ser atualizado.');
      dragging = null;
      return;
    }

    try {
      await axios.put(`http://localhost:3000/teorias/edit/${movedItem.id}`, {
        x: movedItem.x,
        y: movedItem.y,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar posição:', error);
    }

    dragging = null;
  }
};


// Abre modal com a imagem ampliada
const openModal = (url) => {
  modalImageUrl.value = url;
};

// Fecha modal
const closeModal = () => {
  modalImageUrl.value = null;
};

// Inicializa canvas e desenha linhas
onMounted(async () => {
  canvas.value.width = board.value.offsetWidth;
  canvas.value.height = board.value.offsetHeight;
  try {
    const token = localStorage.getItem('token');
    const boardId = route.params.id;

  const response = await axios.get(`http://localhost:3000/teorias/board/${boardId}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

    items.value = response.data.map(card => ({
      id: card.id,
      name: card.nome_card,
      x: card.x,
      y: card.y,
      foto: card.foto,
      video: card.video,
      media: [
         ...(card.foto ? [{ type: 'image', url: `http://localhost:3000/${card.foto}` }] : []),
         ...(card.video ? [{ type: 'video', url: `http://localhost:3000/${card.video}` }] : []),
      ]
    }));
    // Carrega as conexões
    const lineRes = await axios.get('http://localhost:3000/lines', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Mapeia os IDs para índices atuais
    const idToIndex = {};
    items.value.forEach((item, i) => {
      if (item.id) idToIndex[item.id] = i;
    });

    connections.value = lineRes.data
      .map(line => {
        const start = idToIndex[line.startCardId];
        const end = idToIndex[line.endCardId];
        return (start != null && end != null) ? [start, end] : null;
      })
      .filter(Boolean); // remove nulls

    drawLines();
  } catch (error) {
    console.error('Erro ao carregar cards:', error);
  }
});

const saveConnections = async () => {
  try {
    const token = localStorage.getItem('token');

    const linesToSave = connections.value.map(([startIndex, endIndex]) => ({
      startCardId: items.value[startIndex].id,
      endCardId: items.value[endIndex].id,
    }));

    await axios.post('http://localhost:3000/lines/save', {
      lines: linesToSave,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('🔗 Conexões salvas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao salvar conexões:', error);
  }
};

watch(connections, saveConnections, { deep: true });

watch(items, drawLines, { deep: true });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.board {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(187, 145, 90);
  background-image: url('https://www.transparenttextures.com/patterns/cork.png');
  overflow: hidden;
  border: 8px solid #2e1e12;
}

.card {
  position: absolute;
  background: #fffdfa;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  font-family: 'Special Elite', monospace;
  font-size: 16px;
  cursor: grab;
  user-select: none;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  transform: rotate(-1deg);
  z-index: 1;
  transition: transform 0.2s ease;
  max-width: 350px;
  width: auto;
  min-height: 60px;
  word-wrap: break-word;
  color: #000;
}

.card.selected {
  border: 2px solid #1976d2;
  box-shadow: 0 0 10px #1976d2;
  transform: scale(1.05) rotate(-1deg);
  z-index: 3;
}

.card:hover {
  transform: scale(1.03);
  z-index: 2;
}

.card .card-top-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #808080;
  border-radius: 4px 4px 0 0;
}

.card::before {
  content: '';
  width: 12px;
  height: 12px;
  background: red;
  border-radius: 50%;
  position: absolute;
  top: -6px;
  left: calc(50% - 6px);
  box-shadow: 0 0 2px #000;
  z-index: 10;
}

.card-content {
  margin-bottom: 10px;
}

.media-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.media-item img,
.media-item video {
  max-width: 150px;
  max-height: 150px;
  border-radius: 4px;
  cursor: pointer;
}

.remove-card-btn {
  margin-top: 8px;
  background: #d9534f;
  color: white;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 3px;
  float: right;
  font-size: 14px;
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.add-card-form {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: #fffdfa;
  padding: 10px;
  border-radius: 4px;
  font-family: 'Special Elite', monospace;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.add-card-form input[type="text"] {
  padding: 5px;
  margin-right: 5px;
  font-size: 14px;
}

.add-card-form input[type="file"] {
  margin: 5px 0;
}

.add-card-form button {
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Special Elite', monospace;
}

.add-card-form button:hover {
  background-color: #45a049;
}

/* Modal para imagem maximizada */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 6px;
  box-shadow: 0 0 15px #000;
}

.modal-close-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #d9534f;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  line-height: 32px;
  text-align: center;
  z-index: 10000;
  transition: background-color 0.2s ease;
}

.modal-close-btn:hover {
  background-color: #c9302c;
}
</style>
