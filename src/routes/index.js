import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Cadastro from '../components/Cadastro.vue';
import Hub from '@/components/Hub.vue';
import Feed from '@/components/Feed.vue';
import CrimeBoard from '@/components/CrimeBoard.vue'
const routes = [
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro },
  { path: '/', redirect: '/login' },
  { path: '/hub', component: Hub },
  { path: '/feed', component: Feed },
  { path: '/crimeboard/:id', name: 'CrimeBoard', component: CrimeBoard }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;