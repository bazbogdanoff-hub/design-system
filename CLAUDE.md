# Design system: agent instructions

The consuming app is `../aegis`; its `CLAUDE.md` and `.cursor/rules/` hold
the house rules for how components are composed and changed. Read them
before touching anything here.

## Named styles

Say the name; the definition is the doc.

| name | what | doc |
|---|---|---|
| **Prism** | brand glass on whatever is *on*: primary button fill in the chart marks' glass recipe; off states sink into a well | `docs/patterns/Prism.md` |

## Writing

**Never write the long dash (U+2014, the em dash).** Not in component text,
docs, token descriptions, stories, code comments, commit messages or chat.
Many readers take it as a sign of machine-written text (owner, 2026-10-04).
Rephrase instead:

- an explanation or list that follows → a colon;
- a second thought → a full stop and a new sentence;
- an aside → commas or brackets;
- a name with a qualifier → " · " or a comma;
- an empty value → a short hyphen `-`;
- when nothing else fits, a spaced short hyphen " - ".

The en dash (U+2013) is not a way round it. `npm run check:dashes` fails on
any long dash in a tracked file; run it before committing.
