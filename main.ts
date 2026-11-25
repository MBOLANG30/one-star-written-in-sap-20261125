import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One-line, one-star review written by a houseplant about its human owner.
// Grievance: erratic watering on a rigid schedule, then being dragged into
// full sun and blamed for the sunburn — a plant's-eye complaint, in one line.
const REVIEW =
  "One star. He waters me every third Tuesday, thirsty or drowning, then drags my pot into full sun and calls it a holiday — I got sunburned in my own living room, and he blamed the window.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Validate the review before writing anything.
if (REVIEW.length < 1 || REVIEW.length > 279) {
  console.error(`review must be 1-279 characters, got ${REVIEW.length}`);
  process.exit(1);
}
if (REVIEW.includes("\n") || REVIEW.includes("\r")) {
  console.error("review must be a single line");
  process.exit(1);
}
if (REVIEW !== REVIEW.trim()) {
  console.error("review must not have leading or trailing whitespace");
  process.exit(1);
}
for (const ch of REVIEW) {
  const code = ch.charCodeAt(0);
  // Reject C0 controls, DEL, and C1 controls — the entry must be plain text.
  if ((code < 0x20 && ch !== "\t") || (code >= 0x7f && code <= 0x9f)) {
    console.error("review must not contain control characters");
    process.exit(1);
  }
}

// Create the output directory (never delete it) and write the entry.
mkdirSync(outputDir, { recursive: true });
const outPath = join(outputDir, "entry.txt");
writeFileSync(outPath, REVIEW, "utf8");

// Read back and confirm the file holds exactly the intended line.
const written = readFileSync(outPath, "utf8");
if (written !== REVIEW) {
  console.error("entry.txt does not match the intended review");
  process.exit(1);
}
console.log(`wrote ${outPath} (${REVIEW.length} characters)`);
