# ASTRA-HAR — Demo Script

**SIH 2026 | Team UnoFlyp | ISRO PS-26174**
Target runtime: ~2 minutes

---

> **Presenter notes:**
> Speak at a natural pace — don't rush. Hit every [ACTION] cue before you say the line that follows it.
> The audience is technical; don't over-explain, but make sure they see every state change.

---

## 0. Hook — 10 seconds

"Astronauts on the ISS follow strict step-by-step protocols for scientific experiments. If they miss a step or do it out of order, the experiment is compromised — and ground crew may not know for minutes. We built ASTRA-HAR to catch that in under a second, on-device, without sending a single frame of video to the ground."

---

## 1. Mission Overview — 15 seconds

[ACTION: Navigate to the Mission Overview page. Let the page fully load so the panel values are visible.]

"This is Mission Overview — the first thing a ground controller sees when they open the dashboard. You've got mission elapsed time, protocol compliance percentage, the current experiment step, and a live view of the AI pipeline stages. Everything is green right now — experiment hasn't started yet."

[ACTION: Point to or hover over the compliance percentage and the AI pipeline visualization.]

"That pipeline — Camera, Object Detection, Pose, Hand Tracking, Activity Recognition, Sequence Validation — that entire chain runs on the edge device. Nothing goes to the cloud."

---

## 2. Live Experiment — 40 seconds

[ACTION: Navigate to the Live Experiment page.]

"This is the main operational view. On the left you have the camera feed — in deployment, this is the payload camera inside the ISS module. The overlays show bounding boxes on detected objects, the skeletal pose, and hand landmarks. On the right is the protocol sequence timeline."

[ACTION: Click START DEMO.]

"I'll start the simulation now. Watch the sequence timeline — steps are completing as the astronaut performs them in order. The AI decision pipeline panel on the right is lighting up at each stage as inference runs."

[ACTION: Wait for 2–3 steps to complete in the timeline. Point to the KPI strip at the top or bottom of the page.]

"You can see the KPI strip updating — events logged, bandwidth saved versus raw video, uptime, compliance rate. Right now we're fully compliant."

[ACTION: Click WRONG SEQUENCE (or the equivalent deviation trigger button).]

"Now I'll simulate the astronaut skipping a step — grabbing the wrong object."

[ACTION: Pause 1 second and let the deviation alert appear on screen.]

"There it is. The sequence engine caught the mismatch immediately — deviation alert, the step is flagged, and the operator panel lights up. The astronaut also gets voice guidance telling them to stop and return to the previous step."

[ACTION: Click ACKNOWLEDGE on the deviation alert.]

"Acknowledging the alert resumes the monitoring loop. The event is already written to the log. Ground crew can review it asynchronously."

---

## 3. Protocol Page — 10 seconds

[ACTION: Navigate to the Protocol page.]

"The Protocol page is where you define the experiment sequence before launch. Each step has an action type, the target object, the expected interaction, the voice instruction the astronaut hears, and a minimum confidence threshold the AI has to meet before it marks the step complete. You can build, edit, and save custom protocols here."

---

## 4. AI Vision Page — 10 seconds

[ACTION: Navigate to the AI Vision page.]

"AI Vision gives you a dedicated view of what the model sees. Full camera feed with live detection annotations, and per-class confidence scores — object detection, pose estimation, hand tracking — with a running history. This is the view you'd hand to the AI team for debugging or model tuning."

---

## 5. Event Log Page — 10 seconds

[ACTION: Navigate to the Event Log page. Click one of the category filter buttons — for example, WARNING.]

"The Event Log is a full timeline of everything that happened in the experiment. Filter by category — ACTION, OBJECT, WARNING, SYSTEM. That deviation we just triggered is already here. You can export the full log as a structured file for post-mission analysis."

---

## 6. Video / Stream Page — 5 seconds

[ACTION: Navigate to the Video / Stream page.]

"Video and Stream — local recording controls and RTSP stream configuration for the payload camera. Video is stored on the edge device and downlinked when bandwidth allows. Nothing is streamed live to the ground."

---

## 7. System Health Page — 10 seconds

[ACTION: Navigate to the System Health page. Let the charts animate for a moment.]

"System Health gives you live resource monitoring — CPU, GPU, memory, temperature, inference FPS, and end-to-end latency. On a real deployment, if the edge device is thermal-throttling or inference latency spikes above threshold, the crew gets a system warning before it affects detection accuracy."

---

## 8. Outro — 10 seconds

[ACTION: Navigate back to the Mission Overview page or keep System Health visible — whichever looks best on your screen.]

"To close — ASTRA-HAR runs fully offline, no cloud dependency. Raw video is 2.4 gigabytes per hour; we bring that down to 18 megabytes per hour in structured telemetry — over 99% reduction. The entire AI pipeline runs on the edge device in under one second per decision. That's ASTRA-HAR — thank you."

---

*Total spoken word count: ~310 words | Estimated delivery time: ~2 min 5 sec at 150 wpm*
