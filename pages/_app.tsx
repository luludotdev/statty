import { config, library } from '@fortawesome/fontawesome-svg-core'
import {
  faCheckCircle,
  faExclamationCircle,
  faQuestionCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import { showAd } from 'lib/ad'
import { AppProps } from 'next/app'

import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false
library.add(faCheckCircle, faExclamationCircle, faQuestionCircle, faTimesCircle)
showAd()

const NextApp = ({ Component, pageProps }: AppProps) => (
  <>
    <style jsx global>
      {`
        html, body
          box-sizing border-box

        *, *:before, *:after
          box-sizing inherit

        body
          margin 0
          padding 2rem
          font 16px/1.5 system-ui, sans-serif
      `}
    </style>

    <Component {...pageProps} />
  </>
)

export default NextApp
