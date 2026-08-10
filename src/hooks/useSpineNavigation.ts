'use client'

import { useCallback, useEffect, useState } from 'react'
import { useScrollSpy } from './useScrollSpy'
import { SPINE_CHAPTER_EVENT, SPINE_GOTO_EVENT, type SpineChapterDetail } from '@/components/sections/spine/chapters'

const TRAILING_IDS = ['skills', 'achievements', 'contact']

/**
 * The single source of truth for "where is the user in the homepage story,"
 * shared by the Header nav and the left ScrollProgressRail. Chapter 0-3
 * comes from whichever spine renderer is mounted (via a window event, so
 * this hook never needs to know or care which one) — chapter 4-5 comes from
 * a normal scrollspy over the trailing in-flow sections, which wins
 * whenever it reports something (see ScrollProgressRail's original
 * reasoning: scrollspy naturally reflects "we've scrolled past the pin").
 */
export function useSpineNavigation() {
  const [spineChapter, setSpineChapter] = useState(0)
  const trailingActive = useScrollSpy(TRAILING_IDS, 200)

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<SpineChapterDetail>).detail
      if (detail && typeof detail.chapter === 'number') setSpineChapter(detail.chapter)
    }
    window.addEventListener(SPINE_CHAPTER_EVENT, handler)
    return () => window.removeEventListener(SPINE_CHAPTER_EVENT, handler)
  }, [])

  let activeIndex = spineChapter
  if (trailingActive === 'skills') activeIndex = 4
  else if (trailingActive === 'achievements' || trailingActive === 'contact') activeIndex = 5

  const gotoChapter = useCallback((chapter: number) => {
    window.dispatchEvent(new CustomEvent<SpineChapterDetail>(SPINE_GOTO_EVENT, { detail: { chapter } }))
  }, [])

  return { activeIndex, spineChapter, trailingActive, gotoChapter }
}
