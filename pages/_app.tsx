import { config, library } from '@fortawesome/fontawesome-svg-core'
import {
  faCheckCircle,
  faExclamationCircle,
  faQuestionCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import { showAd } from 'lib/ad'
import { AppProps } from 'next/app'

import '~styles/app.styl'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false
library.add(faCheckCircle, faExclamationCircle, faQuestionCircle, faTimesCircle)
showAd()

const NextApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default NextApp
