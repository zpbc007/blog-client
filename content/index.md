---
title: Introduction
description: ''
position: 1
category: 'Getting started'
features:
  - Feature 12
  - Feature 2
  - Feature 33
---

<img src="/preview.png" class="light-img" width="1280" height="640" alt=""/>
<img src="/preview-dark.png" class="dark-img" width="1280" height="640" alt=""/>

[Module]() for [NuxtJS](https://nuxtjs.org).

<alert type="success">

Your documentation has been created successfully!

</alert>

## Features

<list :items="features"></list>

<p class="flex items-center">Enjoy light and dark mode:&nbsp;<app-color-switcher class="inline-flex ml-2"></app-color-switcher></p>

```ts
hook('content:ready', async (content: any) => {
  const server = await createApolloServer(content)
  server.listen().then((serverInfo) => {
    nuxt.options.cli.badgeMessages.push(chalk.bold.blueBright('Yoda Docs'), '')
    nuxt.options.cli.badgeMessages.push(
      `${chalk.bold('Graphql Playground:')} ${chalk.underline.yellow(
        serverInfo.url
      )}`
    )
  })
})
```
