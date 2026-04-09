'use client'

import { useState, useEffect } from 'react'

const QUOTES = [
  { text: '行动是治愈恐惧的良药', author: '威廉·詹姆斯' },
  { text: '不要等待，时机永远不会恰到好处', author: '拿破仑·希尔' },
  { text: '成功不是终点，失败也不是终局', author: '温斯顿·丘吉尔' },
  { text: '你今天的所作所为，决定了明天的你', author: '拿破仑·希尔' },
  { text: '不要用战术上的勤奋，掩盖战略上的懒惰', author: '雷军' },
  { text: '保持好奇，永远年轻', author: '史蒂夫·乔布斯' },
  { text: '最好的时间管理就是不要浪费时间', author: '无名' },
  { text: '写代码的时候别忘了喝咖啡', author: '小橘' },
  { text: '每天进步一点点，一年后的你会感谢今天的自己', author: '无名' },
  { text: '别想太多，做了再说', author: '无名' },
]

export default function Quote() {
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)])

  return (
    <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-4">
      <p className="text-slate-300 text-sm italic leading-relaxed">"{quote.text}"</p>
      <p className="text-slate-500 text-xs mt-2 text-right">— {quote.author}</p>
    </div>
  )
}
