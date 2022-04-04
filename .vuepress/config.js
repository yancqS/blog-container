module.exports = {
  title: 'Yoha\'s Blog',
  description: '道虽迩，不行不至；事虽小，不为不成',
  markdown: {
    lineNumbers: true
  },
  head: [
    ['link', {
      rel: 'icon',
      href: `/favicon.ico`
    }]
  ],
  base: '/',
  theme: "vuepress-theme-custom",
  themeConfig: {
    heroImage: 'https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211027231332.jpeg',
    summaryLength: 300,
    translations: {
      read_more: 'Keep reading!',
      read_this_post: 'Read this post now!',
    },
    lastUpdated: 'Last Updated',
    cookies: {
      theme: 'dark-lime',
      buttonText: 'Got it!',
      message: 'We use cookies!',
    },
    summary: true,
    nav: [
      {
        text: 'Home',
        link: '/',
        icon: 'el-icon-house',
      },
      {
        text: 'Life',
        link: '/lifes/',
        icon: 'el-icon-lollipop',
      },
      {
        text: 'Handbook',
        link: '/handbooks/',
        icon: 'el-icon-s-management',
      },
      {
        text: 'Emoji',
        link: '/emoji/',
        emoji: '💕'
      },
    ],
    about: {
      fullName: 'Qing',
      bio: '科幻迷😄  漫威粉🤟  爱前端🥰  爱米线🌟  搓炉石🎮  LOL云玩家🎮  被写代码耽误的大厨🤣',
      image: 'https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211027232539.jpeg',
    },
    logo: 'https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210414163022.jpeg',
    friendlink: [
      {
        name: '阮一峰个人网站',
        link: 'http://www.ruanyifeng.com/home.html'
      },
      {
        name: 'MDN',
        link: 'https://developer.mozilla.org/zh-CN/'
      },
      {
        name: 'Hitokoto',
        link: 'https://hitokoto.cn/'
      }
    ],
    sitemap: true,
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/yancqs',
        },
        {
          type: 'weibo',
          link: 'https://weibo.com/superYoha',
        },
        {
          type: 'zhihu',
          link: 'https://www.zhihu.com/people/yoha-32-56',
        }
      ],
      copyright: [
        {
          text: 'Privacy Policy',
          link: 'https://policies.google.com/privacy?hl=en-US',
        },
        {
          text: `MIT Licensed Copyright © 2018-${new Date().getFullYear()}`,
          link: '',
        },
      ],
    },
    busuanzi: {
      enable: true
    }
  },
  plugins: [
    'reading-progress',
    'vuepress-plugin-mathjax',
    'vuepress-plugin-reading-time',
    [
      'vuepress-plugin-medium-zoom',
      {
        selector: '.content__default img',
        delay: 1000,
        options: {
          margin: 24,
          background: '#fff',
          scrollOffset: 0,
        },
      },
    ]
  ],
}