# pi-extensions

Personal extensions for the [Pi coding agent](https://github.com/badlogic/pi-mono).

## Extensions

| Extension | Description |
|-----------|-------------|
| [co-authored-by](extensions/co-authored-by/) | Automatically appends git trailers (`Co-Authored-By`, `Generated-By`) to commit messages with the model name and pi version |

Example commit message:

```
fix: resolve null pointer

Co-Authored-By: Claude Sonnet 4 <noreply@pi.dev>
Generated-By: pi 0.52.12
```

## Install

```bash
pi install git:github.com/bruno-garcia/pi-extensions
```

To enable only specific extensions:

```json
{
  "packages": [
    {
      "source": "git:github.com/bruno-garcia/pi-extensions",
      "extensions": ["extensions/co-authored-by/index.ts"]
    }
  ]
}
```

## Quick Setup

If you keep a local clone, add to your `~/.pi/agent/settings.json`:

```json
{
  "extensions": [
    "~/git/pi-extensions/extensions/co-authored-by"
  ]
}
```

Or use the CLI flag:

```bash
pi -e ~/git/pi-extensions/extensions/co-authored-by
```

## Development

```bash
npm install
npm test
```
