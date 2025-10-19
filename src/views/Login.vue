<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const response = await api.post("/auth/login", {
      username: username.value,
      password: password.value,
    });

    const { access_token, token_type, user } = response.data;

    // Simpan token & user ke localStorage
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("token_type", token_type);
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect ke dashboard
    router.push("/admin");
  } catch (error: any) {
    errorMessage.value = error.response?.data?.detail || "Login gagal";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
      <h2 class="mb-4 text-2xl font-bold text-center text-gray-700">Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-600">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-600">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <p v-if="errorMessage" class="mt-3 text-sm text-center text-red-500">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
