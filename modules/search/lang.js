const enhanceLunr = (lunr, langs) => {
  if (langs.length) {
    require('lunr-languages/lunr.stemmer.support')(lunr)
    langs.forEach((name) => {
      if (name !== 'en') {
        try {
          if (name === 'jp' || name === 'ja') {
            return require(`lunr-languages/tinyseg`)(lunr)
          }
          // 添加中文支持
          if (name === 'zh') {
            return require('./zh')(lunr)
          }
          require(`lunr-languages/lunr.${name}`)(lunr)
        } catch (e) {
          console.error(e)
        }
      }
    })
  }
}

module.exports = {
  enhanceLunr,
}
