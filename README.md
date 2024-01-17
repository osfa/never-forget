- zoom fix?

- more plates

  - gridded plate test?
  - fried?
  - layers how?
  - weird sigils?
  - symlink?

- better audiotoggle
- gui mobile / hide

- subs
- loader?

- landing page / info for poem

- scroll and scrbolling and zoom logics

  - scroll smoothness
  - zoom min max per viewport
  - zoom from center

- audio pick how?

- favicon
- share stuff / meta
- profile headers and imgs

- TiledImage.viewportToImageCoordinates

- animations

  - hide bar etc..
  - change zoom scroll correctly

- cloud front? config?

- narrator voice drops sometimes?

# vite-vue2-starter

ln -s DROPBOX_PATH/\_NF-03-5 /whereverdularepot/never-forget-vite-vue2/public/NF-03-5

A simple start for using vue2 with vite, using [underfin's vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2).

({{ batch.filter((img) => img.model === selectedModel).filter((img) => img.inputImage.includes(input)).length }}) ({{ batch.filter((img) => img.model === model).length }}) RGB = 1, 0, 1) hsla(0, 0%, 100%, 1.00)

- blacklist
- save filters to storage
- pill/prompt/model colors

- have top bar where you can save model prompt combos?
- clicking pills filters?

- dbl click lightbox
- support prompt prop…
- all meta on hover

- scroll to bottom button

- tag cloud func? allow filtering out input images
- step through inputs, prune inptus

- comic mode
- sequence mode
- cfg/ss filter

- rate input?
- only need model prompt badges? on imgs..page per input
  - emojis?
- button to mark all inputs as certain number?

  - select multiple? shiftr to sel extras?

- have thing that shows if default model setting?

NF-03-5--divineelegancemix*V9--911-00008-2x.jpg_prompt-makeup-mukbang_support_prompt-blue_MP-1_cfg-18_ss-15_seed-1000195145_cnet_d-0.9_cnet_c-0_00001*

NF-03-5-- divineelegancemix_V9 --

- 911-00008-2x.jpg\_
- prompt-makeup-mukbang\_
- support*prompt-blue*
- MP-1\_
- cfg-18*ss-15*
- seed-1000195145\_
- cnet*d-0.9_cnet_c-0*
- 00001\_

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

isRatingMode = true

showControls? debug?

1 to 5 does something but doesnt serve next image? test with short suites? rip out odl imgs?

🎱 is blacklist toggle?

---

- new image pool

- need way to filter based on stars...

  - list multiple?
  - after rating, serve next
  - possible just redo the comopontent?
  - make dedicated rating componetnt?

- rating count incorrect..

---

pick out:

- 9/11 variant
  - all resolutions
  - all compressions
  - three variants

same for avatar hackers trackers

looping sequence of arrows? 2x png..

or just fucking do it properly in illustraotr...

"also on youtube etc"

have it loop around on scroll? moebius etc..

black arrows...

---

start with white and sketch out gan charts and then have them vertical? in blocks? stylize colros and bkag later...![Alt text](https://docs-assets.developer.apple.com/published/114d850041/3401943c-c259-4bd7-86ab-f62e4ee06c99.png)

- use neon colors?
- should show at diff steps? test like 10 steps? 5?

---

ai arts distinct forms are appearing, but tis still most interestingly approached as "human machine interaction gestaltat"

      <!-- <div
        @click="moveCursor(idx)"
        class="chapter-bkg"
        :class="{ isLoading: isLoading }"
        ref="sequences"
        v-for="(chapter, idx) in table_top"
        :key="`${chapter.imgPath}-${idx}`"
        :style="{ backgroundImage: 'url(' + chapter.imgPath + ')' }">
        <div v-if="showControls" class="action-bar">
          <span @click="blackListCard(idx)" class="action">⚫</span><span @click="superStarCard(idx)" class="action">✨</span><span>{{ chapter.stars || "not rated" }}</span>
        </div>
        <div v-if="showControls" class="meta-bar">
          <span class="action">{{ cursorPosition }} / {{ batch.length }}</span>
          <span class="action">{{ previouslyRated }}</span>
        </div>
      </div> -->

      @click.native="moveCursor(image.id, 1)"

//.replace("-fried*w2040_q10", ""); // .replace("-fried.jpg", "*.png") // /Users/jbe/Dropbox/stabdiff-ui-v2/comfyui-outs/\_NF/NF-03-5/ // ava/v1-5-pruned-emaonly.ckpt/sel/ // NF-03-5--v1-5-pruned-emaonly.ckpt-- // avatar2_5495_318.jpg_prompt-second-life_support_prompt-9-11_MP-1_cfg-28_ss-18_seed-1000195145_cnet_d-0.9_cnet_c-0-fried_w2040_q10_00001-fried.jpg

// split / and get last? // NF-03-5/ava/realisticVisionV51_v51VAE/fried/NF-03-5--realisticVisionV51_v51VAE--avatar2_2726_215.jpg_prompt-2001_support_prompt-9-11_MP-1_cfg-15_ss-18_seed-1000195145_cnet_d-0.9_cnet_c-0-fried_w2040_q10_00001-fried.jpg
