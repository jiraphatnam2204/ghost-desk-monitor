---
name: Ghost-Desk Monitor
description: Showcase site for a library desk sign that knows whether someone is really seated, drawn as an exam-season seating plan pinned up in a reading room.
colors:
  stamp-violet: "#5a3fc0"
  hl-pink: "#ff8cc6"
  hl-yellow: "#ffe94a"
  hl-green: "#96f07e"
  paper: "#f8f9fb"
  paper-shadow: "#eceef2"
  toner: "#1b1c1e"
  toner-press: "#33353a"
  toner-2: "#474a4f"
  toner-3: "#6b6e73"
  rule-soft: "#c5c9d0"
  rule-faint: "#dfe2e7"
typography:
  display:
    fontFamily: "Sarabun, Leelawadee UI, Tahoma, sans-serif"
    fontSize: "clamp(52px, 9vw, 136px)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Sarabun, Leelawadee UI, Tahoma, sans-serif"
    fontSize: "clamp(30px, 4.6vw, 54px)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Sarabun, Leelawadee UI, Tahoma, sans-serif"
    fontSize: "clamp(24px, 2.6vw, 32px)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  seat-number:
    fontFamily: "Sarabun, Leelawadee UI, Tahoma, sans-serif"
    fontSize: "clamp(20px, 3.4vw, 44px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  lede:
    fontFamily: "Sarabun, Leelawadee UI, Tahoma, sans-serif"
    fontSize: "clamp(18px, 1.6vw, 21px)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Sarabun, Leelawadee UI, Tahoma, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
    fontFeature: "\"tnum\" 1"
  label:
    fontFamily: "Sarabun, Leelawadee UI, Tahoma, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.04em"
  code:
    fontFamily: "JetBrains Mono, Consolas, monospace"
    fontSize: "0.84em"
    fontWeight: 400
rounded:
  none: "0px"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  sheet: "1240px"
  measure: "68ch"
  row: "14px"
  section-top: "clamp(40px, 6vw, 72px)"
  section-bottom: "clamp(48px, 7vw, 88px)"
components:
  button-primary:
    backgroundColor: "{colors.toner}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.toner-press}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.toner}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.paper-shadow}"
    textColor: "{colors.toner}"
  stamp:
    textColor: "{colors.stamp-violet}"
    rounded: "{rounded.none}"
    padding: "6px 14px 7px"
  seat-cell:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.toner}"
    rounded: "{rounded.none}"
    height: "clamp(64px, 9vw, 116px)"
  nav-link:
    textColor: "{colors.toner-2}"
    padding: "16px 6px"
  nav-link-current:
    textColor: "{colors.toner}"
---

# Design System: Ghost-Desk Monitor

## Overview

**Creative North Star: "The Exam-Season Seating Plan"**

Every surface is a photocopied notice pinned up in a library reading room during exam season: cool white sheets, toner-black ruled grids, official header fields, and a numbered seat cell for every desk. The only colour on the page is what a person adds by hand to a printed plan: three highlighter inks marking which seats are really taken, and one violet rubber stamp for status. Everything else is achromatic toner.

The page is dense the way a form is dense: ruled rows, small field labels against very large numbers, double rules under totals. Sections are ruled sheets separated by a 2px toner rule, never boxed into cards. Depth comes only from the isometric device drawings, which are inked in the same toner on the same paper. Absence is drawn on purpose: a ghost desk is a dashed cell holding a belongings mark, an unknown name is an empty dotted field, a missing measurement is a dashed blank to be filled in.

Motion is a highlighter stroke being drawn: passes scale in from the left on a slow ease-out, and the minute axis sweeps linearly. Nothing bounces, fades in on scroll, or floats.

**Key Characteristics:**
- Achromatic toner-on-paper text field; colour only on state marks.
- Three highlighter inks are the whole state system (pink in use, yellow away, green free); a second yellow pass stacks urgency.
- One violet rubber stamp, rotated, multiplied onto the paper.
- Square corners on every container; ruled lines instead of boxes and shadows.
- Sarabun throughout, at weight 800 for numbers and headings, with tiny 12px field labels set against them.
- Isometric line drawings rendered in the page's own toner on the page's own paper.

## Colors

Photocopy paper and toner carry every word; three fluorescent highlighters and one violet stamp ink are the only hues, and each means a state.

### Primary
- **Rubber-Stamp Violet** (stamp-violet): the status stamp ink on the notice header and the plan head, the "now" line on the minute axis while a countdown runs, and the focus ring on every interactive element. It is the one ink that speaks for the office rather than for a seat.

### Secondary
- **In-Use Pink** (hl-pink): highlighter pass on a seat, the axis sweep, the device's prism face, and the word "in use" in running text when that state is named.
- **Away Yellow** (hl-yellow): the away pass; laid down twice (second pass lower, rotated the other way, 0.7-0.85 opacity) once the 20-minute LINE warning has gone out. Also the default ink of the inline highlighter.
- **Free Green** (hl-green): the release pass when a desk is freed, and the word "free" in running text.

### Neutral
- **Photocopy White** (paper): the page, every sheet, every seat cell, figure plates, secondary buttons.
- **Copier Glass Grey** (paper-shadow): hover fill of secondary buttons, code-block and inline-code ground, scrollbar track.
- **Toner Black** (toner): body text, headings, every structural rule (header borders, seat outlines, section rules, double totals rules), the primary button fill.
- **Toner Pressed** (toner-press): primary button hover.
- **Second-Pass Toner** (toner-2): field labels, notes, secondary descriptions, inactive nav links, references at the right of section heads.
- **Faded Toner** (toner-3): link underlines at rest, spare/placeholder rows, scrollbar thumb.
- **Soft Rule** (rule-soft): row dividers inside registers and lists, the chair mark under each seat.
- **Faint Rule** (rule-faint): sub-row dividers nested inside tier lists.

### Named Rules
**The Ink Means State Rule.** Highlighter inks and the stamp violet appear only on state marks: seat passes, the axis sweep, the prism face, a state word in text, the stamp, and focus. Never as decoration, section tint, icon colour or link colour.

**The Multiply Rule.** Highlighter passes and the stamp sit on paper with `mix-blend-mode: multiply`, so toner text stays legible through them and stacked passes darken like real ink.

## Typography

**Display Font:** Sarabun (with Leelawadee UI, Tahoma, sans-serif), loaded via next/font in weights 300-800, Thai and Latin subsets.
**Body Font:** Sarabun, same stack.
**Label/Mono Font:** JetBrains Mono (with Consolas, monospace), for code and message formats only.

**Character:** Sarabun is the Thai official-document face, so the whole site reads as a notice from an office. Weight 800 with tight negative tracking does the shouting; weight 600 small labels do the filing.

### Hierarchy
- **Display** (800, clamp(52px, 9vw, 136px), 0.86, -0.045em): the project name on the notice header; inner page titles use the same face at clamp(56px, 10vw, 132px) with looser leading for Thai stacking.
- **Headline** (800, clamp(30px, 4.6vw, 54px), 1.15, -0.02em): section heads on each ruled sheet.
- **Title** (800, clamp(24px, 2.6vw, 32px), 1.15): tier names and part names inside a sheet.
- **Seat Number** (800, clamp(20px, 3.4vw, 44px), 0.95, -0.03em): seat cell numbers; the selected desk ID runs larger at clamp(36px, 5vw, 56px).
- **Lede** (400, clamp(18px, 1.6vw, 21px), 1.6): opening paragraph of a section, capped at 68ch.
- **Body** (400, 17px, 1.65, tabular figures on): running text, capped at 68ch. Notes drop to 15-15.5px in Second-Pass Toner.
- **Label** (600, 12px, 0.04em): header-field labels, room labels (front of room, door), register column heads (700, 12.5px, 0.03em). Never uppercase; the system sets Thai and English labels in sentence case.

### Named Rules
**The Full Scale Rule.** Numbers (seat numbers, desk IDs, dates, prices) set big and heavy against tiny field labels. The contrast between a 12px label and a 44px number is the hierarchy.

**The Mono Is For Code Rule.** JetBrains Mono appears only inside `code` and `pre`. Labels, numbers and readouts stay in Sarabun.

## Layout

A single centred sheet (max 1240px) with a fluid gutter (clamp(16px, 4vw, 48px)). Each section is a ruled sheet: a 2px toner rule across the top inset by the gutter, clamp(40-72px) above and clamp(48-88px) below. Section heads are a two-column grid: the headline left, a small right-aligned reference (count or document ref) at the baseline right.

Content inside a sheet runs as asymmetric two-column splits (roughly 1.2-1.75 : 1) that collapse to one column between 860 and 960px. Lists are registers: a 2px rule on top, 1px soft rules between rows, about 12-14px row padding, and a 4px double rule under totals. The home seating plan is 4 rows by 6 seats split by an aisle, with a front-of-room rule above and a door mark below; on narrow screens seat state text hides and the seat keeps its number and ink.

The masthead is sticky, 60px tall, paper ground with a 1px toner rule below. The colophon sits under a 4px double rule in a four-column grid (two at 900px, one at 520px).

## Elevation & Depth

The system is flat. There are no shadows on any surface; the isometric figure plates have their kit shadow explicitly removed and replaced by a 2px toner border. Depth exists only inside the isometric drawings of the node and gateway, which are re-themed to toner greys on paper (face white, shades stepping from #d7dbe2 to #f1f3f6, 1.4px edges). Layering is shown by line weight: 1px soft rules, 1.5px cell outlines, 2px sheet and header rules, 3px front-of-room and selection marks, 4px double rules for totals.

### Named Rules
**The Ruled Sheet Rule.** Separation is a line, never a shadow, tint panel or card. If two things need distance, rule them apart.

## Shapes

Every container is square-cornered (0px): seat cells, header fields, buttons, the plan, figure plates, code blocks, stamps. Borders are solid toner at 1.5-2px, or dashed when a thing is absent (ghost desk, blank figure, spare row) and dotted for an unfilled name field. The only soft shapes are the highlighter passes themselves: irregular radii (around 0.18em 0.32em 0.22em 0.4em on text, 6px 14px 8px 16px on seats) with a slight skew and rotation, because that is how a chisel-tip highlighter lands. The stamp is a doubled rectangle (2px border plus 1px outline offset 2px) rotated -4deg.

## Components

### Buttons
Form controls on an official notice: square, ruled, heavy label.
- **Shape:** square (0px), 2px toner border, min-height 48px (44px inside the plan controls).
- **Primary:** Toner Black fill, Photocopy White label, weight 700, 17px, padding 10px 20px, optional 18px line icon.
- **Hover / Focus:** primary darkens to Toner Pressed, secondary fills Copier Glass Grey, 0.18s ease-out; focus is a 2px Rubber-Stamp Violet outline offset 3px.
- **Secondary:** paper fill, toner label and border.

### Status Stamp
A violet rubber-stamp mark carrying the project or plan status: 2px violet border plus a 1px outline offset 2px, weight 800 15px text tracked 0.06em with an optional 11px small line, rotated -4deg, multiplied at 0.88 opacity. One per header.

### Inline Highlighter
A state word in running text gets a pass behind it: a skewed, slightly rotated block of ink in multiply. Yellow by default, pink and green by ink attribute, with an optional second pass offset downward for escalated urgency.

### Header Fields
The notice's ruled field grid: two columns inside a 2px toner border, 1px rules between cells, a 12px label above a 600-weight 16px value. Unknown values stay as designed empty cells.

### Registers (tables and ruled lists)
Column heads 700 12.5px over a 2px rule; rows on 1px soft rules; numeric columns right-aligned with tabular figures; totals rows under a 2px rule and over a 4px double rule. Below 560px, rows stack into a grid and the header hides. Numbered lists beside figures use a 26px square counter box that inverts to toner when its part is active.

### Navigation
Sticky masthead with a seat-cell mark and the project name (light 600 with an 800 bold word). Links are 600 16px in Second-Pass Toner; hover darkens to toner and draws a 3px toner underline to 35%; the current page holds the full underline. On phones the wordmark text hides and links tighten to 15px.

### Seat Cell (signature)
The seating-plan desk: a square 1.5px toner cell on paper, a 44px max weight-800 seat number top-left, state and timer in small 600 text at the bottom, a soft chair rule under the cell. State is a highlighter pass scaling in from the left over 0.55s; away at 20 minutes adds a second pass rotated the other way. A ghost desk turns its border dashed and shows a belongings mark top-right. Selection is a 3px toner outline offset 3px; focus is the same in violet.

### Minute Axis (signature)
Every time event sits on one shared axis under the plan: a 22px track between a 2px and a 1px rule, ticks at 0, 2, 20 and 30 minutes, a highlighter sweep filling linearly in the current state's ink, and a 3px "now" line that turns violet while counting. Labels below are 13px Second-Pass Toner, darkening once passed.

### Isometric Figure Plate
Node and gateway drawings from the anatomy kit, re-themed to the site's toner and paper, inside a square plate with a 2px toner border and Sarabun corner labels. Pointing at a part in the adjacent list draws that part's edges at 2.6px in black with a cool grey fill; the prism face takes the current highlighter ink.

## Do's and Don'ts

### Do:
- **Do** keep every text and structural element in toner on paper; reach for pink, yellow, green or violet only to mark a state.
- **Do** draw absence on purpose: dashed cells for ghost desks, dashed blanks for missing figures, dotted empty fields for unknown names.
- **Do** separate content with rules at the established weights (1px soft, 2px toner, 4px double for totals).
- **Do** set numbers at full scale (weight 800, tight tracking) against 12px field labels.
- **Do** put every time event on the shared 0 · 2 · 20 · 30 minute axis.
- **Do** blend highlighter passes and the stamp with multiply so text reads through.

### Don't:
- **Don't** use cards, drop shadows, decorative gradients or rounded panels; sections are ruled sheets.
- **Don't** use highlighter inks as backgrounds for sections, buttons or links, or invent a fourth state colour.
- **Don't** use JetBrains Mono for labels, numbers or headings.
- **Don't** fill unknown names or measurements with placeholder values; leave the designed blank.
- **Don't** add a second stamp colour or more than one stamp per header.
