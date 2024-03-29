import React from 'react'
import { useTranslation } from 'react-i18next'

import { SelectBox } from 'shared/ui'
import { type SuggestType } from 'shared/types'
import { type LanguageType, useLanguage } from 'shared/config/language/lib'

import { OptionsForSelect } from '../lib/SelectOptions'

export const SelectLanguage = () => {
  const {
    t: translation,
    i18n: { changeLanguage },
  } = useTranslation()
  const { lang: language } = useLanguage()

  const handleChangeLanguage = (value: SuggestType['id']) => {
    const stringValue = value as LanguageType
    void changeLanguage(stringValue)
  }

  const options = OptionsForSelect(translation)

  return (
    <SelectBox
      value={language ?? 'ru'}
      options={options}
      onChange={handleChangeLanguage}
    />
  )
}
