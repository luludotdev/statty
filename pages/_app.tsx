import { AppProps } from 'next/app'

import '~styles/app.styl'

const NextApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default NextApp
