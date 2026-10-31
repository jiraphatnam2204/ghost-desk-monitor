import Link from "next/link";
import type { ReactNode } from "react";
import { ACCESSORIES, BUDGET, MISC, ORDER_LABEL, PARTS, TEAM_SIZE, TOOLS, baht, lineTotal, type Order } from "@/lib/equipment";
import { SENSOR_BY_PART } from "@/lib/sensors";

const WHERE = { node: "Node", gateway: "Gateway", both: "ทั้งสองฝั่ง" } as const;

export function OrderTag({ order }: { order: Order }) {
  return (
    <span className="order-tag" data-order={order}>
      {ORDER_LABEL[order]}
    </span>
  );
}

// One line per item that opens to its details. Columns are set per list in equipment.css.
function Row({ id, name, sub, use, note, price, tag, children }: { id: string; name: string; sub: ReactNode; use: string; note?: string; price?: string; tag: ReactNode; children: ReactNode }) {
  return (
    <li id={id}>
      <details>
        <summary>
          <span className="row-name">
            <b>{name}</b>
            <small>{sub}</small>
          </span>
          <span className="row-use">
            {use}
            {note ? <small>{note}</small> : null}
          </span>
          {price !== undefined ? <span className="row-price">{price}</span> : null}
          {tag}
        </summary>
        <dl className="row-facts">{children}</dl>
      </details>
    </li>
  );
}

function Fact({ label, wide, children }: { label?: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={wide ? "wide" : undefined}>
      {label ? <dt className="field-label">{label}</dt> : null}
      <dd>{children}</dd>
    </div>
  );
}

export function Budget() {
  return (
    <div className="budget">
      <div className="budget-sum">
        <span className="field-label">งบรวม (ประมาณ)</span>
        <b>~{baht(BUDGET.total)} บาท</b>
        <span className="budget-each">
          หาร {TEAM_SIZE} คน ≈ <b>{baht(Math.round(BUDGET.total / TEAM_SIZE))}</b> บาท/คน
        </span>
      </div>
      <dl className="budget-split">
        <div>
          <dt>สั่งแล้ว</dt>
          <dd>~{baht(BUDGET.ordered)}</dd>
        </div>
        <div>
          <dt>ยังไม่สั่ง</dt>
          <dd>~{baht(BUDGET.left)}</dd>
        </div>
        <p>
          ชิ้นส่วนหลัก {baht(BUDGET.parts)} + อุปกรณ์เสริม {baht(BUDGET.accessories)} + ของจิปาถะ ~{baht(BUDGET.misc)} + เครื่องมือ {baht(BUDGET.tools)} + ค่าส่งที่จ่ายแล้ว {baht(BUDGET.shipping)} · ใบที่ยังไม่สั่งจะมีค่าส่งเพิ่ม
        </p>
      </dl>
    </div>
  );
}

export function PartsList() {
  return (
    <>
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
            <Row
              key={part.id}
              id={part.id}
              name={part.name}
              sub={
                <>
                  {sensor ? <span className="row-sensor">Sensor {sensor.no}</span> : null}
                  {WHERE[part.where]}
                  {part.qty > 1 ? ` × ${part.qty}` : ""}
                </>
              }
              use={part.use}
              note={part.orderNote}
              price={part.price ? baht(lineTotal(part)) : "—"}
              tag={<OrderTag order={part.order} />}
            >
              <Fact label="หน้าที่" wide>
                {part.role}
              </Fact>
              <Fact label="ต่อผ่าน">{part.bus}</Fact>
              <Fact label="Library">{part.library}</Fact>
              <Fact label="เริ่มจาก">{part.start}</Fact>
              <Fact label="ร้าน · ความยาก">
                {part.url ? (
                  <a href={part.url} target="_blank" rel="noreferrer">
                    {part.shop}
                  </a>
                ) : (
                  part.shop
                )}
                {part.price ? ` · ${baht(part.price)} × ${part.qty}` : ""} · {part.level}
              </Fact>
              <Fact label="ทำไมตัวนี้" wide>
                {part.why}
                {part.note ? <span className="row-muted"> · {part.note}</span> : null}
              </Fact>
            </Row>
          );
        })}
      </ol>
    </>
  );
}

export function AccessoriesTable() {
  return (
    <div className="scroll-x">
      <table className="register stack-sm">
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ชื่อ</th>
            <th>ใช้ทำอะไร</th>
            <th className="num">จำนวน</th>
            <th className="num">บาท</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {ACCESSORIES.map((item) => (
            <tr key={item.code}>
              <td>
                <code>{item.code}</code>
              </td>
              <td>
                <b>{item.name}</b>
                <span className="row-muted"> · {item.shop}</span>
              </td>
              <td>{item.use}</td>
              <td className="num" data-label="จำนวน">{item.qty}</td>
              <td className="num" data-label="บาท">{baht(lineTotal(item))}</td>
              <td>
                <OrderTag order={item.order} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>รวม</td>
            <td className="num">{baht(BUDGET.accessories)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function MiscList() {
  return (
    <ol className="rows rows-misc">
      {MISC.map((item) => (
        <Row
          key={item.id}
          id={`misc-${item.id}`}
          name={item.name}
          sub={`${WHERE[item.where]} · ${item.qty}`}
          use={item.use}
          note={item.orderNote}
          tag={<OrderTag order={item.order} />}
        >
          <Fact label="ไว้ทำอะไร">{item.job}</Fact>
          <Fact label="ทำ / ซื้ออย่างไร">{item.make}</Fact>
          {item.watch ? (
            <div className="wide row-watch">
              <dt className="field-label">ระวัง</dt>
              <dd>{item.watch}</dd>
            </div>
          ) : null}
          <Fact wide>
            <Link href={`/build-plan/#step-${item.step}`}>ใช้ในขั้น {item.step} ของ Build Plan</Link>
          </Fact>
        </Row>
      ))}
    </ol>
  );
}

export function ToolsTable() {
  return (
    <div className="scroll-x">
      <table className="register stack-sm">
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ชื่อ</th>
            <th>ใช้ทำอะไร</th>
            <th className="num">จำนวน</th>
            <th className="num">บาท</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {TOOLS.map((tool) => (
            <tr key={tool.code}>
              <td>
                <code>{tool.code}</code>
              </td>
              <td>
                {tool.url ? (
                  <a href={tool.url} target="_blank" rel="noreferrer">
                    <b>{tool.name}</b>
                  </a>
                ) : (
                  <b>{tool.name}</b>
                )}
              </td>
              <td>{tool.job}</td>
              <td className="num" data-label="จำนวน">{tool.qty}</td>
              <td className="num" data-label="บาท">{baht(lineTotal(tool))}</td>
              <td>
                <OrderTag order={tool.order} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>รวม</td>
            <td className="num">{baht(BUDGET.tools)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
