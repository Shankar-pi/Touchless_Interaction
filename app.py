import cv2
import pickle
import numpy as np
import mediapipe as mp
from flask import Flask, render_template, Response, jsonify, send_from_directory, request
from flask_socketio import SocketIO, emit
from collections import deque, Counter
from send_ticket_confirmation import send_ticket_confirmation
import threading
import time
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize Mediapipe Hand Detector
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Load the trained model
try:
    with open("model.p", "rb") as f:
        model_data = pickle.load(f)
    model = model_data['model']
    print("Model loaded successfully!")
except FileNotFoundError:
    print("Error: model.p file not found. Please train the model first.")
    exit()
except Exception as e:
    print(f"Error loading model: {e}")
    exit()

# Initialize webcam
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

# Initialize MediaPipe Hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5
)

# For smoothing predictions
prediction_history = deque(maxlen=10)
current_prediction = "Show your hand"
last_sent_prediction = ""
last_sent_time = 0
GESTURE_COOLDOWN = 1.5

# Email cooldown tracking
last_email_sent_time = 0
EMAIL_COOLDOWN = 60  # 60 seconds (1 minute) cooldown between emails

@socketio.on('booking_submitted')
def handle_booking_submission(data):
    """Handle booking form submission with email cooldown"""
    global last_email_sent_time
    
    current_time = time.time()
    time_since_last_email = current_time - last_email_sent_time
    
    print("\n" + "="*60)
    print("BOOKING SUBMISSION RECEIVED")
    print("="*60)
    print(f"Booking data: {data}")
    print(f"  - Aadhar: {data.get('aadhar')}")
    print(f"  - From: {data.get('from')}")
    print(f"  - To: {data.get('to')}")
    print(f"  - Class: {data.get('class')}")
    print(f"  - Flight Date: {data.get('flight_date')}")
    print(f"  - Flight Time: {data.get('flight_time')}")
    print(f"Time since last email: {time_since_last_email:.2f} seconds")
    print("="*60)
    
    # Check if enough time has passed since last email
    if time_since_last_email < EMAIL_COOLDOWN:
        remaining_time = int(EMAIL_COOLDOWN - time_since_last_email)
        print(f"⚠ EMAIL BLOCKED: Please wait {remaining_time} more seconds")
        print("="*60)
        emit('booking_status', {
            'status': 'cooldown',
            'message': f'Please wait {remaining_time} seconds before submitting another booking.'
        })
        return
    
    # Send email
    print("Sending email...")
    result = send_ticket_confirmation(data)
    print(result)
    
    # Update last email sent time
    last_email_sent_time = current_time
    
    # Send success response
    emit('booking_status', {'status': 'success', 'message': 'Booking confirmed successfully!'})
    print("✓ Booking status: SUCCESS")
    print(f"✓ Next email can be sent after {EMAIL_COOLDOWN} seconds")
    print("="*60)

def camera_display_thread():
    global current_prediction, last_sent_prediction, last_sent_time
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        frame = cv2.flip(frame, 1)
        height, width, _ = frame.shape
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(frame_rgb)
        frame_prediction = "No hand detected"
        
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    frame,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style()
                )
                
                data_aux = []
                x_ = []
                y_ = []
                
                for landmark in hand_landmarks.landmark:
                    x_.append(landmark.x)
                    y_.append(landmark.y)
                    
                for landmark in hand_landmarks.landmark:
                    data_aux.append(landmark.x - min(x_))
                    data_aux.append(landmark.y - min(y_))
                
                if len(data_aux) == 42:
                    prediction = model.predict([np.asarray(data_aux)])[0]
                    frame_prediction = prediction
                    prediction_history.append(prediction)
                    
                    if prediction_history:
                        pred_counter = Counter(prediction_history)
                        current_prediction = pred_counter.most_common(1)[0][0]
                        
                        current_time = time.time()
                        if (current_prediction != last_sent_prediction or 
                            current_time - last_sent_time > GESTURE_COOLDOWN):
                            socketio.emit('gesture_detected', {'gesture': current_prediction})
                            print(f"Gesture detected: {current_prediction}")
                            last_sent_prediction = current_prediction
                            last_sent_time = current_time
        
        cv2.rectangle(frame, (10, 10), (400, 90), (0, 0, 0), -1)
        cv2.putText(frame, f"Current: {current_prediction}", (20, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        try:
            cv2.imshow('Airport Kiosk - Gesture Recognition', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        except:
            time.sleep(0.01)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/Images/<path:filename>')
def serve_images(filename):
    return send_from_directory('Images', filename)

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

@app.route('/<page>')
def serve_page(page):
    if page.endswith('.html'):
        return render_template(page)
    elif page.endswith('.png') or page.endswith('.jpg') or page.endswith('.jpeg'):
        if os.path.exists(page):
            return send_from_directory('.', page)
    return "File not found", 404

@app.route('/favicon.ico')
def favicon():
    return '', 204

if __name__ == '__main__':
    print("\n" + "="*60)
    print("AIRPORT KIOSK - STARTING SERVER")
    print("="*60)
    print("Gesture recognition enabled")
    print(f"Email cooldown: {EMAIL_COOLDOWN} seconds")
    print("="*60 + "\n")
    
    camera_thread = threading.Thread(target=camera_display_thread, daemon=True)
    camera_thread.start()
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, use_reloader=False)