- app loader...

- split fix for srts and audio files...

- switch btween single grid less freq
  - if still loading, dont grid swap?
  - possibly layout corresponds to classes instead...1-3 etc

choose:

- image placeholder loader
- dont render in grid until loaded
- stagger render?
- mobile grid?

- vue-top-progress

## Update rated db

0. backup favs etc..

1. /Users/jbe/Dropbox/MLREPOS/comfy-scripts/scripts/path_crawl.py Updates pics-versioned-ts.json

2. path_crawl_parse.js with favs to write to data/pics-parsed.json

python /Users/jbe/Dropbox/MLREPOS/comfy-scripts/scripts/path_crawl.py && node path_crawl_parse.js

3.  rsync -rt /Users/jbe/Dropbox/stabdiff-ui-v2/comfyui-outs/\_NF/NF-03-5 /Volumes/DSK8/never-forget rsync -aP /Volumes/DSK8/never-forget jbe@192.168.1.123:/volume1/homes/jbe

4.  create jpegged python /Users/jbe/Dropbox/vid-bench/EDL/src/batch-jpg.py

5.  `aws s3 sync /Volumes/DSK8/never-forget/NF-03-5 s3://jpeg.matrix.surf/NF-03-5 --exclude "*" --include "*.jpg"`

6.  hit http://localhost:3000/#/console

7.  export selection, take viewport

## CP to aws bukcet

aws s3 cp /Users/jbe/static-sites/never-forget-vite-vue2/public/dzi/\_local s3://jpeg.matrix.surf/dzi/v0 --recursive

aws s3 sync /Users/jbe/Dropbox/stabdiff-ui-v2/\_sorted-outputs/never-forget/\_\_never-forget_outs/\_nf-plate-out/indigoComic_v10withvae-2eed4fd6-d8a4-11ee-b9b5-120e0458f973 s3://jpeg.matrix.surf/png-jpeg-flat

aws s3 sync /Volumes/DSK8/never-forget/NF-03-5 s3://jpeg.matrix.surf/NF-03-5 --exclude "_" --include "_.jpg"

---

- Working on this sprawling project that never ends but we're almost there, here's some WIP jpegs #instantlore #neverforget

--

- POV you're a variational autoencoder

- bunch gui CATS?

- filter bar right

  - save maps settings?
  - show ipa settings in card header
  - and support prompt in card header
  - filter execute button? move?
  - paging broke?
  - save plates to localstorage?

- image card header in imagecard copmponent? or sep style sheet?
- split and clean 911s? categories etc?? - join gui cat

- memorial/bts category cleanup!!!
- sup prompt sort...memorial and 911...

- icons instead of strings in soc med bar. and smaller...?
- db setup?

- some cells regular, some dzi?

- chk notion..

- infin scroll interaction how?
- "soul harvest"

- s3 - upload feels as well?

- soc med icons

---

- swap for betyter audios..
- ollama describe images? quick lllm api hookup? keys how?

--

- for you pageification?

- def only allow vertical axis scorll if mobile just endless vertical scrolls?
- update seadragon

- mask viewport? somehow? so only right tracks? in dzi scrolll force nav dstiacnes anyways... mix tilesources somehow?
- def fry the gui stuff alot?

- model picker is url scramble func?
- mix frmaes less? or from mirrorerd sources? so only fry diff?

- have music player thing modulate css glow or something?
- mix in the real input images but super fried?

- swap the bars to transp and more ui? or just skip colors to the right: and top? white and insta logo etc

- vintage web icons in bar? weird little transp guys?
- have little bar that fills up with ticks and then scrollls?

- http://localhost:3000/canvas-test.html

  - udp?

- link to #neverforget int in marquee?

- ju djupare ner i narrativet, ju fler ljud fx spår?

- larger tile sizes? more models? variate tile sizes and pos rand zoom? blend plates of diff resolutions? diff tilesizers and images in grid? degrade over scroll?

- iamge storage?

- alternative version than grid? select imgs? need upscale chk? frying etc? still have frames? make versions or no?

---

- realsize display of img in modal?

- need scroll zoom throttle somehow?

- social media header smaller and not on top of - peek aboo? fades away on scroll? on scroll also trigger dzi interaction?s

- more plates - gridded plate test? - fried? - layers how? - weird sigils? - symlink?

- gui mobile / hide

- subs
- loader?

- landing page / info for poem

- scroll and scrbolling and zoom logics

  - scroll smoothness - zoom min max per viewport - zoom from center

- audio pick how?

- favicon
- share stuff / meta
- profile headers and imgs
- support prompt prop

- tag cloud func? allow filtering out input images
- step through inputs, prune inptus

---

By default, the furthest you can zoom in is based on the ratio of image pixels to screen pixels specified in the maxZoomPixelRatio option (default 1.1).

In other words, if maxZoomPixelRatio is 1, then you can only zoom in enough to see the image pixels 1:1. As you've found, you can override that with maxZoomLevel, but then how close to the actual pixels you can get will depend on the size of your viewer.

If your image naturally fills the viewer on the horizontal dimension, you'll get a starting zoom of 1.

If zoomPerClick is set to 2, on the first click your zoom will now be 2. On the second click it'll be 4 (zooms are multiplicative), and on the third zoom it'll be 8.

Therefore you should set your maxZoomLevel to 8 in that scenario.

If your image doesn't start with a zoom of 1 (because it's tall enough it doesn't fill out the width of the viewer),

## you'll have to base the maxZoomLevel on that starting zoom. If you have a different zoomPerClick, you'll have to take that into account.

## Scripts

```bash
  npm run dev # start dev server
  npm run build # build for production
  npm run serve # locally preview production build
```

ffmpeg -i 192kbps.mp4 -i 2hours-audio.mp3 -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 output.mp4

ffmpeg -i 192kbps.mp4 -i 2hours-audio.mp3 -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 output.mp4

ffmpeg -i 192kbps.mp4 -i 2hours-audio.mp3 -c copy combo.mkv

node 16?

---

ai arts distinct forms are appearing, but tis still most interestingly approached as "human machine interaction gestaltat"

                   <meta name="twitter:image" content="http://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4Xbkl" />
                        <meta name="twitter:description" content="Follow these trademark and brand guidelines when referring to Microsoft trademarks and the names of Microsoft software, products, and services." />
                        <meta name="twitter:title" content="Trademark and Brand Guidelines | Microsoft Legal" />
                        <meta name="twitter:url" content="https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks" />
                        <meta name="twitter:creator" content="@Microsoft" />
                        <meta name="twitter:site" content="@Microsoft" />
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta property="og:image" content="http://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4Xbkl" />
                        <meta property="og:description" content="Follow these trademark and brand guidelines when referring to Microsoft trademarks and the names of Microsoft software, products, and services." />
                        <meta property="og:title" content="Trademark and Brand Guidelines | Microsoft Legal" />
                        <meta property="og:url" content="https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks" />
                        <meta property="og:locale" content="en_US" />
                        <meta property="og:type" content="website" />
                        <meta property="og:site_name" content="Microsoft Legal" />
                        <meta name="robots" content="index,follow" />
