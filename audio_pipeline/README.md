# French audio pipeline

Generate French speech audio from a sentence or text file with OpenAI text-to-speech. Output files are written to `audio_pipeline/audio/` by default.

OpenAI's policy requires clear disclosure to listeners that the voice is AI-generated.

## Setup

Use Node 18 or newer. No package install is needed.

Set your API key in PowerShell:

```powershell
$env:OPENAI_API_KEY="sk-your-token-here"
```

Or put the key in an ignored local file:

```powershell
Set-Content audio_pipeline\.env "sk-your-token-here"
```

The script reads `audio_pipeline\.env` automatically. You can also store `OPENAI_API_KEY=sk-your-token-here` in that file.

## Generate one French sentence

```powershell
node audio_pipeline\make-audio.mjs --text "Bonjour, comment allez-vous ?" --voice marin
```

That creates an MP3 in `audio_pipeline\audio\`.

## Generate from a text file

```powershell
node audio_pipeline\make-audio.mjs --input audio_pipeline\sample_input.txt --voice cedar --output audio_pipeline\audio\sample.mp3
```

## Voices

List the built-in voices:

```powershell
node audio_pipeline\make-audio.mjs --list-voices
```

Current built-in voices:

`alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`, `sage`, `shimmer`, `verse`, `marin`, `cedar`

For best quality, OpenAI recommends `marin` or `cedar`.

## Voice style

Add instructions to control delivery:

```powershell
node audio_pipeline\make-audio.mjs --text "Je cherche le metro." --voice coral --instructions "Speak slowly in Parisian French, like a patient language teacher."
```

## Other options

```powershell
node audio_pipeline\make-audio.mjs --help
```

- `--format mp3` is the default. Other supported formats are `opus`, `aac`, `flac`, `wav`, and `pcm`.
- `--model gpt-4o-mini-tts` is the default.
- `--voice` can be a built-in voice name or a custom voice ID if your OpenAI organization has custom voices enabled.

## Workbook verb study recordings

Open Verb Study from Home or at `/#verbs` after signing in. The local layout preview is `http://localhost:8000/?variant=A#verb-study-prototype`.
It reads `verb-study-data.json` and plays the saved recordings indexed by
`audio/verb-study/manifest.json`. The page never calls OpenAI or receives an API key.
English starts covered, hover previews a cell, and a tap keeps it open.

Import the supplied workbook without changing the original Excel file:

```powershell
py scripts/import-verb-study.py "path/to/French_Verbs_Comprehensive_Reference.xlsx"
```

Review the number of distinct recordings before generating:

```powershell
node audio_pipeline/record-verb-study.mjs --plan
node audio_pipeline/record-verb-study.mjs --concurrency 12
```

Generation uses the existing ignored local API key, `gpt-4o-mini-tts`, and the Marin
voice with French pronunciation instructions. Duplicate text shares one recording.
Rerunning resumes from existing files; model, voice, instructions, and text are part
of each file's identity. Reload the study page after generation completes.

The import retains sheet and row references, expands shared subject labels into
separately playable French sentences, applies necessary `que` elision, and uses
`Il fallait que` in the literary past-subjunctive examples to match their English.
These adjustments are noted on the affected study entries.

## Section listening quizzes

Choose a verb and topic in the study preview, then press **Test this section**.
Each round shuffles one recorded example per row. The choices appear when the
recording ends; the first answer reveals French, English, and the usage note.
The results screen offers another round or practice of just the missed forms.

All 176 workbook groups support a quiz. Single-row topics draw distractors from
related forms of the same verb. Where singular/plural spellings sound identical
(such as `il mange` and `ils mangent`), either spelling is valid by ear and the
reveal explains the original example. Section quiz state and scores live in memory.

## Mega test and web hosting

The mega test shuffles all 710 entries once, keeping choices within the original verb/topic groups. It saves its order, answers and current position in user-scoped local storage after each answer. Resume works on the same browser; this progress is not cloud-synced.

Production reads the manifest and MP3s from the existing Ogham S3 bucket under audio/verb-study/. Upload the referenced recordings before publishing the frontend. The generated manifest is versioned; MP3s stay outside Git.

Run the verb study regression check with: node scripts/test-verb-study.mjs
