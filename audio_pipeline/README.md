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
