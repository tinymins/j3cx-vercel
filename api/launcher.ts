import type { VercelRequest, VercelResponse } from '@vercel/node';
import got from 'got';
import http from 'http';
import https from 'https';
import md5 from 'md5';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
});
const httpAgent = new http.Agent({
  keepAlive: true,
});

interface LauncherJSON {
  AnotherSelfUpdateUrlsV2?: string[];
  GameConfigUrls: string[];
  GameLibrary: {
    AppCode: string;
    ConfigFile: string;
    InnerConfigFile: string;
    InnerMD5: string;
    MD5: string;
    PreGameKey: string[];
  }[];
  InnerAnotherSelfUpdateUrlsV2?: string[];
  InnerGameConfigUrls: string[];
  InnerNetDomains?: string[];
  InnerSelfUpdateUrls?: string[];
  InnerSelfUpdateUrlsV2?: string[];
  MultiChannelUrls?: string[];
  OfficialUrl?: string;
  PreTestSelfUpdateUrls?: string[];
  PreTestSelfUpdateUrlsV2?: string[];
  PrivateLicenseUrl?: string;
  SelfUpdateUrls?: string[];
  SelfUpdateUrlsV2?: string[];
  ServiceUrl?: string;
  UpgradeLimtV1?: number;
  UserLicenseUrl?: string;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    let returnType = 'JSON';
    let queryUrls = String(req.query.urls || '');
    if (!queryUrls) {
      if (req.url && (/\.md5(\?.*)?$/ui).test(req.url)) {
        returnType = 'MD5';
      }
      queryUrls = 'http://xlauncherv2hw.xoyocdn.com/XLauncherV2/XLauncher_Remote.json|http://xlauncherv2hkhw.xoyo.games/XLauncherV2/XLauncher_TW_Remote.json';
    }
    if (!queryUrls) {
      throw new Error('Missing param `urls`');
    }
    if ((/\.md5(\?.*)?$/ui).test(queryUrls)) {
      queryUrls = queryUrls.replace(/\.md5(\?.*)?$/ui, '');
      returnType = 'MD5';
    }
    const urls = queryUrls.split('|');
    const contents = await Promise.all(
      urls.map(url => new Promise<string>((resolve, reject) => {
        got(url, {
          agent: {
            http: httpAgent,
            https: httpsAgent,
          },
          hooks: {
            afterResponse: [
              (response) => {
                response.request.destroy();
                return response;
              },
            ],
          },
        })
          .then((r) => {
            resolve(r.body);
            return r;
          })
          .catch(reject);
      })),
    );
    const contentJson: LauncherJSON = {
      GameConfigUrls: [''],
      InnerGameConfigUrls: [''],
      GameLibrary: [],
    };
    for (const c of contents) {
      const data = JSON.parse(c) as LauncherJSON;
      const prevContentJson = { ...contentJson };
      Object.assign(contentJson, data, prevContentJson);
      for (const game of data.GameLibrary) {
        if (contentJson.GameLibrary.some(g => g.AppCode === game.AppCode)) {
          continue;
        }
        contentJson.GameLibrary.push({
          ...game,
          InnerConfigFile: `${data.InnerGameConfigUrls[0]}${game.InnerConfigFile}`,
          ConfigFile: `${data.GameConfigUrls[0]}${game.ConfigFile}`,
        });
      }
    }
    const contentText = JSON.stringify(contentJson);
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.send(returnType === 'MD5' ? md5(contentText) : contentText);
  } catch (error) {
    res.status(500);
    res.send(error instanceof Error ? error.message : String(error || ''));
  }
};
