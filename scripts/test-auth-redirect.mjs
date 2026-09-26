import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../auth-core.js", import.meta.url), "utf8");
const window = {};
vm.runInNewContext(source, { window });

const redirect = window.OghamAuthCore.getCognitoRedirectUri;
assert.equal(redirect({ hostname: "localhost" }), "http://localhost:8000/");
assert.equal(redirect({ hostname: "127.0.0.1" }), "http://localhost:8000/");
assert.equal(
  redirect({ hostname: "main.d39wc75md4exup.amplifyapp.com" }),
  "https://main.d39wc75md4exup.amplifyapp.com/"
);
assert.equal(
  redirect({ hostname: "preview.example.test" }),
  "https://main.d39wc75md4exup.amplifyapp.com/"
);

const appSource = readFileSync(new URL("../app.js", import.meta.url), "utf8");
assert.match(appSource, /OghamAuthCore\.getCognitoRedirectUri\(window\.location\)/);

console.log("Cognito redirect URI regression tests passed.");
