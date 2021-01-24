<template>
  <div class="container-sm mt-20">
    <div class="mx-5">
      <div v-if="!isLogin" class="flex items-center justify-center h-screen">
        <div
          class="bg-green-800 text-white font-bold rounded-lg border shadow-lg p-10"
        >
          <p>
            Welcome to the Chat App
          </p>
          <p class="font-light">
            Click the button below to sign in
          </p>
          <div
            class=" text-white font-bold rounded-lg flex items-center justify-center "
          >
            <button
              class=" bg-blue-500 rounded-lg hover:bg-blue-600 p-3 my-3"
              @click="signIn"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
      <Message
        v-else
        v-for="{ id, text, userPhotoURL, userName, userId } in messages"
        :key="id"
        :name="userName"
        :photo-url="userPhotoURL"
        :sender="userId === user?.uid"
      >
        {{ text }}
      </Message>
    </div>
  </div>

  <div ref="bottom" class="mt-20" />

  <div class="bottom">
    <div class="container-sm">
      <form v-if="isLogin" @submit.prevent="send">
        <input v-model="message" placeholder="Message" required />
        <button type="submit">
          <SendIcon />
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue'
import { useAuth, useChat } from '@/firebase'

import SendIcon from './SendIcon.vue'
import Message from './Message.vue'

export default {
  components: { Message, SendIcon },
  setup() {
    const { user, isLogin, signIn } = useAuth()
    const { messages, sendMessage } = useChat()

    const bottom = ref(null)
    watch(
      messages,
      () => {
        nextTick(() => {
          bottom.value?.scrollIntoView({ behavior: 'smooth' })
        })
      },
      { deep: true }
    )

    const message = ref('')
    const send = () => {
      sendMessage(message.value)
      message.value = ''
    }

    return { user, isLogin, signIn, messages, bottom, message, send }
  }
}
</script>
