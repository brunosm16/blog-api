import '../models/authentication'
export interface Authentication {
  auth: (AuthenticationModel) => Promise<string | null>
}
