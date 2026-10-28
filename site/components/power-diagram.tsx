// How one desk is powered: one 5 V adapter split to the board and the servo, the capacitor across the servo supply,
// and every ground tied together. Plain wiring drawing in toner.
export function PowerDiagram() {
  return (
    <svg className="power-svg" viewBox="0 0 720 300" role="img" aria-label="การต่อไฟต่อโต๊ะ: อแดปเตอร์ 5 โวลต์ แยกไฟไปบอร์ด FireBeetle และ servo ตัวเก็บประจุ 1000 ไมโครฟารัดต่อคร่อมไฟ servo และ GND ทั้งหมดต่อร่วมกัน">
      {/* adapter */}
      <rect x="20" y="96" width="120" height="70" className="pw-box" />
      <text x="34" y="124" className="pw-title">
        Adapter
      </text>
      <text x="34" y="146" className="pw-text">
        5 V 2 A
      </text>

      {/* terminal block */}
      <rect x="210" y="86" width="70" height="90" className="pw-box" />
      <text x="218" y="78" className="pw-text">
        terminal block
      </text>
      <circle cx="245" cy="112" r="6" className="pw-screw" />
      <circle cx="245" cy="150" r="6" className="pw-screw" />

      {/* adapter to block */}
      <path d="M140 112 H239" className="pw-wire" />
      <path d="M140 150 H239" className="pw-wire pw-gnd" />
      <text x="160" y="104" className="pw-label">
        +5 V
      </text>
      <text x="160" y="170" className="pw-label">
        GND
      </text>

      {/* board */}
      <rect x="520" y="24" width="180" height="78" className="pw-box" />
      <text x="534" y="52" className="pw-title">
        FireBeetle 2
      </text>
      <text x="534" y="74" className="pw-text">
        5 V · GND · GPIO (PWM)
      </text>

      {/* servo */}
      <rect x="520" y="192" width="180" height="78" className="pw-box pw-heavy" />
      <text x="534" y="220" className="pw-title">
        Servo TD-7120MG
      </text>
      <text x="534" y="242" className="pw-text">
        V+ · GND · signal
      </text>

      {/* +5 V to board and servo */}
      <path d="M251 112 H330 V48 H518" className="pw-wire" />
      <path d="M330 112 V214 H518" className="pw-wire" />
      {/* ground to board and servo */}
      <path d="M251 150 H370 V84 H518" className="pw-wire pw-gnd" />
      <path d="M370 150 V250 H518" className="pw-wire pw-gnd" />
      <circle cx="330" cy="112" r="3.5" className="pw-node" />
      <circle cx="370" cy="150" r="3.5" className="pw-node" />

      {/* capacitor across the servo supply, close to the servo */}
      <path d="M460 214 V222" className="pw-wire" />
      <path d="M446 222 H474" className="pw-plate" />
      <path d="M446 232 Q460 226 474 232" className="pw-plate" />
      <path d="M460 230 V250" className="pw-wire pw-gnd" />
      <circle cx="460" cy="214" r="3.5" className="pw-node" />
      <circle cx="460" cy="250" r="3.5" className="pw-node" />
      <text x="400" y="200" className="pw-label pw-cap">
        1000 µF
      </text>
      <text x="448" y="219" className="pw-label">
        +
      </text>

      {/* PWM signal from board to servo */}
      <path d="M690 102 V190" className="pw-wire pw-signal" />
      <text x="606" y="150" className="pw-label">
        PWM
      </text>
    </svg>
  );
}
