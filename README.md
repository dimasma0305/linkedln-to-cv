# linkedln-to-cv

Convert a LinkedIn data export ZIP into a CV preview in the browser.

## GitHub Pages

This repository is configured to deploy to GitHub Pages with GitHub Actions.

### One-time setup

1. Push this repository to GitHub.
2. Go to `Settings -> Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main` (or run the `Deploy to GitHub Pages` workflow manually).

### Notes

- The workflow builds a static export (`out/`) and deploys it.
- Base path is set automatically on GitHub Actions:
  - Project Pages (`https://<user>.github.io/<repo>`): base path is `/<repo>`.
  - User/Org Pages (`https://<user>.github.io`): base path is `/`.
