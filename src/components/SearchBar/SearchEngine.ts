import Pinyin from 'pinyin'
import Jieba from 'js-jieba'
// @ts-ignore
import { JiebaDict, HMMModel, UserDict, IDF, StopWords } from 'jieba-zh-cn'

// 中文分词（使用jieba）
const jieba = Jieba(JiebaDict, HMMModel, UserDict, IDF, StopWords)

export interface DataItem {
  lon: string
  lat: string
  name: string
  area: string
  address: string
}

export default class SearchEngine {
  indexedData: {
    original: DataItem
    pinyin: string
    initials: string
    segments: string[] // 分词结果（如：['苹果', '水果']）
    allKeys: string[]
  }[]
  constructor(list: DataItem[]) {
    // 空构造函数，实际初始化请用静态 async 方法
    this.indexedData = list.map((item) => {
      // 生成拼音（全拼）和首字母
      const name = item.name
      const pinyin = Pinyin(name, { style: Pinyin.STYLE_NORMAL }).join('')
      const initials = Pinyin(name, { style: Pinyin.STYLE_INITIALS }).join('').toLowerCase()

      const segments = jieba.cut(name) // 精确模式，返回数组

      return {
        original: item,
        pinyin,
        initials,
        segments, // 分词结果（如：['苹果', '水果']）
        allKeys: [
          // 合并所有可搜索关键词
          name,
          pinyin,
          initials,
          ...segments,
        ].map((key) => key.toLowerCase()), // 统一小写
      }
    })
  }

  /**
   * 模糊搜索主方法
   * @param {string} keyword - 搜索关键词（支持中文、拼音、首字母、混合输入）
   * @returns {Array} 匹配结果数组（按匹配度排序）
   */
  search(keyword: string) {
    const cleanKeyword = keyword.trim().toLowerCase()
    if (!cleanKeyword) return []

    // 拆分关键词（支持空格分隔的多个关键词）
    const keywords = cleanKeyword.split(/\s+/).filter((k) => k)

    return this.indexedData
      .map((item) => {
        // 计算匹配分数：匹配的关键词数量越多、位置越前，分数越高
        const matches = item.allKeys.reduce((acc, key, index) => {
          const isMatch = keywords.some((kw) => key.includes(kw))
          return isMatch ? acc + (100 - index) : acc // 前缀匹配权重更高
        }, 0)

        return {
          item: item.original,
          score: matches,
          segments: item.segments, // 保留分词结果（可选）
        }
      })
      .filter((result) => result.score > 0) // 过滤无匹配项
  }
}
