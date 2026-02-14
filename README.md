# pi extensions

A collection of extensions for [pi](https://github.com/badlogic/pi-mono), the coding agent.

## Extensions

### [co-authored-by](extensions/co-authored-by/)

Automatically appends git trailers to commit messages when the agent runs `git commit -m`. Adds attribution for the model used and the pi version.

Example commit message:

```
fix: resolve null pointer

Co-Authored-By: Claude Sonnet 4 <noreply@pi.dev>
Generated-By: pi 0.52.12
```

## Usage

Add to your pi settings (`~/.pi/settings.json` or `.pi/settings.json`):

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
