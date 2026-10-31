# Purchase Order Record: Ghost-Desk Monitor

| | |
|---|---|
| **Project** | Ghost-Desk Monitor, Embedded System (CEDT) Final Project 2026 |
| **Team** | TomyumSea (5 members) |
| **Prepared** | 31 October 2026 |
| **Currency** | Thai baht (THB). Prices exclude shipping. |
| **Prices verified** | Against each supplier's product page, 30–31 October 2026 |
| **Required delivery** | Friday 6 November 2026 (end of week 1) |
| **Assumption** | The laboratory supplies no parts, consumables or tools. Every item the build needs is listed here. |

The parts list with the reason for each item is on the site's Equipment page. The source of truth for part prices is `site/lib/project.ts`.

## 1. Summary

| Ref. | Supplier | Scope | Status | Amount (THB) |
|---|---|---|---|---:|
| PO-1 | cybertice | Sensors, servos, adapters, capacitors | **Ordered** 31 Oct | 1,687 |
| PO-2 | arduitronics | FireBeetle 2 node board (first unit), gateway board | **Ordered** 31 Oct | 1,870 |
| PO-3 | allnewstep | Radar sensors, adapter boards, DC jacks, prototyping supplies | **Ordered** 31 Oct | 597 |
| PO-4 | Shopee | SCD41 CO₂ sensor | **Ordered** 31 Oct | ~820 |
| | | | **Ordered subtotal** | **~4,974** |
| PO-5 | arduitronics | FireBeetle 2 node board (second unit) | Pending: after the proof of concept, by 13 Nov | 1,185 |
| PO-6 | cybertice | Soldering and measurement tools | Pending | 955 |
| PO-7 | Various | Perfboard, enclosure material, printing | Pending (estimate) | ~150 |
| | | | **Pending subtotal** | **~2,290** |
| | | | **Grand total** | **~7,264** |

The grand total comes to about 1,455 baht per member, before shipping. The Equipment page budget (~7,265) covers the same items, tools included; the 1-baht difference is rounding in the estimates.

## 2. Orders placed

### PO-1: cybertice (ordered 31 Oct, 10 pieces)

| No. | Description | Code | Qty | Unit | Amount | Link |
|---:|---|---|---:|---:|---:|---|
| 1 | VL53L1X time-of-flight distance sensor | M1532 | 2 | 210 | 420 | [product](https://www.cybertice.com/product/5302/vl53l1x-%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A3%E0%B8%B0%E0%B8%A2%E0%B8%B0%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B9%81%E0%B8%AA%E0%B8%87%E0%B9%80%E0%B8%A5%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C-%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%99%E0%B8%A2%E0%B8%B3%E0%B8%AA%E0%B8%B9%E0%B8%87-laser-ranging-sensor-module-%E0%B8%A3%E0%B8%B0%E0%B8%A2%E0%B8%B0%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%88%E0%B8%B1%E0%B8%9A-0-400cm) |
| 2 | TD-7120MG servo motor, 0–270° | — | 2 | 440 | 880 | [product](https://www.cybertice.com/product/5406/td-7120mg-servo-motor-0-270%E0%B8%AD%E0%B8%87%E0%B8%A8%E0%B8%B2-%E0%B9%80%E0%B8%9F%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B9%82%E0%B8%A5%E0%B8%AB%E0%B8%B0%E0%B8%97%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%AB%E0%B8%A1%E0%B8%94-%E0%B9%81%E0%B8%A3%E0%B8%87%E0%B8%9A%E0%B8%B4%E0%B8%94%E0%B8%AA%E0%B8%B9%E0%B8%87%E0%B8%AA%E0%B8%B8%E0%B8%94-20kg) |
| 3 | Power adapter 5 V 2 A, 5.5×2.5 mm plug (one per node) | P0009 | 2 | 130 | 260 | [product](https://www.cybertice.com/product/365/power-adapter-5v-2a-%E0%B8%AD%E0%B8%B0%E0%B9%81%E0%B8%94%E0%B8%9B%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C-5v-%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B9%81%E0%B8%AA-2a-%E0%B8%AB%E0%B8%B1%E0%B8%A7%E0%B9%81%E0%B8%88%E0%B9%87%E0%B8%84-5-5x2-5mm) |
| 4 | GY-302 BH1750 ambient light sensor | — | 1 | 50 | 50 | [product](https://www.cybertice.com/product/784/gy-302-%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C-%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%A1%E0%B9%81%E0%B8%AA%E0%B8%87-ambient-light-sensor-module-bh1750fvi) |
| 5 | MAX4466 electret microphone amplifier | M0571 | 1 | 65 | 65 | [product](https://www.cybertice.com/product/2057/electret-microphone-sound-sencor-amplifier-max4466-%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%AA%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B9%84%E0%B8%A7%E0%B8%AA%E0%B8%B9%E0%B8%87) |
| 6 | Electrolytic capacitor 1000 µF 50 V, 13×25 mm (one beside each servo) | E0044 | 2 | 6 | 12 | [search](https://www.cybertice.com/search?q=1000uF) |
| | | | | | **1,687** | |

### PO-2: arduitronics (ordered 31 Oct)

| No. | Description | Code | Qty | Unit | Amount | Link |
|---:|---|---|---:|---:|---:|---|
| 1 | DFRobot FireBeetle 2 ESP32-S3 with OV2640 camera (sensor node, first unit) | — | 1 | 1,185 | 1,185 | [product](https://www.arduitronics.com/product/5665/firebeetle-2-esp32-s3-ai-board-with-ov2640-camera-image-recognition-ble-5-%E0%B9%81%E0%B8%97%E0%B9%89%E0%B8%88%E0%B8%B2%E0%B8%81-dfrobot) |
| 2 | Waveshare ESP32-S3-DEV-KIT-N8R8 (gateway). Arduino IDE: Flash Size 8MB, PSRAM OPI. | BA00293 | 1 | 685 | 685 | [product](https://www.arduitronics.com/product/5932/esp32-s3-microcontroller-2-4ghz-wi-fi-development-board-240mhz-dual-core-processor-esp32-s3-wroom-1-) |
| | | | | | **1,870** | |

### PO-3: allnewstep (ordered 31 Oct)

| No. | Description | Code | Qty | Unit | Amount | Link |
|---:|---|---|---:|---:|---:|---|
| 1 | HLK-LD2410 24 GHz mmWave presence radar | A5250 | 2 | 180 | 360 | [product](https://www.allnewstep.com/product/5388/%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%88%E0%B8%B1%E0%B8%9A%E0%B8%A1%E0%B8%99%E0%B8%B8%E0%B8%A9%E0%B8%A2%E0%B9%8C-hlk-ld2410-%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%99%E0%B8%A2%E0%B8%B3%E0%B8%AA%E0%B8%B9%E0%B8%87-%E0%B9%82%E0%B8%A1%E0%B8%94%E0%B8%B9%E0%B8%A5%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%88%E0%B8%B1%E0%B8%9A%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B9%84%E0%B8%AB%E0%B8%A7-fmcw-human-presence-sensor-) |
| 2 | 8-pin adapter board, 1.27/2.0 → 2.54 mm, for the LD2410 (two in use, two spare) | A1121 | 4 | 7 | 28 | [search](https://www.allnewstep.com/search?q=A1121) |
| 3 | DC jack 5.5×2.5 mm, female, solder type (mates with the P0009 plug) | A836 | 2 | 10 | 20 | [search](https://www.allnewstep.com/search?q=DC+Jack) |
| 4 | Breadboard MB-102 | A247 | 2 | 37 | 74 | |
| 5 | Jumper wire, male–female (sold per wire) | A2329 | 20 | 2 | 40 | |
| 6 | Jumper wire, male–male | A2331 | 20 | 2 | 40 | |
| 7 | Jumper wire, female–female | A2330 | 10 | 2 | 20 | |
| 8 | Pin header, 1×40 | A233 | 3 | 5 | 15 | |
| | | | | | **597** | |

### PO-4: Shopee (ordered 31 Oct)

| No. | Description | Code | Qty | Unit | Amount |
|---:|---|---|---:|---:|---:|
| 1 | Sensirion SCD41 CO₂, temperature and humidity sensor module | — | 1 | ~820 | ~820 |

The SCD41 was out of stock at cybertice on 30–31 October and was ordered from Shopee instead (problem P2). The amount will be replaced with the receipt total.

## 3. Orders pending

### PO-5: arduitronics, second node board

| No. | Description | Code | Qty | Unit | Amount | Order by |
|---:|---|---|---:|---:|---:|---|
| 1 | DFRobot FireBeetle 2 ESP32-S3 with OV2640 camera (sensor node, second unit) | — | 1 | 1,185 | 1,185 | Fri 13 Nov |

Order this unit once the proof of concept passes on the first board: build steps C1 (radar engineering data), C2 (VL53L1X), C4 (servo moves with Wi-Fi active, no reset) and C6 (photo reaches the gateway). The 13 November deadline keeps build step F1 on schedule.

### PO-6: cybertice, tools

Needed before soldering can begin: the FireBeetle headers, the LD2410 adapter boards and the DC jack wires.

| No. | Description | Code | Qty | Unit | Amount | Link |
|---:|---|---|---:|---:|---:|---|
| 1 | Soldering kit, 60 W, temperature-adjustable (200–450 °C), with stand, sponge, five tips and desoldering pump | A0559 | 1 | 365 | 365 | [product](https://www.cybertice.com/product/4821/%E0%B8%8A%E0%B8%B8%E0%B8%94%E0%B8%AD%E0%B8%B8%E0%B8%9B%E0%B8%81%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B8%9A%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%A3%E0%B8%B5-60w-%E0%B8%AB%E0%B8%B1%E0%B8%A7%E0%B9%81%E0%B8%A3%E0%B9%89%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B8%E0%B8%93%E0%B8%AB%E0%B8%A0%E0%B8%B9%E0%B8%A1%E0%B8%B4%E0%B9%84%E0%B8%94%E0%B9%89) |
| 2 | Solder wire 60/40, 2 m | A0087 | 2 | 40 | 80 | [category](https://www.cybertice.com/category/96/accessories/%E0%B8%AD%E0%B8%B8%E0%B8%9B%E0%B8%81%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B8%9A%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%A3%E0%B8%B5) |
| 3 | Digital multimeter DT9205A | A0341 | 1 | 270 | 270 | [search](https://www.cybertice.com/search?q=%E0%B8%A1%E0%B8%B1%E0%B8%A5%E0%B8%95%E0%B8%B4%E0%B8%A1%E0%B8%B4%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C) |
| 4 | Side cutter for electronics | A0499 | 1 | 40 | 40 | [search](https://www.cybertice.com/search?q=%E0%B8%84%E0%B8%B5%E0%B8%A1) |
| 5 | Wire stripper, TUOSEN 6 in | A0256 | 1 | 160 | 160 | [search](https://www.cybertice.com/search?q=%E0%B8%84%E0%B8%B5%E0%B8%A1) |
| 6 | Desoldering wick 2.0 mm, 1.5 m | A0491 | 1 | 40 | 40 | [category](https://www.cybertice.com/category/96/accessories/%E0%B8%AD%E0%B8%B8%E0%B8%9B%E0%B8%81%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B8%9A%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%A3%E0%B8%B5) |
| | | | | | **955** | |

The DT9205A runs on a 9 V battery, and the product page does not say one is included. Buy one locally if needed. allnewstep had no multimeters or solder wire in stock on 31 October, which is why this order goes to cybertice.

### PO-7: small parts (estimate)

| No. | Description | Qty | Amount | Needed by |
|---:|---|---:|---:|---|
| 1 | Perfboard for the final wiring | as needed | | Build step G |
| 2 | Enclosure material (foam board or acrylic), glue, fixings | as needed | | Build step G |
| 3 | Printing: QR stickers and labels | as needed | | Build step G |
| | | | **~150** | |

If an enclosure is 3D-printed or laser-cut, obtain a quotation first; it may exceed this estimate.

## 4. Items not to purchase

| Item | Reason |
|---|---|
| AMG8833 thermal sensor | Replaced by the VL53L1X |
| HC-SR501 PIR sensor | Cannot detect a person sitting still |
| MH-Z19C CO₂ sensor | The SCD41 has been ordered |
| Raspberry Pi | The gateway is an ESP32-S3 |
| A third 5 V adapter | The gateway is powered over USB-C from an existing phone charger |
| TOF400C distance sensor | Use the VL53L1X M1532 (210 baht), not the TOF400C (275 baht) |

## 5. Procedure for pending orders

- [ ] One member places each order; every member transfers their share. Record payments in the group chat.
- [ ] Re-check price and stock on the product page immediately before payment.
- [ ] PO-5: confirm the listing is the FireBeetle 2 **with** the OV2640 camera.
- [ ] Record the expected delivery date of every order in the table in section 6.

## 6. Delivery tracking

| Ref. | Supplier | Ordered | Expected | Received | Inspected |
|---|---|---|---|---|---|
| PO-1 | cybertice | 31 Oct | | | |
| PO-2 | arduitronics | 31 Oct | | | |
| PO-3 | allnewstep | 31 Oct | | | |
| PO-4 | Shopee | 31 Oct | | | |
| PO-5 | arduitronics | | | | |
| PO-6 | cybertice | | | | |

If any order will arrive after Friday 6 November, inform the team. Work then begins with the gateway firmware on any team member's Lab 10 board (same layout) and a simulated node until the parts arrive.

## 7. Inspection on receipt

1. Count every item against the order and photograph the parcel contents.
2. Confirm the specifications:
   - The TD-7120MG is labelled 0–270°.
   - The FireBeetle 2 includes the OV2640 camera.
   - The Waveshare board is marked N8R8.
3. Use the multimeter to confirm each adapter gives 5 V. Identify the positive terminal of each DC jack before connecting it to a board.
4. Carry out the first functional tests:
   - **Build step C1, radar:** run the LD2410 with the **MyLD2410** library (`sensor_data` example) in engineering mode. Print the energy in each range gate 10 times per second. The `ld2410` library by ncmreynolds cannot read this data.
   - **Build step C2, VL53L1X:** power it at 3.3 V. Compare an empty chair with a seated person, in both light and dark clothing.
   - **Build step C6, photo:** send a camera photo from the node to the gateway over the hotspot (problem F13). Older FireBeetle 2 revisions need the AXP313A camera power chip switched on in code first; DFRobot provides the code.
   - **Wiring:** wire to the draft pin map in build step A4, checking each pin against the board's printed labels.
