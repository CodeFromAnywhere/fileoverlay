// Add CORS headers helper
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const tryParseJson = (text: string | undefined) => {
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

const postOverlay = async (request: Request) => {
  const json = await request.json();

  const sources: { fileObjectUrl: string; fileObjectApiKey?: string }[] =
    json?.sources;

  if (!sources || !Array.isArray(sources) || sources.length < 2) {
    return new Response("Please provide at least two sources", { status: 400 });
  }

  const fileObjects = await Promise.all(
    sources.map(async (source) => {
      const { fileObjectApiKey, fileObjectUrl } = source;
      const headers: { [key: string]: string } = {
        accept: "application/json",
      };
      if (fileObjectApiKey) {
        headers["Authorization"] = fileObjectApiKey;
      }

      if (!fileObjectUrl || !URL.canParse(fileObjectUrl)) {
        return {
          fileObjectApiKey,
          fileObjectUrl,
          status: 400,
          error: "No file object url",
        };
      }

      const fileObjectResponse = await fetch(fileObjectUrl, { headers });

      if (!fileObjectResponse.ok) {
        return {
          fileObjectApiKey,
          fileObjectUrl,
          status: fileObjectResponse.status,
          error: await fileObjectResponse.text(),
        };
      }

      const text = await fileObjectResponse.text();
      const result: { files: {} } | null = tryParseJson(text);

      if (!result?.files) {
        return {
          fileObjectApiKey,
          fileObjectUrl,
          status: 400,
          error: "Could not process the file object as a File object JSON ",
        };
      }

      return { fileObjectApiKey, fileObjectUrl, result, status: 200 };
    }),
  );

  const errors = fileObjects.filter((x) => x.result === null);

  if (errors.length > 0) {
    return new Response(
      "Could not find all file objects: " + JSON.stringify(errors),
      { status: 404 },
    );
  }

  // Apply overlay. NB: this will get out of memory after a certain size, so its probably wise to limit total repo size.
  const overlayFileObject = fileObjects
    .map((x) => x.result!.files)
    .reduce((previous, current) => ({ ...previous, ...current }), {});

  // TODO: make a new tree of all of them combined
  const tree = {};
  // TODO: create all operations needed to get from the last source to the end fileobject result (all templates applied to it)
  const operations = [];
  // TODO: create a diff on the last source (all templates applied to it)
  const diff: string = "";

  return new Response(
    JSON.stringify({ files: overlayFileObject }, undefined, 2),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};

const getOverlay = (request: Request) => {
  const url = new URL(request.url);
  const chunks = url.pathname.split("/").slice(2);
  // if given, is an api key for the last chunk
  const apiKey =
    request.headers.get("Authorization")?.slice("Bearer ".length) ||
    url.searchParams.get("apiKey");

  const repos = chunks
    .map((chunk, index) => {
      if (index % 2 === 0) {
        return null;
      }
      return { owner: chunks[index - 1], repo: chunk };
    })
    .filter((x) => !!x)
    .map((x) => x!);

  const sources = repos.map((repo, index) => {
    const isLast = index + 1 === repos.length;
    const fileObjectApiKey = isLast && apiKey ? apiKey : undefined;
    return {
      fileObjectUrl: `https://uithub.com/${repo.owner}/${repo.repo}`,
      fileObjectApiKey,
    };
  });

  return postOverlay(
    new Request(url.origin + "/overlay", {
      method: "POST",
      body: JSON.stringify({ sources }),
    }),
  );
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Handle OPTIONS request for CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Validate path
    if (request.method === "POST" && url.pathname === "/overlay") {
      return postOverlay(request);
    } else if (
      request.method === "GET" &&
      url.pathname.startsWith("/overlay/")
    ) {
      return getOverlay(request);
    }

    // Add CORS headers to all responses
    return new Response("Method not allowed", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
