import Head from 'next/head'
import { FC } from 'react'

interface RequiredProps {
  siteName: string
}

interface OptionalProps {
  description: string
  image: string
  colour: string
}

export const Meta: FC<RequiredProps & Partial<OptionalProps>> = ({
  siteName,
  description,
  image,
  colour,
}) => {
  const site = `${siteName} • Statty`

  return (
    <Head>
      <title>{site}</title>

      <meta property='og:type' content='website' />
      <meta property='og:title' content={siteName} />
      <meta property='og:site_name' content='Statty' />

      {description && <meta property='og:description' content={description} />}
      {image && <meta property='og:image' content={image} />}
      {colour && <meta name='theme-color' content={colour} />}
    </Head>
  )
}
