// Puerto secundario: TokenServicePort
// Define el contrato que debe cumplir cualquier implementación de tokens
export class TokenServicePort {
  sign(_payload)  { throw new Error('sign no implementado'); }
  verify(_token)  { throw new Error('verify no implementado'); }
}
