module.exports = {
  title: 'Yoha\'s Blog',
  description: 'Blog is mainly used to record daily learning',
  markdown: {
    lineNumbers: true
  },
  head: [
    ['link', {
      rel: 'icon',
      href: `/favicon.ico`
    }]
  ],
  base: '/blog/',
  theme: "vuepress-theme-custom",
  summaryLength: 100,
  themeConfig: {
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
    ],
    posts: {
      prepend: "Hi, I hope you'll <i>enjoy</i> this post!",
      append: "Hi, I hope you've <b>enjoyed</b> this post!",
    },
    about: {
      fullName: 'Qing',
      bio: '科幻迷😄  漫威粉🤟  爱前端🥰  爱米线🌟  搓炉石🎮  LOL云玩家🎮',
      image: 'https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201018002803.jpg',
    },
    logo: 'https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210414163022.jpeg',
    friendlink: [
      {
        name: '阮一峰个人网站',
        link: 'http://www.ruanyifeng.com/home.html'
      },
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
          text: `MIT Licensed Copyright © ${new Date().getFullYear()}-present`,
          link: '',
        },
      ],
    }
  },
  plugins: [
    'reading-progress',
    'vuepress-plugin-mathjax',
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