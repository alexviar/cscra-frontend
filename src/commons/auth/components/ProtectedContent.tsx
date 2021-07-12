import { PropsWithChildren } from "react"
// import { Permisos } from "../constants"
import { User, useLoggedUser } from "../hooks"

// type Values<T> = T[keyof T] 

type Props = {
  authorize: (user: User) => boolean | undefined
}

export const ProtectedContent = ({
  authorize,
  children
}: PropsWithChildren<Props>) => {
  const loggedUser = useLoggedUser()

  const authorized = authorize(loggedUser)
  if(authorized || authorized === undefined && loggedUser?.isSuperUser()) return <>{children}</>


  return null
}