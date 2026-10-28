import type { SolidPaths } from "@/components/iso/iso-kit";
import { Dots, IsoFigure, Line, Plate, Solid } from "@/components/iso/react/draw";
import { BASE_ART, ESP_ART, HEIGHT, LEADS, LIFT, LUX_ART, MIC_ART, MODULES, SCD_ART, SEATS, STANDOFFS, WIDTH } from "./geometry";
import { GatewayLive, type GatewayLayer } from "./live";
import "./gateway.css";

function Board({ art }: { art: { pcb: SolidPaths; holes: string } }) {
  return (
    <>
      <Solid paths={art.pcb} tone="mid" crease="faint" />
      <Line d={art.holes} tone="lo" />
    </>
  );
}

const BASE = (
  <g key="base">
    <path className="iso-halo" d={BASE_ART.halo} />
    {BASE_ART.feet.map((parts, index) => (
      <g key={index}>
        <Solid paths={parts[0]} tone="lo" crease="faint" />
        <Solid paths={parts[1]} tone="mid" crease="faint" />
      </g>
    ))}
    <Solid paths={BASE_ART.plate} tone="mid" crease="faint" />
    <Line d={BASE_ART.groove} tone="faint" />
    <Dots points={BASE_ART.screws} size={0.5} tone="mid" />
    <Solid paths={BASE_ART.clip} tone="mid" crease="faint" />
    <Dots points={BASE_ART.clipScrew} size={0.45} tone="mid" />
  </g>
);

// Brass standoffs stay screwed to the plate when the boards lift off them.
const POSTS = (
  <g key="posts">
    {STANDOFFS.map((paths, index) => (
      <Solid key={index} paths={paths} tone="mid" crease="faint" />
    ))}
    <Line d={SEATS} tone="lo" />
  </g>
);

const ESP = (
  <g key="esp" data-module="esp">
    <Board art={ESP_ART} />
    <Line d={ESP_ART.silk} tone="faint" />
    <Solid paths={ESP_ART.modulePcb} tone="mid" crease="none" />
    <Line d={ESP_ART.antenna} tone="mid" />
    <Solid paths={ESP_ART.can} tone="hi" crease="faint" inner={<Line d={ESP_ART.canSeam} tone="faint" />} />
    <Solid paths={ESP_ART.chip} tone="mid" crease="faint" />
    {ESP_ART.usb.map((paths, index) => (
      <Solid key={index} paths={paths} tone="mid" crease="faint" />
    ))}
    {ESP_ART.buttons.map((button, index) => (
      <g key={index}>
        <Solid paths={button.body} tone="mid" crease="faint" />
        <Solid paths={button.cap} tone="mid" crease="faint" />
      </g>
    ))}
    <g className="gw-led">
      <Dots points={ESP_ART.led} size={0.8} tone="hi" pulse />
    </g>
    <Solid paths={ESP_ART.headerBack} tone="lo" crease="none" />
    <Dots points={ESP_ART.pinsBack} size={0.45} tone="mid" />
    <Solid paths={ESP_ART.headerFront} tone="lo" crease="none" />
    <Dots points={ESP_ART.pinsFront} size={0.45} tone="mid" />
  </g>
);

const SCD = (
  <g key="scd" data-module="scd">
    <Board art={SCD_ART} />
    <Solid paths={SCD_ART.sensor} tone="hi" crease="faint" />
    <Line d={SCD_ART.sensorPort} tone="mid" />
    <Solid paths={SCD_ART.header} tone="lo" crease="none" />
    <Dots points={SCD_ART.pins} size={0.45} tone="mid" />
  </g>
);

const LUX = (
  <g key="lux" data-module="lux">
    <Board art={LUX_ART} />
    <Solid paths={LUX_ART.chip} tone="hi" crease="faint" />
    <Line d={LUX_ART.window} tone="mid" />
    <Solid paths={LUX_ART.header} tone="lo" crease="none" />
    <Dots points={LUX_ART.pins} size={0.45} tone="mid" />
  </g>
);

const MIC_BOARD = (
  <g key="mic-board" data-module="mic">
    <Board art={MIC_ART} />
    <Solid paths={MIC_ART.header} tone="lo" crease="none" />
    <Dots points={MIC_ART.pins} size={0.45} tone="mid" />
  </g>
);

const MIC_PARTS = (
  <g key="mic-parts" data-module="mic">
    <Solid paths={MIC_ART.amp} tone="mid" crease="faint" />
    <Solid paths={MIC_ART.pot} tone="mid" crease="faint" />
    <Line d={MIC_ART.potSlot} tone="hi" />
    <Solid paths={MIC_ART.capsule} tone="hi" crease="faint" />
    <Line d={MIC_ART.felt} tone="lo" />
  </g>
);

// Painter's order, back to front; leads are drawn live so their ends stay on the pins.
const LAYERS: GatewayLayer[] = [
  { id: "base", node: BASE },
  { id: "posts", node: POSTS },
  { id: "esp", node: ESP, lift: LIFT.esp },
  { id: "scd", node: SCD, lift: LIFT.scd },
  { id: "lux", node: LUX, lift: LIFT.lux },
  { id: "leads", leads: [...LEADS.i2c, ...LEADS.chain, LEADS.usb] },
  { id: "mic-board", node: MIC_BOARD, lift: LIFT.mic },
  { id: "mic-leads", leads: LEADS.mic },
  { id: "mic-parts", node: MIC_PARTS, lift: LIFT.mic },
];

export function GatewayFigure() {
  return (
    <Plate
      fig="Fig 2"
      title="Gateway บนแท่น"
      hint="ชี้หรือแตะบอร์ดเพื่อดูการต่อ"
      readout={MODULES[0].readout}
      keys={MODULES.map((module) => ({ mark: module.id === "esp" ? "lit" : "raised", label: `${module.label}: ${module.key}` }))}
      caption="แผ่นฐานบนขายาง บอร์ดทุกตัวยืนบนเสา standoff · SCD41 กับ BH1750 ต่อพ่วงบน I²C สองเส้นเดียวกัน, ไมค์ MAX4466 ต่อ 3 สายเข้าขา ADC, สาย USB-C ยึดกับคลิปที่ขอบแผ่น"
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label="ภาพไอโซเมตริกของ gateway: บอร์ด YD-ESP32-23 ต่อสายไปยัง SCD41, BH1750 และไมค์ MAX4466 บนแผ่นฐาน">
        <GatewayLive layers={LAYERS} />
      </IsoFigure>
    </Plate>
  );
}
