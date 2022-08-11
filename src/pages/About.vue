<template>
  <q-page padding class="row">
    <div class="col">
      <q-card>
        <q-card-section>
          <div class="column items-center q-gutter-md">
            <div style="position: relative">
              <img src="/svg/zisu.svg" width="128" />
              <q-badge color="orange" floating>{{ version }}</q-badge>
            </div>
            <img src="/svg/text.svg" height="64" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { version } from 'app/package.json'
</script>
