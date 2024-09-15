// iconsList.ts
import { h } from 'vue'

import {
  ChevronRightIcon,
  ChevronDownIcon,
  FileIcon,
  FolderOpenIcon,
  FolderCloseIcon,
  SrcFolderIcon,
  TsConfigIcon,
  GitIgnoreIcon,
  JSONFileIcon,
  ReadMeIcon,
  YarnIcon,
  CmdIcon,
  XmlIcon,
  ConfigIcon,
  PrettierIcon,
  HtmlIcon,
  CssIcon,
  BinaryIcon,
  TsIcon,
  JsIcon,
} from '@/icons/icons'

// Define icons as components
export const icons: Record<string, ReturnType<typeof h>> = {
  directoryClosed: h(FolderCloseIcon, { fill: '#fff' }),
  directoryOpen: h(FolderOpenIcon, { fill: '#fff' }),
  file: h(FileIcon, { fill: '#fff' }),
  '.editorconfig': h(ConfigIcon),
  '.gitignore': h(GitIgnoreIcon),
  '.prettierrc': h(PrettierIcon),
  'README.md': h(ReadMeIcon),
  'package.json': h(JSONFileIcon),
  src: h(SrcFolderIcon),
  bin: h(BinaryIcon),
  'tsconfig.json': h(TsConfigIcon),
  'tsconfig.tsbuildinfo': h(TsConfigIcon),
  'yarn-error.log': h(YarnIcon),
  'yarn.lock': h(YarnIcon),
  '.js': h(JsIcon),
  '.ts': h(TsIcon),
  '.cmd': h(CmdIcon),
  '.xml': h(XmlIcon),
  '.html': h(HtmlIcon),
  '.css': h(CssIcon),
  rightArrow: h(ChevronRightIcon, { fill: '#fff' }),
  downArrow: h(ChevronDownIcon, { fill: '#fff' }),
}

export default icons
