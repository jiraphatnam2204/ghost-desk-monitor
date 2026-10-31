import { ORDER_LABEL, PARTS, SUNDRIES, SUNDRIES_LEFT, TOOLS_TOTAL, baht, lineTotal } from "@/lib/project";
import { SENSOR_BY_PART } from "@/lib/sensors";

const TEAM = 5;

const partsTotal = PARTS.reduce((sum, part) => sum + lineTotal(part), 0);
const total = partsTotal + SUNDRIES + TOOLS_TOTAL;
// a part ordered 1 of 2 still owes one unit
const partsLeft = PARTS.reduce((sum, part) => sum + (part.order === "pending" ? lineTotal(part) : part.order === "partial" ? part.price : 0), 0);
const left = partsLeft + TOOLS_TOTAL + SUNDRIES_LEFT;

// Every part in one list: what it is for, what it costs, whether it is ordered. A row opens to the build details.
export function PartsRegister() {
  return (
    <div className="register-tool">
      <div className="budget">
        <div className="budget-sum">
          <span className="field-label">งบรวม (ประมาณ)</span>
          <b>~{baht(total)} บาท</b>
          <span className="budget-each">
            หาร {TEAM} คน ≈ <b>{baht(Math.round(total / TEAM))}</b> บาท/คน
          </span>
        </div>
        <dl className="budget-split">
          <div>
            <dt>สั่งแล้ว</dt>
            <dd>~{baht(total - left)}</dd>
          </div>
          <div>
            <dt>ยังไม่สั่ง</dt>
            <dd>~{baht(left)}</dd>
          </div>
          <p>
            ชิ้นส่วน {baht(partsTotal)} + ของจิปาถะ ~{baht(SUNDRIES)} + เครื่องมือ {baht(TOOLS_TOTAL)} · ยังไม่รวมค่าส่ง
          </p>
        </dl>
      </div>

      <div className="rows-head" aria-hidden="true">
        <span>ชิ้น</span>
        <span>ใช้ทำอะไร</span>
        <span>บาท</span>
        <span>สถานะ</span>
      </div>
      <ol className="rows">
        {PARTS.map((part) => {
          const sensor = SENSOR_BY_PART[part.id];
          return (
            <li id={part.id} key={part.id}>
              <details>
                <summary>
                  <span className="row-name">
                    <b>{part.name}</b>
                    <small>
                      {sensor ? <span className="row-sensor">Sensor {sensor.no}</span> : null}
                      {part.where === "node" ? "Node" : "Gateway"}
                      {part.qty > 1 ? ` × ${part.qty}` : ""}
                    </small>
                  </span>
                  <span className="row-use">{part.use}</span>
                  <span className="row-price">{part.price === 0 ? "—" : baht(lineTotal(part))}</span>
                  <span className="row-order" data-order={part.order}>
                    {ORDER_LABEL[part.order]}
                  </span>
                </summary>
                <dl className="row-facts">
                  <div className="wide">
                    <dt className="field-label">หน้าที่</dt>
                    <dd>{part.role}</dd>
                  </div>
                  <div>
                    <dt className="field-label">ต่อผ่าน</dt>
                    <dd>{part.bus}</dd>
                  </div>
                  <div>
                    <dt className="field-label">Library</dt>
                    <dd>{part.library}</dd>
                  </div>
                  <div>
                    <dt className="field-label">เริ่มจาก</dt>
                    <dd>{part.start}</dd>
                  </div>
                  <div>
                    <dt className="field-label">ร้าน · ความยาก</dt>
                    <dd>
                      {part.url ? (
                        <a href={part.url} target="_blank" rel="noreferrer">
                          {part.shop}
                        </a>
                      ) : (
                        part.shop
                      )}
                      {part.price ? ` · ${baht(part.price)} × ${part.qty}` : ""} · {part.level}
                    </dd>
                  </div>
                  <div className="wide">
                    <dt className="field-label">ทำไมตัวนี้</dt>
                    <dd>
                      {part.why}
                      {part.note ? <span className="part-note"> · {part.note}</span> : null}
                    </dd>
                  </div>
                </dl>
              </details>
            </li>
          );
        })}
      </ol>
      <p className="note gap">
        ราคาเช็กจากหน้าร้าน 28–31 ต.ค. 2026 · FireBeetle ตัวที่ 2 สั่งหลัง PoC ผ่าน ภายใน 13 พ.ย. · ใบสั่งซื้อเต็มพร้อมรหัสสินค้าอยู่ใน docs/order-list.md
      </p>
    </div>
  );
}
