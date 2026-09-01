# AWS deployment

`OghamUserStateApi.mjs` is the source for the `OghamUserStateApi` Lambda. Keep the API Gateway routes on the same Lambda:

- `GET /state` with the Cognito JWT authorizer
- `PUT /state` with the same Cognito JWT authorizer
- `POST /dictionary/gloss` with the same Cognito JWT authorizer
- `POST /captures` with the same Cognito JWT authorizer
- `GET /captures` with the same Cognito JWT authorizer
- `PATCH /captures/{captureId}` with the same Cognito JWT authorizer
- `DELETE /captures/{captureId}` with the same Cognito JWT authorizer

The handler stores the complete frontend snapshot rather than an allowlist, so new study fields are not silently discarded. It always replaces client-supplied `userId`, `email`, and `updatedAt` with trusted values.

Lambda environment variables:

```text
USER_STATE_TABLE=OghamUserState
CAPTURE_TABLE=OghamCaptures
OPENAI_SECRET_ID=odrerir/openai
OPENAI_GLOSS_MODEL=gpt-4o-mini
```

API Gateway CORS must allow the Amplify origin and `http://localhost:8000`, headers `authorization` and `content-type`, and methods `GET`, `PUT`, `POST`, `PATCH`, `DELETE`, and `OPTIONS`. Preflight `OPTIONS` must not require JWT authorization.

## Capture Inbox deployment

The browser writes each capture to a small local outbox first. The Lambda then stores it in a separate per-user DynamoDB table. The authenticated Cognito `sub` is the partition key, so a client cannot choose or read another user's partition.

1. Sign in to the AWS CLI, then create or update the retained table:

   ```powershell
   aws cloudformation deploy --template-file aws/capture-table.yml --stack-name ogham-captures
   ```

2. Add `CAPTURE_TABLE=OghamCaptures` to the `OghamUserStateApi` Lambda.

3. Give the Lambda execution role these actions on the `OghamCaptures` table: `dynamodb:PutItem`, `dynamodb:GetItem`, `dynamodb:Query`, `dynamodb:UpdateItem`, and `dynamodb:DeleteItem`. Keep the existing permissions for `OghamUserState` and Secrets Manager.

4. Deploy both `OghamUserStateApi.mjs` and `capture-http.mjs` together. The Lambda entry file imports the capture contract with a relative import, so deploying only the entry file will fail at startup.

5. Add the four `/captures` API Gateway routes listed above. Attach the existing Cognito JWT authorizer to every route, then deploy the API stage.

6. Confirm API Gateway CORS includes `PATCH` and `DELETE`. The Lambda also returns matching CORS headers.

7. Open the published app at `/#capture`, sign in, save a test phrase, reload, and confirm it returns as `Saved to AWS`. `aws/events/create-capture-smoke.json` is also available for a Lambda console smoke test after replacing its sample `sub` if desired.

The table uses on-demand billing, server-side encryption, point-in-time recovery, and a retain policy. No table needs to be created by hand before running the deployment command.

After deploying, save one Fluency Review rating and confirm the DynamoDB item contains `fluencyRatings`, `fluencyRatingUpdatedAt`, `fluencyReveals`, and timestamped `fluency-rating|...` values inside `progress.completed`. Then sign in on another device and use Account -> Sync now.
