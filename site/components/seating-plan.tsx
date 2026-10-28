"use client";

import * as React from "react";
import { DESKS, SPEEDS, clockControls, deskMoment, isPresent, noticesOf, roomTime, useDemoClock } from "@/lib/demo-clock";
import { AWAY_AFTER, RELEASE_AT, STATE_LABEL, WARN_AT, clock, type Moment } from "@/lib/session";
import { PERSONA_LABEL, STORY } from "@/lib/story";

const COLUMNS = 6;
const deskId = (index: number) => `D${String(index + 1).padStart(2, "0")}`;

function passesOf(moment: Moment) {
  if (moment.state === "inUse") return { ink: "pink", count: 1 };
  if (moment.state === "free") return { ink: "green", count: 1 };
  return { ink: "yellow", count: moment.warned ? 2 : 1 };
}

function Seat({ index, moment, selected, story }: { index: number; moment: Moment; selected: boolean; story: boolean }) {
  const { ink, count } = passesOf(moment);
  const ghost = moment.state === "away";
  const label = `โต๊ะ ${deskId(index)} ${STATE_LABEL[moment.state]}${ghost ? ` มาแล้ว ${clock(moment.awayFor ?? 0)} นาที` : ""}${moment.warned ? " ส่ง LINE เตือนแล้ว" : ""}`;
  return (
    <button
      type="button"
      className="seat"
      data-state={moment.state}
      data-ghost={ghost ? "" : undefined}
      data-story={story ? "" : undefined}
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

function StoryBar({ story }: { story: number | null }) {
  const step = story === null ? null : STORY[story];
  if (!step || story === null) {
    return (
      <div className="story">
        <div className="story-start">
          <div>
            <b>เล่า use case ทีละขั้น</b>
            <span>
              {STORY.length} ขั้น บนโต๊ะ D07, D15 และ D20 · ระหว่างนำเสนอใช้ <kbd>←</kbd> <kbd>→</kbd>
            </span>
          </div>
          <button type="button" className="action" data-primary="" onClick={() => clockControls.story(0)}>
            เริ่ม story
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="story" data-on="">
      <div className="story-steps" role="group" aria-label="ขั้นของ use case">
        {STORY.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className="story-dot"
            aria-current={index === story ? "step" : undefined}
            data-done={index < story ? "" : undefined}
            onClick={() => clockControls.story(index)}
            title={item.title}
          >
            {index + 1}
          </button>
        ))}
        <button type="button" className="text-button story-exit" onClick={() => clockControls.reset()}>
          ออกจาก story
        </button>
      </div>
      <div className="story-body">
        <div className="story-card" aria-live="polite">
          <span className="story-persona">{PERSONA_LABEL[step.persona]}</span>
          <h3>
            {story + 1}. {step.title}
          </h3>
          <p>{step.text}</p>
        </div>
        <div className="story-nav">
          <button type="button" className="action" onClick={() => clockControls.story(story - 1)} disabled={story === 0}>
            ← ก่อนหน้า
          </button>
          <button type="button" className="action" data-primary="" onClick={() => clockControls.story(story + 1)} disabled={story === STORY.length - 1}>
            ถัดไป →
          </button>
        </div>
      </div>
    </div>
  );
}

export function SeatingPlan() {
  const { minute, selected, playing, speed, manual, story } = useDemoClock();
  const moments = Array.from({ length: DESKS }, (_, index) => deskMoment(minute, index, manual));
  const chosen = moments[selected];
  const counts = moments.reduce(
    (tally, moment) => ({ ...tally, [moment.state]: tally[moment.state] + 1 }),
    { free: 0, inUse: 0, away: 0 } as Record<Moment["state"], number>,
  );
  const notices = noticesOf(manual, minute);
  const storyDesks = story === null ? [] : Object.keys(manual).map(Number);
  // during the story only its desks speak, so the narration isn't drowned by the rest of the room
  const speaks = (desk: number) => story === null || storyDesks.includes(desk);
  // LINE: messages from desks someone is driving, plus any other desk warned right now
  const inbox = [
    ...notices.filter((notice) => notice.kind === "warn").map((notice) => ({ desk: notice.desk, at: notice.at })),
    ...moments
      .map((moment, desk) => ({ moment, desk }))
      .filter(({ moment, desk }) => moment.warned && !manual[desk] && speaks(desk))
      .map(({ moment, desk }) => ({ desk, at: minute - (moment.awayFor ?? 0) + WARN_AT })),
  ].sort((a, b) => b.at - a.at);
  const leftovers = moments.map((moment, desk) => ({ moment, desk })).filter(({ moment, desk }) => moment.state === "away" && speaks(desk));
  const released = notices.filter((notice) => notice.kind === "release");
  const freeDesks = moments.map((moment, desk) => ({ moment, desk })).filter(({ moment }) => moment.state === "free");
  const present = manual[selected] ? isPresent(manual[selected], minute) : chosen.state === "inUse" && chosen.awayFor === null;

  // presenter keys: space pauses, arrows walk the story, N jumps the selected desk to its next event
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable]") || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === " " && !target.closest("button, a, summary")) {
        event.preventDefault();
        clockControls.toggle();
      } else if (event.key === "ArrowRight" && story !== null) {
        clockControls.story(story + 1);
      } else if (event.key === "ArrowLeft" && story !== null) {
        clockControls.story(story - 1);
      } else if (event.key.toLowerCase() === "n") {
        clockControls.next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [story]);

  return (
    <div className="plan">
      <div className="plan-head">
        <p className="plan-room">
          <span className="field-label">ผังที่นั่ง</span>
          ห้องอ่านหนังสือ ชั้น 3 · 24 โต๊ะ
        </p>
        <p className="plan-tally" aria-live="off">
          <span className="hl" data-ink="green">ว่าง {counts.free}</span> <span className="hl" data-ink="pink">ใช้งาน {counts.inUse}</span>{" "}
          <span className="hl" data-ink="yellow">ไม่อยู่ {counts.away}</span>
        </p>
        <span className="stamp plan-stamp">
          จำลอง
          <small>ไม่ใช่ข้อมูลจริง</small>
        </span>
      </div>

      <div className="plan-main">
        <div className="plan-floor">
          <div className="room">
            <div className="room-front" aria-hidden="true">
              <span>หน้าห้อง · เคาน์เตอร์บรรณารักษ์</span>
            </div>
            <div className="seats" role="group" aria-label="ผังโต๊ะ 24 ตัว กดโต๊ะเพื่อเลือก กดซ้ำเพื่อข้ามไปเหตุการณ์ถัดไป">
              {moments.map((moment, index) => (
                <React.Fragment key={index}>
                  {index % COLUMNS === COLUMNS / 2 ? <span className="aisle" aria-hidden="true" /> : null}
                  <Seat index={index} moment={moment} selected={index === selected} story={storyDesks.includes(index)} />
                </React.Fragment>
              ))}
            </div>
            <div className="room-door" aria-hidden="true">
              <span>ทางเข้า</span>
            </div>
          </div>
          <div className="plan-axis">
            <span className="field-label">เส้นเวลาโต๊ะ {deskId(selected)} · นับจากตอนที่ไม่เห็นคน</span>
            <MinuteAxis moment={chosen} />
          </div>
        </div>

        <div className="plan-rail">
          <StoryBar story={story} />

          <div className="rail-desk">
            <p className="plan-desk-id">
              <span className="field-label">โต๊ะที่เลือก · กดโต๊ะในผังเพื่อเปลี่ยน</span>
              <b>{deskId(selected)}</b>
              <span className="plan-desk-state" aria-live="polite">
                {STATE_LABEL[chosen.state]}
                {chosen.awayFor !== null ? ` · ไม่เห็นคนมา ${clock(chosen.awayFor)}` : ""}
              </span>
            </p>
            <div className="desk-actions" role="group" aria-label={`ทำอะไรที่โต๊ะ ${deskId(selected)}`}>
              {present ? (
                <>
                  <button type="button" className="action" onClick={() => clockControls.act("leave-items")}>
                    ลุก · ทิ้งกระเป๋าไว้
                  </button>
                  <button type="button" className="action" onClick={() => clockControls.act("leave-clean")}>
                    ลุก · เก็บของกลับ
                  </button>
                </>
              ) : (
                <button type="button" className="action" onClick={() => clockControls.act("sit")}>
                  {chosen.state === "away" ? "กลับมานั่ง" : "นั่งลง"}
                </button>
              )}
              <button type="button" className="action" data-primary="" onClick={() => clockControls.next()}>
                ข้ามไปเหตุการณ์ถัดไป <kbd>N</kbd>
              </button>
            </div>
          </div>

          <div className="time-controls" role="group" aria-label="เวลาในห้อง">
            <span className="field-label">เวลาในห้อง</span>
            <b className="room-clock">{roomTime(minute)}</b>
            <button type="button" className="chip" onClick={() => clockControls.toggle()} aria-pressed={!playing}>
              {playing ? "หยุด" : "เดินต่อ"} <kbd>Space</kbd>
            </button>
            <span className="chips">
              {SPEEDS.map((option) => (
                <button key={option.label} type="button" className="chip" aria-pressed={speed === option.value} onClick={() => clockControls.setSpeed(option.value)}>
                  {option.label}
                </button>
              ))}
            </span>
            <button type="button" className="text-button" onClick={() => clockControls.reset()}>
              เริ่มใหม่
            </button>
          </div>
        </div>
      </div>

      <div className="views" aria-label="สิ่งที่แต่ละคนเห็น">
        <section className="view">
          <h3>
            <span className="field-label">ผู้หาที่นั่ง · ผังห้อง</span>
            ว่าง {freeDesks.length} โต๊ะ
          </h3>
          {freeDesks.length ? (
            <p className="view-desks">
              {freeDesks.map(({ desk }) => (
                <button key={desk} type="button" className="desk-tag" onClick={() => clockControls.select(desk)}>
                  {deskId(desk)}
                </button>
              ))}
            </p>
          ) : (
            <p className="view-empty">ไม่มีโต๊ะว่างตอนนี้</p>
          )}
        </section>
        <section className="view">
          <h3>
            <span className="field-label">เจ้าของโต๊ะ · LINE</span>
            {inbox.length ? `${inbox.length} ข้อความ` : "ยังไม่มีข้อความ"}
          </h3>
          <ol className="inbox">
            {inbox.slice(0, 4).map((message) => (
              <li key={`${message.desk}-${message.at}`}>
                <span className="inbox-time">{roomTime(message.at)}</span>
                <span>
                  โต๊ะ <b>{deskId(message.desk)}</b> ไม่มีคน {WARN_AT} นาที จะปล่อยใน {RELEASE_AT - WARN_AT} นาที
                </span>
              </li>
            ))}
          </ol>
        </section>
        <section className="view">
          <h3>
            <span className="field-label">เจ้าหน้าที่ · หน้า staff</span>
            {released.length + leftovers.length ? `${released.length + leftovers.length} โต๊ะมีของ` : "ไม่มีของค้าง"}
          </h3>
          <ol className="inbox">
            {released.map((notice) => (
              <li key={`r-${notice.desk}-${notice.at}`}>
                <span className="inbox-time">{roomTime(notice.at)}</span>
                <span>
                  <b>{deskId(notice.desk)}</b> ปล่อยแล้ว · มีของค้าง ให้มาเก็บ
                </span>
              </li>
            ))}
            {leftovers.slice(0, 4).map(({ moment, desk }) => (
              <li key={`a-${desk}`}>
                <span className="inbox-time">ตอนนี้</span>
                <span>
                  <b>{deskId(desk)}</b> ไม่อยู่ {Math.floor(moment.awayFor ?? 0)} นาที · มีของบนโต๊ะ
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
