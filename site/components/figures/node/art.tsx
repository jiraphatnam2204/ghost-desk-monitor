import * as React from "react";
import { Dots, FaceText, Line, Solid, Wire } from "@/components/iso/react/draw";
import { BENCH, BOOK_ART, DESK_ART, HEAD_CABLE, INSIDE_ART, MAST_ART, QR_ART, RADAR_ART, RADAR_CABLE, SERVO_CABLE, SIGN_ART, TAG_ART } from "./geometry";
import { NodeLive, type Layer } from "./live";

const BENCH_G = (
  <g key="bench">
    <path className="iso-halo" d={BENCH.halo} />
    {BENCH.feet.map((parts, index) => (
      <g key={index}>
        <Solid paths={parts[0]} tone="lo" crease="faint" />
        <Solid paths={parts[1]} tone="mid" crease="faint" />
      </g>
    ))}
    <Solid paths={BENCH.plate} tone="mid" crease="faint" />
    <Line d={BENCH.groove} tone="faint" />
    <Line d={BENCH.screwRings} tone="lo" />
    <Dots points={BENCH.screws} size={0.5} tone="mid" />
    <Solid paths={BENCH.label} tone="lo" crease="none" />
    <Line d={BENCH.labelLine} tone="faint" />
    <Line d={BENCH.labelRules} tone="lo" free />
    <Dots points={BENCH.labelScrews} size={0.45} tone="mid" />
  </g>
);

const BACK_LEGS = (
  <g key="back-legs">
    {DESK_ART.backLegs.map((leg, index) => (
      <g key={index}>
        <Solid paths={leg.glide} tone="lo" crease="faint" />
        <Solid paths={leg.leg} tone="mid" crease="faint" />
      </g>
    ))}
    <Solid paths={MAST_ART.thumb} tone="mid" crease="faint" />
    <Solid paths={MAST_ART.jaw} tone="mid" crease="faint" />
  </g>
);

const APRON = (
  <g key="apron">
    <Solid paths={DESK_ART.apron} tone="mid" crease="faint" />
    <Dots points={DESK_ART.apronScrews} size={0.5} tone="mid" />
    <Dots points={RADAR_ART.screws} size={0.5} tone="lo" />
  </g>
);

const RADAR = (
  <g key="radar" className="gdm-radar">
    <Solid paths={RADAR_ART.board} tone="hi" crease="faint" />
    <Line d={RADAR_ART.patches} tone="mid" />
    <Line d={RADAR_ART.feed} tone="lo" />
    <path className="gdm-ink" d={RADAR_ART.chip} />
    <Dots points={RADAR_ART.pins} size={0.45} tone="mid" />
    <Dots points={RADAR_ART.screws} size={0.4} tone="lo" />
    <g className="gdm-presence">
      <Dots points={RADAR_ART.presence} size={0.7} tone="hi" pulse />
    </g>
  </g>
);

const FRONT_LEGS = (
  <g key="front-legs">
    {DESK_ART.frontLegs.map((leg, index) => (
      <g key={index}>
        <Solid paths={leg.glide} tone="lo" crease="faint" />
        <Solid paths={leg.leg} tone="mid" crease="faint" />
      </g>
    ))}
  </g>
);

const TOP = (
  <g key="top">
    <Solid paths={DESK_ART.top} tone="mid" crease="faint" inner={<Line d={DESK_ART.banding} tone="faint" />} />
    <Line d={DESK_ART.grommet} tone="lo" />
    <Line d={DESK_ART.grommetInner} tone="faint" />
    <Solid paths={TAG_ART.plate} tone="lo" crease="none" />
    <FaceText transform={TAG_ART.text} size={3.2} tone="hi">
      D01
    </FaceText>
    <Dots points={TAG_ART.screws} size={0.4} tone="mid" />
  </g>
);

const MAST = (
  <g key="mast" className="gdm-mast">
    <Solid paths={MAST_ART.clamp} tone="mid" crease="faint" />
    <Dots points={MAST_ART.clampScrews} size={0.45} tone="mid" />
    <Wire from={HEAD_CABLE.from} via={HEAD_CABLE.via} to={HEAD_CABLE.to} tone="mid" size={0.9} />
    <Solid paths={MAST_ART.collar} tone="mid" crease="faint" />
    <Solid paths={MAST_ART.post} tone="mid" crease="none" inner={<Line d={MAST_ART.postSeams} tone="faint" />} />
    <Solid paths={MAST_ART.arm} tone="mid" crease="faint" />
    <Solid paths={MAST_ART.armCap} tone="mid" crease="faint" />
    <Dots points={MAST_ART.armScrews} size={0.45} tone="mid" />
  </g>
);

// The FireBeetle 2 board, hung from the arm on a back plate; the housing hides it until the head comes apart.
const INSIDE = (
  <g key="inside" className="gdm-board">
    <Solid paths={INSIDE_ART.backPlate} tone="mid" crease="faint" />
    <Solid paths={INSIDE_ART.usb} tone="mid" crease="faint" />
    <Solid paths={INSIDE_ART.pcb} tone="mid" crease="faint" />
    <Dots points={INSIDE_ART.pcbScrews} size={0.5} tone="mid" />
    <Dots points={INSIDE_ART.pins} size={0.45} tone="mid" />
    <Solid paths={INSIDE_ART.antenna} tone="lo" crease="none" />
    <Line d={INSIDE_ART.antennaTrace} tone="mid" />
    <Solid paths={INSIDE_ART.module} tone="hi" crease="faint" inner={<Line d={INSIDE_ART.moduleSeam} tone="faint" />} />
    <path className="gdm-ink gdm-ribbon" d={INSIDE_ART.ribbon} />
    <Solid paths={INSIDE_ART.camera} tone="hi" crease="faint" />
    <Line d={INSIDE_ART.cameraLens} tone="hi" />
  </g>
);

const HOUSING = (
  <g key="housing" className="gdm-head">
    <Solid paths={MAST_ART.head} tone="hi" crease="faint" inner={<Line d={MAST_ART.headSeam} tone="faint" />} />
    <Line d={MAST_ART.vents} tone="lo" />
    <Dots points={MAST_ART.headScrews} size={0.45} tone="mid" />
    <g className="gdm-led">
      <Dots points={MAST_ART.led} size={0.9} tone="hi" pulse />
    </g>
    <Solid paths={MAST_ART.lens} tone="mid" crease="faint" />
    <Line d={MAST_ART.lensRings} tone="hi" />
    <Dots points={MAST_ART.lensGlint} size={0.5} tone="faint" />
    <g className="gdm-thermal">
      <Solid paths={MAST_ART.thermal} tone="mid" crease="none" />
      <Solid paths={MAST_ART.thermalCan} tone="hi" crease="faint" />
      <Line d={MAST_ART.thermalEye} tone="mid" />
    </g>
  </g>
);

const BOOK = (
  <g key="book">
    <Solid paths={BOOK_ART.back} tone="mid" crease="none" />
    <Solid paths={BOOK_ART.pages} tone="lo" crease="none" inner={<Line d={BOOK_ART.pageLines} tone="faint" />} />
    <Solid paths={BOOK_ART.cover} tone="mid" crease="faint" />
    <Line d={BOOK_ART.title} tone="faint" />
  </g>
);

const SIGN_BACK = (
  <g key="sign-back">
    <g className="gdm-stand">
      <Solid paths={SIGN_ART.plinth} tone="mid" crease="faint" inner={<Line d={SIGN_ART.plinthSeam} tone="faint" />} />
      <Dots points={SIGN_ART.plinthScrews} size={0.5} tone="mid" />
    </g>
    <g className="gdm-block">
      <Solid paths={SIGN_ART.block} tone="mid" crease="faint" />
      <Line d={SIGN_ART.blockScrews} tone="lo" />
      <Line d={SIGN_ART.blockSlots} tone="mid" />
    </g>
    <g className="gdm-stand">
      <Solid paths={SIGN_ART.cheekL} tone="mid" crease="faint" />
      <Dots points={SIGN_ART.cheekScrewsL} size={0.45} tone="mid" />
      <Line d={SIGN_ART.bossL} tone="lo" />
      <Solid paths={SIGN_ART.stop} tone="mid" crease="faint" />
    </g>
  </g>
);

const CHEEK_R = (
  <g key="cheek-r" className="gdm-stand">
    <Solid paths={SIGN_ART.cheekR} tone="mid" crease="faint" />
    <Dots points={SIGN_ART.cheekScrewsR} size={0.45} tone="mid" />
    <Line d={SIGN_ART.shaftBore} tone="lo" />
  </g>
);

const SERVO = (
  <g key="servo" className="gdm-servo">
    <Solid paths={SIGN_ART.servoEars} tone="mid" crease="faint" />
    <Solid paths={SIGN_ART.servo} tone="hi" crease="faint" />
    <Line d={SIGN_ART.servoLabel} tone="faint" />
    <Line d={SIGN_ART.servoRules} tone="lo" free />
    <Dots points={SIGN_ART.servoEarScrews} size={0.45} tone="mid" />
  </g>
);

const CAP = (
  <g key="cap" className="gdm-cap">
    <Solid paths={SIGN_ART.cap} tone="mid" crease="faint" inner={<Line d={SIGN_ART.capSleeve} tone="faint" />} />
    <Line d={SIGN_ART.capTop} tone="lo" />
    <Line d={SIGN_ART.capVent} tone="lo" />
  </g>
);

const QR_STAND = (
  <g key="qr-stand">
    <Solid paths={QR_ART.base} tone="mid" crease="faint" />
    <Line d={QR_ART.slot} tone="lo" />
  </g>
);

const QR_CARD = (
  <g key="qr-card" className="gdm-qr">
    <Solid paths={QR_ART.card} tone="hi" crease="faint" />
    <path className="gdm-ink" d={QR_ART.modules} />
    <Line d={QR_ART.rule} tone="lo" free />
  </g>
);

// Painter's order, back to front. `move` is each assembly's way out when the figure comes apart, in world units.
const LAYERS: Layer[] = [
  { id: "bench", node: BENCH_G },
  { id: "back-legs", node: BACK_LEGS },
  { id: "apron", node: APRON },
  { id: "radar-lead", cable: RADAR_CABLE },
  { id: "radar", node: RADAR, move: [0, 0, -22], at: 0.3 },
  { id: "front-legs", node: FRONT_LEGS },
  { id: "top", node: TOP },
  { id: "mast", node: MAST },
  { id: "inside", node: INSIDE },
  { id: "housing", node: HOUSING, move: [0, 0, -40], at: 0 },
  { id: "book", node: BOOK },
  { id: "sign-back", node: SIGN_BACK },
  { id: "prism" },
  { id: "cheek-r", node: CHEEK_R },
  { id: "servo-lead", cable: SERVO_CABLE },
  { id: "servo", node: SERVO, move: [44, 0, 0], at: 0.15 },
  { id: "cap", node: CAP },
  { id: "prism-apart" },
  { id: "qr-stand", node: QR_STAND },
  { id: "qr-card", node: QR_CARD, move: [0, 0, 36], at: 0.4 },
];

export function NodeArt() {
  return <NodeLive layers={LAYERS} />;
}
