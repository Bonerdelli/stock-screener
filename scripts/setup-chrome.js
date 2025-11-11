#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')

try {
  const puppeteer = require('puppeteer')
  const chromePath = puppeteer.executablePath()
  if (chromePath) {
    process.env.CHROME_BIN = chromePath
    console.log(`Using Chrome from Puppeteer: ${chromePath}`)
  }
} catch (e) {
  console.warn('Puppeteer not found, using system Chrome')
}

const args = process.argv.slice(2)
const ngCommand = path.join(__dirname, '..', 'node_modules', '.bin', 'ng')
const child = spawn(ngCommand, args, {
  stdio: 'inherit',
  env: process.env,
  shell: true
})

child.on('exit', (code) => {
  process.exit(code || 0)
})

