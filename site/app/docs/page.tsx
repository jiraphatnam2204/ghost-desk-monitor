import type { Metadata } from "next";
import { DocView } from "@/components/doc-view";
import "../pages.css";
import "./docs.css";

export const metadata: Metadata = {
  title: "Docs",
  description: "Formal write-ups for the course: the project proposal and the final report, in English and Thai, ready to print as PDF.",
};

export default function DocsPage() {
  return (
    <>
      <header className="sheet page-head docs-head">
        <h1>Docs</h1>
        <p className="lede">
          Formal write-ups for the professor · เอกสารทางการส่งอาจารย์ ภาษาอังกฤษและภาษาไทย · Proposal ส่งศุกร์ 30 ต.ค. · Final report โตไปพร้อมงาน ช่องที่ยังต้องเติมมีกรอบบอกไว้
        </p>
      </header>
      <section className="sheet docs-body" aria-label="Documents">
        <DocView />
      </section>
    </>
  );
}
