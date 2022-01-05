import { authClient, apiClient } from "../../../commons/services"
import { User } from "../state"

export const AuthService = {
  login: async (username: string, password: string, remember_me: boolean) => {
    await authClient.get("sanctum/csrf-cookie")
    return await authClient.post<User>("login", {
      username,
      password,
      remember_me
    })
  },
  logout: () => {
    return authClient.post("logout")
  },
  fetch: () => {
    return apiClient.get<User>("user")
  }
}