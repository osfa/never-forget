aws s3 cp /Users/jbe/static-sites/never-forget-vite-vue2/public/dzi/\_local s3://jpeg.matrix.surf/dzi/v0 --recursive

- Working on this sprawling project that never ends but we're almost there, here's some WIP jpegs #instantlore #neverforget

---

- mix models opt...

- zoom buttons

  - zoom hover, active
  - pause button (with ios support)

- audio and srt in bucket?
- plate mixing bug: remove or fix with more plates?

- LLM test: ollama script fiddling

- use existing plate mate to make video?

- single card test: vert hori...

- save weighting

- highres popup, dzi? alert modal with highresimgs? dzis in modal? modal popup: background css pos based on mouse? sometimes single iamge modals on top? as a weird reminder? and then ui element: ok embed youtube or video tags kinda nice? super fried on top? youtube embedfs in modal?

photo alubm sheet composer?

fade in filter and top bar? more css anims?

completely black/green plates? diff sizes plates? make sure same size?

landing page: popup that shows text and then enter?

having diff filters in produces diff tones.js osc sounds? so like a synth?

have some sort of scale at the bottom

instant lore textmärke?

formats overlay? dvd etc

---

- frycells?
- compressions weights?
- random fit, black plates?

---

have mouse cursor draw? tracking path? multiple audio tracks? colorpicker+zoomer fx tock click sounds when siwtching dirs?

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
