let array = [];
    let sorting = false;
    let animationSpeed = 1500;
    let stepMode = false;
    let sortingSteps = [];
    let currentStepIndex = 0;
    let stats = { comparisons: 0, swaps: 0, passes: 0 };

    function init() {
      generateArray();
    }
    function generateArray() {
      array = [];
      for (let i = 0; i < 5; i++) {
        array.push(Math.floor(Math.random() * 99) + 1);
      }
      
      renderArray();
      clearIterationLog();
      updateExplanation("Click 'Start Sorting' to begin the simulation.");

      document.getElementById('startBtn').disabled = false;
      document.getElementById('stepBtn').disabled = false;
      document.getElementById('stepBtn').textContent = 'Step by Step';
      document.getElementById('prevBtn').disabled = true;
      document.getElementById('prevBtn').style.display = 'none';
      sorting = false;
      stepMode = false;
      currentStepIndex = 0;
      sortingSteps = [];
    }
    function renderArray() {
      const container = document.getElementById('array-container');
      container.innerHTML = '';
      
      array.forEach((value, index) => {
        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = value;
        box.id = `box-${index}`;
        container.appendChild(box);
      });
    }
// ----------------------------------------------//



    function updateExplanation(text) {
      document.getElementById('explanation').textContent = text;
    }
    function clearIterationLog() {
      document.getElementById('iteration-log').innerHTML = '';
    }

    // Add iteration to log (for step-by-step mode)
    function addIterationLog(pass, step, currentArray, explanation, indices, isSwap) {
      const logContainer = document.getElementById('iteration-log');
      const iteration = document.createElement('div');
      iteration.className = 'iteration';
      
      const title = document.createElement('div');
      title.className = 'iteration-title';
      title.textContent = `Pass ${pass}, Step ${step}`;
      
      const arrayDisplay = document.createElement('div');
      arrayDisplay.className = 'iteration-array';
      
      currentArray.forEach((value, index) => {
        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = value;
        
        if (indices.includes(index)) {
          if (isSwap) {
            box.classList.add('swapping');
          } else {
            box.classList.add('comparing');
          }
        }
        
        arrayDisplay.appendChild(box);
      });
      
      const explanationDiv = document.createElement('div');
      explanationDiv.className = 'iteration-explanation';
      explanationDiv.textContent = explanation;
      
      iteration.appendChild(title);
      iteration.appendChild(arrayDisplay);
      iteration.appendChild(explanationDiv);
      
      logContainer.appendChild(iteration);
      logContainer.scrollTop = logContainer.scrollHeight;
    }

    // Add pass result to log
    function addPassLog(pass, currentArray, sortedIndex) {
      const logContainer = document.getElementById('iteration-log');
      const iteration = document.createElement('div');
      iteration.className = 'iteration';
      
      const title = document.createElement('div');
      title.className = 'iteration-title';
      title.textContent = `Pass ${pass} Complete`;
      
      const arrayDisplay = document.createElement('div');
      arrayDisplay.className = 'iteration-array';
      
      currentArray.forEach((value, index) => {
        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = value;
        
        if (index >= sortedIndex) {
          box.classList.add('sorted');
        }
        
        arrayDisplay.appendChild(box);
      });
      
      const explanationDiv = document.createElement('div');
      explanationDiv.className = 'iteration-explanation';
      explanationDiv.textContent = `Largest element ${currentArray[sortedIndex]} moved to position ${sortedIndex + 1}`;
      
      iteration.appendChild(title);
      iteration.appendChild(arrayDisplay);
      iteration.appendChild(explanationDiv);
      
      logContainer.appendChild(iteration);
      logContainer.scrollTop = logContainer.scrollHeight;
    }

    // Highlight elements being compared
    function highlightComparing(i, j) {
      clearHighlights();
      document.getElementById(`box-${i}`).classList.add('comparing');
      document.getElementById(`box-${j}`).classList.add('comparing');
    }
    // Highlight elements being swapped
    function highlightSwapping(i, j) {
      clearHighlights();
      document.getElementById(`box-${i}`).classList.add('swapping');
      document.getElementById(`box-${j}`).classList.add('swapping');
    }
    // Mark element as sorted
    function markSorted(index) {
      document.getElementById(`box-${index}`).classList.add('sorted');
    }
    // Clear all highlights
    function clearHighlights() {
      document.querySelectorAll('.box').forEach(box => {
        box.classList.remove('comparing', 'swapping');
      });
    }




    // Sleep function for animation timing
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Swap two elements in the array
    function swapElements(i, j) {
      [array[i], array[j]] = [array[j], array[i]];
      
      // Update the display
      const container = document.getElementById('array-container');
      const boxes = container.children;
      
      // Swap the text content
      [boxes[i].textContent, boxes[j].textContent] = [boxes[j].textContent, boxes[i].textContent];
    }

    // Generate all sorting steps for step-by-step mode
    function generateSortingSteps() {
      const steps = [];
      const tempArray = [...array];
      let currentStep = 0;
      let tempStats = { comparisons: 0, swaps: 0, passes: 0 };
      
      const n = tempArray.length;
      
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        tempStats.passes++;
        
        for (let j = 0; j < n - i - 1; j++) {
          currentStep++;
          tempStats.comparisons++;
          
          // Add comparison step
          steps.push({
            type: 'compare',
            indices: [j, j + 1],
            array: [...tempArray],
            pass: i + 1,
            step: currentStep,
            explanation: `Comparing ${tempArray[j]} and ${tempArray[j + 1]}`,
            stats: { ...tempStats }
          });
          
          if (tempArray[j] > tempArray[j + 1]) {
            // Add swap step
            [tempArray[j], tempArray[j + 1]] = [tempArray[j + 1], tempArray[j]];
            swapped = true;
            tempStats.swaps++;
            
            steps.push({
              type: 'swap',
              indices: [j, j + 1],
              array: [...tempArray],
              pass: i + 1,
              step: currentStep,
              explanation: `Swapped ${tempArray[j + 1]} and ${tempArray[j]} because ${tempArray[j + 1]} > ${tempArray[j]}`,
              stats: { ...tempStats }
            });
          }
        }
        
        // Mark the last element as sorted
        steps.push({
          type: 'sorted',
          indices: [n - i - 1],
          array: [...tempArray],
          pass: i + 1,
          step: currentStep,
          explanation: `Element ${tempArray[n - i - 1]} is now in its correct position`,
          stats: { ...tempStats }
        });
        
        if (!swapped) break;
      }
      
      // Mark all remaining elements as sorted
      for (let i = 0; i < n; i++) {
        steps.push({
          type: 'final_sorted',
          indices: [i],
          array: [...tempArray],
          pass: 'Final',
          step: currentStep,
          explanation: 'All elements are now sorted!',
          stats: { ...tempStats }
        });
      }
      
      return steps;
    }

    // Execute a single step
    async function executeStep(step) {
      switch (step.type) {
        case 'compare':
          highlightComparing(step.indices[0], step.indices[1]);
          if (stepMode) {
            addIterationLog(step.pass, step.step, step.array, step.explanation, step.indices, false);
          }
          break;
          
        case 'swap':
          highlightSwapping(step.indices[0], step.indices[1]);
          swapElements(step.indices[0], step.indices[1]);
          if (stepMode) {
            addIterationLog(step.pass, step.step, step.array, step.explanation, step.indices, true);
          }
          break;
          
        case 'sorted':
          markSorted(step.indices[0]);
          if (!stepMode) {
            addPassLog(step.pass, step.array, step.indices[0]);
          }
          break;
          
        case 'final_sorted':
          markSorted(step.indices[0]);
          break;
      }
      
      updateExplanation(step.explanation);
    }

    // Start the sorting process
    async function startSort() {
      if (sorting) return;
      
      sorting = true;
      document.getElementById('startBtn').disabled = true;
      document.getElementById('stepBtn').disabled = true;
      clearIterationLog();
      
      const steps = generateSortingSteps();
      
      for (let i = 0; i < steps.length; i++) {
        await executeStep(steps[i]);
        
        if (steps[i].type === 'compare' || steps[i].type === 'swap') {
          await sleep(animationSpeed);
        } else if (steps[i].type === 'sorted') {
          await sleep(animationSpeed);
        }
        
        if (steps[i].type !== 'final_sorted') {
          clearHighlights();
        }
      }
      
      updateExplanation('🎉 Sorting completed! Array is now sorted in ascending order.');
      sorting = false;
      document.getElementById('resetBtn').focus();
    }

    // Step-by-step sorting
    function stepSort() {
      if (!stepMode) {
        stepMode = true;
        sortingSteps = generateSortingSteps();
        currentStepIndex = 0;
        document.getElementById('stepBtn').textContent = 'Next Step';
        document.getElementById('prevBtn').style.display = 'inline-block';
        document.getElementById('prevBtn').disabled = true;
        document.getElementById('startBtn').disabled = true;
        clearIterationLog();
      }
      
      if (currentStepIndex < sortingSteps.length) {
        executeStep(sortingSteps[currentStepIndex]);
        currentStepIndex++;
        
        // Enable/disable buttons based on position
        document.getElementById('prevBtn').disabled = currentStepIndex <= 1;
        
        if (currentStepIndex >= sortingSteps.length) {
          document.getElementById('stepBtn').textContent = 'Completed';
          document.getElementById('stepBtn').disabled = true;
          updateExplanation('🎉 Step-by-step sorting completed!');
        }
      }
    }

    // Previous step function
    function prevStep() {
      if (stepMode && currentStepIndex > 1) {
        currentStepIndex -= 2; // Go back two steps (current and previous)
        
        // Reset array to initial state
        generateArrayFromStep();
        
        // Re-execute steps up to current position
        clearIterationLog();
        for (let i = 0; i < currentStepIndex; i++) {
          executeStepSilent(sortingSteps[i]);
        }
        
        // Execute current step with visual feedback
        if (currentStepIndex < sortingSteps.length) {
          executeStep(sortingSteps[currentStepIndex]);
          currentStepIndex++;
        }
        
        // Update buttons
        document.getElementById('prevBtn').disabled = currentStepIndex <= 1;
        document.getElementById('stepBtn').disabled = false;
        document.getElementById('stepBtn').textContent = 'Next Step';
      }
    }

    // Generate array from initial state for previous step functionality
    function generateArrayFromStep() {
      // Reset to original array state
      for (let i = 0; i < array.length; i++) {
        array[i] = sortingSteps[0].array[i];
      }
      renderArray();
      clearHighlights();
    }

    // Execute step without visual feedback (for rewinding)
    function executeStepSilent(step) {
      switch (step.type) {
        case 'swap':
          swapElements(step.indices[0], step.indices[1]);
          break;
        case 'sorted':
          markSorted(step.indices[0]);
          break;
        case 'final_sorted':
          markSorted(step.indices[0]);
          break;
      }
    }

    window.onload = init;