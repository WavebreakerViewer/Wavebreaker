# Wavebreaker Local Splash Screen

Wavebreaker loads the login splash from a local file instead of a hosted web page:

```text
splash/index.html
```

At runtime this folder is copied beside the viewer executable.

## Editable Files

- `indra/newview/splash/splash.xml` controls branding, links, panels, live feed URLs, and destinations.
- `indra/newview/splash/index.html` is the local splash page shell.
- `indra/newview/splash/splash.css` controls layout and colors.
- `indra/newview/splash/splash.js` loads `splash.xml` and fetches live RSS/Atom/JSON sources.
- `indra/newview/splash/wavebreaker_logo.png` and `indra/newview/splash/wavebreaker_icon.png` are the splash images.

## Links

Edit `splash.xml` under `<links>` to change:

- X
- Primfeed
- YouTube
- Flickr
- Plurk
- Wiki
- JIRA
- Help

## Live Feeds

Edit `splash.xml` under `<feeds>` to change Firestorm Blog, Linden News, and Blogger Network sources.

The viewer reads `splash.xml`, embeds it into a generated cache HTML file, and then loads that generated local page. This avoids Chromium restrictions around `fetch()` from `file:///` pages while keeping `splash.xml` directly editable.

The local page fetches live feed URLs directly from the XML. Because the viewer loads the local splash page with clean-browser permissions, cross-origin feed fetches are enabled for the login splash.

## Testing

To force the local splash page from the command line:

```text
--loginpage splash/index.html
```

To test directly from the source tree:

```text
--loginpage G:\firestorm\codex_builds\1\wavebreakerlt\indra\newview\splash\index.html
```

## Packaging

`indra/newview/viewer_manifest.py` copies `indra/newview/splash` into the built viewer output as `splash`.

## WebRTC Path-Length Build Failure

If configure fails while unpacking `webrtc` with a path ending in `client_side_weighted_round_robin.upb_minitable.h`, the source path is too long for Python tar extraction on Windows.

From `G:\firestorm\codex_builds\1`, map the source tree to a short drive:

```text
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\use-wavebreaker-short-build-drive.ps1 -SourceRoot .\wavebreakerlt -DriveLetter W
```

Then build from Cygwin/Git Bash:

```text
cd /cygdrive/w
export AUTOBUILD_VARIABLES_FILE='W:\wb-build-variables\variables\variables'
autobuild configure -A 64 -c ReleaseWB_open
autobuild build -A 64 -c ReleaseWB_open
```

Remove the mapping later with:

```text
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\use-wavebreaker-short-build-drive.ps1 -DriveLetter W -Remove
```
