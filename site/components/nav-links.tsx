"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/equipment", label: "Equipment" },
  { href: "/grading", label: "Grading Criteria" },
  { href: "/build-plan", label: "Build Plan" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/problems", label: "Problems" },
  { href: "/docs", label: "Docs" },
];

export function NavLinks() {
  const path = usePathname();
  const list = React.useRef<HTMLUListElement>(null);

  // on a narrow screen the nav scrolls sideways: keep the current page in view
  React.useEffect(() => {
    list.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [path]);
  return (
    <nav aria-label="หน้าหลัก" className="nav-scroll">
      <ul className="nav-links" ref={list}>
        {LINKS.map((link) => {
          const here = link.href === "/" ? path === "/" : path.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link href={link.href} aria-current={here ? "page" : undefined}>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
