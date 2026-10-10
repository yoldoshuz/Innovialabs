---
title: Object Detection With YOLO: From Dataset to Deployment
description: How to collect and label images, fine-tune YOLO, evaluate it with mAP and deploy the model on a camera or edge device for a real business task.
summary: A YOLO project is mostly data work: collect frames from real conditions, label them carefully, fine-tune a pretrained model, check mAP on held-out data and export for your hardware.
---
## The short answer

**YOLO** (You Only Look Once) is a family of models that find objects in an image in a single pass and draw boxes around them with a class and confidence score. For a business task — a helmet on a worker, a license plate, a product on a shelf — you usually do not train from scratch. You **fine-tune** a pretrained model on your own data. The path is: data → labeling → training → evaluation → deployment.

## Step 1. Collecting images

Model quality depends on how closely your data matches real operation.

- Shoot **with the same camera and angle** the model will use in production.
- Cover different lighting: day, night, glare, rain.
- Include hard frames: partly hidden objects, crowds, small objects far away.
- Add frames **with no objects** so the model produces fewer false alarms.
- Avoid near-identical consecutive video frames: take every Nth frame.

## Step 2. Labeling

Each object gets a box and a class. Tools such as CVAT or Label Studio export labels in YOLO format.

Rules that save weeks:

- Write a **labeling guide**: what counts as an object, how to handle partly visible ones.
- Boxes should fit the object tightly, without extra background.
- Spot-check labels — labeling errors directly reduce quality.
- Split data into **train / val / test** up front, and keep frames from one scene in the same split.

A YOLO dataset description:

```yaml
path: datasets/helmets
train: images/train
val: images/val
names:
  0: helmet
  1: no_helmet
```

## Step 3. Training

With the Ultralytics library, basic fine-tuning takes a few lines:

```python
from ultralytics import YOLO

model = YOLO("yolov8n.pt")          # small pretrained model
model.train(data="data.yaml", epochs=100, imgsz=640)
metrics = model.val()                # evaluate on val
model.export(format="onnx")          # export for deployment
```

Model size is a trade-off: **small** variants (n, s) are fast and fit edge devices, **large** ones (l, x) are more accurate but need a strong GPU.

## Step 4. Evaluation: what mAP means

- **Precision** — the share of detections that are actually correct.
- **Recall** — the share of real objects the model found.
- **mAP@0.5** — average precision when boxes overlap by 50% or more.
- **mAP@0.5:0.95** — a stricter metric averaged across several overlap thresholds.

Look beyond the overall mAP: check **per-class metrics** and review errors visually. For safety tasks, recall often matters more (do not miss a violation); for automated penalties, precision matters more (do not punish by mistake).

## Step 5. Deployment

| Option | When it fits |
|---|---|
| GPU server | Many cameras, accuracy matters, stable network |
| Edge device (Jetson and similar) | On-site processing, low traffic, privacy |
| CPU / mini PC | Few streams, small model, lower FPS is acceptable |

To speed things up, export the model to **ONNX**, **TensorRT** or **OpenVINO** depending on the hardware. Then you need code around the model: reading the RTSP stream, confirming detections across several frames, and sending events to a CRM, Telegram or an accounting system.

## Common mistakes

- Training on internet photos but deploying on a camera with a different angle.
- Evaluating on frames very similar to training ones — the metrics come out inflated.
- Not monitoring after launch: lighting or the camera changes and quality drops.
- Reacting to every single detection without confirming it over several frames.

## FAQ

### How many images do I need for fine-tuning?

It depends on object complexity and scene variety. Start with a small but diverse set, train a first version, study its errors and collect more data specifically for those cases.

### Can YOLO run without a GPU?

Yes, small models run on a CPU, especially after exporting to OpenVINO or ONNX. FPS will be lower, so many cameras usually call for a GPU or an edge accelerator.

### How often should the model be retrained?

Whenever conditions change: new cameras, lighting, uniforms or objects. Save frames where the model failed in production — they are the best material for the next version.
