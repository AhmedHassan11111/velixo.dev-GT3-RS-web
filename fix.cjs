const fs = require('fs');
const lines = fs.readFileSync('src/App.backup.tsx', 'utf-8').split('\n');

function extract(start, end) {
  return lines.slice(start - 1, end).join('\n') + '\n';
}

fs.writeFileSync('src/components/sections/Reviews.tsx', 'import React, { useRef } from "react";\nimport { motion, useScroll, useTransform } from "motion/react";\nimport { ResponsiveImage } from "../ResponsiveImage";\nimport { reviews } from "../../data";\n\nexport ' + extract(929, 980));

fs.writeFileSync('src/components/sections/CTA.tsx', 'import React, { useRef, useState } from "react";\nimport { motion, useScroll, useTransform } from "motion/react";\nimport { ArrowRight, Phone } from "lucide-react";\nimport { Link } from "../ui/Link";\n\nexport ' + extract(1041, 1144));
