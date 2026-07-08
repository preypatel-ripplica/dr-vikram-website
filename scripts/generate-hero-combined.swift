import AppKit
import CoreText

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let images = root.appendingPathComponent("public/images")
let fonts = root.appendingPathComponent("public/fonts")

for fontFile in ["poppins-400.ttf", "poppins-500.ttf", "poppins-600.ttf", "poppins-700.ttf"] {
  CTFontManagerRegisterFontsForURL(fonts.appendingPathComponent(fontFile) as CFURL, .process, nil)
}

let scale: CGFloat = 2
let canvas = NSSize(width: 683 * scale, height: 728 * scale)
let output = NSImage(size: canvas)

func image(_ name: String) -> NSImage {
  guard let loaded = NSImage(contentsOf: images.appendingPathComponent(name)) else {
    fatalError("Missing image: \(name)")
  }
  return loaded
}

func font(_ weight: String, _ size: CGFloat) -> NSFont {
  let candidates = [
    "Poppins-\(weight)",
    weight == "SemiBold" ? "Poppins-SemiBold" : "",
    weight == "Regular" ? "Poppins-Regular" : "",
    weight == "Medium" ? "Poppins-Medium" : "",
    weight == "Bold" ? "Poppins-Bold" : "",
  ]
  for name in candidates where !name.isEmpty {
    if let font = NSFont(name: name, size: size) {
      return font
    }
  }
  return NSFont.systemFont(ofSize: size, weight: weight == "Bold" || weight == "SemiBold" ? .semibold : .regular)
}

func drawText(_ text: String, in rect: NSRect, size: CGFloat, weight: String, color: NSColor, alignment: NSTextAlignment = .left) {
  let paragraph = NSMutableParagraphStyle()
  paragraph.alignment = alignment
  paragraph.lineBreakMode = .byClipping
  (text as NSString).draw(in: rect, withAttributes: [
    .font: font(weight, size),
    .foregroundColor: color,
    .paragraphStyle: paragraph,
  ])
}

func drawRoundedRect(_ rect: NSRect, radius: CGFloat, fill: NSColor, shadow: Bool = true) {
  NSGraphicsContext.saveGraphicsState()
  if shadow {
    let nsShadow = NSShadow()
    nsShadow.shadowColor = NSColor(calibratedRed: 18/255, green: 83/255, blue: 91/255, alpha: 0.12)
    nsShadow.shadowBlurRadius = 40 * scale
    nsShadow.shadowOffset = NSSize(width: 0, height: -24 * scale)
    nsShadow.set()
  }
  fill.setFill()
  NSBezierPath(roundedRect: rect, xRadius: radius, yRadius: radius).fill()
  NSGraphicsContext.restoreGraphicsState()
}

func drawCover(_ img: NSImage, in rect: NSRect) {
  let sourceSize = img.size
  let sourceRatio = sourceSize.width / sourceSize.height
  let targetRatio = rect.width / rect.height
  var source = NSRect(origin: .zero, size: sourceSize)
  if sourceRatio > targetRatio {
    let width = sourceSize.height * targetRatio
    source.origin.x = (sourceSize.width - width) / 2
    source.size.width = width
  } else {
    let height = sourceSize.width / targetRatio
    source.origin.y = (sourceSize.height - height) / 2
    source.size.height = height
  }
  img.draw(in: rect, from: source, operation: .sourceOver, fraction: 1)
}

func drawAvatar(_ img: NSImage, in rect: NSRect) {
  NSGraphicsContext.saveGraphicsState()
  NSBezierPath(ovalIn: rect).addClip()
  drawCover(img, in: rect)
  NSGraphicsContext.restoreGraphicsState()
  NSColor.white.setStroke()
  let stroke = NSBezierPath(ovalIn: rect.insetBy(dx: 2 * scale, dy: 2 * scale))
  stroke.lineWidth = 2 * scale
  stroke.stroke()
}

func topRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) -> NSRect {
  NSRect(x: x, y: canvas.height - y - height, width: width, height: height)
}

output.lockFocus()

image("hero-composite.png").draw(in: NSRect(origin: .zero, size: canvas), from: .zero, operation: .sourceOver, fraction: 1)

let patientCard = topRect(x: 53 * scale, y: 400 * scale, width: 176 * scale, height: 149 * scale)
drawRoundedRect(patientCard, radius: 28 * scale, fill: .white)
let avatarSize = 44 * scale
let avatarStep = 30.8 * scale
for index in 0..<4 {
  let rect = topRect(x: 73 * scale + CGFloat(index) * avatarStep, y: 420 * scale, width: avatarSize, height: avatarSize)
  drawAvatar(image("patient-avatar-figma-\(index + 1).png"), in: rect)
}
drawText("10000+", in: topRect(x: 53 * scale, y: 480 * scale, width: 176 * scale, height: 40 * scale), size: 31 * scale, weight: "SemiBold", color: NSColor(calibratedRed: 44/255, green: 43/255, blue: 59/255, alpha: 1), alignment: .center)
drawText("Happy patients", in: topRect(x: 53 * scale, y: 522 * scale, width: 176 * scale, height: 24 * scale), size: 15 * scale, weight: "Regular", color: NSColor(calibratedRed: 140/255, green: 140/255, blue: 144/255, alpha: 1), alignment: .center)

let expCard = topRect(x: 418 * scale, y: 558 * scale, width: 265 * scale, height: 52 * scale)
drawRoundedRect(expCard, radius: 26 * scale, fill: .white)
let iconRect = topRect(x: 426 * scale, y: 566 * scale, width: 36 * scale, height: 36 * scale)
NSColor(calibratedRed: 61/255, green: 193/255, blue: 190/255, alpha: 1).setFill()
NSBezierPath(ovalIn: iconRect).fill()
let star = NSBezierPath()
let cx = iconRect.midX
let cy = iconRect.midY
let outer = 10 * scale
let inner = 4.7 * scale
for i in 0..<10 {
  let angle = CGFloat(i) * .pi / 5 - .pi / 2
  let radius = i % 2 == 0 ? outer : inner
  let point = NSPoint(x: cx + cos(angle) * radius, y: cy + sin(angle) * radius)
  if i == 0 { star.move(to: point) } else { star.line(to: point) }
}
star.close()
NSColor.white.setFill()
star.fill()
drawText("20+ years of experience", in: NSRect(x: expCard.minX + 56 * scale, y: expCard.minY + 16 * scale, width: 195 * scale, height: 24 * scale), size: 15 * scale, weight: "SemiBold", color: NSColor(calibratedRed: 44/255, green: 43/255, blue: 59/255, alpha: 1), alignment: .left)

output.unlockFocus()

guard let tiff = output.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiff),
      let png = bitmap.representation(using: .png, properties: [:]) else {
  fatalError("Could not encode PNG")
}

try png.write(to: images.appendingPathComponent("hero-combined.png"))
