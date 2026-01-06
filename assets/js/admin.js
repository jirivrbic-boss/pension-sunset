// ============================================
// ADMIN JAVASCRIPT
// ============================================

import { auth, db } from './firebase.js';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth';
import { 
    collection, 
    getDocs, 
    getDoc,
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    orderBy 
} from 'firebase/firestore';

// ============================================
// INITIALIZATION
// ============================================

let currentUser = null;
let editingRoomId = null;

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initRoomForm();
    loadAvailableImages();
});

// ============================================
// AUTHENTICATION
// ============================================

function initAuth() {
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginError = document.getElementById('loginError');
    
    // Check auth state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loginScreen.style.display = 'none';
            adminDashboard.style.display = 'block';
            document.getElementById('adminUser').textContent = `Přihlášen: ${user.email}`;
            loadRooms();
        } else {
            currentUser = null;
            loginScreen.style.display = 'flex';
            adminDashboard.style.display = 'none';
        }
    });
    
    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            loginError.classList.remove('show');
            
            try {
                await signInWithEmailAndPassword(auth, email, password);
                // Success - onAuthStateChanged will handle UI update
            } catch (error) {
                console.error('Login error:', error);
                loginError.textContent = getErrorMessage(error.code);
                loginError.classList.add('show');
            }
        });
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
            } catch (error) {
                console.error('Logout error:', error);
                alert('Chyba při odhlášení: ' + error.message);
            }
        });
    }
}

function getErrorMessage(errorCode) {
    const messages = {
        'auth/user-not-found': 'Uživatel s tímto emailem neexistuje.',
        'auth/wrong-password': 'Nesprávné heslo.',
        'auth/invalid-email': 'Neplatný email.',
        'auth/user-disabled': 'Tento účet byl deaktivován.',
        'auth/too-many-requests': 'Příliš mnoho pokusů. Zkuste to později.',
        'auth/network-request-failed': 'Chyba připojení. Zkontrolujte internet.'
    };
    
    return messages[errorCode] || 'Chyba při přihlášení. Zkuste to znovu.';
}

// ============================================
// ROOMS MANAGEMENT
// ============================================

async function loadRooms() {
    const tableBody = document.getElementById('roomsTableBody');
    if (!tableBody) return;
    
    try {
        const roomsRef = collection(db, 'rooms');
        const q = query(roomsRef, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Žádné pokoje. Přidejte první pokoj pomocí tlačítka výše.</td></tr>';
            return;
        }
        
        tableBody.innerHTML = '';
        
        querySnapshot.forEach((docSnapshot) => {
            const room = docSnapshot.data();
            const row = createRoomRow(room, docSnapshot.id);
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center" style="color: red;">Chyba při načítání pokojů: ' + error.message + '</td></tr>';
    }
}

function createRoomRow(room, roomId) {
    const row = document.createElement('tr');
    
    const imageUrl = room.image ? `fotky/${room.image}` : '';
    const imageCell = imageUrl 
        ? `<img src="${imageUrl}" alt="${room.name}" class="table-image" onerror="this.style.display='none'">`
        : '<span style="color: #999;">Není</span>';
    
    row.innerHTML = `
        <td><strong>${room.name || 'Neznámý'}</strong></td>
        <td>${room.price || 0} Kč</td>
        <td>${room.capacity || 0} osob</td>
        <td>${(room.description || '').substring(0, 50)}${(room.description || '').length > 50 ? '...' : ''}</td>
        <td>${imageCell}</td>
        <td>
            <div class="table-actions">
                <button class="btn btn-secondary btn-sm" onclick="editRoom('${roomId}')">
                    <i class="fas fa-edit"></i> Editovat
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteRoom('${roomId}', '${room.name}')">
                    <i class="fas fa-trash"></i> Smazat
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// ============================================
// ROOM FORM
// ============================================

function initRoomForm() {
    const addRoomBtn = document.getElementById('addRoomBtn');
    const roomForm = document.getElementById('roomForm');
    const modal = document.getElementById('roomModal');
    const modalClose = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('cancelBtn');
    const formError = document.getElementById('formError');
    
    // Open modal for new room
    if (addRoomBtn) {
        addRoomBtn.addEventListener('click', () => {
            editingRoomId = null;
            document.getElementById('modalTitle').textContent = 'Přidat pokoj';
            document.getElementById('submitBtnText').textContent = 'Přidat pokoj';
            roomForm.reset();
            document.getElementById('roomId').value = '';
            formError.classList.remove('show');
            modal.classList.add('active');
        });
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        editingRoomId = null;
        roomForm.reset();
        formError.classList.remove('show');
    }
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Form submission
    if (roomForm) {
        roomForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            formError.classList.remove('show');
            
            const roomData = {
                name: document.getElementById('roomName').value.trim(),
                price: parseInt(document.getElementById('roomPrice').value),
                capacity: parseInt(document.getElementById('roomCapacity').value),
                description: document.getElementById('roomDescription').value.trim(),
                image: document.getElementById('roomImage').value.trim()
            };
            
            // Validation
            if (!roomData.name || !roomData.description) {
                formError.textContent = 'Vyplňte prosím všechna povinná pole.';
                formError.classList.add('show');
                return;
            }
            
            try {
                if (editingRoomId) {
                    // Update existing room
                    const roomRef = doc(db, 'rooms', editingRoomId);
                    await updateDoc(roomRef, roomData);
                    alert('Pokoj byl úspěšně aktualizován!');
                } else {
                    // Add new room
                    await addDoc(collection(db, 'rooms'), roomData);
                    alert('Pokoj byl úspěšně přidán!');
                }
                
                closeModal();
                loadRooms();
            } catch (error) {
                console.error('Error saving room:', error);
                formError.textContent = 'Chyba při ukládání: ' + error.message;
                formError.classList.add('show');
            }
        });
    }
}

// Global functions for table actions
window.editRoom = async function(roomId) {
    editingRoomId = roomId;
    
    try {
        const roomRef = doc(db, 'rooms', roomId);
        const roomDoc = await getDoc(roomRef);
        
        if (!roomDoc.exists()) {
            alert('Pokoj nebyl nalezen.');
            return;
        }
        
        const roomData = roomDoc.data();
        
        // Fill form
        document.getElementById('modalTitle').textContent = 'Editovat pokoj';
        document.getElementById('submitBtnText').textContent = 'Uložit změny';
        document.getElementById('roomId').value = roomId;
        document.getElementById('roomName').value = roomData.name || '';
        document.getElementById('roomPrice').value = roomData.price || '';
        document.getElementById('roomCapacity').value = roomData.capacity || '';
        document.getElementById('roomDescription').value = roomData.description || '';
        document.getElementById('roomImage').value = roomData.image || '';
        
        document.getElementById('roomModal').classList.add('active');
    } catch (error) {
        console.error('Error loading room:', error);
        alert('Chyba při načítání pokoje: ' + error.message);
    }
};

window.deleteRoom = async function(roomId, roomName) {
    if (!confirm(`Opravdu chcete smazat pokoj "${roomName}"? Tato akce je nevratná.`)) {
        return;
    }
    
    try {
        await deleteDoc(doc(db, 'rooms', roomId));
        alert('Pokoj byl úspěšně smazán!');
        loadRooms();
    } catch (error) {
        console.error('Error deleting room:', error);
        alert('Chyba při mazání pokoje: ' + error.message);
    }
};

// ============================================
// AVAILABLE IMAGES
// ============================================

function loadAvailableImages() {
    const availableImagesSpan = document.getElementById('availableImages');
    if (!availableImagesSpan) return;
    
    // List of available images
    const images = [
        '107276708.jpg', '119300806.jpg', '129898529.jpg', '129898757.jpg',
        '129899039.jpg', '130040998.jpg', '130644941.jpg', '130645994.jpg',
        '130646422.jpg', '143146327.jpg', '143147259.jpg', '143148468.jpg',
        '144696148.jpg', '144696484.jpg', '144699058.jpg', '178478261.jpg',
        '178479648.jpg', '178479759.jpg', '178480294.jpg', '178480560.jpg',
        '178480866.jpg', '178481221.jpg', '178482126.jpg', '178482932.jpg',
        '178483119.jpg', '178484544.jpg', '53954045.jpg', '61598806.jpg',
        '73269680.jpg', '73269716.jpg', '73269987.jpg', '74401789.jpg',
        '88051428.jpg', '88282651.jpg', '96204493.jpg'
    ];
    
    availableImagesSpan.textContent = images.slice(0, 5).join(', ') + ' ... (celkem ' + images.length + ' obrázků)';
}

