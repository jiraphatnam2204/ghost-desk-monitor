"use client";

import * as React from "react";
import { PROPOSAL, REPORT, type Block, type Doc, type Lang } from "@/lib/docs-content";
import { BlockDiagram, StateDiagram } from "./doc-figures";
import { Enlarge } from "./enlarge";

const DOCS: Doc[] = [PROPOSAL, REPORT];
const STATUS: Record<"ready" | "draft" | "todo", Record<Lang, string>> = {
  ready: { en: "Ready", th: "พร้อม" },
  draft: { en: "Draft", th: "ร่าง" },
  todo: { en: "To write", th: "ยังต้องเขียน" },
};

// **bold**, *italic* and `code`, the only inline marks the content uses.
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
        if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}

function BlockView({ block, lang }: { block: Block; lang: Lang }) {
  switch (block.kind) {
    case "p":
      return (
        <p>
          <Inline text={block.text[lang]} />
        </p>
      );
    case "list": {
      const items = block.items.map((item, index) => (
        <li key={index}>
          <Inline text={item[lang]} />
        </li>
      ));
      return block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case "table":
      return (
        <div className="scroll-x">
          <table className="register doc-table">
            {block.caption ? (
              <caption>
                <Inline text={block.caption[lang]} />
              </caption>
            ) : null}
            <thead>
              <tr>
                {block.head.map((cell, index) => (
                  <th key={index} className={block.numeric?.includes(index) ? "num" : undefined}>
                    <Inline text={cell[lang]} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, index) => (
                    <td key={index} className={block.numeric?.includes(index) ? "num" : undefined}>
                      <Inline text={cell[lang]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "figure":
      return (
        <Enlarge openOnClick className="doc-enlarge">
          <figure className="doc-figure">
            <div data-enlarge-window="">{block.figure === "block-diagram" ? <BlockDiagram lang={lang} /> : <StateDiagram lang={lang} />}</div>
            <figcaption>
              <Inline text={block.caption[lang]} />
            </figcaption>
          </figure>
        </Enlarge>
      );
    case "code":
      return (
        <figure className="doc-code">
          <pre>{block.code}</pre>
          {block.caption ? (
            <figcaption>
              <Inline text={block.caption[lang]} />
            </figcaption>
          ) : null}
        </figure>
      );
    case "todo":
      return (
        <p className="doc-todo">
          <span className="doc-todo-mark">{lang === "th" ? "ต้องเติม" : "To fill in"}</span>
          <Inline text={block.text[lang]} />
        </p>
      );
  }
}

const PRINT_NAME: Record<Doc["id"], Record<Lang, string>> = {
  proposal: { en: "Project proposal", th: "ข้อเสนอโครงงาน" },
  report: { en: "Final report", th: "รายงานฉบับสมบูรณ์" },
};

// The page title becomes the PDF's file name, so name it after the document while the print dialog is open.
function printDoc(title: string) {
  const previous = document.title;
  const restore = () => {
    document.title = previous;
    window.removeEventListener("afterprint", restore);
  };
  window.addEventListener("afterprint", restore);
  document.title = title;
  window.print();
}

export function DocView() {
  const [docId, setDocId] = React.useState<Doc["id"]>("proposal");
  const [lang, setLang] = React.useState<Lang>("en");

  const doc = DOCS.find((item) => item.id === docId) ?? PROPOSAL;
  const counts = doc.sections.reduce((tally, section) => ({ ...tally, [section.status]: (tally[section.status] ?? 0) + 1 }), {} as Record<string, number>);

  return (
    <div className="doc-shell">
      <div className="doc-toolbar">
        <div className="chips" role="group" aria-label="เอกสาร">
          {DOCS.map((item) => (
            <button key={item.id} type="button" className="chip" aria-pressed={item.id === doc.id} onClick={() => setDocId(item.id)}>
              {item.id === "proposal" ? "Proposal · ข้อเสนอโครงงาน" : "Final report · รายงาน"}
            </button>
          ))}
        </div>
        <div className="chips lang" role="group" aria-label="ภาษา">
          <button type="button" className="chip" aria-pressed={lang === "en"} onClick={() => setLang("en")} lang="en">
            English
          </button>
          <button type="button" className="chip" aria-pressed={lang === "th"} onClick={() => setLang("th")} lang="th">
            ไทย
          </button>
        </div>
        <button type="button" className="action" onClick={() => printDoc(`Ghost-Desk Monitor - ${PRINT_NAME[doc.id].en} (${lang.toUpperCase()})`)}>
          Print / Save PDF
        </button>
      </div>

      <div className="doc-layout">
        <nav className="doc-toc" aria-label={lang === "th" ? "สารบัญ" : "Contents"}>
          <span className="field-label">{lang === "th" ? "สารบัญ" : "Contents"}</span>
          <ol>
            {doc.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${doc.id}-${section.id}`}>{section.title[lang]}</a>
                <span className="doc-status" data-status={section.status}>
                  {STATUS[section.status][lang]}
                </span>
              </li>
            ))}
          </ol>
          <p className="note">
            {Object.entries(counts)
              .map(([status, n]) => `${n} ${STATUS[status as keyof typeof STATUS][lang]}`)
              .join(" · ")}
          </p>
        </nav>

        <article className="doc-paper" lang={lang}>
          {/* A table only when printing: its head and foot repeat on every page and stand in for page margins,
              because the @page margins are zero to keep the browser's URL and date out of the PDF. */}
          <table className="print-frame" role="presentation">
            <thead>
              <tr>
                <td>
                  <div className="print-space" />
                </td>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td>
                  <div className="print-foot">{`Ghost-Desk Monitor · ${PRINT_NAME[doc.id][lang]} · Embedded System (CEDT) 2026`}</div>
                </td>
              </tr>
            </tfoot>
            <tbody>
              <tr>
                <td>
                  <header className="doc-head">
                    <h2>{doc.title[lang]}</h2>
                    <p className="doc-subtitle">{doc.subtitle[lang]}</p>
                    <dl className="doc-meta">
                      {doc.meta.map((item) => (
                        <div key={item.label.en}>
                          <dt>{item.label[lang]}</dt>
                          <dd>
                            <Inline text={item.value[lang]} />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </header>
                  {doc.sections.map((section) => (
                    <section key={section.id} id={`${doc.id}-${section.id}`} className="doc-section" data-status={section.status}>
                      <h3>
                        {section.title[lang]}
                        <span className="doc-status" data-status={section.status}>
                          {STATUS[section.status][lang]}
                        </span>
                      </h3>
                      {section.blocks.map((block, index) => (
                        <BlockView key={index} block={block} lang={lang} />
                      ))}
                    </section>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </div>
  );
}
