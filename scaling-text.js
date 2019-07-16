function ScalingText (canvas) {
  const ctx = canvas.getContext("2d")
  let w = canvas.width
  let h = canvas.height
  let s = 1
  let sW = w
  let sH = h
  let pL = 0
  let pR = 0
  let pT = 0
  let pB = 0
  let startOffset = 0
  let sFontSize = 16
  let fontFamily = 'Arial'
  let fontColor = '#000'
  let debugColor = '#f00'
  let debug = false
  let userText = ''
  let userFontSize = 16

  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  canvas.width = sW
  canvas.height = sH

  this.setDebug = (enabled) => {
    debug = enabled
    render()
  }

  this.setText = (text) => {
    userText = text
    render()
  }

  this.setFont = (size = 16, family = 'Arial', color = '#000', offset = 0) => {
    fontColor = color
    fontFamily = family
    userFontSize = size
    startOffset = offset * s
    sFontSize = userFontSize * s
    render()
  }

  this.setSize = (width, height, scale = 1, paddingTop = 10, paddingLeft = 10, paddingBottom = 10, paddingRight = 10) => {
    w = width
    h = height
    s = scale
    sW = w * s
    sH = h * s
    sFontSize = userFontSize * s
    pT = paddingTop * s
    pL = paddingLeft * s
    pB = paddingBottom * s
    pR = paddingRight * s
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    canvas.width = sW
    canvas.height = sH
    render()
  }

  function getLines (words) {
    let lines = []
    let currentLine = ''
    let width = 0
    const padding = pL + pR

    words.forEach((word, idx) => {
      const printWord = word + ' '
      const { width: wordWidthSpace } = ctx.measureText(printWord)
      const { width: wordWidthNoSpace } = ctx.measureText(word)
      const isWider = (wordWidthNoSpace + width + padding) >= sW
      if (isWider) {
        // New line
        lines.push(currentLine)
        currentLine = ''
        width = 0
      }
      width += wordWidthSpace
      currentLine += printWord
    })
    if (currentLine.length > 0) {
      lines.push(currentLine)
    }
    return lines
  }

  function render () {
    // Set canvas properties
    canvas.setAttribute('aria-label', userText)

    // Clear canvas
    ctx.clearRect(0, 0, sW, sH)

    // Clean and split userText.
    const words = userText.trim().replace(/\s+/gmi, ' ').split(/\s|\n/gi)

    if (debug) {
      ctx.fillStyle = debugColor
      ctx.fillRect(0, 0, sW, pT)
      ctx.fillRect(0, sH - pB, sW, sH)
      ctx.fillRect(0, 0, pL, sH)
      ctx.fillRect(sW - pR, 0, sW, sH)
    }

    let isWidthinBounds = false
    let fontSize = sFontSize
    let lines = []

    // Test if text will fit. Reduce if it doesn't.
    while (!isWidthinBounds) {
      ctx.font = `${fontSize}px ${fontFamily}`;
      lines = getLines(words)
      const textHeightTest = lines.length * fontSize
      if (textHeightTest < (sH - pT - pB)) {
        isWidthinBounds = true
      } else {
        fontSize -= 2
      }
      if (fontSize <= 0) {
        isWidthinBounds = false
      }
    }

    // Center the text vertically.
    const totalTextHeight = lines.length * fontSize
    const startAt = (sH - totalTextHeight) / 2

    if (debug) {
      ctx.fillStyle = debugColor
      ctx.fillRect(0, startAt, sW, 1)                     // Text start
      ctx.fillRect(0, sH / 2, sW, 1)                      // Center
      ctx.fillRect(0, startAt + totalTextHeight, sW, 1)   // Text end
    }

    // Print out lines.
    ctx.fillStyle = fontColor
    lines.forEach((line, idx) => {
      ctx.fillText(line, pL, startAt - startOffset + (fontSize * (idx + 1)))
    })
  }
}
