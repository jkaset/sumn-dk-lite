# DK Lite
## Project Goals
This is a collection of opt-in modules to help make your Webflow project more accessible. To ensure hidden content is accessible to all site visitors, not just by those using a mouse, DK Lite modules tackle hide and show logic by using various combinations of the following approaches:
* converting default Webflow elements into native button tags
* using click, focus, and blur event listeners to manage visibility states and corresponding ARIA attributes

To convert an existing element into a DK Lite module, simply add one or more data attributes to that element. Ex: `<header dk-nav="#"></header>`

*Coming Soon: detailed usage instructions and requirements for each DK Lite module.*

## Get Started
### Install
`yarn`
### Run Locally
`yarn dev`

### Build for Production
`yarn build`

## Technology Used
* Parcel - compiling code
* JS-Cookie - handling modal and dialog visibility