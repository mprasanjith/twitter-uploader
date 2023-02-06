import { getServerSession } from "next-auth/next";
import { EUploadMimeType, TwitterApi } from "twitter-api-v2";
import { authOptions } from "./auth/[...nextauth]";
import { Writable } from "stream";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse, PageConfig } from "next";

if (!process.env.TWITTER_KEY || !process.env.TWITTER_SECRET) {
  throw new Error("No Twitter keys provided.");
}

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 5242880,
  maxFieldsSize: 5242880,
  maxFields: 7,
  allowEmptyFiles: false,
  multiples: false,
};

function formidablePromise(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0]
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((accept, reject) => {
    const form = formidable(opts);

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return accept({ fields, files });
    });
  });
}

const fileConsumer = <T = unknown>(acc: T[]) => {
  const writable = new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk);
      next();
    },
  });

  return writable;
};

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(404).end();

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.json({
      success: false,
      message: "You must be signed in",
    });
  }

  const userClient = new TwitterApi({
    appKey: process.env.TWITTER_KEY,
    appSecret: process.env.TWITTER_SECRET,
    // Following access tokens are not required if you are
    // at part 1 of user-auth process (ask for a request token)
    // or if you want a app-only client (see below)
    accessToken: session.oauthToken,
    accessSecret: session.oauthTokenSecret,
  });

  try {
    const chunks: never[] = [];

    const { fields, files } = await formidablePromise(req, {
      ...formidableConfig,
      fileWriteStreamHandler: () => fileConsumer(chunks),
    });

    const fileData = Buffer.concat(chunks);
    const mediaId = await userClient.v1.uploadMedia(fileData, {
      mimeType: EUploadMimeType.Jpeg,
    });

    console.log({ mediaId });

    const createdTweet = await userClient.v1.tweet(fields.content as string, {
      media_ids: [mediaId],
    });

    return res.status(200).json({
      url: `https://twitter.com/${createdTweet.user.screen_name}/status/${createdTweet.id_str}`,
      tweet: createdTweet
    });
  } catch (err) {
    console.log({ err });
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default handler;
