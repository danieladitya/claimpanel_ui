import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Users from '@/views/Users.vue'
import Products from '@/views/Products.vue'
import Settings from '@/views/Settings.vue'
import Claim from '@/views/ClaimList.vue'
import Claimdetail from '@/views/ClaimDetail.vue'
import Login from '@/views/Login.vue'
import SettingTypeDocument from '@/views/SettingTypeDocument.vue'
import CrossCheckRulesView from '@/views/CrossCheckRulesView.vue'
const routes = [
  
  {
    path : '/', 
    name : 'Login', 
    component :Login
  },
  {
    path: '/admin',
    name: 'dashboard',
    component: Dashboard, 
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/users',
    name: 'users',
    component: Users,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/products',
    name: 'products',
    component: Products,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/settings',
    name: 'settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    redirect: '/admin'
  }, 
  {
    path: '/admin/claim',
    name: 'claim',
    component: Claim,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/claims/:id',
    name: 'claim-detail',
    component: Claimdetail,
    meta: { requiresAuth: true }
  }, 
  {
    path: '/admin/settings/document_type', 
    name: 'document-type', 
    component: SettingTypeDocument
  }, 
  {
    path: '/admin/settings/cross_check_rules',
    name: 'crosscheckrules',
    component: CrossCheckRulesView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from , next)=>{
  const token = localStorage.getItem('access_token');
  if(to.meta.requiresAuth && !token){
    next('/login');
  }else{
    next();
  }
})
export default router