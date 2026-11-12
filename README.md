# Product Logs — Daniel Ade-Otoki

Self-initiated product work for teams I'd like to join. For each company I research the product from public evidence, frame one real problem, and ship a working prototype of the fix.

- **Live site:** https://design-pitches.vercel.app
- **Portfolio:** https://danieladeotoki.com

## Structure

| Path | What it is |
|---|---|
| `content/<company>.json` | The Product Log for one company: context, goals, job to be done, sourced evidence, approaches, decision, validation plan |
| `app/[slug]/page.tsx` | Renders any Product Log at `/<company>` |
| `app/prototypes/<company>/` | The working prototype for that company, served at `/prototypes/<company>` and embedded in its log |
| `lib/types.ts` | The Product Log schema |

## Rules every log follows

- Every claim about a company links to a public source.
- No invented user-test results. Each log ends with a validation plan: what I'd measure and how.
- Independent concepts, not affiliated with the companies shown.

## Run locally

```bash
npm install
npm run dev
```
