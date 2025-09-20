const theme = {
  chalk: {
    backgroundColor: '#161522',
    titleColor: '#fff',
    logoSrc: 'logo_dark.png',
    themeSrc: 'qiehuan_dark.png',
    headerBorderSrc: 'header_border_dark.png'
  },
  vintage: {
    backgroundColor: '#eee',
    titleColor: '#000',
    logoSrc: 'logo_light2.png',
    themeSrc: 'qiehuan_light.png',
    headerBorderSrc: 'header_border_light.png'
  }
}

export function getThemeValue (themeName) {
  return theme[themeName]
}
