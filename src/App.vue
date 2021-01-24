<template>
  <Nav />
  <Chat />
</template>

<script>
import { defineAsyncComponent } from 'vue'
import Nav from '@/components/Nav.vue'
// lazy load the chat app
const Chat = defineAsyncComponent(() => import('@/components/Chat.vue'))

export default {
  name: 'App',
  components: { Nav, Chat }
}
</script>
