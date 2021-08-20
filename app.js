import ConvertTags from './modules/convertTags.ts'
import Dialog from './modules/dialog.ts'
import Nav from './modules/nav.ts'
import Tabs from './modules/tabs.ts'
import Accordion from './modules/accordion.ts'
import Anchors from './modules/anchors.ts'
import Cards from './modules/cards.ts'
import Dropdowns from './modules/dropdowns.ts'
import AudioPlayer from './modules/audioPlayer.ts'

const App = () => {
  ConvertTags()
  Dialog()
  Nav()
  Tabs()
  Accordion()
  Anchors()
  Cards()
  Dropdowns()
  AudioPlayer()
}

export default App
