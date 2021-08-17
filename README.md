# DK Lite
## Project Goals
This is a collection of opt-in modules to help make your Webflow project more accessible. To ensure hidden content is accessible to all site visitors, not just by those using a mouse, DK Lite modules tackle hide and show logic by using various combinations of the following approaches:
* converting default Webflow elements into native button tags
* using click, focus, and blur event listeners to manage visibility states and corresponding ARIA attributes

To convert an existing element into a DK Lite module, simply add one or more data attributes to that element. Ex: `<header dk-nav="#"></header>`

*Coming Soon: detailed usage instructions and requirements for each DK Lite module.*

## Get Started
### Fork this repo
At the top right of this screen, select “fork.”
At the settings tab of your new forked repo, rename your project.

### Create repo locally
At the clone tab at the top of your repo’s home screen, click “Clone.”
Copy the SSH code
In your terminal, in your chosen directory, enter “git clone <paste ssh code>”
Type “cd <your repo’s github name>”
From here, you can access this repo inside VSCode by typing “code .”

### Install
`yarn`
### Run Locally
`yarn dev`

### Build for Production
In a new tab in your terminal, run 
`yarn build`

### Create Vercel Project
In overview page, create new. Here you can search for your repo in dropdown. It will be under either HuntGather or your personal github username.
In the settings tab, Name your project.
Build Command: yarn build
Output Directory: public

## Technology Used
* ESBuild - compiling code
* JS-Cookie - handling modal and dialog visibility



## Technology Used
* ESBuild - compiling code
* JS-Cookie - handling modal and dialog visibility
