import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../services';
import { ConfigService } from '@nestjs/config';
import { Role, User } from '@prisma/client';
import { ProvidersService } from '../services/providers.service';
import { Providers } from '@prisma/client';
import { GoogleUser } from '@/types/users/google';
import { GitHubUser } from '@/types/users/github';
import { VkUser } from '@/types/users/vk';

const isGoogleUser = (user: any): user is GoogleUser => {
  return user?.iss;
};

const isGithubUser = (user: any): user is GitHubUser => {
  return user?.public_repos;
};

const isVkUser = (user: any): user is VkUser => {
  return user?.can_access_closed !== undefined;
};

@Injectable()
export class Authorized implements CanActivate {
  private prisma: PrismaService;
  private providers: ProvidersService;
  private readonly config: ConfigService;

  constructor(
    prisma: PrismaService,
    providers: ProvidersService,
    config: ConfigService,
  ) {
    this.prisma = prisma;
    this.config = config;
    this.providers = providers;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.headers);

    const token = request.headers['authorization'].split(' ')[1];
    const authedBy: Providers = request.headers['auth-by'];
    let providersUserData: {
      accessToken: string;
      user: GoogleUser | GitHubUser | VkUser;
    } = null;

    if (!token) return false;
    if (!authedBy) return false;

    switch (authedBy) {
      case Providers.GOOGLE:
        providersUserData = await this.providers.Google(token);
        break;
      case Providers.GITHUB:
        providersUserData = await this.providers.Github(token);
        break;
      case Providers.VK:
        providersUserData = await this.providers.Vk(token);
        break;
    }

    try {
      const userCandidate = await this.prisma.user.findFirst({
        where: {
          providers: {
            string_contains: JSON.stringify({
              [authedBy]: providersUserData.user,
            }),
          },
        },
      });

      if (userCandidate) {
        request['user'] = userCandidate;
        request['token'] = providersUserData.accessToken;
      } else {
        let newUser: User | null = null;
        if (isGoogleUser(providersUserData.user)) {
          newUser = await this.prisma.user.create({
            data: {
              providers: JSON.stringify({ [authedBy]: providersUserData.user }),
              providers_list: [authedBy],
              email: providersUserData.user.email as string,
              first_name: providersUserData.user.given_name as string,
              last_name: providersUserData.user.family_name as string,
              image_url: providersUserData.user.picture,
              role: Role.USER,
            },
          });
        } else if (isGithubUser(providersUserData.user)) {
          newUser = await this.prisma.user.create({
            data: {
              providers: JSON.stringify({ [authedBy]: providersUserData.user }),
              providers_list: [authedBy],
              email: providersUserData.user.email || '',
              first_name: providersUserData.user.name as string,
              last_name: '',
              image_url: providersUserData.user.avatar_url,
              role: Role.USER,
            },
          });
        } else if (isVkUser(providersUserData.user)) {
          newUser = await this.prisma.user.create({
            data: {
              providers: JSON.stringify({ [authedBy]: providersUserData.user }),
              providers_list: [authedBy],
              email: 'VKAuthed',
              first_name: providersUserData.user.first_name,
              last_name: providersUserData.user.last_name,
              image_url: '',
              role: Role.USER,
            },
          });
        }

        request['token'] = providersUserData.accessToken;
        request['user'] = newUser;
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
