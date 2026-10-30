import { fadeLineSvg, type SolidPaths } from "@/components/iso/iso-kit";
import { Dots, IsoFigure, Line, Plate, Solid } from "@/components/iso/react/draw";
import { SIGNAL_STEPS } from "@/lib/signal-path";
import {
  BAG_ART,
  BASE_ART,
  CABINET_ART,
  CHAIR_ART,
  DESK_ART,
  GATEWAY_ART,
  HEIGHT,
  MAST_ART,
  OTHER_DESKS,
  PERSON_ART,
  PHONE_ART,
  RADAR_ART,
  RADAR_WAVES,
  ROUTER_ART,
  SCREEN_ART,
  SIGN_ART,
  THIS_DESK,
  VIEW_ART,
  WALL_ART,
  WIDTH,
} from "./geometry";
import { RoomLive, type RoomLayer } from "./live";
import "@/components/figures/node/node.css";
import "./room.css";

const Body = ({ paths, tone = "hi" }: { paths: SolidPaths; tone?: "hi" | "mid" | "lo" }) => <Solid paths={paths} tone={tone} crease="faint" />;
const Svg = ({ html, className }: { html: string; className?: string }) => <g className={className} dangerouslySetInnerHTML={{ __html: html }} />;

const BASE = (
  <g key="base">
    <path className="iso-halo" d={BASE_ART.halo} />
    {BASE_ART.feet.map((parts, index) => (
      <g key={index}>
        <Body paths={parts[0]} tone="lo" />
        <Body paths={parts[1]} tone="mid" />
      </g>
    ))}
    <Body paths={BASE_ART.plate} tone="mid" />
    <Line d={BASE_ART.seams} tone="faint" />
    <Line d={BASE_ART.groove} tone="faint" />
    <Line d={BASE_ART.screwRings} tone="faint" />
    <Dots points={BASE_ART.screws} size={0.6} tone="mid" />
    <Body paths={BASE_ART.label} tone="mid" />
    <Line d={BASE_ART.labelLines} tone="lo" free />
    <Dots points={BASE_ART.labelScrews} size={0.5} tone="mid" />
  </g>
);

const CABINET = (
  <g key="cabinet">
    <Body paths={CABINET_ART.kick} tone="lo" />
    <Solid paths={CABINET_ART.body} tone="mid" crease="faint" inner={<Line d={CABINET_ART.drawers} tone="lo" />} />
    {CABINET_ART.handles.map((paths, index) => (
      <Body key={index} paths={paths} tone="mid" />
    ))}
    <Line d={CABINET_ART.labels} tone="faint" />
    <Body paths={CABINET_ART.top} tone="mid" />
    <g className="rm-gateway">
      <Dots points={GATEWAY_ART.feet} size={0.6} tone="lo" />
      <Solid
        paths={GATEWAY_ART.box}
        tone="hi"
        crease="faint"
        inner={
          <>
            <Line d={GATEWAY_ART.lid} tone="faint" />
            <Line d={GATEWAY_ART.vents} tone="lo" />
            <Line d={GATEWAY_ART.sideVents} tone="lo" />
          </>
        }
      />
      <Dots points={GATEWAY_ART.screws} size={0.45} tone="mid" />
      <g className="rm-led">
        <Dots points={GATEWAY_ART.led} size={0.9} tone="hi" pulse />
      </g>
      <Body paths={GATEWAY_ART.antennaBase} tone="mid" />
      <Body paths={GATEWAY_ART.antenna} tone="hi" />
    </g>
    <g className="iso-wire" data-tone="lo">
      <Line d={CABINET_ART.cable} tone="lo" />
      {CABINET_ART.cableEnds.map(([x, y], index) => (
        <circle key={index} className="iso-wire-end" cx={x} cy={y} r={0.8} />
      ))}
    </g>
    <g className="rm-router">
      <Solid paths={ROUTER_ART.box} tone="hi" crease="faint" inner={<Line d={ROUTER_ART.grille} tone="faint" />} />
      <Dots points={ROUTER_ART.leds} size={0.55} tone="mid" pulse />
      {ROUTER_ART.hinges.map((paths, index) => (
        <g key={index}>
          <Body paths={paths} tone="mid" />
          <Body paths={ROUTER_ART.antennas[index]} tone="hi" />
        </g>
      ))}
    </g>
  </g>
);

// The partition wall and its dashboard screen: the cell for this desk takes the state's ink,
// the rest show a fixed, busy room.
const WALL = (
  <g key="wall">
    <Solid paths={WALL_ART.wall} tone="mid" crease="faint" inner={<Line d={WALL_ART.joints} tone="faint" />} />
    <Body paths={WALL_ART.cap} tone="mid" />
    <Body paths={WALL_ART.skirting} tone="mid" />
    <Body paths={WALL_ART.socket} tone="mid" />
    <Body paths={WALL_ART.plug} tone="mid" />
    <Body paths={WALL_ART.bracket} tone="lo" />
    <g className="rm-screen">
      <Body paths={WALL_ART.panel} tone="hi" />
      <path className="rm-glass" d={WALL_ART.screen} />
      <Line d={SCREEN_ART.title} tone="hi" free />
      {SCREEN_ART.cells.map((d, index) =>
        index === THIS_DESK ? (
          <path key={index} className="rm-cell rm-this" d={d} />
        ) : (
          <path key={index} className="rm-cell" data-ink={OTHER_DESKS[index] ?? "free"} d={d} />
        ),
      )}
      <Dots points={WALL_ART.power} size={0.5} tone="mid" />
    </g>
  </g>
);

const DESK_BACK = (
  <g key="desk-back">
    <Dots points={DESK_ART.glides} size={1.2} tone="lo" />
    {DESK_ART.backLegs.map((paths, index) => (
      <Body key={index} paths={paths} tone="mid" />
    ))}
    <Solid paths={DESK_ART.panel} tone="mid" crease="faint" inner={<Line d={DESK_ART.panelSeam} tone="faint" />} />
  </g>
);

const DESK_FRONT = (
  <g key="desk-front">
    {DESK_ART.frontLegs.map((paths, index) => (
      <Body key={index} paths={paths} tone="mid" />
    ))}
    <Body paths={DESK_ART.apron} tone="mid" />
    <g className="rm-radar">
      <Solid paths={RADAR_ART.board} tone="hi" crease="none" inner={<Line d={RADAR_ART.patches} tone="mid" />} />
      <Dots points={RADAR_ART.pins} size={0.4} tone="mid" />
    </g>
    <Solid paths={DESK_ART.top} tone="mid" crease="faint" inner={<Line d={DESK_ART.topSeam} tone="faint" />} />
    <Line d={DESK_ART.grommet} tone="lo" />
    <Body paths={DESK_ART.book} tone="mid" />
    <Line d={DESK_ART.bookSpine} tone="lo" />
    <Line d={DESK_ART.bookLines} tone="faint" free />
  </g>
);

const MAST = (
  <g key="mast" className="rm-head">
    <g className="iso-wire" data-tone="lo">
      <Line d={MAST_ART.lead} tone="lo" />
    </g>
    <Body paths={MAST_ART.clamp} tone="mid" />
    <Body paths={MAST_ART.clampScrew} tone="mid" />
    <Body paths={MAST_ART.mast} tone="mid" />
    <Body paths={MAST_ART.collar} tone="mid" />
    <Body paths={MAST_ART.arm} tone="mid" />
    <Body paths={MAST_ART.hanger} tone="mid" />
    <Body paths={MAST_ART.antenna} tone="hi" />
    <Solid paths={MAST_ART.head} tone="hi" crease="faint" inner={<Line d={MAST_ART.headSeam} tone="faint" />} />
    <Line d={MAST_ART.lensHood} tone="faint" />
    <Line d={MAST_ART.lens} tone="hi" />
    <Body paths={MAST_ART.tof} tone="mid" />
    <Dots points={MAST_ART.tofEye} size={0.6} tone="hi" />
    <g className="rm-led">
      <Dots points={MAST_ART.led} size={0.6} tone="hi" pulse />
    </g>
  </g>
);

const SIGN_BACK = (
  <g key="sign-back" className="rm-sign">
    <Body paths={SIGN_ART.plinth} tone="mid" />
    <Dots points={SIGN_ART.plinthScrews} size={0.45} tone="mid" />
    <Body paths={SIGN_ART.stand} tone="lo" />
    <Body paths={SIGN_ART.cheekL} tone="mid" />
    <Line d={SIGN_ART.bossL} tone="lo" />
  </g>
);

const SIGN_FRONT = (
  <g key="sign-front" className="rm-sign">
    <Body paths={SIGN_ART.cheekR} tone="mid" />
    <Line d={SIGN_ART.shaft} tone="lo" />
    <Solid paths={SIGN_ART.servo} tone="mid" crease="faint" inner={<Line d={SIGN_ART.servoLabel} tone="faint" />} />
    <Body paths={SIGN_ART.servoEars} tone="mid" />
    <Solid paths={SIGN_ART.cap} tone="mid" crease="faint" inner={<Line d={SIGN_ART.capBand} tone="faint" />} />
    <Line d={SIGN_ART.capTop} tone="lo" />
  </g>
);

// What the camera and the VL53L1X look at, shown when they are asked.
const VIEW = (
  <g key="view" className="rm-view">
    <Line d={VIEW_ART.patch} tone="mid" dashed />
    <Line d={VIEW_ART.rays} tone="mid" dotted />
    <Dots points={VIEW_ART.ends} size={0.8} tone="mid" />
  </g>
);

const BAG = (
  <g key="bag" className="rm-bag">
    <Solid paths={BAG_ART.body} tone="hi" crease="faint" inner={<Line d={BAG_ART.seam} tone="faint" />} />
    <Body paths={BAG_ART.flap} tone="mid" />
    <Dots points={BAG_ART.buckle} size={0.7} tone="mid" />
    <g className="iso-wire" data-tone="mid">
      <Line d={BAG_ART.strap} tone="mid" />
    </g>
  </g>
);

const LEGS = (
  <g key="person-legs" className="rm-person">
    {PERSON_ART.feet.map((paths, index) => (
      <Body key={index} paths={paths} tone="mid" />
    ))}
    {PERSON_ART.shins.map((paths, index) => (
      <Body key={index} paths={paths} tone="hi" />
    ))}
    {PERSON_ART.knees.map((paths, index) => (
      <Body key={index} paths={paths} tone="mid" />
    ))}
  </g>
);

const CHAIR_SEAT = (
  <g key="chair-seat">
    {CHAIR_ART.legs.map((paths, index) => (
      <Body key={index} paths={paths} tone="mid" />
    ))}
    <Body paths={CHAIR_ART.rail} tone="lo" />
    <Body paths={CHAIR_ART.seat} tone="mid" />
  </g>
);

const LAP = (
  <g key="person-lap" className="rm-person">
    {PERSON_ART.thighs.map((paths, index) => (
      <Body key={index} paths={paths} tone="hi" />
    ))}
    <Body paths={PERSON_ART.hips} tone="hi" />
  </g>
);

const WAVES = <Svg key="waves" className="rm-waves" html={RADAR_WAVES.map((points) => fadeLineSvg(points, { fade: [14, 14], tone: "lit" })).join("")} />;

const UPPER = (
  <g key="person-upper" className="rm-person">
    <Body paths={PERSON_ART.foreL} tone="hi" />
    <Body paths={PERSON_ART.handL} tone="hi" />
    <Body paths={PERSON_ART.elbowL} tone="mid" />
    <Body paths={PERSON_ART.upperL} tone="hi" />
    <Body paths={PERSON_ART.belly} tone="hi" />
    <Body paths={PERSON_ART.chest} tone="hi" />
    <Dots points={PERSON_ART.joints} size={0.6} tone="mid" />
    <Body paths={PERSON_ART.neck} tone="mid" />
    <Solid paths={PERSON_ART.head} tone="hi" crease="faint" inner={<Line d={PERSON_ART.headRing} tone="faint" />} />
    <Body paths={PERSON_ART.foreR} tone="hi" />
    <Body paths={PERSON_ART.handR} tone="hi" />
    <Body paths={PERSON_ART.elbowR} tone="mid" />
    <Body paths={PERSON_ART.upperR} tone="hi" />
  </g>
);

const CHAIR_BACK = (
  <g key="chair-back">
    {CHAIR_ART.posts.map((paths, index) => (
      <Body key={index} paths={paths} tone="mid" />
    ))}
    <Solid paths={CHAIR_ART.back} tone="mid" crease="faint" inner={<Line d={CHAIR_ART.backSeam} tone="faint" />} />
  </g>
);

const PHONE = (
  <g key="phone" className="rm-phone">
    <Body paths={PHONE_ART.stand} tone="mid" />
    <Body paths={PHONE_ART.back} tone="mid" />
    <Body paths={PHONE_ART.phone} tone="hi" />
    <path className="rm-glass" d={PHONE_ART.screen} />
    <Line d={PHONE_ART.speaker} tone="mid" free />
    <g className="rm-bubble">
      <path className="rm-bubble-fill" d={PHONE_ART.bubble} />
      <Line d={PHONE_ART.bubbleLines} tone="hi" free />
    </g>
    <Body paths={PHONE_ART.lip} tone="mid" />
  </g>
);

// Painter's order, back to front.
const LAYERS: RoomLayer[] = [
  { id: "base", node: BASE },
  { id: "wall", node: WALL },
  { id: "cabinet", node: CABINET },
  { id: "desk-back", node: DESK_BACK },
  { id: "desk-front", node: DESK_FRONT },
  { id: "mast", node: MAST },
  { id: "sign-back", node: SIGN_BACK },
  { id: "prism" },
  { id: "sign-front", node: SIGN_FRONT },
  { id: "view", node: VIEW },
  { id: "bag", node: BAG },
  { id: "person-legs", node: LEGS },
  { id: "chair-seat", node: CHAIR_SEAT },
  { id: "person-lap", node: LAP },
  { id: "waves", node: WAVES },
  { id: "person-upper", node: UPPER },
  { id: "chair-back", node: CHAIR_BACK },
  { id: "phone", node: PHONE },
  { id: "links" },
  { id: "packet" },
];

export function RoomFigure({ fig = "Fig 1" }: { fig?: string }) {
  return (
    <Plate
      fig={fig}
      title="หนึ่งโต๊ะ ตั้งแต่นั่งลงจนขึ้นจอ"
      hint="กดที่รูปหรือ ← → เพื่อไปทีละขั้น"
      readout={`1/${SIGNAL_STEPS.length} · ${SIGNAL_STEPS[0].at} · ${SIGNAL_STEPS[0].title}`}
      keys={[
        { mark: "lit", label: "ชิ้นที่ทำงานในขั้นนั้น" },
        { mark: "dotted", label: "สัญญาณวิทยุ: ESP-NOW, Wi-Fi, Internet" },
        { mark: "flat", label: "ป้ายและจอเปลี่ยนสีตามสถานะโต๊ะ" },
      ]}
      caption="ห้องอ่านหนังสือหนึ่งมุมบนแท่น: โต๊ะ D07 กับ sensor node (เรดาร์ใต้ขอบโต๊ะ, หัวกล้องบนเสา, ป้ายปริซึมกับ servo), gateway กับ Wi-Fi router บนตู้, จอ dashboard บนผนัง และโทรศัพท์ของเจ้าของโต๊ะ · เส้นโค้งที่ขึ้นไปสูงแทนการวิ่งออกอินเทอร์เน็ตไป Supabase หรือ LINE แล้วกลับมา"
    >
      <IsoFigure
        width={WIDTH}
        height={HEIGHT}
        label="ภาพไอโซเมตริกของมุมห้องอ่านหนังสือ: คนนั่งที่โต๊ะที่มี sensor node, gateway และ router บนตู้, จอ dashboard บนผนัง และโทรศัพท์ เส้นประแสดงทางที่สัญญาณวิ่ง"
      >
        <RoomLive layers={LAYERS} />
      </IsoFigure>
    </Plate>
  );
}
