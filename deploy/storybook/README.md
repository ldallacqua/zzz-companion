# Storybook on Vercel

The component workshop, built from `main` at https://zzz-companion-storybook.vercel.app.

It is its own Vercel project, `zzz-companion-storybook`, on this repository, with this folder as
its root directory (the site is `apps/web`, the API `apps/api`; each project reads the
`vercel.json` in its root directory). `vercel.json` here installs and builds from the top of the
repository and writes the build to `dist/` (ignored by git).

It builds only `main` and production deploys: the ignore step skips a build Vercel says is for
another branch, so pull requests cost no Storybook build (the free plan builds one thing at a
time, and the site's previews come first). It prints what Vercel told it at the top of the log.

In the project's settings, "skip deployments when there are no changes to the root directory"
must stay off: this folder holds no code, so with it on every build would be skipped.
