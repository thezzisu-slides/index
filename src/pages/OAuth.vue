<template>
  <q-page padding class="row">
    <div class="col">
      <q-card flat> Loading... </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { loginCallback } from 'src/utils/account'
import { useRoute } from 'vue-router'

const route = useRoute()

;(async function () {
  try {
    const { code, state } = route.query
    let href = route.params.href
    if (
      typeof code !== 'string' ||
      typeof state !== 'string' ||
      typeof href !== 'string'
    )
      throw new Error('Bad parameters')
    href = atob(href)
    await loginCallback(code, state, href)
  } catch (e) {
    //
  }
})()
</script>
