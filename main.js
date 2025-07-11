const SUPABASE_URL = 'https://pyuqhcptlcbxwohevvvv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5dXFoY3B0bGNieHdvaGV2dnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODUwMDYsImV4cCI6MjA2NjI2MTAwNn0.8C2xfii7OgpNo54GKyGMTzxjLbY11SOmOkkobqb9mdo';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auto-select current day
const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
let currentDay = days[new Date().getDay()];
let workoutPlan = {};
let workoutProgress = {}; // This will hold in-progress data

// Default workout plan
let previousWorkout = {};
let hasPreviousWorkout = false; // Track if user has previous workout data
let hasPersonalizedWorkout = false;

// State management variables
let isLoggedIn = false;
let loggedInUserId = null;

const defaultWorkoutPlan = {
    'MON': [
        {muscle: 'Leg', exercise: 'Leg Curl', sets: 5, reps: '20, 30', rpe: '7–8', description: 'Last set 30 reps, slow eccentric', ref : ''},
        {muscle: 'Leg', exercise: 'Barbell Squat', sets: 5, reps: '15–20', rpe: '7–8', description: 'Narrow stance, PR every 3 weeks', ref : ''},
        {muscle: 'Leg', exercise: 'Leg Extension', sets: 5, reps: '20–25, 30', rpe: '8–9', description: 'Last set 30 reps, focus on squeeze', ref : ''},
        {muscle: 'Tricep', exercise: 'Cable Pushdown', sets: 3, reps: '15, 12, 10', rpe: '7–8', description: 'Controlled tempo, full ROM', ref : ''},
        {muscle: 'Bicep', exercise: 'Spider Curls', sets: 3, reps: '8,10,8', rpe: '7–8', description: 'Flat Bench Laying down', ref : ''},
        {muscle: 'Tricep', exercise: 'Single-Handed Cable Push', sets: 3, reps: 'To failure', rpe: '9', description: 'Partials at end, both arms', ref : ''},
        {muscle: 'Tricep', exercise: 'Overhead Cable Extension', sets: 3, reps: '15', rpe: '7–8', description: 'Keep elbows stable', ref : ''},
        {muscle: 'Bicep', exercise: 'Single-Handed Cable Pull', sets: 3, reps: '6,8,6', rpe: '7–9', description: 'Focus on Strech part', ref : ''},
        {muscle: 'Tricep', exercise: 'Skull Crushers', sets: 3, reps: '10–12', rpe: '8', description: 'Elbow eye level', ref : ''}
    ],
    'TUE': [
        {muscle: 'Chest', exercise: 'Incline Barbell Bench Press', sets: 6, reps: '15', rpe: '8', description: 'Focus on upper chest, added sets', ref : ''},
        {muscle: 'Chest', exercise: 'Incline Dumbbell Bench Press', sets: 3, reps: '10', rpe: '7–8', description: 'Emphasize stretch, slow eccentric', ref : ''},
        {muscle: 'Chest', exercise: 'Pec Fly/Cable Fly', sets: 3, reps: '15', rpe: '7–8', description: 'Controlled, full ROM', ref : ''},
        {muscle: 'Shoulder', exercise: 'Single-Handed Cable Lateral', sets: 3, reps: 'To failure', rpe: '9', description: 'Partials at end, controlled', ref : ''},
        {muscle: 'Shoulder', exercise: 'Seated Rear Delt Extension', sets: 3, reps: '10', rpe: '7–8', description: 'Focus on rear delts, strict form', ref : ''}
    ],
    'WED': [
        {muscle: 'Back', exercise: 'Lat Pulldown', sets: 4, reps: '15', rpe: '7–8', description: 'Alternate between Wide and Narrow Grip', ref : ''},
        {muscle: 'Back', exercise: 'Cable Row (Lat-Focused)', sets: 3, reps: '15-20', rpe: '7–8', description: 'Perform seated rows by pulling the handle towards the lower abdomen/hips, keeping elbows close to the body, and minimizing biceps and trapezius involvement for maximum lat engagement.', ref : 'https://pyuqhcptlcbxwohevvvv.supabase.co/storage/v1/object/public/workoutvideos/back/Back%20-%20Cable%20Seated%20Row%20(Lat-Focused)%20-%20Made%20with%20Clipchamp.mp4'},
        {muscle: 'Back', exercise: 'Incline Bench Shrug', sets: 4, reps: '5-8', rpe: '7-8', description: 'Lying face down on an incline bench, shrug shoulders upwards, focusing on squeezing the shoulder blades to activate the mid and lower traps.', ref : 'https://pyuqhcptlcbxwohevvvv.supabase.co/storage/v1/object/public/workoutvideos/back/Back%20-%20Incline%20Bench%20Shrug%20-%20Made%20with%20Clipchamp.mp4'},
        {muscle: 'Back', exercise: 'Lat Prayer', sets: 3, reps: '15', rpe: '7–8', description: 'Last set partials, controlled', ref : ''},
        {muscle: 'Bicep', exercise: 'Barbell Curl', sets: 5, reps: '15', rpe: '7–8', description: 'Focus on Negatives', ref : ''},
        {muscle: 'Bicep', exercise: 'Single-Handed Cable Curl', sets: 3, reps: '10', rpe: '9', description: 'Partials at end, both arms', ref : ''},
        {muscle: 'Bicep', exercise: 'Double Handed Cable Curl', sets: 3, reps: '15', rpe: '7–8', description: 'Strict form, full ROM', ref : ''}
    ],
    'THU': [
        {muscle: 'Core', exercise: 'Elevated Knee Tuck In (Pike Position)', sets: 5, reps: '15', rpe: '7–8', description: 'Starting in a plank-like position with feet elevated, tuck knees towards the chest, lifting the hips high.', ref : 'https://pyuqhcptlcbxwohevvvv.supabase.co/storage/v1/object/public/workoutvideos/core/Core%20-%20Elevated%20Knee%20Tuck%20In%20-%20Made%20with%20Clipchamp.mp4'},
        {muscle: 'Core', exercise: 'Hanging Knee Raises', sets: 4, reps: '10', rpe: '7–8', description: 'Bringing the knees up and then twisting the hips/pelvis to the side, engaging the obliques. He mentions lifting the pelvis to the sides for the effective version.', ref : 'https://pyuqhcptlcbxwohevvvv.supabase.co/storage/v1/object/public/workoutvideos/core/Core%20-%20Hanging%20Knee%20Raises%20-%20Made%20with%20Clipchamp.mp4'},
        {muscle: 'Core', exercise: 'Crunches', sets: 6, reps: '10', rpe: '7–8', description: 'NA', ref : ''},
        {muscle: 'Calves', exercise: 'Standing Barbell Calf Raise', sets: 7, reps: '10–20', rpe: '7–8', description: 'NA', ref : ''},
        {muscle: 'Calves', exercise: 'Seated Calf Raise', sets: 7, reps: '15–20', rpe: '7–8', description: 'Added exercise for volume', ref : ''}
    ],
    'FRI': [
        {muscle: 'Chest', exercise: 'Flat Barbell Bench Press', sets: 4, reps: '7-8', rpe: '8–9', description: 'PR every 3 weeks, added sets', ref : ''},
        {muscle: 'Chest', exercise: 'Incline Dumbbell Bench Press', sets: 3, reps: '10', rpe: '7–8', description: 'Focus on stretch', ref : ''},
        {muscle: 'Chest', exercise: 'Pec Deck Fly / Cable Fly', sets: 3, reps: '15', rpe: '7–8', description: 'Sit with arms extended to the sides. Bring handles together in front of your chest, focusing on squeezing your pecs, not pushing with shoulders', ref : ''},
        {muscle: 'Chest', exercise: 'Dumble Pullover', sets :3, reps: 15, rpe :'', description: 'Lie perpendicular on a bench, holding one dumbbell with both hands. Lower it behind your head, then pull it back over your chest in a controlled arc.', ref : 'https://pyuqhcptlcbxwohevvvv.supabase.co/storage/v1/object/public/workoutvideos/chest/Chest%20-%20Dumble%20Pullovers.mp4'},
        {muscle: 'Tricep', exercise: 'Overhead Cable Extension', sets: 3, reps: '15, 12, 10', rpe: '7–8', description: 'Stay close to the Cable with 10-15 degree lean, keep elbows tucked in at the bottom pointing forward and head down, and as you extend flare them out over you head', ref : 'https://pyuqhcptlcbxwohevvvv.supabase.co/storage/v1/object/public/workoutvideos/tricep/Tricep%20-%20%20Overhead%20Cable%20Extension%20-%20Made%20with%20Clipchamp.mp4'},
        {muscle: 'Tricep', exercise: 'Single-Handed Cable Kick Back', sets: 3, reps: 'To failure', rpe: '9', description: 'Partials at end, both arms', ref : ''},
        {muscle: 'Tricep', exercise: 'Skull Crushers', sets: 3, reps: '10–12', rpe: '8', description: 'Strict form, full ROM', ref : ''},
        {muscle: 'Shoulder', exercise: 'Shoulder Press (Machine/DB)', sets: 3, reps: '10–12', rpe: '7–8', description: 'Focus on anterior delts', ref : ''}
    ],
    'SAT': [
        {muscle: 'Back', exercise: 'Lat Pulldown', sets: 4, reps: '15', rpe: '7–8', description: 'Added set, wide grip', ref : ''},
        {muscle: 'Back', exercise: 'Bent Barbell Rows', sets: 5, reps: 'To failure', rpe: '9', description: 'Partials at end, added sets', ref : ''},
        {muscle: 'Back', exercise: 'Lat Prayer', sets: 3, reps: '15', rpe: '7–8', description: 'Last set partials, controlled', ref : ''},
        {muscle: 'Back', exercise: 'Lower Partial Deadlifts', sets: 1, reps: 'To failure', rpe: '9', description: 'High reps', ref : ''},
        {muscle: 'Back', 'exercise': 'Deadlift', sets: 1, reps: '1', rpe: '10', description: 'PR every 3–4 weeks', ref : ''},
        {muscle: 'Bicep', 'exercise': 'Barbell Curl', sets: 5, reps: '15', rpe: '7–8', description: 'Focus on contraction', ref : ''},
        {muscle: 'Bicep', 'exercise': 'Single-Handed Cable Curl', sets: 3, reps: '10', rpe: '9', description: 'Partials at end, both arms', ref : ''},
        {muscle: 'Bicep', 'exercise': 'Preacher Curl', sets: 3, reps: '15', rpe: '7–8', description: 'Strict form, full ROM', ref : ''}
    ]
};

// --- UI AND WORKOUT DISPLAY FUNCTIONS ---

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

function selectDay(day) {
    currentDay = day;
    document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    displayWorkout();
}

function loadDefaultWorkout() {
    workoutPlan = JSON.parse(JSON.stringify(defaultWorkoutPlan));
    displayWorkout();
    setCurrentDayActive();
}

function loadPersonalizedWorkout(personalizedData) {
    workoutPlan = {};
    personalizedData.forEach(row => {
        const day = row.day;
        if (!workoutPlan[day]) workoutPlan[day] = [];
        workoutPlan[day].push({
            muscle: row.muscle || '',
            exercise: row.exercise,
            sets: parseInt(row.sets) || 3,
            reps: row.reps || '10',
            rpe: row.rpe || '7-8',
            description: row.description || '',
            ref: row.ref || ''
        });
    });
    displayWorkout();
    setCurrentDayActive();
}

function setCurrentDayActive() {
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === currentDay) btn.classList.add('active');
    });
}

function formatReferenceLink(ref) {
    if (!ref || ref.trim() === '') return '';
    if (ref.startsWith('http://') || ref.startsWith('https://')) {
        return `<br><a href="${ref}" target="_blank" style="color: #007bff; text-decoration: none; font-weight: 500;">🎥 Watch Exercise Video</a>`;
    }
    return `<br>Reference: ${ref}`;
}

function displayWorkout() {
    const container = document.getElementById('workout-content');
    if (!workoutPlan[currentDay] || workoutPlan[currentDay].length === 0) {
        container.innerHTML = `<div class="no-data">No workout plan for ${currentDay}.</div>`;
        return;
    }

    let html = '';
    const exercises = workoutPlan[currentDay];
    const groupedExercises = groupByMuscle(exercises);
    const prevDayData = previousWorkout[currentDay] || [];

    for (const muscle in groupedExercises) {
        html += `<div class="exercise-group"><div class="muscle-header">💪 ${muscle}</div>`;
        groupedExercises[muscle].forEach((exercise, exerciseIndex) => {
            const exerciseKey = `${currentDay}-${muscle}-${exerciseIndex}`;
            const progress = workoutProgress[exerciseKey] || {};
            let prevExercise = prevDayData.find(e => e.muscle === muscle && e.exercise === exercise.exercise);
            let prevSets = prevExercise?.sets || {};

            html += `<div class="exercise-item">
                <div class="exercise-header"><div class="exercise-name">${exercise.exercise}</div></div>
                <div class="exercise-details">
                    Target: ${exercise.sets} sets × ${exercise.reps} reps | RPE: ${exercise.rpe}
                    ${exercise.description ? '<br>Description: <b>' + exercise.description + '</b>' : ''}
                    ${formatReferenceLink(exercise.ref)}
                </div>`;

            for (let setNum = 1; setNum <= exercise.sets; setNum++) {
                const setData = progress[`set${setNum}`] || {};
                const isCompleted = setData.completed || false;
                let prevSet = prevSets[`set${setNum}`];
                let prevSetHtml = '';
                if (hasPreviousWorkout && prevSet) {
                    prevSetHtml = `<div style='font-size:0.9em; color:#888; margin-bottom:2px;'>
                        Previous: <b>${prevSet[0] || '-'} kg / ${prevSet[1] || '-'} reps${prevSet[2] ? ' / RPE ' + prevSet[2] : ''}</b>
                    </div>`;
                }

                html += `<div class="set-tracker">
                    <div class="set-number">Set ${setNum}</div>
                    <div style="flex:1;">
                        ${prevSetHtml}
                        <div class="set-inputs">
                            <div class="input-group"><div class="input-label">Reps</div><input type="number" class="set-input ${isCompleted ? 'completed' : ''}" value="${setData.reps || ''}" onchange="updateSet('${exerciseKey}', ${setNum}, 'reps', this.value)"></div>
                            <div class="input-group"><div class="input-label">Weight</div><input type="number" step="0.5" class="set-input ${isCompleted ? 'completed' : ''}" value="${setData.weight || ''}" onchange="updateSet('${exerciseKey}', ${setNum}, 'weight', this.value)"></div>
                            <div class="input-group"><div class="input-label">RPE</div><input type="number" min="1" max="10" class="set-input ${isCompleted ? 'completed' : ''}" value="${setData.rpe || ''}" onchange="updateSet('${exerciseKey}', ${setNum}, 'rpe', this.value)"></div>
                        </div>
                    </div>
                    <div class="set-status"><button class="complete-btn ${isCompleted ? 'completed' : ''}" onclick="toggleSetComplete('${exerciseKey}', ${setNum})">${isCompleted ? '✓' : 'O'}</button></div>
                </div>`;
            }
            html += `</div>`;
        });
        html += `</div>`;
    }

    container.innerHTML = html;
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn';
    submitBtn.textContent = 'Submit Workout';
    submitBtn.style.marginTop = '30px';
    submitBtn.onclick = submitWorkoutData;
    container.appendChild(submitBtn);
}

function groupByMuscle(exercises) {
    return exercises.reduce((acc, exercise) => {
        (acc[exercise.muscle] = acc[exercise.muscle] || []).push(exercise);
        return acc;
    }, {});
}

// --- DATA HANDLING AND STATE UPDATES ---

function updateSet(exerciseKey, setNum, field, value) {
    workoutProgress[exerciseKey] = workoutProgress[exerciseKey] || {};
    workoutProgress[exerciseKey][`set${setNum}`] = workoutProgress[exerciseKey][`set${setNum}`] || {};
    workoutProgress[exerciseKey][`set${setNum}`][field] = value;

    // Save progress to localStorage on every input change
    if (loggedInUserId) {
        localStorage.setItem(`gymapp_progress_${loggedInUserId}`, JSON.stringify(workoutProgress));
    }
}

function toggleSetComplete(exerciseKey, setNum) {
    workoutProgress[exerciseKey] = workoutProgress[exerciseKey] || {};
    workoutProgress[exerciseKey][`set${setNum}`] = workoutProgress[exerciseKey][`set${setNum}`] || {};
    workoutProgress[exerciseKey][`set${setNum}`].completed = !workoutProgress[exerciseKey][`set${setNum}`].completed;

    // Also save this progress change to localStorage
    if (loggedInUserId) {
        localStorage.setItem(`gymapp_progress_${loggedInUserId}`, JSON.stringify(workoutProgress));
    }
    displayWorkout();
}

function buildPreviousWorkoutFromProgress() {
    const result = {};
    Object.keys(workoutPlan).forEach(day => {
        result[day] = [];
        const grouped = groupByMuscle(workoutPlan[day]);
        Object.keys(grouped).forEach(muscle => {
            grouped[muscle].forEach((exercise, exerciseIndex) => {
                const exerciseKey = `${day}-${muscle}-${exerciseIndex}`;
                const progress = workoutProgress[exerciseKey] || {};
                const sets = {};
                for (let setNum = 1; setNum <= exercise.sets; setNum++) {
                    const setData = progress[`set${setNum}`] || {};
                    sets[`set${setNum}`] = [setData.weight || '', setData.reps || '', setData.rpe || ''];
                }
                result[day].push({ muscle, exercise: exercise.exercise, sets });
            });
        });
    });
    return result;
}

// --- SESSION MANAGEMENT & LOGIN/LOGOUT ---

function setSession(userId, isGuest) {
    localStorage.setItem('gymapp_session', JSON.stringify({ userId, isGuest }));
}

function getSession() {
    try {
        return JSON.parse(localStorage.getItem('gymapp_session'));
    } catch {
        return null;
    }
}

function clearSession() {
    localStorage.removeItem('gymapp_session');
}

function showLogoutButton(show) {
    const logoutContainer = document.getElementById('logout-container');
    if (logoutContainer) logoutContainer.style.display = show ? 'block' : 'none';
}

function logout() {
    // Clear any lingering progress for the user logging out
    if (loggedInUserId) {
        localStorage.removeItem(`gymapp_progress_${loggedInUserId}`);
    }

    isLoggedIn = false;
    loggedInUserId = null;
    hasPreviousWorkout = false;
    hasPersonalizedWorkout = false;
    previousWorkout = {};
    workoutPlan = {};
    workoutProgress = {};

    clearSession();
    document.getElementById('tabs').style.display = 'none';
    document.getElementById('workout-tab').classList.remove('active');
    document.getElementById('login-tab').classList.add('active');
    showLogoutButton(false);
}

async function guestLogin() {
    isLoggedIn = true;
    loggedInUserId = 'guest';
    hasPreviousWorkout = false;
    hasPersonalizedWorkout = false;
    previousWorkout = {};
    workoutProgress = {}; // Reset before loading
    setSession('guest', true);

    // Load any saved guest progress from localStorage
    const savedProgress = localStorage.getItem(`gymapp_progress_guest`);
    if (savedProgress) {
        try {
            workoutProgress = JSON.parse(savedProgress);
        } catch (e) {
            console.error("Error parsing saved guest progress:", e);
            workoutProgress = {};
        }
    }

    loadDefaultWorkout();
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('workout-tab').classList.add('active');
    document.getElementById('tabs').style.display = 'flex';
    showLogoutButton(true);
    document.getElementById('login-status').textContent = '';
}

async function login() {
    const username = document.getElementById('username').value.trim();
    const statusDiv = document.getElementById('login-status');
    statusDiv.textContent = 'Logging in...';
    statusDiv.className = 'status';

    if (!username) {
        statusDiv.textContent = 'Please enter a username.';
        statusDiv.className = 'status error';
        return;
    }

    try {
        const { data, error } = await supabaseClient.from('workouts').select('user_id, data').eq('user_id', username);
        if (error) throw error;
        if (!data || data.length === 0) {
            statusDiv.textContent = 'Invalid username.';
            statusDiv.className = 'status error';
            return;
        }

        const user = data[0];
        isLoggedIn = true;
        loggedInUserId = user.user_id;
        setSession(loggedInUserId, false);

        // Load saved progress from localStorage BEFORE loading workout plan
        const savedProgress = localStorage.getItem(`gymapp_progress_${loggedInUserId}`);
        if (savedProgress) {
            try {
                workoutProgress = JSON.parse(savedProgress);
            } catch (e) {
                console.error("Error parsing saved progress:", e);
                workoutProgress = {}; // Reset on error
            }
        }

        statusDiv.textContent = 'Login successful! Loading your data...';
        statusDiv.className = 'status success';

        if (user.data) {
            try {
                previousWorkout = typeof user.data === 'string' ? JSON.parse(user.data) : user.data;
                hasPreviousWorkout = Object.keys(previousWorkout).some(day => previousWorkout[day]?.length > 0);
            } catch (e) {
                console.error('Error parsing previous workout data:', e);
                hasPreviousWorkout = false;
                previousWorkout = {};
            }
        } else {
            hasPreviousWorkout = false;
            previousWorkout = {};
        }

        const personalizedData = await fetchPersonalizedWorkout(loggedInUserId);
        if (personalizedData && personalizedData.length > 0) {
            hasPersonalizedWorkout = true;
            loadPersonalizedWorkout(personalizedData);
            statusDiv.textContent = 'Login successful! Personalized workout loaded.';
        } else {
            hasPersonalizedWorkout = false;
            loadDefaultWorkout();
            statusDiv.textContent = `Login successful! ${hasPreviousWorkout ? 'Previous workout data loaded.' : 'No previous workout data found.'}`;
        }

        document.getElementById('login-tab').classList.remove('active');
        document.getElementById('workout-tab').classList.add('active');
        document.getElementById('tabs').style.display = 'flex';
        document.getElementById('username').value = '';
        showLogoutButton(true);
    } catch (error) {
        console.error('Login error:', error);
        statusDiv.textContent = 'Login failed. Please try again.';
        statusDiv.className = 'status error';
    }
}

async function fetchPersonalizedWorkout(userId) {
    try {
        const { data, error } = await supabaseClient.from('personalized_workouts').select('*').order('id', { ascending: true });
        if (error) {
            console.error('Error fetching personalized workouts:', error);
            return null;
        }
        return data.filter(workout => {
            if (typeof workout.USER === 'string') {
                const users = workout.USER.replace(/[{}]/g, '').split(',');
                return users.includes(userId);
            }
            return false;
        });
    } catch (error) {
        console.error('Exception in fetchPersonalizedWorkout:', error);
        return null;
    }
}

// --- DATA SUBMISSION ---

async function saveWorkoutToDatabase() {
    if (!isLoggedIn || !loggedInUserId || loggedInUserId === 'guest') {
        alert('Please log in with a username to save data.');
        return;
    }

    try {
        const workoutData = buildPreviousWorkoutFromProgress();
        const { error } = await supabaseClient
            .from('workouts')
            .update({ data: workoutData, created_at: new Date().toISOString() })
            .eq('user_id', loggedInUserId);

        if (error) throw error;
        
        alert('Workout data saved successfully!');
        hasPreviousWorkout = true;

        // Clear the temporary progress from localStorage and memory
        localStorage.removeItem(`gymapp_progress_${loggedInUserId}`);
        workoutProgress = {};
        displayWorkout(); // Refresh the view to show empty fields

    } catch (error) {
        console.error('Save error:', error);
        alert('Failed to save workout data.');
    }
}

function submitWorkoutData() {
    if (isLoggedIn && loggedInUserId !== 'guest') {
        saveWorkoutToDatabase();
    } else {
        // Fallback for guest users: download JSON
        alert("As a guest, your workout will be downloaded as a JSON file. Log in to save to the cloud.");
        const data = buildPreviousWorkoutFromProgress();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workout_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-btn').addEventListener('click', login);
    document.getElementById('guest-btn')?.addEventListener('click', guestLogin);
    document.getElementById('logout-btn')?.addEventListener('click', logout);

    document.getElementById('login-tab').classList.add('active');
    document.getElementById('workout-tab').classList.remove('active');
    document.getElementById('tabs').style.display = 'none';
    showLogoutButton(false);

    // Auto-login if session exists
    const session = getSession();
    if (session && session.userId) {
        if (session.isGuest) {
            guestLogin();
        } else {
            document.getElementById('username').value = session.userId;
            login();
        }
    }
});