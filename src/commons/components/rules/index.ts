import { RegisterOptions, ValidationRule } from "react-hook-form"
import { validation } from "../../../configs/messages.json"

export const required = (): RegisterOptions["required"] => ({
  value: true,
  message: validation.required
})

export const maxLength = (length: number): RegisterOptions["maxLength"]=>({
  value: length,
  message: validation.maxLength.format(length)
})

export const pattern = (pattern: RegExp): RegisterOptions["pattern"] =>({
  value: pattern,
  message: validation.pattern.format("XXX-XXXXX")
})