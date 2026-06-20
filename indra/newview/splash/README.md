# Wavebreaker Local Splash

This folder is copied beside the built viewer executable as `splash`.

Edit `splash.xml` to change:

- Social links: X, Primfeed, YouTube, Flickr, and Plurk.
- Wiki, JIRA, and help links.
- Live feed URLs for Firestorm Blog, Linden News, and Blogger Network.
- Logo file names, colors, panel text, and destination source.

The viewer loads `splash/index.html` from the hard drive. It does not require a local web server.

At runtime, the viewer reads `splash.xml`, embeds it into a generated cache HTML file, and loads that generated page. This avoids Chromium restrictions around JavaScript `fetch()` from `file:///` pages while keeping `splash.xml` directly editable.

The local page uses JavaScript to read the embedded XML and fetch the live feed URLs listed in that XML file. The viewer loads this local page with clean-browser permissions so cross-origin feed fetches are allowed by the embedded browser.

For quick testing, launch the viewer with:

```text
--loginpage splash/index.html
```

Or point it at an absolute local file:

```text
--loginpage G:\firestorm\codex_builds\1\wavebreakerlt\indra\newview\splash\index.html
```
