"use client";

import * as React from "react";
import { DESKS, clockControls, deskMoment, useDemoClock } from "@/lib/demo-clock";
import { AWAY_AFTER, RELEASE_AT, STATE_LABEL, WARN_AT, clock, type Moment } from "@/lib/session";

const COLUMNS = 6;
const deskId = (index: number) => `D${String(index + 1).padStart(2, "0")}`;

function passesOf(moment: Moment) {
  if (moment.state === "inUse") return { ink: "pink", count: 1 };
  if (moment.state === "free") return { ink: "green", count: 1 };
  return { ink: "yellow", count: moment.warned ? 2 : 1 };
}

function Seat({ index, moment, selected }: { index: number; moment: Moment; selected: boolean }) {
  const { ink, count } = passesOf(moment);
  const ghost = moment.state === "away";
  const label = `โต๊ะ ${deskId(index)} ${STATE_LABEL[moment.state]}${ghost ? ` มาแล้ว ${clock(moment.awayFor ?? 0)} นาที` : ""}${moment.warned ? " ส่ง LINE เตือนแล้ว" : ""}`;
  return (
    <button
      type="button"
      className="seat"
      data-state={moment.state}
      data-ghost={ghost ? "" : undefined}
      aria-pressed={selected}
      aria-label={label}
      onClick={() => (selected ? clockControls.next(index) : clockControls.select(index))}
    >
      <span className="seat-pass" data-ink={ink} data-pass="1" aria-hidden="true" />
      <span className="seat-pass" data-ink={ink} data-pass="2" data-on={count > 1 ? "" : undefined} aria-hidden="true" />
      <span className="seat-no">{String(index + 1).padStart(2, "0")}</span>
      <span className="seat-state" aria-hidden="true">
        {STATE_LABEL[moment.state]}
        {ghost ? <span className="seat-timer">{clock(moment.awayFor ?? 0)}</span> : null}
      </span>
      {ghost ? <BagMark /> : null}
    </button>
  );
}

// What was left on a ghost desk: a bag, drawn in toner.
function BagMark() {
  return (
    <svg className="seat-bag" viewBox="0 0 24 20" aria-hidden="true" focusable="false">
      <path d="M8 7V5.2C8 3.4 9.6 2 12 2s4 1.4 4 3.2V7" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="7" width="18" height="11" fill="var(--paper)" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 11.5h18" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

const MARKS = [
  { at: 0, label: "ไม่เห็นคน" },
  { at: AWAY_AFTER, label: "โต๊ะโล่ง → ว่าง · มีของ → ไม่อยู่" },
  { at: WARN_AT, label: "LINE เตือนเจ้าของ" },
  { at: RELEASE_AT, label: "ปล่อยโต๊ะ" },
];

function MinuteAxis({ moment }: { moment: Moment }) {
  const away = moment.awayFor;
  const at = away === null ? 0 : Math.min(away, RELEASE_AT);
  const share = (minute: number) => `${(minute / RELEASE_AT) * 100}%`;
  return (
    <div className="axis" data-state={moment.state} data-counting={away !== null ? "" : undefined}>
      <div className="axis-track" aria-hidden="true">
        <span className="axis-sweep" data-pass="1" style={{ transform: `scaleX(${Math.min(at, RELEASE_AT) / RELEASE_AT})` }} />
        <span
          className="axis-sweep"
          data-pass="2"
          style={{ left: share(WARN_AT), width: share(RELEASE_AT - WARN_AT), transform: `scaleX(${Math.max(0, at - WARN_AT) / (RELEASE_AT - WARN_AT)})` }}
        />
        {MARKS.map((mark) => (
          <span key={mark.at} className="axis-tick" style={{ left: share(mark.at) }} />
        ))}
        <span className="axis-rail" style={{ transform: `translateX(${share(at)})` }}>
          <span className="axis-now" />
        </span>
      </div>
      <ol className="axis-marks">
        {MARKS.map((mark) => (
          <li key={mark.at} style={{ left: share(mark.at) }} data-passed={away !== null && away >= mark.at ? "" : undefined}>
            <b>{mark.at} นาที</b>
            <span>{mark.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SeatingPlan() {
  const { minute, selected, playing } = useDemoClock();
  const moments = Array.from({ length: DESKS }, (_, index) => deskMoment(minute, index));
  const chosen = moments[selected];
  // the most recent LINE warning anywhere in the room
  const warned = moments
    .map((moment, index) => ({ moment, index }))
    .filter(({ moment }) => moment.warned)
    .sort((a, b) => (a.moment.awayFor ?? 0) - (b.moment.awayFor ?? 0))[0];
  const counts = moments.reduce(
    (tally, moment) => ({ ...tally, [moment.state]: tally[moment.state] + 1 }),
    { free: 0, inUse: 0, away: 0 } as Record<Moment["state"], number>,
  );

  return (
    <div className="plan">
      <div className="plan-head">
        <div>
          <span className="field-label">ผังที่นั่ง</span>
          <p className="plan-room">ห้องอ่านหนังสือ ชั้น 3 · 24 โต๊ะ</p>
        </div>
        <div>
          <span className="field-label">ตอนนี้ในห้อง</span>
          <p className="plan-tally" aria-live="off">
            <span className="hl" data-ink="green">ว่าง {counts.free}</span> <span className="hl" data-ink="pink">ใช้งาน {counts.inUse}</span>{" "}
            <span className="hl" data-ink="yellow">ไม่อยู่ {counts.away}</span>
          </p>
        </div>
        <span className="stamp plan-stamp">
          จำลอง
          <small>ไม่ใช่ข้อมูลจริง</small>
        </span>
      </div>

      <div className="room">
        <div className="room-front" aria-hidden="true">
          <span>หน้าห้อง · เคาน์เตอร์บรรณารักษ์</span>
        </div>
        <div className="seats" role="group" aria-label="ผังโต๊ะ 24 ตัว กดโต๊ะเพื่อดูสถานะ กดซ้ำเพื่อข้ามไปเหตุการณ์ถัดไป">
          {moments.map((moment, index) => (
            <React.Fragment key={index}>
              {index % COLUMNS === COLUMNS / 2 ? <span className="aisle" aria-hidden="true" /> : null}
              <Seat index={index} moment={moment} selected={index === selected} />
            </React.Fragment>
          ))}
        </div>
        <div className="room-door" aria-hidden="true">
          <span>ทางเข้า</span>
        </div>
      </div>

      <div className="plan-desk">
        <div className="plan-desk-id">
          <span className="field-label">โต๊ะที่เลือก</span>
          <p>
            <b>{deskId(selected)}</b>
            <span className="plan-desk-state" aria-live="polite">
              {STATE_LABEL[chosen.state]}
              {chosen.awayFor !== null ? ` · ไม่เห็นคนมา ${clock(chosen.awayFor)}` : ""}
            </span>
          </p>
        </div>
        <MinuteAxis moment={chosen} />
        {warned ? (
          <p className="line-slip" aria-live="polite">
            <span className="field-label">LINE · Ghost-Desk Official Account</span>
            <span>
              โต๊ะ {deskId(warned.index)} ไม่มีคน {Math.floor(warned.moment.awayFor ?? 0)} นาที จะปล่อยใน {Math.max(1, Math.ceil(RELEASE_AT - (warned.moment.awayFor ?? 0)))} นาที
            </span>
          </p>
        ) : null}
        <div className="plan-controls">
          <button type="button" className="action" onClick={() => clockControls.next()}>
            ข้ามไปเหตุการณ์ถัดไป
          </button>
          <button type="button" className="action" onClick={() => clockControls.toggle()} aria-pressed={!playing}>
            {playing ? "หยุดเวลา" : "เดินเวลาต่อ"}
          </button>
        </div>
      </div>
    </div>
  );
}
