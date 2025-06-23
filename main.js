const SUPABASE_URL = 'https://pyuqhcptlcbxwohevvvv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5dXFoY3B0bGNieHdvaGV2dnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODUwMDYsImV4cCI6MjA2NjI2MTAwNn0.8C2xfii7OgpNo54GKyGMTzxjLbY11SOmOkkobqb9mdo';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentDay = 'MON';
let workoutPlan = {};  
let workoutProgress = {};

// Default workout plan based on your Excel data
let previousWorkout = {};
let hasPreviousWorkout = false; // Track if user has previous workout data

const defaultWorkoutPlan = {
    'MON': [
        {muscle: 'Leg', exercise: 'Leg Extension', sets: 5, reps: '20–25, 30', rpe: '8–9', notes: 'Last set 30 reps, focus on squeeze'},
        {muscle: 'Leg', exercise: 'Leg Curl', sets: 5, reps: '20, 30', rpe: '7–8', notes: 'Last set 30 reps, slow eccentric'},
        {muscle: 'Leg', exercise: 'Barbell Squat', sets: 5, reps: '15–20', rpe: '7–8', notes: 'Narrow stance, PR every 3 weeks'},
        {muscle: 'Tricep', exercise: 'Cable Pushdown', sets: 3, reps: '15, 12, 10', rpe: '7–8', notes: 'Controlled tempo, full ROM'},
        {muscle: 'Bicep', exercise: 'Spider Curls', sets: 3, reps: '8,10,8', rpe: '7–8', notes: 'Flat Bench Laying down'},
        {muscle: 'Tricep', exercise: 'Single-Handed Cable Push', sets: 3, reps: 'To failure', rpe: '9', notes: 'Partials at end, both arms'},
        {muscle: 'Tricep', exercise: 'Overhead Cable Extension', sets: 3, reps: '15', rpe: '7–8', notes: 'Keep elbows stable'},
        {muscle: 'Bicep', exercise: 'Single-Handed Cable Pull', sets: 3, reps: '6,8,6', rpe: '7–9', notes: 'Focus on Strech part'},
        {muscle: 'Tricep', exercise: 'Skull Crushers', sets: 3, reps: '10–12', rpe: '8', notes: 'Elbow eye level'}
    ],
    'TUE': [
        {muscle: 'Chest', exercise: 'Incline Barbell Bench Press', sets: 6, reps: '15', rpe: '8', notes: 'Focus on upper chest, added sets'},
        {muscle: 'Chest', exercise: 'Incline Dumbbell Bench Press', sets: 3, reps: '10', rpe: '7–8', notes: 'Emphasize stretch, slow eccentric'},
        {muscle: 'Chest', exercise: 'Pec Fly/Cable Fly', sets: 3, reps: '15', rpe: '7–8', notes: 'Controlled, full ROM'},
        {muscle: 'Shoulder', exercise: 'Single-Handed Cable Lateral', sets: 3, reps: 'To failure', rpe: '9', notes: 'Partials at end, controlled'},
        {muscle: 'Shoulder', exercise: 'Seated Rear Delt Extension', sets: 3, reps: '10', rpe: '7–8', notes: 'Focus on rear delts, strict form'}
    ],
    'WED': [
        {muscle: 'Back', exercise: 'Lat Pulldown', sets: 4, reps: '15', rpe: '7–8', notes: 'Alternate between Wide and Narrow Grip'},
        {muscle: 'Back', exercise: 'Cable Rowing', sets: 3, reps: '15-20', rpe: '7–8', notes: 'Full Stretch of Lats and Elbow drive'},
        {muscle: 'Back', exercise: 'Bent Barbell Rows', sets: 5, reps: 'To failure', rpe: '9', notes: 'Partials at end, added sets'},
        {muscle: 'Back', exercise: 'Lat Prayer', sets: 3, reps: '15', rpe: '7–8', notes: 'Last set partials, controlled'},
        {muscle: 'Bicep', exercise: 'Barbell Curl', sets: 5, reps: '15', rpe: '7–8', notes: 'Focus on Negatives'},
        {muscle: 'Bicep', exercise: 'Single-Handed Cable Curl', sets: 3, reps: '10', rpe: '9', notes: 'Partials at end, both arms'},
        {muscle: 'Bicep', exercise: 'Double Handed Cable Curl', sets: 3, reps: '15', rpe: '7–8', notes: 'Strict form, full ROM'}
    ],
    'THU': [
        {muscle: 'Core', exercise: 'Elevated Double Knee Tuck', sets: 8, reps: '30', rpe: '7–8', notes: 'Rest lats on bench, core focus'},
        {muscle: 'Core', exercise: 'Declined Crunches', sets: 4, reps: '20', rpe: '7–8', notes: 'Slow eccentric, full contraction'},
        {muscle: 'Core', exercise: 'Hanging Knee Raises (Side)', sets: 6, reps: '10', rpe: '7–8', notes: 'NA'},
        {muscle: 'Calves', exercise: 'Standing Barbell Calf Raise', sets: 7, reps: '10–20', rpe: '7–8', notes: 'NA'},
        {muscle: 'Calves', exercise: 'Seated Calf Raise', sets: 7, reps: '15–20', rpe: '7–8', notes: 'Added exercise for volume'}
    ],
    'FRI': [
        {muscle: 'Chest', exercise: 'Flat Barbell Bench Press', sets: 6, reps: '15', rpe: '8–9', notes: 'PR every 3 weeks, added sets'},
        {muscle: 'Chest', exercise: 'Incline Dumbbell Bench Press', sets: 3, reps: '10', rpe: '7–8', notes: 'Focus on stretch'},
        {muscle: 'Chest', exercise: 'Pec Fly', sets: 3, reps: '15', rpe: '7–8', notes: 'Controlled, full ROM'},
        {muscle: 'Tricep', exercise: 'Cable Pushdown', sets: 3, reps: '15, 12, 10', rpe: '7–8', notes: 'Controlled tempo'},
        {muscle: 'Tricep', exercise: 'Single-Handed Cable Push', sets: 3, reps: 'To failure', rpe: '9', notes: 'Partials at end, both arms'},
        {muscle: 'Tricep', exercise: 'Overhead Cable Extension', sets: 3, reps: '15', rpe: '7–8', notes: 'Keep elbows stable'},
        {muscle: 'Tricep', exercise: 'Skull Crushers', sets: 3, reps: '10–12', rpe: '8', notes: 'Strict form, full ROM'},
        {muscle: 'Shoulder', exercise: 'Shoulder Press (Machine/DB)', sets: 3, reps: '10–12', rpe: '7–8', notes: 'Focus on anterior delts'}
    ],
    'SAT': [
        {muscle: 'Back', exercise: 'Lat Pulldown', sets: 4, reps: '15', rpe: '7–8', notes: 'Added set, wide grip'},
        {muscle: 'Back', exercise: 'Bent Barbell Rows', sets: 5, reps: 'To failure', rpe: '9', notes: 'Partials at end, added sets'},
        {muscle: 'Back', exercise: 'Lat Prayer', sets: 3, reps: '15', rpe: '7–8', notes: 'Last set partials, controlled'},
        {muscle: 'Back', exercise: 'Lower Partial Deadlifts', sets: 1, reps: 'To failure', rpe: '9', notes: 'High reps'},
        {muscle: 'Back', exercise: 'Deadlift', sets: 1, reps: '1', rpe: '10', notes: 'PR every 3–4 weeks'},
        {muscle: 'Bicep', exercise: 'Barbell Curl', sets: 5, reps: '15', rpe: '7–8', notes: 'Focus on contraction'},
        {muscle: 'Bicep', exercise: 'Single-Handed Cable Curl', sets: 3, reps: '10', rpe: '9', notes: 'Partials at end, both arms'},
        {muscle: 'Bicep', exercise: 'Preacher Curl', sets: 3, reps: '15', rpe: '7–8', notes: 'Strict form, full ROM'}
    ]
};

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'progress') {
        updateProgressStats();
    }
}

function selectDay(day) {
    currentDay = day;
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    displayWorkout();
}

function loadDefaultWorkout() {
    workoutPlan = JSON.parse(JSON.stringify(defaultWorkoutPlan));
    displayWorkout();
}

function parseWorkoutData(data) {
    workoutPlan = {};
    let currentDay = '';
    
    data.forEach(row => {
        if (row.Day && ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].includes(row.Day)) {
            currentDay = row.Day;
            if (!workoutPlan[currentDay]) {
                workoutPlan[currentDay] = [];
            }
        }
        
        if (currentDay && row.Exercise) {
            workoutPlan[currentDay].push({
                muscle: row.Muscle || '',
                exercise: row.Exercise,
                sets: parseInt(row.Sets) || 3,
                reps: row.Reps || '10',
                rpe: row.RPE || '7-8',
                notes: row.Notes || ''
            });
        }
    });
}

function displayWorkout() {
    const container = document.getElementById('workout-content');
    
    if (!workoutPlan[currentDay] || workoutPlan[currentDay].length === 0) {
        container.innerHTML = '<div class="no-data">No workout plan for ' + currentDay + '. Upload a plan or load the default.</div>';
        return;
    }

    let html = '';
    
    // Add previous workout status message at the top
    if (!hasPreviousWorkout) {
        html += `<div class="status" style="background: rgba(255, 193, 7, 0.1); color: #856404; border: 1px solid rgba(255, 193, 7, 0.2); margin-bottom: 20px;">
            <strong>📋 No Previous Workout Data</strong><br>
            This is your first workout or no previous data was found. Start tracking your progress!
        </div>`;
    } else {
        html += `<div class="status success" style="margin-bottom: 20px;">
            <strong>📊 Previous Workout Data Loaded</strong><br>
            Your previous workout stats are shown below each set for reference.
        </div>`;
    }
    
    const exercises = workoutPlan[currentDay];
    const groupedExercises = groupByMuscle(exercises);

    // Get previous workout for the current day
    const prevDayData = previousWorkout[currentDay] || [];

    Object.keys(groupedExercises).forEach(muscle => {
        html += `<div class="exercise-group">
            <div class="muscle-header">💪 ${muscle}</div>`;
        
        groupedExercises[muscle].forEach((exercise, exerciseIndex) => {
            const exerciseKey = `${currentDay}-${muscle}-${exerciseIndex}`;
            const progress = workoutProgress[exerciseKey] || {};

            // Find previous workout for this exercise
            let prevExercise = prevDayData.find(e => e.muscle === muscle && e.exercise === exercise.exercise);
            let prevSets = prevExercise && prevExercise.sets ? prevExercise.sets : {};
            
            html += `<div class="exercise-item">
                <div class="exercise-header">
                    <div class="exercise-name">${exercise.exercise}</div>
                </div>
                <div class="exercise-details">
                    Target: ${exercise.sets} sets × ${exercise.reps} reps | RPE: ${exercise.rpe}
                    ${exercise.notes ? '<br>Notes: ' + exercise.notes : ''}
                </div>`;
            
            for (let setNum = 1; setNum <= exercise.sets; setNum++) {
                const setData = progress[`set${setNum}`] || {};
                const isCompleted = setData.completed || false;

                // Previous set data
                let prevSet = prevSets[`set${setNum}`] || null;
                let prevSetHtml = '';
                if (hasPreviousWorkout && prevSet) {
                    // prevSet: [weight, reps, rpe]
                    prevSetHtml = `<div style='font-size:0.9em; color:#888; margin-bottom:2px;'>
                        Previous: <b>${prevSet[0] || '-'} kg / ${prevSet[1] || '-'} reps${prevSet[2] ? ' / RPE ' + prevSet[2] : ''}</b>
                    </div>`;
                }
                
                html += `<div class="set-tracker">
                    <div class="set-number">Set ${setNum}</div>
                    <div style="flex:1;">
                        ${prevSetHtml}
                        <div class="set-inputs">
                            <div class="input-group">
                                <div class="input-label">Reps</div>
                                <input type="number" class="set-input ${isCompleted ? 'completed' : ''}" 
                                        value="${setData.reps || ''}" 
                                        onchange="updateSet('${exerciseKey}', ${setNum}, 'reps', this.value)">
                            </div>
                            <div class="input-group">
                                <div class="input-label">Weight</div>
                                <input type="number" step="0.5" class="set-input ${isCompleted ? 'completed' : ''}" 
                                        value="${setData.weight || ''}" 
                                        onchange="updateSet('${exerciseKey}', ${setNum}, 'weight', this.value)">
                            </div>
                            <div class="input-group">
                                <div class="input-label">RPE</div>
                                <input type="number" min="1" max="10" class="set-input ${isCompleted ? 'completed' : ''}" 
                                        value="${setData.rpe || ''}" 
                                        onchange="updateSet('${exerciseKey}', ${setNum}, 'rpe', this.value)">
                            </div>
                        </div>
                    </div>
                    <div class="set-status">
                        <button class="complete-btn ${isCompleted ? 'completed' : ''}" 
                                onclick="toggleSetComplete('${exerciseKey}', ${setNum})">
                            ${isCompleted ? '✓' : '○'}
                        </button>
                    </div>
                </div>`;
            }
            
            html += `</div>`;
        });
        
        html += `</div>`;
    });

    container.innerHTML = html;

    // Add submission button
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn';
    submitBtn.textContent = 'Submit Workout';
    submitBtn.style.marginTop = '30px';
    submitBtn.onclick = function() {
        submitWorkoutData();
    };
    container.appendChild(submitBtn);
}

function groupByMuscle(exercises) {
    const grouped = {};
    exercises.forEach(exercise => {
        if (!grouped[exercise.muscle]) {
            grouped[exercise.muscle] = [];
        }
        grouped[exercise.muscle].push(exercise);
    });
    return grouped;
}

function updateSet(exerciseKey, setNum, field, value) {
    if (!workoutProgress[exerciseKey]) {
        workoutProgress[exerciseKey] = {};
    }
    if (!workoutProgress[exerciseKey][`set${setNum}`]) {
        workoutProgress[exerciseKey][`set${setNum}`] = {};
    }
    
    workoutProgress[exerciseKey][`set${setNum}`][field] = value;
}

function toggleSetComplete(exerciseKey, setNum) {
    if (!workoutProgress[exerciseKey]) {
        workoutProgress[exerciseKey] = {};
    }
    if (!workoutProgress[exerciseKey][`set${setNum}`]) {
        workoutProgress[exerciseKey][`set${setNum}`] = {};
    }
    
    const isCompleted = workoutProgress[exerciseKey][`set${setNum}`].completed || false;
    workoutProgress[exerciseKey][`set${setNum}`].completed = !isCompleted;
    
    displayWorkout();
}

// Helper to convert workoutProgress to previousWorkout structure
function buildPreviousWorkoutFromProgress() {
    const result = {};
    Object.keys(workoutPlan).forEach(day => {
        result[day] = [];
        const exercises = workoutPlan[day];
        const grouped = groupByMuscle(exercises);
        Object.keys(grouped).forEach(muscle => {
            grouped[muscle].forEach((exercise, exerciseIndex) => {
                const exerciseKey = `${day}-${muscle}-${exerciseIndex}`;
                const progress = workoutProgress[exerciseKey] || {};
                const sets = {};
                for (let setNum = 1; setNum <= exercise.sets; setNum++) {
                    const setData = progress[`set${setNum}`] || {};
                    sets[`set${setNum}`] = [
                        setData.weight || '',
                        setData.reps || '',
                        setData.rpe || ''
                    ];
                }
                result[day].push({
                    muscle: muscle,
                    exercise: exercise.exercise,
                    sets: sets
                });
            });
        });
    });
    return result;
}

// Download data as data.json
function submitWorkoutData() {
    const data = buildPreviousWorkoutFromProgress();
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

let isLoggedIn = false;
let loggedInUserId = null;

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const statusDiv = document.getElementById('login-status');
    console.log(username);
    console.log(password);
    statusDiv.textContent = 'Logging in...';
    statusDiv.className = 'status';

    if (!supabaseClient) {
        statusDiv.textContent = 'Database connection error.';
        statusDiv.className = 'status error';
        return;
    }

    if (!username || !password) {
        statusDiv.textContent = 'Please enter both username and password.';
        statusDiv.className = 'status error';
        return;
    }

    try {
        // Query Supabase for user
        const { data, error } = await supabaseClient
            .from('workouts')
            .select('user_id, data')
            .eq('user_id', username)
            .eq('password', password);

        if (error) {
            console.error('Supabase error:', error);
            statusDiv.textContent = 'Error logging in. Please try again.';
            statusDiv.className = 'status error';
            return;
        }

        // Check if the returned array has any data
        if (!data || data.length === 0) {
            statusDiv.textContent = 'Invalid username or password.';
            statusDiv.className = 'status error';
            return;
        }

        // Access the first element of the array
        const user = data[0]; 

        // Success - user found
        isLoggedIn = true;
        loggedInUserId = user.user_id;
        console.log('Logged in user:', user);
        statusDiv.textContent = 'Login successful! Loading your data...';
        statusDiv.className = 'status success';

        // Parse and load the user's previous workout data
        if (user.data && user.data !== 'NULL' && user.data !== null && user.data.trim() !== '') {
            try {
                if (typeof user.data === 'string') {
                    previousWorkout = JSON.parse(user.data);
                } else {
                    previousWorkout = user.data;
                }
                
                // Check if previousWorkout has any meaningful data
                const hasData = Object.keys(previousWorkout).some(day => 
                    previousWorkout[day] && previousWorkout[day].length > 0
                );
                
                if (hasData) {
                    hasPreviousWorkout = true;
                    console.log('Loaded previous workout data:', previousWorkout);
                    statusDiv.textContent = 'Login successful! Previous workout data loaded.';
                } else {
                    hasPreviousWorkout = false;
                    previousWorkout = {};
                    console.log('Previous workout data is empty');
                    statusDiv.textContent = 'Login successful! No previous workout data found.';
                }
            } catch (parseError) {
                console.error('Error parsing workout data:', parseError);
                hasPreviousWorkout = false;
                previousWorkout = {};
                statusDiv.textContent = 'Login successful! (Note: Could not load previous workout data)';
            }
        } else {
            hasPreviousWorkout = false;
            previousWorkout = {};
            console.log('No previous workout data found for user');
            statusDiv.textContent = 'Login successful! No previous workout data found.';
        }

        // Hide login, show workout interface
        document.getElementById('login-tab').classList.remove('active');
        document.getElementById('workout-tab').classList.add('active');
        document.getElementById('tabs').style.display = 'flex';

        loadDefaultWorkout();

        // Clear login form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';

    } catch (error) {
        console.error('Login error:', error);
        statusDiv.textContent = 'Login failed. Please try again.';
        statusDiv.className = 'status error';
    }
}

// Optional: Add function to save workout data back to database
async function saveWorkoutToDatabase() {
    if (!isLoggedIn || !loggedInUserId) {
        alert('Please log in first');
        return;
    }

    try {
        const workoutData = buildPreviousWorkoutFromProgress();
        
        const { data, error } = await supabaseClient
            .from('workouts')
            .update({ 
                data: JSON.stringify(workoutData),
                created_at: new Date().toISOString()
            })
            .eq('user_id', loggedInUserId);

        if (error) {
            console.error('Save error:', error);
            alert('Failed to save workout data');
        } else {
            alert('Workout data saved successfully!');
            // Update the flag since we now have workout data
            hasPreviousWorkout = true;
        }
    } catch (error) {
        console.error('Save error:', error);
        alert('Failed to save workout data');
    }
}

// Update the submit function to also save to database
function submitWorkoutData() {
    const data = buildPreviousWorkoutFromProgress();
    
    // Also save to database if logged in
    if (isLoggedIn) {
        saveWorkoutToDatabase();
    }
}

async function testSupabaseConnection() {
    console.log('Testing Supabase connection...');
    try {
        const { data, error } = await supabaseClient
            .from('workouts')
            .select('*')
            .limit(1);
        
        console.log('Connection test result:', { data, error });
        
        if (error) {
            console.error('Connection test failed:', error);
            return false;
        } else {
            console.log('Connection test successful');
            return true;
        }
    } catch (err) {
        console.error('Connection test error:', err);
        return false;
    }
}

// Call this when the page loads to test connection
window.addEventListener('DOMContentLoaded', function() {
    testSupabaseConnection();
});

// Prevent workout interaction until login
window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('workout-tab').classList.remove('active');
    document.getElementById('tabs').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-btn').addEventListener('click', login);
    
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('workout-tab').classList.remove('active');
    document.getElementById('tabs').style.display = 'none';
});