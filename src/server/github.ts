import { Server } from "node:http";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import express, { Express, Request, Response } from "express";
import open from "open";

// Replace with your GitHub OAuth App client ID and client secret
const clientId = Github.CLIENT_ID;
const clientSecret = Github.CLIENT_SECRET;

// GitHub API and OAuth endpoints
const githubApiUrl = "https://api.github.com";
const githubOAuthUrl = "https://github.com/login/oauth";
const accessTokenUrl = `${githubOAuthUrl}/access_token`;
const authorizeUrl = `${githubOAuthUrl}/authorize`;

export type GithubUser = {
  username: string;
  email: string;
  avatar: string;
  url: string;
};

class InternalServer {
  private app: Express = express();
  private server?: Server;
  private static internalServer: InternalServer | null = null;

  // Private constructor to enforce singleton pattern
  private constructor() {}

  // Exchange the GitHub code for an access token
  private async getAccessToken(code: string): Promise<string> {
    const body = new URLSearchParams();
    body.append("client_id", clientId);
    body.append("client_secret", clientSecret);
    body.append("code", code);

    const response = await fetch(accessTokenUrl, {
      method: "POST",
      headers: { Accept: "application/json" },
      body,
    });

    const data = (await response.json()) as {
      token_type: string;
      access_token: string;
    };
    return `${data.token_type} ${data.access_token}`;
  }

  // Get user details from GitHub using the access token
  private async getUser(token: string): Promise<GithubUser> {
    const response = await fetch(`${githubApiUrl}/user`, {
      headers: { Authorization: token },
    });

    const data = (await response.json()) as {
      login: string;
      email: string;
      avatar_url: string;
      html_url: string;
    };

    return {
      username: data.login,
      email: data.email,
      avatar: data.avatar_url,
      url: data.html_url,
    };
  }

  // Set up a callback to handle GitHub OAuth authorization
  getUserCallback(): Promise<GithubUser> {
    return new Promise(async (resolve, reject) => {
      this.app.get(
        "/auth/github/callback",
        async (req: Request, res: Response) => {
          try {
            const token = await this.getAccessToken(req.query.code as string);
            const user = await this.getUser(token);
            resolve(user);
            res.redirect(`/github-auth-success.html?cwd=${process.cwd()}`);
          } catch (err) {
            res.status(500).send(err);
            reject();
          }
        },
      );
    });
  }

  // Open the GitHub authorization page in the default browser
  private githubAuthorize() {
    open(`${authorizeUrl}?client_id=${clientId}&scope=read:user,user:email`);
  }

  // Start the internal server and initiate GitHub OAuth
  start() {
    this.close();
    this.app.use(
      express.static(join(fileURLToPath(import.meta.url), "..", "github")),
    );
    this.server = this.app.listen(4869, () => {
      this.githubAuthorize();
    });
    return this;
  }

  // Close the internal server
  close() {
    if (this.server) {
      this.server.close();
      this.server = undefined;
    }
  }

  // Singleton pattern to open the internal server
  static openServer() {
    if (!InternalServer.internalServer) {
      InternalServer.internalServer = new InternalServer();
    }
    return InternalServer.internalServer;
  }
}

// Export an instance of the internal server
export default InternalServer.openServer();
