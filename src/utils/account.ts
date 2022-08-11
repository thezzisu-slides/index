import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

const CLIENT_ID = <string>import.meta.env.VITE_GITHUB_APP_ID
const CLIENT_SECRET = <string>import.meta.env.VITE_GITHUB_APP_SECRET
const loginState = useLocalStorage('account:login_state', '')
export const token = useLocalStorage('account:user_token', '')
export const isLoggedIn = computed(() => !!token.value)

export function login() {
  loginState.value = Math.random().toString(36).substring(2, 15)
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: window.location.origin + '/oauth/' + btoa(location.href),
    scope: 'user',
    state: loginState.value
  })
  const loginUrl = `https://github.com/login/oauth/authorize?${params.toString()}`
  window.location.href = loginUrl
}

export async function loginCallback(code: string, state: string, href: string) {
  if (state !== loginState.value) throw new Error('Invalid state')

  loginState.value = ''
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code
  })
  const url = `https://github.com/login/oauth/access_token?${params.toString()}`
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    }
  })
  const { access_token } = await resp.json()
  token.value = access_token
  window.location.href = href
}
