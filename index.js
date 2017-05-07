const plist = require('nextstep-plist')
const promisify = require('promisify-node')
const fs = promisify('fs')
const os = require('os')
const merge = require('lodash.merge')

const darwin = 'darwin'
const messages = require('./messages')

const HOME_DIRECTORY = os.homedir()
const LIBRARY_DIRECTORY = `${HOME_DIRECTORY}/Library`
const KEYBINDINGS_DIRECTORY = `${LIBRARY_DIRECTORY}/KeyBindings`
const KEYBINDINGS_FILE = `${KEYBINDINGS_DIRECTORY}/DefaultKeyBinding.dict`
const COMPOSE_FILE = `${HOME_DIRECTORY}/.macoscompose`
const COMPOSE_KEY = '§'

function checkPlatform () {
  if (os.platform() !== darwin) {
    console.warn(messages.warning, messages.unacceptablePlatform)
  }
}

async function makeDirectories () {
  const home = os.homedir()
  const library = `${home}/Library`
  const keybindings = `${library}/KeyBindings`
  if (!fs.existsSync(library)) {
    await fs.mkdir(library)
  }
  if (!fs.existsSync(keybindings)) {
    await fs.mkdir(keybindings)
  }
}

async function getCurrentBindings () {
  try {
    const dictionary = (await fs.readFile(KEYBINDINGS_FILE)).toString()
    return plist.parse(dictionary)
  } catch (error) {
    return {}
  }
}

function stringToObject (string, value, index = 0, acc = {}, root = acc) {
  const character = string[index]
  if (index + 1 >= string.length) {
    root[character] = value
    return acc
  } else {
    root[character] = {}
    return stringToObject(string, value, index + 1, acc, root[character])
  }
}

function parseCompose (compose) {
  const regex = /^\s*"?((?:[^"]|\\\")+)"?:\s+(.*)$/
  const comment = '#'
  const insertText = 'insertText:'
  const entries = compose
    .split('\n')
    .filter(entry => entry[0] !== comment)
    .map(entry => regex.exec(entry))
    .filter(Boolean)
    .reduce((acc, [_, key, value]) => {
      return merge({}, acc, stringToObject(key, [insertText, value]))
    }, {})
  return {[COMPOSE_KEY]: entries}
}

async function getComposeBindings () {
  return parseCompose((await fs.readFile(COMPOSE_FILE)).toString())
}

async function write (bindings) {
  await fs.writeFile(KEYBINDINGS_FILE, plist.stringify(bindings))
}

;(async function () {
  checkPlatform()
  await makeDirectories()
  const current = await getCurrentBindings()
  const compose = await getComposeBindings()
  const bindings = merge({}, current, compose)
  await write(bindings)
})()
