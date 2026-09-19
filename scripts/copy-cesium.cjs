const fs = require("fs");
const path = require("path");
const source = path.join(__dirname, "..", "node_modules", "cesium", "Build", "Cesium");
const target = path.join(__dirname, "..", "public", "cesium");
if (fs.existsSync(source)) fs.cpSync(source, target, { recursive: true });
