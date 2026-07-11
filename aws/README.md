# AWS deployment

`OghamUserStateApi.mjs` is the source for the `OghamUserStateApi` Lambda. Keep the API Gateway routes on the same Lambda:

- `GET /state` with the Cognito JWT authorizer
- `PUT /state` with the same Cognito JWT authorizer
- `POST /dictionary/gloss` with the same Cognito JWT authorizer

The handler stores the complete frontend snapshot rather than an allowlist, so new study fields are not silently discarded. It always replaces client-supplied `userId`, `email`, and `updatedAt` with trusted values.

Lambda environment variables:

```text
USER_STATE_TABLE=OghamUserState
OPENAI_SECRET_ID=odrerir/openai
OPENAI_GLOSS_MODEL=gpt-4o-mini
```

API Gateway CORS must allow the Amplify origin and `http://localhost:8000`, headers `authorization` and `content-type`, and methods `GET`, `PUT`, `POST`, and `OPTIONS`. Preflight `OPTIONS` must not require JWT authorization.

After deploying, save one Fluency Review rating and confirm the DynamoDB item contains `fluencyRatings`, `fluencyRatingUpdatedAt`, `fluencyReveals`, and timestamped `fluency-rating|...` values inside `progress.completed`. Then sign in on another device and use Account -> Sync now.
