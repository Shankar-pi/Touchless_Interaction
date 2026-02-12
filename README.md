
## 🚀 Overview

Touchless Interaction with Kiosk is a computer vision-based system that enables users to interact with a kiosk interface using hand gestures instead of physical touch.

The project was developed to improve hygiene, accessibility, and user experience in public environments such as ATMs, ticketing machines, and self-service kiosks.

---

## 🎯 Problem Statement

Traditional kiosks require physical contact, which can:

* Spread germs in public environments
* Create accessibility challenges
* Reduce user convenience

This project provides a **contactless interaction system** using real-time hand gesture recognition.

---

## 🛠️ Technologies Used

* Flask – Web framework
* OpenCV – Real-time computer vision
* TensorFlow – Deep learning framework for gesture model
* MediaPipe – Hand tracking and gesture recognition
* HTML/CSS – Frontend interface
* Pretrained model: gesture_model.h5

---

## ✨ Features

* Real-time hand tracking
* Gesture-based menu navigation
* Touch-free interaction
* Lightweight and efficient processing
* Achieved **>90% gesture detection accuracy** during testing

---

## 🧠 How It Works (Technical Explanation)

The system uses real-time frame processing through OpenCV.

* Frames are captured from the webcam
* Image preprocessing (grayscale conversion, thresholding, contour detection) is applied
* Hand region is extracted
* Gesture patterns are classified based on shape and movement
* Detected gestures trigger corresponding UI events

The system is optimized to reduce latency and ensure smooth user experience.


---

## 🖥️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/touchless-kiosk.git

# Create a virtual environment:
python -m venv venv
venv\Scripts\activate      # For Windows
# OR
source venv/bin/activate   # For macOS/Linux

# Install dependencies:
pip install -r requirements.txt

# Run the project
python main.py
```

---

## 📂  Folder Structure

```
Touchless_Interaction_With_Kisok/
│
├── app.py                      # Main backend script
├── gesture_model.h5            # Trained gesture model
├── index111.html               # HTML UI
│
├── static/                     # Assets (images, styles)
│   ├── *.png                   # Icon images
│   ├── *.jpg                   # Background/check-in images
│   ├── styles.css              # Styling
│   ├── styles1.css
│   └── styles2.css

```

---

##📦 requirements.txt

```
Flask
opencv-python
tensorflow
mediapipe
numpy

```

---

## ⚠️ Challenges Faced

* Handling varying lighting conditions
* Background noise interference
* Reducing detection delay
* Improving gesture accuracy

---

## 📈 Results

* Achieved more than 90% gesture detection accuracy
* Successfully integrated gesture recognition with kiosk interface
* Improved accessibility and hygiene in public interaction systems

