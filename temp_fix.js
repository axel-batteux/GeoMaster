function handleAnswer(selected, btnElement) {
    if (currentState.isAnswering) return;
    currentState.isAnswering = true;
    stopTimer();

    // Determine correctness
    const target = currentState.currentQuestion;
    let isCorrect = false;

    // Check based on mode
    if (currentState.currentRoundMode === 'flags' || currentState.currentRoundMode === 'map') {
        isCorrect = selected === target.name; // In Map, this fn isn't used, but just in case
    } else if (currentState.currentRoundMode === 'capitals') {
        // Did we ask for capital or country?
        const qText = ui.questionText.innerText;
        if (qText.includes('capitale de quel')) {
            isCorrect = selected === target.name;
        } else {
            isCorrect = selected === target.capital;
        }
    } else if (currentState.currentRoundMode === 'prefecture') {
        isCorrect = selected === target.prefecture;
    } else if (currentState.currentRoundMode === 'code') {
        isCorrect = selected === target.code;
    } else if (currentState.currentRoundMode === 'prefecture-inverse') {
        isCorrect = selected === target.name;
    }

    // Fallback if 'selected' matches any correct property (simplified check)
    if (!isCorrect) {
        if (selected === target.name || selected === target.capital || selected === target.prefecture || selected === target.code) {
            isCorrect = true;
        }
    }


    if (isCorrect) {
        currentState.score++;
        currentState.streak++;
        ui.currentScore.innerText = currentState.score;
        btnElement.classList.add('correct');
        playSound('correct');
        // NO OVERLAY HERE
    } else {
        currentState.streak = 0;
        btnElement.classList.add('wrong');
        playSound('wrong');
        highlightCorrectOption(target);
        // NO OVERLAY HERE
    }
    updateStreakDisplay();

    // Fast transition
    setTimeout(nextQuestion, 600);
}

function highlightCorrectOption(target) {
    // Find the button with the correct text
    const buttons = ui.optionsGrid.querySelectorAll('button');
    buttons.forEach(btn => {
        const txt = btn.innerText;
        if (txt === target.name || txt === target.capital || txt === target.prefecture || txt === target.code) {
            btn.classList.add('correct');
        }
    });
}
