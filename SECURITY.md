# Security Policy

## Table of Contents

1. [Supported Versions](#supported-versions)
2. [Reporting a Vulnerability](#reporting-a-vulnerability)
3. [Security Best Practices](#security-best-practices)
4. [Environment Variables and Secrets](#environment-variables-and-secrets)
5. [Dependency Security](#dependency-security)
6. [Known Security Considerations](#known-security-considerations)
7. [Disclosure Policy](#disclosure-policy)

---

## Supported Versions

Only the latest version of AstroDex on the `main` branch is actively maintained and receives security updates.

| Version / Branch | Supported |
|-----------------|-----------|
| `main` (latest) | ✅ Yes |
| Older forks / branches | ❌ No |

If you are running a forked or older version, we strongly recommend syncing with `main` regularly.

---

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability in AstroDex, **please do not open a public GitHub issue.** Public disclosure before a fix is available puts all users at risk.

### How to Report

1. **Open a [GitHub Security Advisory](https://github.com/SourabhX16/astrodex/security/advisories/new)**
   This is the preferred and most secure channel. It keeps the report private between you and the maintainers until a fix is ready.

2. **Alternatively**, contact the maintainer directly via GitHub:
   [@SourabhX16](https://github.com/SourabhX16)

### What to Include in Your Report

Please provide as much detail as possible so we can reproduce and address the issue quickly:

- A clear description of the vulnerability
- The component, file, or endpoint affected
- Step-by-step instructions to reproduce the issue
- Proof of concept code or screenshots (if applicable)
- The potential impact or attack scenario
- Any suggested fix or mitigation (optional but appreciated)

### What to Expect

| Timeline | Action |
|----------|--------|
| **Within 48 hours** | Acknowledgement of your report |
| **Within 7 days** | Initial assessment and severity classification |
| **Within 30 days** | A patch or mitigation plan, depending on complexity |
| **After fix is released** | Public disclosure coordinated with you |

We will keep you informed at every step. If you do not receive an acknowledgement within 48 hours, please follow up via GitHub.

---

## Security Best Practices

### For Contributors

Follow these practices whenever you contribute code to AstroDex:

#### ✅ Do

- Validate and sanitize all user input before processing or rendering
- Use environment variables for all credentials and configuration secrets
- Keep dependencies up to date and audit them regularly with `npm audit`
- Use TypeScript's strict mode to catch type-related vulnerabilities at compile time
- Follow the principle of least privilege — request only the permissions your code actually needs
- Use `HTTPS` for all external API requests
- Prefer well-maintained, widely adopted libraries over custom implementations for cryptography or authentication

#### ❌ Do Not

- Hard-code API keys, tokens, passwords, or any secrets in source code
- Commit `.env.local` or any file containing real credentials
- Disable TypeScript strict checks to work around type errors
- Use `dangerouslySetInnerHTML` without explicit sanitization (e.g., via [DOMPurify](https://github.com/cure53/DOMPurify))
- Suppress ESLint security rules without a documented reason
- Log sensitive user data to the console or external logging services
- Trust client-side data on the server without re-validation

---

## Environment Variables and Secrets

AstroDex uses environment variables to manage sensitive configuration. Mishandling these is one of the most common sources of accidental secret exposure.

### Rules

| Rule | Detail |
|------|--------|
| **Never commit secrets** | `.env.local` is in `.gitignore` — keep it that way |
| **Use `.env.local.example`** | Commit a template with placeholder values so contributors know what variables are needed |
| **Prefix public variables correctly** | Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never prefix a secret variable with `NEXT_PUBLIC_` |
| **Rotate compromised keys immediately** | If a secret is accidentally committed, treat it as compromised and rotate it before removing it from history |

### Variable Reference

```env
# .env.local.example — copy this file to .env.local and fill in real values

# Supabase (future integration)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NASA API (if applicable)
NASA_API_KEY=your_nasa_api_key
```

> ⚠️ `NASA_API_KEY` does **not** use the `NEXT_PUBLIC_` prefix because it should only be accessed server-side (e.g., in API routes or Server Components). Exposing it to the browser would allow anyone to use your quota.

### If You Accidentally Commit a Secret

1. **Rotate the secret immediately** — invalidate the exposed key before doing anything else
2. Remove the secret from the codebase
3. Use [`git filter-repo`](https://github.com/newren/git-filter-repo) or [BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) to purge it from Git history
4. Force-push the cleaned history
5. Notify the maintainer so the incident can be assessed

---

## Dependency Security

Third-party dependencies are a common attack vector. AstroDex uses the following practices to mitigate supply chain risk:

### Auditing Dependencies

```bash
# Run a full audit of installed packages
npm audit

# Automatically fix low-risk vulnerabilities
npm audit fix

# Review high and critical vulnerabilities manually
npm audit --audit-level=high
```

Run `npm audit` regularly and always before opening a pull request.

### Guidelines

- **Do not add new dependencies lightly.** Every dependency is a potential attack surface. Ask yourself whether the functionality can be achieved with what is already in the project or with native APIs.
- **Evaluate packages before adding them:**
  - Is it actively maintained?
  - Does it have a large number of dependents?
  - Does it have a clear security policy?
  - Are the weekly download numbers reasonable?
- **Pin dependency versions** in critical situations rather than relying on broad semver ranges
- **Do not install packages from untrusted or unknown sources**

---

## Known Security Considerations

The following are known areas of the codebase that require careful handling:

### WebGL / Three.js

- GLSL shaders are compiled and executed on the GPU. While this is sandboxed by the browser, avoid injecting untrusted user input into shader source strings.
- Texture URLs loaded via `useTexture` should always point to trusted, controlled origins to prevent unexpected asset loading.

### NASA API Integration

- The NASA API key should **never** be exposed to the client. All requests to the NASA API must be proxied through Next.js API routes or Server Components.
- Rate-limit API routes to prevent abuse and protect your API quota.

### Future Supabase Integration

- Use **Row Level Security (RLS)** on all Supabase tables. Never rely solely on client-side checks to protect data.
- The `anon` key is safe to expose in the browser only when RLS policies are correctly configured.
- Validate all data on the server side in addition to any client-side validation.
- Use Supabase Auth for user identity — do not implement custom authentication unless absolutely necessary.

---

## Disclosure Policy

AstroDex follows a **coordinated disclosure** model:

1. Reporter submits a vulnerability privately
2. Maintainers acknowledge and assess the report
3. A fix is developed, tested, and released
4. A public security advisory is published after the fix is available
5. The reporter is credited in the advisory (unless they prefer to remain anonymous)

We ask that reporters:

- Give us a reasonable amount of time to address the issue before any public disclosure
- Avoid accessing, modifying, or deleting user data during any testing
- Act in good faith toward the security and privacy of the project and its users

In return, we commit to:

- Responding promptly and transparently
- Crediting researchers who report valid vulnerabilities
- Not pursuing legal action against good-faith security researchers

---

## Resources

| Resource | Link |
|----------|------|
| GitHub Security Advisories | [Create an advisory](https://github.com/SourabhX16/astrodex/security/advisories/new) |
| npm Audit Docs | [docs.npmjs.com/cli/audit](https://docs.npmjs.com/cli/v9/commands/npm-audit) |
| Next.js Security | [nextjs.org/docs/app/building-your-application/authentication](https://nextjs.org/docs/app/building-your-application/authentication) |
| Supabase RLS Guide | [supabase.com/docs/guides/auth/row-level-security](https://supabase.com/docs/guides/auth/row-level-security) |
| OWASP Top 10 | [owasp.org/www-project-top-ten](https://owasp.org/www-project-top-ten/) |
| BFG Repo Cleaner | [rtyley.github.io/bfg-repo-cleaner](https://rtyley.github.io/bfg-repo-cleaner/) |

---

*This security policy was last updated for the current state of the AstroDex `main` branch. It will be revised as the project grows and new integrations are added.*
