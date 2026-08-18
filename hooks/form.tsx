import { createFormHook } from '@tanstack/react-form'

import ComboboxField from '@/components/block/form/combobox-field'
import GalleryUploadField from '@/components/block/form/gallery-upload-field'
import NumberField from '@/components/block/form/number-field'
import PasswordField from '@/components/block/form/password-field'
import RatingField from '@/components/block/form/rating-field'
import RichTextEditorField from '@/components/block/form/rich-text-editor-field'
import SelectField from '@/components/block/form/select-field'
import SelectGroupField from '@/components/block/form/select-group-field'
import SliderField from '@/components/block/form/slider-field'
import SubmitButton from '@/components/block/form/submit'
import SwitchField from '@/components/block/form/switch-field'
import TextField from '@/components/block/form/text-field'
import TextareaField from '@/components/block/form/textarea-field'

import { fieldContext, formContext } from './form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    NumberField,
    PasswordField,
    SelectField,
    SelectGroupField,
    ComboboxField,
    SliderField,
    SwitchField,
    TextareaField,
    RatingField,
    GalleryUploadField,
    RichTextEditorField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})
