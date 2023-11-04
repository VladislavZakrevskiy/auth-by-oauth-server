import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { GitHubUser } from '@/types/users/github';

@Injectable()
export class ProvidersService {
  private readonly client: OAuth2Client;
  private readonly config: ConfigService;
  private readonly http: HttpService;

  constructor(config: ConfigService, httpService: HttpService) {
    this.config = config;
    this.http = httpService;
    this.client = new OAuth2Client(
      config.get('GOOGLE_CLIENT_ID'),
      config.get('GOOGLE_CLIENT_SECRET'),
    );
  }

  async Google(token: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: this.config.get('GOOGLE_CLIENT_ID'),
    });
    const userData = ticket.getPayload();
    return { accessToken: token, user: userData };
  }

  async Github(code: string) {
    const data = await this.http.axiosRef.post<
      void,
      AxiosResponse<{ access_token: string }>
    >('https://github.com/login/oauth/access_token', undefined, {
      headers: { 'Content-Type': 'application/json' },
      params: {
        client_id: this.config.get('GITHUB_CLIENT_ID'),
        client_secret: this.config.get('GITHUB_CLIENT_SECRET'),
        code,
      },
    });

    const accessToken = new URLSearchParams(data.data).get('access_token');

    // Fetch the user's GitHub profile
    const res = await this.http.axiosRef.get<void, AxiosResponse<GitHubUser>>(
      'https://api.github.com/user',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'zustand-reactQueryV5-tailwind-bulletproof',
        },
      },
    );
    return { accessToken, user: res.data };
  }

  async Vk(code: string) {
    const data = await this.http.axiosRef.post<
      void,
      AxiosResponse<{ access_token: string }>
    >('https://oauth.vk.com/access_token', undefined, {
      headers: { 'Content-Type': 'application/json' },
      params: {
        client_id: this.config.get('VK_CLIENT_ID'),
        client_secret: this.config.get('VK_CLIENT_SECRET'),
        redirect_uri: 'http://localhost:5173/oauth/success', // такой же как у client (при измениниях менять везде)
        code,
        v: '5.154',
      },
    });

    const accessToken = data.data.access_token;

    // Fetch the user's GitHub profile
    const res = await this.http.axiosRef.get<void, AxiosResponse<GitHubUser>>(
      'https://api.vk.com/method/users.get',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          v: '5.154',
        },
        params: {
          v: '5.154',
        },
      },
    );
    console.log(res.data);
    return { accessToken, user: res.data };
  }
}
