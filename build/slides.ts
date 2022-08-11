import fs from 'fs-extra'
import { dirname, join } from 'path'
import { Plugin, ResolvedConfig } from 'vite'
import { Octokit } from '@octokit/rest'
import { fileURLToPath } from 'url'
import 'zx/globals'

export interface ISlidesPluginOptions {
  owner: string
  isOrg?: boolean
  ignore?: (string | RegExp)[]
}

type ResolvedPluginOptions = {
  [key in keyof ISlidesPluginOptions]-?: ISlidesPluginOptions[key]
}

export interface ISlideConfig {
  slug?: string
  name?: string
  description?: string
}

export interface ISlideInfo {
  slug: string
  name: string
  description: string
  repo: {
    name: string
    url: string
  }
}

export interface ISlidesInfo {
  owner: string
  generated: number
  slides: ISlideInfo[]
}

const __dirname = dirname(fileURLToPath(import.meta.url))

function isMatched(str: string, pat: string | RegExp) {
  if (typeof pat === 'string') {
    return str === pat
  } else {
    return pat.test(str)
  }
}

export async function prepare(
  options: ResolvedPluginOptions,
  viteConfig: ResolvedConfig
) {
  const IS_DEV = viteConfig.mode === 'development'
  const cache = join(__dirname, 'cache')
  await fs.ensureDir(cache)
  cd(cache)

  const kit = new Octokit()
  const resp = options.isOrg
    ? kit.repos.listForOrg({ org: options.owner })
    : kit.repos.listForUser({ username: options.owner })

  const repos = await resp.then(({ data }) =>
    data.filter(
      (repo) => !options.ignore.some((item) => isMatched(repo.name, item))
    )
  )

  /** @type {import('./slides').ISlidesInfo} */
  const info = {
    owner: options.owner,
    generated: Date.now(),
    /** @type {any[]} */
    slides: []
  }

  for (const repo of repos) {
    console.log(chalk.blueBright(`Preparing ${repo.name}`))
    const loc = repo.name.toLowerCase()

    console.log(chalk.blueBright(`=> [${repo.name}] Fetch code`))
    if (await fs.pathExists(loc)) {
      cd(loc)
      await $`git fetch --all`
      await $`git reset --hard origin/HEAD`
    } else {
      await $`git clone ${repo.clone_url} ${loc}`
      cd(loc)
    }

    let slideInfo: ISlideConfig = {}
    if (await fs.pathExists(join(cache, loc, 'slide.json'))) {
      slideInfo = await fs.readJSON(join(cache, loc, 'slide.json'))
    }

    const slug = slideInfo.slug ?? loc

    if (IS_DEV) {
      console.log(chalk.blueBright(`=> [${repo.name}] Build is skipped`))
    } else {
      console.log(chalk.blueBright(`=> [${repo.name}] Install dependencies`))
      await $`yarn`

      console.log(chalk.blueBright(`=> [${repo.name}] Build`))
      $.env.SLIDE_BASE = `/${slug}/`
      await $`yarn build`
    }

    cd('..')
    info.slides.push({
      slug,
      name: slideInfo.name ?? repo.name,
      description: slideInfo.description ?? repo.description ?? '',
      repo: {
        name: repo.name,
        url: repo.html_url
      }
    })
  }

  await fs.writeJSON(join(cache, 'info.json'), info, { spaces: 2 })
  return info
}

function resolvePluginOptions(
  options: ISlidesPluginOptions
): ResolvedPluginOptions {
  return {
    owner: options.owner,
    isOrg: options.isOrg ?? true,
    ignore: options.ignore ?? ['index', /template/]
  }
}

export default function slides(_options: ISlidesPluginOptions): Plugin {
  const options = resolvePluginOptions(_options)
  const prefix = 'virtual:slides'
  let viteConfig: ResolvedConfig
  let info: ISlidesInfo

  return {
    name: 'content',
    configResolved(config) {
      viteConfig = config
    },
    async buildStart() {
      info = await prepare(options, viteConfig)
    },
    resolveId(id) {
      if (id.startsWith(prefix)) {
        return '\0' + id
      }
    },
    load(id) {
      if (id.startsWith('\0' + prefix)) {
        if (id === '\0' + prefix) {
          return `export default ${JSON.stringify(info)}`
        }
      }
    },
    async writeBundle() {
      for (const slide of info.slides) {
        const loc = join(
          __dirname,
          'cache',
          slide.repo.name.toLowerCase(),
          'dist'
        )
        const dst = join(viteConfig.build.outDir, slide.slug)
        await fs.emptyDir(dst)
        await fs.copy(loc, dst)
      }
    }
  }
}
