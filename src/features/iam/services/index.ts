import axios from "axios";
import apiClient from "../../../commons/services/apiClient"
import { User } from "../../auth/state";
import { Role } from "../state";

export const Users = {
  loadAll: (page: {
    current: number,
    size: number
  }, filter: {
    username?: string,
    active?: number,
    externalId?: number
  })=>{
    return apiClient.get<{
      meta: {total: number},
      records: User[]
    }>('/users', {
      params: {
        page,
        filter
      }
    })
  },
  load: (userId: number) =>{
    return apiClient.get<User>(`/users/${userId}`)
  },
  register: ({username, password, externalId: external_id, roleIds: role_ids}: {
    username: string,
    password: string,
    roleIds: number[],
    externalId: number  
  }) => {
    return apiClient.post('/users', {
      username, password, external_id, role_ids
    })
  },
  update: ({id, username, roleIds: role_ids}: {
    id: number,
    username: string,
    roleIds: number[]
  }) => {
    return apiClient.put(`/users/${id}`, {
      username, role_ids
    })
  }
}

export const Roles = {
  fetchAll: ()=>{
    return apiClient.get<Role[]>('/roles')
  },
  fetch: (roleId: number)=>{
    return apiClient.get<Role>(`/roles/${roleId}`)
  },
  register: (data: Role) => {
    return apiClient.post<Role>('roles', data)
  },
  update: (data: Role) => {
    return apiClient.put<Role>(`roles/${data.id}`, data)
  }
}

export const Permissions = {
  fetchAll: ()=>{
    return apiClient.get<string[]>('/permissions')
  }
}