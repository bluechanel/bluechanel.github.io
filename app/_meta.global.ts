export default {
  index: {
    type: 'page'
  },
  docs: {
    title: 'Documentation',
    type: 'page',
    items: {
      'one-level': ''
    }
  },
  posts: {
    title: '博客',
    type: 'page',
    items: {
      draft: {
        display: 'hidden'
      }
    }
  },
  _: {
    type: 'page',
    href: 'https://nextra.site',
    title: 'Nextra Docs'
  }
}
