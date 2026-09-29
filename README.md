# 🌉 SignBridge — Indian Sign Language (ISL) Vision Recognition

SignBridge is an assistive web application that translates **Indian Sign Language (ISL)** hand gestures into live on-screen text and natural real-time speech using 3D skeletal computer vision and an in-browser Deep Neural Network (MLP).

---

## 🚀 Key Features

* **Dual-Hand 3D Landmark Tracking (60 FPS):** Detects 42 skeletal joints across both hands in real time via Google MediaPipe.
* **In-Browser Neural Classification (< 0.1 ms latency):** Executes a trained Multi-Layer Perceptron (MLP) directly in client-side JavaScript without requiring server round-trips or heavy external runtimes.
* **Real-Time Speech Synthesis:** Converts recognized signs into clear spoken voice audio using the Web Speech API.
* **Interactive Visual Feedback:** Features a 3×3 real-time reference grid where the recognized sign illuminates dynamically with a unique signature color.
* **100% Vector SVG Iconography:** Clean, modern high-tech interface built with pure vector symbols and zero emoji dependencies.

---

## 🛠️ Tech Stack

* **Frontend:** React 19 + Vite (Modern Dark Glassmorphic Design System)
* **Computer Vision:** Google MediaPipe Tasks Vision API (42 3D joint landmarks)
* **Machine Learning:** TensorFlow / Keras (offline training), JSON weight export for native browser inference
* **Audio:** Web Speech Synthesis API
* **Language Standards:** Indian Sign Language Research and Training Centre (ISLRTC)

---

## 📖 How It Works & Mathematical Process

For a detailed, step-by-step breakdown of how raw camera pixels are converted into skeletal graph coordinates, mathematically normalized, and evaluated by the Neural Network, see:

👉 **[Read the Full Engineering & Mathematical Process Guide (process.md)](./process.md)**

---

## 📊 Model Architecture & Benchmark Summary

* **Model Type:** Multi-Layer Perceptron (MLP Deep Neural Network)
* **Input Layer:** 126 normalized 3D landmark features (21 joints $\times$ 3 coords $\times$ 2 hands)
* **Hidden Layer 1:** 128 neurons (`ReLU` activation + 20% Dropout)
* **Hidden Layer 2:** 64 neurons (`ReLU` activation + 20% Dropout)
* **Output Layer:** 9 classes for Digits 1–9 (`Softmax` activation)

### Empirical Accuracy Metrics

| Condition | Measured Accuracy | Real-World Context |
| :--- | :---: | :--- |
| **Kaggle Benchmark (5-Fold CV)** | **100.00%** | Theoretical performance on dataset test sets. |
| **Tracking Jitter & Hand Tremors** | **99.1% – 100%** | Highly resistant to hand shaking (up to 20% noise injection). |
| **Live Upright Gestures** | **90% – 95%** | Real-world testing when hand is upright in front of the lens. |
| **Hand Tilt / Slanted Wrist ($\pm 20^\circ$)** | **71% – 72%** | Accuracy drops if wrist is tilted diagonally $>15^\circ$. |

> **Accuracy Tip:** For best recognition, position your hand upright and 2 to 3 feet from the camera in a reasonably well-lit room.

---

## 💻 Getting Started Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [npm](https://www.npmjs.com/)

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Build for production
npm run build
```

Open your browser to `http://localhost:5173` to launch SignBridge.
