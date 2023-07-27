import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type HttpGetClient } from '@/infra/http'

type AppToken = {
  access_token: string
}

type DebugToken = {
  data: {
    user_id: string
  }
}

type UserInformation = {
  id: string
  name: string
  email: string
}

export class FacebookApi implements LoadFacebookUserApi {
  private readonly BASE_FACEBOOK_URL = 'https://graph.facebook.com'

  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const userInformation = await this.getUserInformation(params.token)
    return {
      facebookId: userInformation.id,
      name: userInformation.name,
      email: userInformation.email
    }
  }

  private async getAppToken (): Promise<AppToken> {
    return this.httpClient.get({
      url: `${this.BASE_FACEBOOK_URL}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken (clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken()
    return this.httpClient.get({
      url: `${this.BASE_FACEBOOK_URL}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken
      }
    })
  }

  private async getUserInformation (clientToken: string): Promise<UserInformation> {
    const debugToken = await this.getDebugToken(clientToken)
    return this.httpClient.get({
      url: `${this.BASE_FACEBOOK_URL}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }
}
