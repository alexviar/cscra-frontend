import { PropsWithChildren } from "react"
// import { Permisos } from "../constants"
import { User, useUser } from "../hooks"
import { superUserPolicyEnhancer } from "../utils"


type Props = {
  authorize: (user: User) => boolean | undefined
}

export const ProtectedContent = ({
  authorize,
  children
}: PropsWithChildren<Props>) => {
  const user = useUser()

  if(superUserPolicyEnhancer(authorize)(user)) return <>{children}</>


  return null
}