import { useState } from 'react'
import Tippy from '@tippyjs/react'
import copy from 'clipboard-copy'
import 'tippy.js/dist/tippy.css'
import useSandbox from '../utils/useSandbox'

import { saveAs } from 'file-saver'
import { CodesandboxIcon, CopyIcon, DownloadIcon, ShadowIcon, TSIcon } from './icons'

const Nav = ({ code, config, setConfig, fileName, textOriginalFile }) => {
  const [copied, setCopied] = useState(false)
  const [loading, sandboxId, error, sandboxCode] = useSandbox({
    fileName,
    textOriginalFile,
    code,
    types: config.types,
  })

  const copyToClipboard = async () => {
    try {
      await copy(code)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 200)
      // eslint-disable-next-line no-empty
    } catch {}
  }

  const download = async () => {
    const createZip = await import('../utils/createZip').then((mod) => mod.createZip)
    const blob = await createZip(sandboxCode, fileName, textOriginalFile)
    saveAs(blob, `${fileName.split('.')[0]}.zip`)
  }

  return (
    <nav className="p-10 flex justify-end align-center">
      <ul className="flex justify-end align-center">
        <li className={`${config.types ? 'text-blue-600' : ''} hover:text-blue-600 pr-5`}>
          <Tippy content={config.types ? 'Hide Typescript types' : 'Show Typescript types'}>
            <button className="cursor-pointer" onClick={() => setConfig({ ...config, types: !config.types })}>
              <TSIcon />
            </button>
          </Tippy>
        </li>
        <li className={`${!config.shadows ? 'text-gray-900' : 'text-green-600'} hover:text-green-600 pr-5`}>
          <Tippy content={config.shadows ? 'Hide Shadow Code' : 'Show Shadow Code'}>
            <button className="cursor-pointer" onClick={() => setConfig({ ...config, shadows: !config.shadows })}>
              <ShadowIcon />
            </button>
          </Tippy>
        </li>
        <li className={`${!copied ? 'text-gray-900' : 'text-green-600'} hover:text-green-600 pr-5`}>
          <Tippy content={copied ? 'Copied' : 'Copy to Clipboard'}>
            <button className="cursor-pointer" onClick={copyToClipboard}>
              <CopyIcon />
            </button>
          </Tippy>
        </li>

        {!fileName.includes('.glb') ? (
          !error ? (
            <li className={`${!loading ? 'text-gray-900 hover:text-green-600' : 'text-gray-200'} `}>
              <Tippy content={!loading ? 'Open in Codesandbox' : 'Creating a sandbox...'}>
                {!loading ? (
                  <a
                    className="cursor-pointer"
                    rel="noreferrer"
                    href={`https://codesandbox.io/s/${sandboxId}?file=/src/Model.${config.types ? 'tsx' : 'js'}`}
                    target="_blank">
                    <CodesandboxIcon />
                  </a>
                ) : (
                  <button>
                    <CodesandboxIcon />
                  </button>
                )}
              </Tippy>
            </li>
          ) : (
            <li className="text-red-600">
              <Tippy content={'There was a problem creating your sandbox'}>
                <button>
                  <CodesandboxIcon />
                </button>
              </Tippy>
            </li>
          )
        ) : null}
        <li className={`text-gray-900 hover:text-green-600 ${!fileName.includes('.glb') ? 'pl-5' : ''}`}>
          <Tippy content={'Download As Zip'}>
            <button className="cursor-pointer" onClick={download}>
              <DownloadIcon />
            </button>
          </Tippy>
        </li>
      </ul>
    </nav>
  )
}

export default Nav
