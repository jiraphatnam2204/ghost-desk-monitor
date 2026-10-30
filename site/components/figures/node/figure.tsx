import { IsoFigure, Plate } from "@/components/iso/react/draw";
import { NodeArt } from "./art";
import { HEIGHT, WIDTH } from "./view";
import "./node.css";

export function NodeFigure() {
  return (
    <Plate
      fig="Fig 1"
      title="Sensor node ที่โต๊ะ"
      hint="กดที่รูปเพื่อข้ามเหตุการณ์ · ปุ่มข้างรูปถอดประกอบ"
      readout="D01 · ใช้งาน · servo 0°"
      keys={[
        { mark: "lit", label: "ป้ายปริซึม 3 หน้า หมุนด้วย servo 270°" },
        { mark: "raised", label: "กล้อง + VL53L1X บนแขน มองลงโต๊ะและเก้าอี้" },
        { mark: "dotted", label: "LD2410 ใต้ขอบโต๊ะ กะพริบเมื่อจับลมหายใจได้" },
      ]}
      caption="โต๊ะทดสอบบนแท่น: เสาหนีบขอบโต๊ะถือหัวกล้อง (FireBeetle 2 ESP32-S3 + OV2640) และ VL53L1X วัดระยะลงเบาะ, LD2410 หันหาเก้าอี้, ป้ายปริซึมหน้าชมพู/เหลือง/เขียว บนฐานที่มีหมุดกันหมุนเกิน และตัวเก็บประจุ 1000 µF ข้าง servo · ป้ายหมุนตามโต๊ะที่เลือกในผังด้านบน (จำลอง)"
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label="ภาพไอโซเมตริกของโต๊ะทดสอบที่มี sensor node: หัวกล้องบนเสา, เรดาร์ LD2410 ใต้ขอบโต๊ะ, ป้ายปริซึมสามหน้าที่หมุนด้วย servo และป้าย QR">
        <NodeArt />
      </IsoFigure>
    </Plate>
  );
}
