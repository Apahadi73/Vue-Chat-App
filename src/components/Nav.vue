<template>
  <nav>
    <div>
      <h1><strong>Chat</strong> App</h1>

      <!-- displays avatar and sign out button if the user is logged in -->
      <div v-if="isLogin" class="login">
        <Avatar :src="user.photoURL" />
        <button class="text-red-400 hover:text-white" @click="signOut">
          Sign Out
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import Avatar from './Avatar.vue'
import { useAuth } from '@/firebase'

export default {
  components: { Avatar },
  setup() {
    const { user, isLogin, signOut, signIn } = useAuth()
    return { user, isLogin, signOut, signIn }
  }
}
</script>
