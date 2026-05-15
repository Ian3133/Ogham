# French audio pipeline

Generate human-like French MP3 audio from a word, phrase, sentence, or text file.

This uses Google's public translate text-to-speech endpoint. It is simple and good for quick lesson assets, but it requires internet access and is not the same as the paid Google Cloud Text-to-Speech product. If you later need official production support, SSML, named voices, or voice tuning, Google Cloud Text-to-Speech is the upgrade path.

## Setup

No package install is needed. Use Node 18 or newer.

## Generate one phrase

```powershell
node audio_pipeline\make-audio.mjs --text "Bonjour, comment allez-vous ?" --output audio_pipeline\out\bonjour.mp3
```

## Generate from a text file

```powershell
node audio_pipeline\make-audio.mjs --input audio_pipeline\sample_input.txt --output audio_pipeline\out\sample.mp3
```

## Options

```powershell
node audio_pipeline\make-audio.mjs --text "Je cherche le metro." --output audio_pipeline\out\metro.mp3 --lang fr --tld fr
```

- `--lang fr` is the default.
- `--tld fr` is the default Google region. Try `ca` for Canadian French.
- Long input is split into smaller chunks and joined into one MP3.
