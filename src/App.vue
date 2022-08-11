<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="app-header">
      <q-toolbar class="q-px-none text-black">
        <q-btn stretch flat href="https://zisu.dev">
          <img src="/svg/zisu.svg" width="24" />
        </q-btn>
        <q-btn stretch flat no-caps no-wrap class="app-logo">
          <img class="app-logo__text" src="/svg/textvar.svg" />
        </q-btn>
        <q-space />
        <q-btn
          stretch
          flat
          icon="mdi-github"
          target="_blank"
          href="https://github.com/thezzisu-slides/index"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding class="row q-gutter-sm items-start content-start">
        <q-card flat class="col-12 text-center">
          <q-card-section>
            <div class="text-h5">Choose a slide to continue</div>
            <div class="text-overline">
              Generated on {{ new Date(info.generated).toLocaleString() }}
            </div>
          </q-card-section>
        </q-card>
        <q-card
          v-for="(slide, i) of info.slides"
          :key="i"
          class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
        >
          <q-img
            :src="`https://opengraph.githubassets.com/${hashstr}/${info.owner}/${slide.repo.name}`"
          >
            <div class="absolute-bottom text-subtitle2 text-left">
              {{ slide.name }}
            </div>
          </q-img>
          <q-card-section>
            {{ slide.description }}
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat icon="mdi-open-in-new" :href="`/${slide.slug}/`" />
            <q-btn
              flat
              icon="mdi-github"
              :href="`https://www.github.com/${info.owner}/${slide.repo.name}`"
            />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>

    <q-footer elevated>
      <div class="row justify-center">
        <div>
          <code>&copy; thezzisu {{ new Date().getFullYear() }}</code>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import info from 'virtual:slides'

const hashstr = Math.floor(Date.now() / 3600000).toString(36)
</script>

<style lang="scss">
.app-header {
  background-color: #e4eef3bf;
  backdrop-filter: blur(10px);
}

.app-logo {
  &__text {
    height: 32px;
    vertical-align: center;
    margin-bottom: -4px;
  }
}

.app-nav {
  background: #f2f2f2cc;
  backdrop-filter: blur(10px);
}
</style>
