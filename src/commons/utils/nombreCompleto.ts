export function nombreCompleto(apellidoPaterno: string | null, apellidoMaterno: string, nombres: string){
  return (apellidoPaterno ? apellidoPaterno + " " : "") + `${apellidoMaterno}  ${nombres}`
}