# Course glossary

`course-glossary.json` is the static, versioned vocabulary source used by Fluency Review. It contains contextual word glosses, French lemmas, grammatical form labels, and selected multi-word expressions. The browser loads this file before applying the user's compact encounter and bookmark state.

Generate or resume the glossary from the repository root:

```powershell
node scripts\generate-course-glossary.mjs
```

The generator reads `OPENAI_API_KEY` from the shell, `.env`, or `audio_pipeline/.env`. It checkpoints each lesson in the ignored `glossary/.generated/` directory, so interrupted runs resume at the next unfinished lesson. Use `--lesson lesson-1 --force` to regenerate one lesson.

Review generated changes before deployment. Routine lookups use this committed file and do not call OpenAI; the authenticated gloss endpoint is only a fallback for missing entries.

After the first generation, run the focused phrase and missing-meaning pass:

```powershell
node scripts\enrich-course-glossary.mjs
```

This preserves validated word records, replaces phrase suggestions with stricter spans, and fills any blank word meanings. It also resumes from ignored per-lesson checkpoints.
Use `--from 32` to regenerate Lesson 32 onward while preserving earlier checkpoints.

Validate the finished artifact with:

```powershell
node scripts\validate-course-glossary.mjs
```
