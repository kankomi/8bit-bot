import fs from 'fs'
import nodeHtmlToImage from 'node-html-to-image'
import logger from '../../utils/logging'

export default async function createBanner(
  username: string,
  level: number,
  exp: number,
  expNextLevel: number,
  avatarUrl: string
): Promise<Buffer | null> {
  try {
    const html = fs.readFileSync('./src/services/banner/banner.html').toString()
    const image = (await nodeHtmlToImage({
      puppeteerArgs: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
      html,
      content: {
        username,
        avatarUrl,
        level,
        exp: exp < 1000 ? exp : `${(exp / 1000).toFixed(1)}k`,
        expNextLevel: expNextLevel < 1000 ? expNextLevel : `${(expNextLevel / 1000).toFixed(1)}k`,
        levelPercent: Math.round((exp / expNextLevel) * 100),
      },
    })) as Buffer

    return image
  } catch (err) {
    logger.error(err)
  }
  return null
}
