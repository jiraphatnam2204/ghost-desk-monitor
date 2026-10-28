// The node → gateway message, shared by the workflow (step B2) and the docs.
export const STRUCT = `typedef struct __attribute__((packed)) {
  uint8_t  ver;          // = 1
  uint8_t  node_id;      // 1, 2, ... in every message
  uint16_t seq;          // ack / retry and packet-loss count
  uint32_t uptime_ms;
  uint8_t  mmw_state;    // 0 none, 1 moving, 2 still, 3 both
  uint16_t mmw_dist_cm;
  uint8_t  mmw_energy;
  int16_t  th_max_c10;   // hottest pixel x 10
  uint8_t  th_hot_px;    // pixels above 30 C
  uint8_t  ai_class;     // 0 empty, 1 person, 2 items_only
  uint8_t  ai_conf;      // 0-100
  uint8_t  sign_face;    // current sign face
} node_report_t;         // 18 bytes, ESP-NOW allows 250`;
