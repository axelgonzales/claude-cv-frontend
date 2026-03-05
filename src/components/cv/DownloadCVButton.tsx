import { Download, ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  BorderStyle,
  AlignmentType,
} from 'docx';
import type { Profile, Experience, Education, SkillGroup } from '../../lib/api';

interface Props {
  profile: Profile;
  experiences: Experience[];
  educations: Education[];
  skills: SkillGroup[];
}

// ─── Template registry ────────────────────────────────────────────────────────

interface Template {
  id: string;
  name: string;
  description: string;
  preview: React.ReactNode;
  build: (p: Props) => Document;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function experiencePeriod(exp: Experience) {
  return exp.isCurrent ? `${exp.startDate} – Present` : `${exp.startDate} – ${exp.endDate}`;
}

// ─── Shared: contact line builder ─────────────────────────────────────────────

function contactLine(profile: Profile) {
  return [profile.location, profile.phone, profile.email, profile.linkedin, profile.github]
    .filter(Boolean).join('  •  ');
}

// ─── Shared: experience block builder ─────────────────────────────────────────

function expBlock(
  exp: Experience,
  opts: { font: string; tx: string; mu: string; ac: string; bodySize: number; titleSize: number },
): Paragraph[] {
  const period = experiencePeriod(exp);
  return [
    // Company, Location                                     Date range
    new Paragraph({
      spacing: { before: 200, after: 20 },
      tabStops: [{ type: 'right' as const, position: 9360 }],
      children: [
        new TextRun({ text: exp.company, bold: true, size: opts.titleSize, color: opts.tx, font: opts.font }),
        new TextRun({ text: `\t${period}`, size: opts.bodySize, color: opts.mu, font: opts.font }),
      ],
    }),
    // Job title
    new Paragraph({
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({ text: exp.role, bold: true, italics: true, size: opts.bodySize, color: opts.ac, font: opts.font }),
      ],
    }),
    // Description bullet
    new Paragraph({
      spacing: { before: 20, after: 20 },
      bullet: { level: 0 },
      children: [new TextRun({ text: exp.description, size: opts.bodySize, color: opts.tx, font: opts.font })],
    }),
    // Technologies bullet (if present)
    ...(exp.technologies ? [new Paragraph({
      spacing: { before: 20, after: 40 },
      bullet: { level: 0 },
      children: [
        new TextRun({ text: 'Technologies: ', bold: true, size: opts.bodySize, color: opts.tx, font: opts.font }),
        new TextRun({ text: exp.technologies, size: opts.bodySize, color: opts.mu, font: opts.font }),
      ],
    })] : []),
  ];
}

// ─── Shared: education block builder ──────────────────────────────────────────

function eduBlock(
  edu: Education,
  opts: { font: string; tx: string; mu: string; bodySize: number; titleSize: number },
): Paragraph[] {
  const years = `${edu.startYear}${edu.endYear ? ` – ${edu.endYear}` : ''}`;
  return [
    new Paragraph({
      spacing: { before: 160, after: 20 },
      tabStops: [{ type: 'right' as const, position: 9360 }],
      children: [
        new TextRun({ text: edu.institution, bold: true, size: opts.titleSize, color: opts.tx, font: opts.font }),
        new TextRun({ text: `\t${years}`, size: opts.bodySize, color: opts.mu, font: opts.font }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({ text: `${edu.degree}${edu.field ? ` – ${edu.field}` : ''}`, size: opts.bodySize, color: opts.tx, font: opts.font }),
      ],
    }),
  ];
}

// ─── Template 1: Professional ─────────────────────────────────────────────────
// Based on: web-developer.png — Blue accents, Calibri, clean section borders

function buildProfessional({ profile, experiences, educations, skills }: Props): Document {
  const AC = '2E74B5', TX = '1F1F1F', MU = '666666';
  const FN = 'Calibri', BS = 21, TS = 22;
  const o = { font: FN, tx: TX, mu: MU, ac: AC, bodySize: BS, titleSize: TS };

  const heading = (text: string) => new Paragraph({
    spacing: { before: 300, after: 100 },
    border: { bottom: { color: AC, space: 2, style: BorderStyle.SINGLE, size: 6 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: AC, font: FN })],
  });

  return new Document({
    styles: { default: { document: { run: { font: FN, size: BS, color: TX } } } },
    sections: [{
      properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
      children: [
        // Name
        new Paragraph({
          spacing: { before: 0, after: 40 },
          children: [new TextRun({ text: profile.name, bold: true, size: 52, color: TX, font: FN })],
        }),
        // Title
        new Paragraph({
          spacing: { before: 0, after: 60 },
          children: [new TextRun({ text: profile.title, bold: true, size: 24, color: TX, font: FN })],
        }),
        // Contact line
        new Paragraph({
          spacing: { before: 0, after: 60 },
          children: [new TextRun({ text: contactLine(profile), size: 18, color: MU, font: FN })],
        }),
        // Summary
        new Paragraph({
          spacing: { before: 0, after: 80 },
          border: { bottom: { color: 'CCCCCC', space: 4, style: BorderStyle.SINGLE, size: 4 } },
          children: [new TextRun({ text: profile.summary, size: BS, color: TX, font: FN })],
        }),

        heading('Experience'),
        ...experiences.flatMap(exp => expBlock(exp, o)),

        heading('Skills'),
        ...skills.map(g => new Paragraph({
          spacing: { before: 60, after: 40 },
          children: [
            new TextRun({ text: `${g.category}: `, bold: true, size: BS, color: TX, font: FN }),
            new TextRun({ text: g.items.split(',').map(s => s.trim()).join(', '), size: BS, color: MU, font: FN }),
          ],
        })),

        heading('Education'),
        ...educations.flatMap(edu => eduBlock(edu, o)),
      ],
    }],
  });
}

// ─── Template 2: Classic ──────────────────────────────────────────────────────
// Based on: front-end-web-developer.png — Centered header, Times/Georgia, underlined sections

function buildClassic({ profile, experiences, educations, skills }: Props): Document {
  const TX = '000000', MU = '444444';
  const FN = 'Times New Roman', BS = 21, TS = 22;
  const o = { font: FN, tx: TX, mu: MU, ac: TX, bodySize: BS, titleSize: TS };

  const heading = (text: string) => new Paragraph({
    spacing: { before: 280, after: 80 },
    alignment: AlignmentType.CENTER,
    border: { bottom: { color: TX, space: 2, style: BorderStyle.SINGLE, size: 6 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: TX, font: FN, characterSpacing: 40 })],
  });

  return new Document({
    styles: { default: { document: { run: { font: FN, size: BS, color: TX } } } },
    sections: [{
      properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
      children: [
        // Name centered
        new Paragraph({
          spacing: { before: 0, after: 20 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: profile.name.toUpperCase(), bold: true, size: 44, color: TX, font: FN, characterSpacing: 60 })],
        }),
        // Contact centered
        new Paragraph({
          spacing: { before: 0, after: 20 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: contactLine(profile), size: 18, color: MU, font: FN })],
        }),
        // Title centered
        new Paragraph({
          spacing: { before: 0, after: 60 },
          alignment: AlignmentType.CENTER,
          border: { bottom: { color: TX, space: 4, style: BorderStyle.SINGLE, size: 4 } },
          children: [new TextRun({ text: profile.title, bold: true, size: 22, color: TX, font: FN })],
        }),

        heading('Professional Experience'),
        ...experiences.flatMap(exp => expBlock(exp, o)),

        heading('Skills'),
        ...skills.map(g => new Paragraph({
          spacing: { before: 60, after: 40 },
          bullet: { level: 0 },
          children: [
            new TextRun({ text: `${g.category}: `, bold: true, size: BS, color: TX, font: FN }),
            new TextRun({ text: g.items.split(',').map(s => s.trim()).join(', '), size: BS, color: MU, font: FN }),
          ],
        })),

        heading('Education'),
        ...educations.flatMap(edu => eduBlock(edu, o)),
      ],
    }],
  });
}

// ─── Template 3: Modern ──────────────────────────────────────────────────────
// Based on: front-end-web-developer2.png / freelance-web-developer2.png
// Colored name, left-aligned, teal/red accent, summary paragraph, clean sections

function buildModern({ profile, experiences, educations, skills }: Props): Document {
  const AC = '8B2F2F', TX = '1A1A1A', MU = '5A5A5A';
  const FN = 'Arial', BS = 21, TS = 22;
  const o = { font: FN, tx: TX, mu: MU, ac: AC, bodySize: BS, titleSize: TS };

  const heading = (text: string) => new Paragraph({
    spacing: { before: 300, after: 80 },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 21, color: AC, font: FN, characterSpacing: 30 })],
  });

  // Thin colored line separator
  const sep = () => new Paragraph({
    spacing: { before: 0, after: 100 },
    border: { bottom: { color: AC, space: 1, style: BorderStyle.SINGLE, size: 4 } },
    children: [],
  });

  return new Document({
    styles: { default: { document: { run: { font: FN, size: BS, color: TX } } } },
    sections: [{
      properties: { page: { margin: { top: 720, right: 800, bottom: 720, left: 800 } } },
      children: [
        // Name
        new Paragraph({
          spacing: { before: 0, after: 20 },
          children: [new TextRun({ text: profile.name, bold: true, size: 56, color: AC, font: FN })],
        }),
        // Title
        new Paragraph({
          spacing: { before: 0, after: 40 },
          children: [new TextRun({ text: profile.title, size: 22, color: TX, font: FN })],
        }),
        // Contact
        new Paragraph({
          spacing: { before: 0, after: 60 },
          children: [new TextRun({ text: contactLine(profile), size: 18, color: MU, font: FN })],
        }),
        // Summary paragraph
        new Paragraph({
          spacing: { before: 0, after: 40 },
          children: [new TextRun({ text: profile.summary, size: BS, color: TX, font: FN })],
        }),
        sep(),

        heading('Relevant Work Experience'),
        ...experiences.flatMap(exp => expBlock(exp, o)),

        heading('Skills'),
        ...skills.map(g => new Paragraph({
          spacing: { before: 60, after: 40 },
          children: [
            new TextRun({ text: `${g.category}: `, bold: true, size: BS, color: TX, font: FN }),
            new TextRun({ text: g.items.split(',').map(s => s.trim()).join(', '), size: BS, color: MU, font: FN }),
          ],
        })),

        heading('Education'),
        ...educations.flatMap(edu => eduBlock(edu, o)),
      ],
    }],
  });
}

// ─── Template 4: Compact ─────────────────────────────────────────────────────
// Based on: entry-level-web-developer.png — Dense, compact, fits lots of content
// Centered name, thin separators, small font, maximizes space

function buildCompact({ profile, experiences, educations, skills }: Props): Document {
  const TX = '000000', MU = '333333';
  const FN = 'Calibri', BS = 19, TS = 20;
  const o = { font: FN, tx: TX, mu: MU, ac: TX, bodySize: BS, titleSize: TS };

  const heading = (text: string) => new Paragraph({
    spacing: { before: 200, after: 60 },
    border: { bottom: { color: TX, space: 1, style: BorderStyle.SINGLE, size: 8 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 20, color: TX, font: FN })],
  });

  return new Document({
    styles: { default: { document: { run: { font: FN, size: BS, color: TX } } } },
    sections: [{
      properties: { page: { margin: { top: 540, right: 540, bottom: 540, left: 540 } } },
      children: [
        // Name centered
        new Paragraph({
          spacing: { before: 0, after: 10 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: profile.name.toUpperCase(), bold: true, size: 36, color: TX, font: FN })],
        }),
        // Contact centered
        new Paragraph({
          spacing: { before: 0, after: 10 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: contactLine(profile), size: 16, color: MU, font: FN })],
        }),
        // Title + thin separator
        new Paragraph({
          spacing: { before: 0, after: 40 },
          alignment: AlignmentType.CENTER,
          border: { bottom: { color: TX, space: 2, style: BorderStyle.SINGLE, size: 4 } },
          children: [new TextRun({ text: profile.title, size: 19, color: TX, font: FN })],
        }),

        heading('Education'),
        ...educations.flatMap(edu => [
          new Paragraph({
            spacing: { before: 80, after: 10 },
            tabStops: [{ type: 'right' as const, position: 10200 }],
            children: [
              new TextRun({ text: edu.institution, bold: true, size: TS, color: TX, font: FN }),
              new TextRun({ text: `\t${edu.startYear}${edu.endYear ? ` – ${edu.endYear}` : ''}`, size: BS, color: MU, font: FN }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 20 },
            children: [new TextRun({ text: `${edu.degree}${edu.field ? `, ${edu.field}` : ''}`, size: BS, color: TX, font: FN })],
          }),
        ]),

        heading('Work Experience'),
        ...experiences.flatMap(exp => {
          const period = experiencePeriod(exp);
          return [
            new Paragraph({
              spacing: { before: 140, after: 10 },
              tabStops: [{ type: 'right' as const, position: 10200 }],
              children: [
                new TextRun({ text: exp.company, bold: true, size: TS, color: TX, font: FN }),
                new TextRun({ text: `\t${period}`, size: BS, color: MU, font: FN }),
              ],
            }),
            new Paragraph({
              spacing: { before: 0, after: 30 },
              children: [new TextRun({ text: exp.role, bold: true, italics: true, size: BS, color: TX, font: FN })],
            }),
            new Paragraph({
              spacing: { before: 10, after: 10 },
              bullet: { level: 0 },
              children: [new TextRun({ text: exp.description, size: BS, color: TX, font: FN })],
            }),
            ...(exp.technologies ? [new Paragraph({
              spacing: { before: 10, after: 20 },
              bullet: { level: 0 },
              children: [
                new TextRun({ text: 'Technologies: ', bold: true, size: BS, color: TX, font: FN }),
                new TextRun({ text: exp.technologies, size: BS, color: MU, font: FN }),
              ],
            })] : []),
          ];
        }),

        heading('Technical Skills'),
        ...skills.map(g => new Paragraph({
          spacing: { before: 40, after: 30 },
          children: [
            new TextRun({ text: `${g.category}: `, bold: true, size: BS, color: TX, font: FN }),
            new TextRun({ text: g.items.split(',').map(s => s.trim()).join(', '), size: BS, color: MU, font: FN }),
          ],
        })),
      ],
    }],
  });
}

// ─── SVG Thumbnail Previews ───────────────────────────────────────────────────

function PreviewProfessional() {
  return (
    <svg width="56" height="72" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="72" rx="3" fill="#F8FAFC" />
      <rect x="5" y="6" width="28" height="4" rx="1" fill="#1F1F1F" />
      <rect x="5" y="12" width="16" height="2" rx="1" fill="#2E74B5" />
      <rect x="5" y="16" width="46" height="1" fill="#2E74B5" opacity="0.5" />
      <rect x="5" y="20" width="8" height="2" rx="1" fill="#2E74B5" />
      <rect x="5" y="24" width="46" height="1.5" rx="0.5" fill="#E2E8F0" />
      <rect x="5" y="27" width="40" height="1.5" rx="0.5" fill="#E2E8F0" />
      <rect x="5" y="32" width="10" height="2" rx="1" fill="#2E74B5" />
      <rect x="5" y="36" width="46" height="1.5" rx="0.5" fill="#E2E8F0" />
      <rect x="5" y="39" width="40" height="1.5" rx="0.5" fill="#E2E8F0" />
      <rect x="5" y="42" width="34" height="1.5" rx="0.5" fill="#E2E8F0" />
      <rect x="5" y="47" width="10" height="2" rx="1" fill="#2E74B5" />
      <rect x="5" y="51" width="46" height="1.5" rx="0.5" fill="#E2E8F0" />
      <rect x="5" y="54" width="36" height="1.5" rx="0.5" fill="#E2E8F0" />
      <rect x="5" y="59" width="10" height="2" rx="1" fill="#2E74B5" />
      <rect x="5" y="63" width="46" height="1.5" rx="0.5" fill="#E2E8F0" />
      <rect x="5" y="66" width="30" height="1.5" rx="0.5" fill="#E2E8F0" />
    </svg>
  );
}

function PreviewClassic() {
  return (
    <svg width="56" height="72" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="72" rx="3" fill="#FFFFFF" />
      {/* Centered name */}
      <rect x="12" y="6" width="32" height="5" rx="1" fill="#000000" />
      {/* Centered contact */}
      <rect x="10" y="13" width="36" height="1.5" rx="0.5" fill="#999999" />
      {/* Centered title + line */}
      <rect x="16" y="17" width="24" height="2" rx="1" fill="#000000" />
      <rect x="3" y="21" width="50" height="0.8" fill="#000000" />
      {/* Section header centered */}
      <rect x="10" y="25" width="36" height="2" rx="1" fill="#000000" />
      <rect x="3" y="28.5" width="50" height="0.6" fill="#000000" />
      {/* Experience entries */}
      <rect x="3" y="31" width="30" height="2" rx="0.5" fill="#333333" />
      <rect x="37" y="31" width="16" height="1.5" rx="0.5" fill="#999999" />
      <rect x="3" y="35" width="50" height="1.2" rx="0.5" fill="#E8E8E8" />
      <rect x="3" y="38" width="44" height="1.2" rx="0.5" fill="#E8E8E8" />
      <rect x="3" y="42" width="28" height="2" rx="0.5" fill="#333333" />
      <rect x="37" y="42" width="16" height="1.5" rx="0.5" fill="#999999" />
      <rect x="3" y="46" width="50" height="1.2" rx="0.5" fill="#E8E8E8" />
      <rect x="3" y="49" width="38" height="1.2" rx="0.5" fill="#E8E8E8" />
      {/* Skills */}
      <rect x="10" y="54" width="36" height="2" rx="1" fill="#000000" />
      <rect x="3" y="57.5" width="50" height="0.6" fill="#000000" />
      <rect x="3" y="60" width="50" height="1.2" rx="0.5" fill="#E8E8E8" />
      <rect x="3" y="63" width="40" height="1.2" rx="0.5" fill="#E8E8E8" />
      <rect x="3" y="66" width="46" height="1.2" rx="0.5" fill="#E8E8E8" />
    </svg>
  );
}

function PreviewModern() {
  return (
    <svg width="56" height="72" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="72" rx="3" fill="#FFFFFF" />
      {/* Colored name left */}
      <rect x="5" y="6" width="30" height="5" rx="1" fill="#8B2F2F" />
      {/* Title */}
      <rect x="5" y="13" width="20" height="2" rx="1" fill="#1A1A1A" />
      {/* Contact */}
      <rect x="5" y="17" width="40" height="1.5" rx="0.5" fill="#999999" />
      {/* Summary text */}
      <rect x="5" y="21" width="46" height="1.2" rx="0.5" fill="#E0E0E0" />
      <rect x="5" y="24" width="40" height="1.2" rx="0.5" fill="#E0E0E0" />
      {/* Colored separator */}
      <rect x="5" y="27" width="46" height="0.8" fill="#8B2F2F" />
      {/* Section header */}
      <rect x="5" y="30" width="18" height="2" rx="1" fill="#8B2F2F" />
      {/* Experience */}
      <rect x="5" y="34" width="26" height="2" rx="0.5" fill="#333333" />
      <rect x="37" y="34" width="14" height="1.5" rx="0.5" fill="#999999" />
      <rect x="5" y="38" width="20" height="1.5" rx="0.5" fill="#8B2F2F" opacity="0.6" />
      <rect x="5" y="41" width="46" height="1.2" rx="0.5" fill="#EEEEEE" />
      <rect x="5" y="44" width="38" height="1.2" rx="0.5" fill="#EEEEEE" />
      <rect x="5" y="48" width="24" height="2" rx="0.5" fill="#333333" />
      <rect x="37" y="48" width="14" height="1.5" rx="0.5" fill="#999999" />
      <rect x="5" y="52" width="46" height="1.2" rx="0.5" fill="#EEEEEE" />
      <rect x="5" y="55" width="40" height="1.2" rx="0.5" fill="#EEEEEE" />
      {/* Skills */}
      <rect x="5" y="60" width="10" height="2" rx="1" fill="#8B2F2F" />
      <rect x="5" y="64" width="46" height="1.2" rx="0.5" fill="#EEEEEE" />
      <rect x="5" y="67" width="38" height="1.2" rx="0.5" fill="#EEEEEE" />
    </svg>
  );
}

function PreviewCompact() {
  return (
    <svg width="56" height="72" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="72" rx="3" fill="#FFFFFF" />
      {/* Centered name */}
      <rect x="14" y="4" width="28" height="3.5" rx="1" fill="#000000" />
      {/* Contact centered */}
      <rect x="8" y="9" width="40" height="1" rx="0.5" fill="#999999" />
      {/* Title centered + line */}
      <rect x="16" y="12" width="24" height="1.5" rx="0.5" fill="#333333" />
      <rect x="3" y="15" width="50" height="0.8" fill="#000000" />
      {/* Education section */}
      <rect x="3" y="17" width="14" height="1.5" rx="0.5" fill="#000000" />
      <rect x="3" y="18.5" width="50" height="0.5" fill="#000000" />
      <rect x="3" y="20" width="30" height="1.5" rx="0.5" fill="#333333" />
      <rect x="3" y="23" width="40" height="1" rx="0.5" fill="#E8E8E8" />
      {/* Experience section */}
      <rect x="3" y="26" width="16" height="1.5" rx="0.5" fill="#000000" />
      <rect x="3" y="27.5" width="50" height="0.5" fill="#000000" />
      <rect x="3" y="29" width="26" height="1.5" rx="0.5" fill="#333333" />
      <rect x="37" y="29" width="16" height="1" rx="0.5" fill="#999999" />
      <rect x="3" y="32" width="18" height="1" rx="0.5" fill="#555555" />
      <rect x="3" y="34.5" width="50" height="1" rx="0.5" fill="#E8E8E8" />
      <rect x="3" y="37" width="44" height="1" rx="0.5" fill="#E8E8E8" />
      <rect x="3" y="40" width="24" height="1.5" rx="0.5" fill="#333333" />
      <rect x="37" y="40" width="16" height="1" rx="0.5" fill="#999999" />
      <rect x="3" y="43" width="16" height="1" rx="0.5" fill="#555555" />
      <rect x="3" y="45.5" width="50" height="1" rx="0.5" fill="#E8E8E8" />
      <rect x="3" y="48" width="46" height="1" rx="0.5" fill="#E8E8E8" />
      <rect x="3" y="51" width="22" height="1.5" rx="0.5" fill="#333333" />
      <rect x="37" y="51" width="16" height="1" rx="0.5" fill="#999999" />
      <rect x="3" y="54" width="50" height="1" rx="0.5" fill="#E8E8E8" />
      <rect x="3" y="57" width="38" height="1" rx="0.5" fill="#E8E8E8" />
      {/* Skills */}
      <rect x="3" y="60" width="14" height="1.5" rx="0.5" fill="#000000" />
      <rect x="3" y="61.5" width="50" height="0.5" fill="#000000" />
      <rect x="3" y="63" width="50" height="1" rx="0.5" fill="#E8E8E8" />
      <rect x="3" y="65.5" width="44" height="1" rx="0.5" fill="#E8E8E8" />
      <rect x="3" y="68" width="36" height="1" rx="0.5" fill="#E8E8E8" />
    </svg>
  );
}

// ─── Template list ────────────────────────────────────────────────────────────

const TEMPLATES: Template[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Blue accents, Calibri, clean borders',
    preview: <PreviewProfessional />,
    build: buildProfessional,
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Centered header, serif font, traditional',
    preview: <PreviewClassic />,
    build: buildClassic,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Colored name, summary paragraph, clean',
    preview: <PreviewModern />,
    build: buildModern,
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Dense layout, fits more content',
    preview: <PreviewCompact />,
    build: buildCompact,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DownloadCVButton({ profile, experiences, educations, skills }: Props) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = async (tpl: Template) => {
    setDownloading(tpl.id);
    try {
      const doc = tpl.build({ profile, experiences, educations, skills });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile.name.replace(/\s+/g, '_')}_CV_${tpl.name}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
      setOpen(false);
    }
  };

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '7px 14px', borderRadius: '999px', fontSize: '0.78rem',
    fontFamily: 'var(--cv-font-body)', fontWeight: 500,
    cursor: 'pointer', transition: 'all 0.2s ease',
    background: open ? 'var(--cv-accent-dim)' : 'var(--cv-surface-2)',
    border: `1px solid ${open ? 'var(--cv-accent-border)' : 'var(--cv-border)'}`,
    color: open ? 'var(--cv-accent)' : 'var(--cv-text-secondary)',
  };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={btnStyle}
        onMouseEnter={e => {
          if (open) return;
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--cv-accent-border)';
          el.style.color = 'var(--cv-accent)';
          el.style.background = 'var(--cv-accent-dim)';
        }}
        onMouseLeave={e => {
          if (open) return;
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--cv-border)';
          el.style.color = 'var(--cv-text-secondary)';
          el.style.background = 'var(--cv-surface-2)';
        }}
      >
        <Download size={13} />
        Download CV
        <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 10px)',
          left: 0,
          zIndex: 100,
          background: 'var(--cv-surface)',
          border: '1px solid var(--cv-border)',
          borderRadius: '14px',
          padding: '14px',
          width: '320px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'var(--cv-font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cv-accent)' }}>
              Choose a template
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cv-text-muted)', padding: '2px', display: 'flex', alignItems: 'center' }}
            >
              <X size={13} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {TEMPLATES.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => handleSelect(tpl)}
                disabled={downloading !== null}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  padding: '12px 8px', borderRadius: '10px', cursor: 'pointer',
                  background: 'var(--cv-surface-2)', border: '1px solid var(--cv-border)',
                  transition: 'all 0.15s ease', opacity: downloading && downloading !== tpl.id ? 0.5 : 1,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--cv-accent-border)';
                  el.style.background = 'var(--cv-accent-dim)';
                  el.style.transform = 'translateY(-2px)';
                  el.style.boxShadow = '0 4px 16px var(--cv-accent-glow)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--cv-border)';
                  el.style.background = 'var(--cv-surface-2)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                {downloading === tpl.id ? (
                  <div style={{ width: '56px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '20px', height: '20px', border: '2px solid var(--cv-accent-border)', borderTopColor: 'var(--cv-accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  </div>
                ) : tpl.preview}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--cv-font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--cv-text-primary)', marginBottom: '2px' }}>
                    {tpl.name}
                  </div>
                  <div style={{ fontFamily: 'var(--cv-font-body)', fontSize: '0.65rem', color: 'var(--cv-text-muted)', lineHeight: 1.3 }}>
                    {tpl.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
