let workoutPlan = {};
let workoutProgress = {};
let currentDay = 'MON';
let currentWorkoutDate = null;

// Default workout plan based on your Excel data
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
    showStatus('✅ Default workout plan loaded!', 'success');
    displayWorkout();
}

function handleFile(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                parseWorkoutData(jsonData);
                showStatus('✅ Workout plan uploaded successfully!', 'success');
                displayWorkout();
                
            } catch (error) {
                showStatus('❌ Error reading file. Please make sure it\'s a valid Excel file.', 'error');
            }
        };
        
        reader.readAsArrayBuffer(file);
    }
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
    const exercises = workoutPlan[currentDay];
    const groupedExercises = groupByMuscle(exercises);

    Object.keys(groupedExercises).forEach(muscle => {
        html += `<div class="exercise-group">
            <div class="muscle-header">💪 ${muscle}</div>`;
        
        groupedExercises[muscle].forEach((exercise, exerciseIndex) => {
            const exerciseKey = `${currentDay}-${muscle}-${exerciseIndex}`;
            const progress = workoutProgress[exerciseKey] || {};
            
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
                
                html += `<div class="set-tracker">
                    <div class="set-number">Set ${setNum}</div>
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

function startWorkout() {
    currentWorkoutDate = new Date().toISOString().split('T')[0];
    showStatus('🏃 Workout started! Track your sets and weights.', 'success');
}

function resetDay() {
    if (confirm('Are you sure you want to reset all progress for ' + currentDay + '?')) {
        const exercises = workoutPlan[currentDay] || [];
        exercises.forEach((exercise, exerciseIndex) => {
            const exerciseKey = `${currentDay}-${exercise.muscle}-${exerciseIndex}`;
            delete workoutProgress[exerciseKey];
        });
        displayWorkout();
        showStatus('🔄 ' + currentDay + ' workout reset!', 'success');
    }
}

function saveWorkout() {
    const workoutData = {
        date: currentWorkoutDate || new Date().toISOString().split('T')[0],
        day: currentDay,
        progress: JSON.parse(JSON.stringify(workoutProgress))
    };
    
    const dataStr = JSON.stringify(workoutData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workout-${workoutData.date}-${currentDay}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showStatus('💾 Workout saved to downloads!', 'success');
}

function exportProgress() {
    const exportData = {
        workoutPlan: workoutPlan,
        workoutProgress: workoutProgress,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gym-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showStatus('📤 Progress exported successfully!', 'success');
}

function importProgress(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.workoutPlan) workoutPlan = data.workoutPlan;
                if (data.workoutProgress) workoutProgress = data.workoutProgress;
                
                displayWorkout();
                updateProgressStats();
                showStatus('📥 Progress imported successfully!', 'success');
            } catch (error) {
                showStatus('❌ Error importing file. Please check the format.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

function clearAllProgress() {
    if (confirm('Are you sure you want to clear ALL workout progress? This cannot be undone.')) {
        workoutProgress = {};
        displayWorkout();
        updateProgressStats();
        showStatus('🗑️ All progress cleared!', 'success');
    }
}

function clearWorkoutPlan() {
    if (confirm('Are you sure you want to clear the workout plan?')) {
        workoutPlan = {};
        workoutProgress = {};
        displayWorkout();
        showStatus('🗑️ Workout plan cleared!', 'success');
    }
}

function updateProgressStats() {
    const statsGrid = document.getElementById('stats-grid');
    
    let totalSets = 0;
    let completedSets = 0;
    let totalWeight = 0;
    let workoutDays = new Set();
    
    Object.keys(workoutProgress).forEach(exerciseKey => {
        const dayMatch = exerciseKey.match(/^([A-Z]{3})-/);
        if (dayMatch) {
            workoutDays.add(dayMatch[1]);
        }
        
        const exercise = workoutProgress[exerciseKey];
        Object.keys(exercise).forEach(setKey => {
            if (setKey.startsWith('set')) {
                totalSets++;
                const setData = exercise[setKey];
                if (setData.completed) {
                    completedSets++;
                }
                if (setData.weight && setData.reps) {
                    totalWeight += parseFloat(setData.weight) * parseInt(setData.reps);
                }
            }
        });
    });
    
    const completionRate = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${completedSets}</div>
            <div class="stat-label">Sets Completed</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${totalSets}</div>
            <div class="stat-label">Total Sets</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${completionRate}%</div>
            <div class="stat-label">Completion Rate</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${completionRate}%"></div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${Math.round(totalWeight)}</div>
            <div class="stat-label">Total Volume (kg×reps)</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${workoutDays.size}</div>
            <div class="stat-label">Days Trained</div>
        </div>
    `;
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('file-status');
    statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
    
    setTimeout(() => {
        statusDiv.innerHTML = '';
    }, 3000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadDefaultWorkout();
    displayWorkout();
    updateProgressStats();
});
