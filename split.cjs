const fs = require('fs');

const appContent = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = appContent.split('\n');

function extract(start, end) {
  return lines.slice(start - 1, end).join('\n') + '\n';
}

function write(filename, content) {
  fs.writeFileSync(filename, content);
  console.log('Created ' + filename);
}

// 1. Data
let dataStr = extract(34, 177);
dataStr = dataStr.replace(/^const /gm, 'export const ');
write('src/data/index.tsx', `import React from "react";\nimport { Zap, Gauge, Wind, Cog, Shield, Camera } from "lucide-react";\n\n` + dataStr);

// 2. ui/Link.tsx
write('src/components/ui/Link.tsx', `import React, { ReactNode, MouseEventHandler } from "react";\n\n` + `export ` + extract(26, 32));

// 3. ui/ScrollProgress.tsx
write('src/components/ui/ScrollProgress.tsx', `import React from "react";\nimport { motion, useScroll, useTransform } from "motion/react";\n\n` + `export ` + extract(1270, 1279));

// 4. ui/MagneticButton.tsx
write('src/components/ui/MagneticButton.tsx', `import React, { useRef, ReactNode, MouseEventHandler } from "react";\nimport { motion, useMotionValue, useSpring } from "motion/react";\n\n` + `export ` + extract(1313, 1348));

// 5. LoadingScreen.tsx
write('src/components/LoadingScreen.tsx', `import React from "react";\nimport { motion } from "motion/react";\n\n` + `export ` + extract(1281, 1311));

// 6. sections/HeroScrollFrames.tsx
write('src/components/sections/HeroScrollFrames.tsx', `import React, { useEffect, useRef, useState } from "react";\nimport { IMAGES } from "../../lib/images";\nimport { heroPoster } from "../../lib/hero-poster";\n\n` + extract(179, 182) + `export ` + extract(184, 451));

// 7. sections/ShowcaseIntro.tsx
write('src/components/sections/ShowcaseIntro.tsx', `import React from "react";\nimport { ResponsiveImage } from "../ResponsiveImage";\n\n` + `export ` + extract(453, 471));

// 8. sections/Header.tsx
write('src/components/sections/Header.tsx', `import React, { useEffect, useState } from "react";\nimport { motion } from "motion/react";\nimport { Menu, X } from "lucide-react";\nimport { Link } from "../ui/Link";\nimport { navLinks } from "../../data";\n\n` + `export ` + extract(473, 559));

// 9. sections/Marquee.tsx
write('src/components/sections/Marquee.tsx', `import React from "react";\n\n` + `export ` + extract(561, 584));

// 10. sections/Performance.tsx
write('src/components/sections/Performance.tsx', `import React, { useRef } from "react";\nimport { motion, useScroll, useTransform } from "motion/react";\nimport { ResponsiveImage } from "../ResponsiveImage";\nimport { performanceSpecs } from "../../data";\n\n` + `export ` + extract(586, 643));

// 11. sections/Design.tsx
write('src/components/sections/Design.tsx', `import React from "react";\nimport { motion } from "motion/react";\nimport { ResponsiveImage } from "../ResponsiveImage";\nimport { designFeatures } from "../../data";\n\n` + `export ` + extract(645, 705));

// 12. sections/Engine.tsx
write('src/components/sections/Engine.tsx', `import React from "react";\nimport { motion } from "motion/react";\nimport { engineSpecs } from "../../data";\n\n` + `export ` + extract(707, 762));

// 13. sections/Technology.tsx
write('src/components/sections/Technology.tsx', `import React from "react";\nimport { motion } from "motion/react";\nimport { getContentImage } from "../../lib/images";\nimport { techFeatures } from "../../data";\n\n` + `export ` + extract(764, 824));

// 14. sections/ServicesShowcase.tsx
write('src/components/sections/ServicesShowcase.tsx', `import React, { useRef } from "react";\nimport { motion, useScroll, useTransform } from "motion/react";\nimport { ResponsiveImage } from "../ResponsiveImage";\n\n` + `export ` + extract(826, 879));

// 15. sections/Gallery.tsx
write('src/components/sections/Gallery.tsx', `import React, { useRef } from "react";\nimport { motion, useScroll, useTransform } from "motion/react";\nimport { getContentImage } from "../../lib/images";\n\n` + `export ` + extract(881, 927));

// 16. sections/Reviews.tsx
write('src/components/sections/Reviews.tsx', `import React, { useRef } from "react";\nimport { motion, useScroll, useTransform } from "motion/react";\nimport { ResponsiveImage } from "../ResponsiveImage";\nimport { reviews } from "../../data";\n\n` + `export ` + extract(929, 979));

// 17. sections/FAQ.tsx
write('src/components/sections/FAQ.tsx', `import React, { useState } from "react";\nimport { motion } from "motion/react";\nimport { ChevronDown } from "lucide-react";\nimport { faqs } from "../../data";\n\n` + `export ` + extract(982, 1039));

// 18. sections/CTA.tsx
write('src/components/sections/CTA.tsx', `import React, { useRef, useState } from "react";\nimport { motion, useScroll, useTransform } from "motion/react";\nimport { ArrowRight, Phone } from "lucide-react";\nimport { Link } from "../ui/Link";\n\n` + `export ` + extract(1041, 1143));

// 19. sections/Footer.tsx
write('src/components/sections/Footer.tsx', `import React, { useState } from "react";\nimport { ArrowRight, Instagram, Linkedin } from "lucide-react";\nimport { Link } from "../ui/Link";\n\n` + `export ` + extract(1146, 1268));

// 20. Main App.tsx Replacement
const appTsx = `"use client";\n
import React, { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence } from "motion/react";

import { LoadingScreen } from "./components/LoadingScreen";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { Header } from "./components/sections/Header";
import { HeroScrollFrames } from "./components/sections/HeroScrollFrames";
import { ShowcaseIntro } from "./components/sections/ShowcaseIntro";
import { Marquee } from "./components/sections/Marquee";
import { Performance } from "./components/sections/Performance";
import { Design } from "./components/sections/Design";
import { Engine } from "./components/sections/Engine";
import { Technology } from "./components/sections/Technology";
import { ServicesShowcase } from "./components/sections/ServicesShowcase";
import { Gallery } from "./components/sections/Gallery";
import { Reviews } from "./components/sections/Reviews";
import { FAQ } from "./components/sections/FAQ";
import { CTA } from "./components/sections/CTA";
import { Footer } from "./components/sections/Footer";\n\n` + extract(1350, 1401);

write('src/App.tsx', appTsx);
