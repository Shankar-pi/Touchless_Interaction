const socket = io();
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

socket.on('gesture_detected', function(data) {
    const gesture = data.gesture;
    console.log('Gesture received:', gesture, 'on page:', currentPage);
    handleGesture(gesture);
});

socket.on('booking_status', function(data) {
    console.log('Booking status:', data);
    if (data.status === 'success') {
        
    } else {
        
    }
});

function handleGesture(gesture) {
    if (gesture === 'X') {
        scrollDown();
        return;
    }
    if (gesture === 'Z') {
        scrollUp();
        return;
    }
    
    if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
        handleIndexGestures(gesture);
    } else if (currentPage === 'flight-info.html') {
        handleFlightInfoGestures(gesture);
    } else if (currentPage === 'baggage-tags.html') {
        handleBaggageTagsGestures(gesture);
    } else if (currentPage === 'help.html') {
        handleHelpGestures(gesture);
    } else if (currentPage === 'call-support.html') {
        handleCallSupportGestures(gesture);
    } else if (currentPage === 'request-staff.html') {
        handleRequestStaffGestures(gesture);
    } else if (currentPage === 'check-in.html') {
        handleCheckInGestures(gesture);
    } else if (currentPage === 'book-flight.html') {
        handleBookFlightGestures(gesture);
    } else if (currentPage === 'airport-map.html') {
        handleAirportMapGestures(gesture);
    }
}

function handleIndexGestures(gesture) {
    switch(gesture) {
        case 'A':
            window.location.href = 'flight-info.html';
            break;
        case 'B':
            window.location.href = 'baggage-tags.html';
            break;
        case 'C':
            window.location.href = 'airport-map.html';
            break;
        case 'I':
            window.location.href = 'help.html';
            break;
        case 'E':
            window.location.href = 'check-in.html';
            break;
        case 'F':
            window.location.href = 'book-flight.html';
            break;
    }
}

function handleFlightInfoGestures(gesture) {
    if (gesture === 'U') {
        window.location.href = 'index.html';
        return;
    }
    
    const dropdown = document.getElementById('selectOptions');
    const isDropdownOpen = dropdown && dropdown.classList.contains('active');
    
    if (gesture === 'I') {
        if (typeof toggleDropdown === 'function') {
            toggleDropdown();
        }
    } else if (isDropdownOpen) {
        if (gesture === 'B' && typeof selectFlight === 'function') {
            selectFlight('SK101');
        } else if (gesture === 'C' && typeof selectFlight === 'function') {
            selectFlight('SK205');
        } else if (gesture === 'D' && typeof selectFlight === 'function') {
            selectFlight('SK308');
        }
    }
}

function handleBaggageTagsGestures(gesture) {
    if (gesture === 'U') {
        window.location.href = 'index.html';
        return;
    }
    
    const bookingDropdown = document.getElementById('bookingOptions');
    const bagsDropdown = document.getElementById('bagsOptions');
    const isBookingOpen = bookingDropdown && bookingDropdown.classList.contains('active');
    const isBagsOpen = bagsDropdown && bagsDropdown.classList.contains('active');
    
    if (gesture === 'A' && !isBookingOpen) {
        if (typeof toggleBookingDropdown === 'function') {
            toggleBookingDropdown();
        }
    } else if (isBookingOpen) {
        if (gesture === 'C' && typeof selectBooking === 'function') {
            selectBooking('ABC123');
        } else if (gesture === 'D' && typeof selectBooking === 'function') {
            selectBooking('XYZ789');
        } else if (gesture === 'E' && typeof selectBooking === 'function') {
            selectBooking('DEF456');
        } else if (gesture === 'F' && typeof selectBooking === 'function') {
            selectBooking('GHI012');
        }
    } else if (gesture === 'H' && !isBagsOpen) {
        if (typeof toggleBagsDropdown === 'function') {
            toggleBagsDropdown();
        }
    } else if (isBagsOpen) {
        if (gesture === 'I' && typeof selectBags === 'function') {
            selectBags('1');
        } else if (gesture === 'J' && typeof selectBags === 'function') {
            selectBags('2');
        } else if (gesture === 'K' && typeof selectBags === 'function') {
            selectBags('3');
        }
    } else if (gesture === 'L') {
        const form = document.getElementById('baggageForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
}

function handleAirportMapGestures(gesture) {
    if (gesture === 'U') {
        window.location.href = 'index.html';
        return;
    }
    
    const mainMenu = document.getElementById('mainMenu');
    const isMainMenuVisible = mainMenu && mainMenu.style.display !== 'none';
    
    if (isMainMenuVisible) {
        if (gesture === 'B' && typeof showSection === 'function') {
            showSection('terminals');
        } else if (gesture === 'D' && typeof showSection === 'function') {
            showSection('gates');
        } else if (gesture === 'K' && typeof showSection === 'function') {
            showSection('restaurants');
        } else if (gesture === 'F' && typeof showSection === 'function') {
            showSection('shops');
        } else if (gesture === 'H' && typeof showSection === 'function') {
            showSection('facilities');
        } else if (gesture === 'I' && typeof showSection === 'function') {
            showSection('transport');
        }
    } else if (gesture === 'E') {
        if (typeof backToMenu === 'function') {
            backToMenu();
        }
    }
}

function handleHelpGestures(gesture) {
    if (gesture === 'U') {
        window.location.href = 'index.html';
        return;
    }
    
    if (gesture === 'L') {
        window.location.href = 'call-support.html';
    } else if (gesture === 'M') {
        window.location.href = 'request-staff.html';
    }
}

function handleCallSupportGestures(gesture) {
    if (gesture === 'U') {
        window.location.href = 'help.html';
        return;
    }
    
    if (gesture === 'A' && typeof callSupport === 'function') {
        callSupport('general');
    } else if (gesture === 'B' && typeof callSupport === 'function') {
        callSupport('special');
    } else if (gesture === 'C' && typeof callSupport === 'function') {
        callSupport('emergency');
    }
}

function handleRequestStaffGestures(gesture) {
    if (gesture === 'U') {
        window.location.href = 'help.html';
        return;
    }
    
    const dropdown = document.getElementById('selectOptions');
    const isDropdownOpen = dropdown && dropdown.classList.contains('active');
    
    if (gesture === 'A' && typeof select === 'function') {
        document.getElementById('formSection').classList.add('show');
        select('Wheelchair');
    } else if (gesture === 'B' && typeof select === 'function') {
        document.getElementById('formSection').classList.add('show');
        select('Flight Changes');
    } else if (gesture === 'C' && typeof select === 'function') {
        document.getElementById('formSection').classList.add('show');
        select('Other');
    } else if (gesture === 'J' && !isDropdownOpen) {
        if (typeof toggleDropdown === 'function') {
            toggleDropdown();
        }
    } else if (isDropdownOpen) {
        if (gesture === 'D' && typeof selectPhone === 'function') {
            selectPhone('+1-555-0101');
        } else if (gesture === 'E' && typeof selectPhone === 'function') {
            selectPhone('+1-555-0102');
        } else if (gesture === 'F' && typeof selectPhone === 'function') {
            selectPhone('+1-555-0103');
        } else if (gesture === 'H' && typeof selectPhone === 'function') {
            selectPhone('+1-555-0104');
        } else if (gesture === 'I' && typeof selectPhone === 'function') {
            selectPhone('+1-555-0105');
        }
    } else if (gesture === 'Y' && typeof submitRequest === 'function') {
        submitRequest();
    }
}

function handleCheckInGestures(gesture) {
    if (gesture === 'U') {
        window.location.href = 'index.html';
        return;
    }
    
    const dropdown = document.getElementById('selectOptions');
    const isDropdownOpen = dropdown && dropdown.classList.contains('active');
    
    if (gesture === 'A' && !isDropdownOpen) {
        if (typeof toggleDropdown === 'function') {
            toggleDropdown();
        }
    } else if (isDropdownOpen) {
        if (gesture === 'D' && typeof selectBooking === 'function') {
            selectBooking('123456', '/Images/Z.png');
        } else if (gesture === 'C' && typeof selectBooking === 'function') {
            selectBooking('789012', '/Images/A.png');
        } else if (gesture === 'B' && typeof selectBooking === 'function') {
            selectBooking('345678', '/Images/A.png');
        }
    } else if (gesture === 'H') {
        const form = document.getElementById('checkinForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
}

function handleBookFlightGestures(gesture) {
    if (gesture === 'U') {
        window.location.href = 'index.html';
        return;
    }
    
    const aadharKeypad = document.getElementById('aadharKeypad');
    const fromModal = document.getElementById('fromModal');
    const toModal = document.getElementById('toModal');
    const classModal = document.getElementById('classModal');
    
    const isAadharOpen = aadharKeypad && aadharKeypad.classList.contains('active');
    const isFromOpen = fromModal && fromModal.classList.contains('active');
    const isToOpen = toModal && toModal.classList.contains('active');
    const isClassOpen = classModal && classModal.classList.contains('active');
    
    if (isAadharOpen) {
        if (gesture === 'A' && typeof addDigit === 'function') {
            addDigit('1');
        } else if (gesture === 'B' && typeof addDigit === 'function') {
            addDigit('2');
        } else if (gesture === 'C' && typeof addDigit === 'function') {
            addDigit('3');
        } else if (gesture === 'D' && typeof addDigit === 'function') {
            addDigit('4');
        } else if (gesture === 'E' && typeof addDigit === 'function') {
            addDigit('5');
        } else if (gesture === 'M' && typeof addDigit === 'function') {
            addDigit('6');
        } else if (gesture === 'R' && typeof addDigit === 'function') {
            addDigit('7');
        } else if (gesture === 'H' && typeof addDigit === 'function') {
            addDigit('8');
        } else if (gesture === 'I' && typeof addDigit === 'function') {
            addDigit('9');
        } else if (gesture === 'T' && typeof addDigit === 'function') {
            addDigit('0');
        } else if (gesture === 'K' && typeof backspace === 'function') {
            backspace();
        }
    } else if (isFromOpen) {
        if (gesture === 'L' && typeof selectFrom === 'function') {
            selectFrom('Hyderabad');
        } else if (gesture === 'O' && typeof selectFrom === 'function') {
            selectFrom('Delhi');
        }
    } else if (isToOpen) {
        if (gesture === 'A' && typeof selectTo === 'function') {
            selectTo('New York');
        } else if (gesture === 'B' && typeof selectTo === 'function') {
            selectTo('Canada');
        }
    } else if (isClassOpen) {
        if (gesture === 'C' && typeof selectClass === 'function') {
            selectClass('Economy');
        } else if (gesture === 'D' && typeof selectClass === 'function') {
            selectClass('Business');
        } else if (gesture === 'F' && typeof selectClass === 'function') {
            selectClass('First Class');
        }
    } else if (gesture === 'Y') {
        const form = document.getElementById('bookingForm');
        const submitBtn = document.getElementById('submitBtn');
        if (form && submitBtn && submitBtn.classList.contains('show')) {
            const bookingData = collectBookingData();
            
            console.log('📤 Sending booking data to server:', bookingData);
            socket.emit('booking_submitted', bookingData);
            
            form.dispatchEvent(new Event('submit'));
        }
    }
}

function collectBookingData() {
    const aadharInput = document.getElementById('aadharInput');
    const fromInput = document.getElementById('fromInput');
    const toInput = document.getElementById('toInput');
    const classInput = document.getElementById('classInput');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const flightDate = futureDate.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    });
    
    const bookingData = {
        aadhar: aadharInput ? aadharInput.value.replace(/\s/g, '') : '',
        from: fromInput ? fromInput.value : '',
        to: toInput ? toInput.value : '',
        class: classInput ? classInput.value : '',
        flight_date: flightDate,
        flight_time: '10:30 AM',
        firstName: firstNameInput ? firstNameInput.value : '',
        lastName: lastNameInput ? lastNameInput.value : '',
        email: emailInput ? emailInput.value : ''
    };
    
    console.log('📋 Collected booking data:', bookingData);
    return bookingData;
}

function scrollDown() {
    window.scrollBy({ top: 300, behavior: 'smooth' });
}

function scrollUp() {
    window.scrollBy({ top: -300, behavior: 'smooth' });
}