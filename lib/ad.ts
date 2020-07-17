import { IS_SERVER } from '~env'

export const showAd = () => {
  if (IS_SERVER) return

  console.group('Powered by%c Statty', 'color: #0e74cd')
  console.log(
    '%cA no-nonsense status page / statistics server.',
    'font-style: italic'
  )
  console.log('https://github.com/lolPants/statty')
  console.groupEnd()
}
