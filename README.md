# Knitables-I

### Project Overview

Knitables-I is a space for knitters to upload patterns or images they would like to make into patterns made with Vue.js.

![](https://github.com/jackrandol/knitables-I/blob/master/ModalTourHighRes.gif "Image Modal Demo")

### Features

Images are uploaded in the yellow bar at the top with a title, comment and username. There is no actual user sign up for the site but users can enter in their name or handle if they wish. Photos are uploaded to the cloud with AWS and then appear in a reverse chronological order, latest image will up upper left most corner.

When the image cards are clicked a modal slides out from the left-hand side and the image appears larger and there is a section where people can leave comments and feedback. Images can also be deleted here and will be removed from the imageboard completely.

Users can navigate with the left and right arrow inside the modal to click to next and previous images.

#### Tech Stack:

- HTML, CSS, JavaScript, Node.js, Express, PostgreSQL, AWS S3

#### Framework:

- Vue.js

## Image Upload

![](https://github.com/jackrandol/knitables-II/blob/master/KnittingProcess.gif "Knitting Time")

## _For Further Development_

- Right now there is a small mock-up of what the image would look like when converted into a knitable pattern. It is created with some simple css styling but it would be better if the image uploaded was already manipulated, resized and with a diffusion dither, so that they could use it as a knitting pattern.
