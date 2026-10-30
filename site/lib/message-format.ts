// The node → gateway message, shared by the workflow (step B2) and the docs.
// The node reads the radar and the ToF 10 times a second and sends one batch a second,
// so the gateway's model sees breathing (a 3–5 s cycle), which a reading every 2 s would miss.
export const STRUCT = `typedef struct __attribute__((packed)) {
  uint8_t  ver;          // = 2
  uint8_t  node_id;      // 1, 2, ... in every message
  uint16_t seq;          // ack / retry and packet-loss count
  uint32_t uptime_ms;    // time of the first sample
  uint8_t  sign_face;    // current sign face
  uint8_t  n;            // samples in this batch (10)
  struct {
    uint8_t  move_e[9];  // LD2410 moving energy, 9 gates of 0.75 m
    uint8_t  still_e[9]; // LD2410 still energy (breathing), 9 gates
    uint16_t tof_mm;     // VL53L1X distance to the seat
  } s[10];               // 10 Hz, one batch a second
} node_batch_t;          // 210 bytes, ESP-NOW allows 250`;
