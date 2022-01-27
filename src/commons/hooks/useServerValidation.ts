import { useEffect } from "react"
import {AxiosError } from "axios"
import { FieldPath, UseFormSetError } from "react-hook-form"

const identity = (key: string) => key as any

export const useServerValidation = <Inputs>(error: AxiosError | undefined, setError: UseFormSetError<Inputs>, keyMapper: (serverKey: string) => FieldPath<Inputs> = identity)=>{
  useEffect(()=>{
    if(error?.response?.status == 422){
      const { errors } = error.response.data
      Object.keys(errors).forEach((key: string)=>{
        let localKey = keyMapper(key)
        setError(localKey, {type: "serverError", message: errors[key]})
      })
    }
  }, [error])
}