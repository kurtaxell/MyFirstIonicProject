import { Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  isQuizStarted = false;
  showCategories = false;
  score = 0;
  timer = 30; // Timer set to 15 seconds
  currentQuestionIndex = 0; // Initialize the current question index to 0, indicating the first question
  currentQuestions: Question[] = [];
  currentCategory = '';
  
  leaderboard: { name: string; score: number }[] = []; // Leaderboard array

  private interval: any;
  userName = ''; // Store user name

    constructor(
      private alertController: AlertController,
      private loadingController: LoadingController
    ) {}

  // Define questions for each category
  // An object that stores questions categorized by their topic, with each category containing an array of question objects.
   questions: Record<string, Question[]> = {
    Programming: [
      { question: 'What does HTML stand for?',
        options: ['Hypertext Markup Language', 'Hightext Machine Language', 'Hyperloop Machine Language', 'None of the above'],
        answer: 'Hypertext Markup Language' },
      
      { question: 'Which language is used for styling web pages?',
        options: ['HTML', 'CSS', 'JavaScript', 'XML'],
        answer: 'CSS' },
      
      { question: 'Which of these is used to define a function in Python?',
        options: ['func', 'function', 'def', 'define'],
        answer: 'def' },
      
      { question: 'Which of these is not a valid variable name in Java?',
        options: ['_myVariable', '1stVariable', 'my_variable', '$myVariable'],
        answer: '1stVariable' },
      
      { question: 'Which keyword is used to declare a constant in Java?',
        options: ['constant', 'final', 'static', 'immutable'],
        answer: 'final' },
      
      { question: 'Which of the following is a programming language used for web development?',
        options: ['C++', 'Python', 'JavaScript', 'SQL'],
        answer: 'JavaScript' },
      
      { question: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Simple Query Language', 'Secure Query Language', 'Standard Query Language'],
        answer: 'Structured Query Language' },
      
      { question: 'Which method is used to find the length of a string in Java?',
        options: ['lengthOf()', 'getLength()', 'size()', 'length()'],
        answer: 'length()' },
      
      { question: 'Which loop is used to iterate over a collection in Java?',
        options: ['for', 'while', 'foreach', 'do-while'],
        answer: 'foreach' },
      
      { question: 'Which operator is used for exponentiation in JavaScript?',
        options: ['^', '**', 'exp()', 'pow()'],
        answer: '**' },
      
      { question: 'What is the default value of an uninitialized integer variable in Java?',
        options: ['0', 'null', 'undefined', 'NaN'],
        answer: '0' },
      
      { question: 'What is the main purpose of an IDE?',
        options: ['Run scripts', 'Debug programs', 'Write and compile code', 'All of the above'],
        answer: 'All of the above' },
      
      { question: 'What is the file extension for a TypeScript file?',
        options: ['.js', '.ts', '.java', '.py'],
        answer: '.ts' },
      
      { question: 'What is the primary use of Node.js?',
        options: ['Front-end development', 'Server-side scripting', 'Database management', 'Graphic design'],
        answer: 'Server-side scripting' },
      
      { question: 'What does the "this" keyword refer to in JavaScript?',
        options: ['Global object', 'Current object', 'Parent object', 'Window object'],
        answer: 'Current object' },
      
      { question: 'Which data structure uses FIFO?',
        options: ['Stack', 'Queue', 'Heap', 'Linked List'],
        answer: 'Queue' },
      
      { question: 'Which symbol is used for comments in SQL?',
        options: ['--', '//', '#', '/* */'],
        answer: '--' },
      
      { question: 'Which framework is commonly used for building mobile apps with JavaScript?',
        options: ['React Native', 'Angular', 'Vue.js', 'Django'],
        answer: 'React Native' },
      
      { question: 'Which language is used for blockchain development?',
        options: ['Solidity', 'Swift', 'Kotlin', 'C#'],
        answer: 'Solidity' },
      
      { question: 'What does API stand for?',
        options: ['Application Programming Interface', 'Automated Process Integration', 'Advanced Programming Instruction', 'Artificial Processing Intelligence'],
        answer: 'Application Programming Interface' }
    ],
  
  
    History: [
      { question: 'Who is known as the "Father of the Philippine Revolution"?',
        options: ['Jose Rizal', 'Emilio Aguinaldo', 'Andres Bonifacio', 'Apolinario Mabini'],
        answer: 'Andres Bonifacio' },
    
      { question: 'What was the first constitution of the Philippines called?',
        options: ['Biak-na-Bato Constitution', 'Malolos Constitution', 'Philippine Independence Constitution', '1935 Constitution'],
        answer: 'Malolos Constitution' },
    
      { question: 'When did the Philippines declare independence from Spain?',
        options: ['June 12, 1898', 'August 23, 1896', 'March 31, 1521', 'July 4, 1946'],
        answer: 'June 12, 1898' },
    
      { question: 'What event started the Philippine-American War in 1899?',
        options: ['Firing at San Juan Bridge', 'Signing of the Treaty of Paris', 'Declaration of Independence', 'Execution of José Rizal'],
        answer: 'Firing at San Juan Bridge' },  
    
      { question: 'What is the name of the secret revolutionary society founded by Andrés Bonifacio?',
        options: ['La Liga Filipina', 'Katipunan', 'Propaganda Movement', 'GOMBURZA'],
        answer: 'Katipunan' }, 
    
      { question: 'Where was the first Catholic Mass held in the Philippines?',
        options: ['Cebu', 'Limasawa', 'Manila', 'Leyte'],
        answer: 'Limasawa' },    
    
      { question: 'Which Filipino general led the defense of Bataan during World War II?',
        options: ['Antonio Luna', 'Vicente Lim', 'Artemio Ricarte', 'Gregorio del Pilar'],
        answer: 'Vicente Lim' },    
    
      { question: 'What act granted Philippine independence from the United States?',
        options: ['Jones Act', 'Hare-Hawes-Cutting Act', 'Tydings-McDuffie Act', 'Philippine Independence Act'],
        answer: 'Tydings-McDuffie Act' },    
    
      { question: 'Which Philippine province was the site of the famous Battle of Mactan, where Ferdinand Magellan was killed?',
        options: ['Cebu', 'Leyte', 'Palawan', 'Mindanao'],
        answer: 'Cebu' },    
    
      { question: 'Who is known as the "Mother of Philippine Independence"?',
        options: ['Melchora Aquino', 'Gabriela Silang', 'Teresa Magbanua', 'Aurora Quezon'],
        answer: 'Melchora Aquino' },
    
      { question: 'What was the name of the ship that brought Ferdinand Magellan to the Philippines?',
        options: ['Victoria', 'Concepción', 'Trinidad', 'San Antonio'],
        answer: 'Victoria' },
    
      { question: 'Who was the first President of the Philippines under the Third Republic?',
        options: ['Manuel Roxas', 'Elpidio Quirino', 'Sergio Osmeña', 'Jose P. Laurel'],
        answer: 'Manuel Roxas' },
    
      { question: 'Which treaty ended the Spanish-American War, leading to the cession of the Philippines to the United States?',
        options: ['Treaty of Tordesillas', 'Treaty of Manila', 'Treaty of Versailles', 'Treaty of Paris'],
        answer: 'Treaty of Paris' },
    
      { question: 'Which historical event is known as the first recorded resistance of Filipinos against Spanish rule?',
        options: ['Battle of Manila Bay', 'Cry of Pugad Lawin', 'Dagohoy Rebellion', 'Tondo Conspiracy'],
        answer: 'Tondo Conspiracy' },
    
      { question: 'What was the primary goal of the Propaganda Movement?',
        options: ['Immediate independence from Spain', 'Reform and equal rights for Filipinos', 'Military rebellion', 'Annexation by the United States'],
        answer: 'Reform and equal rights for Filipinos' },
    
      { question: 'Which Philippine city was declared an "Open City" during World War II to prevent its destruction?',
        options: ['Cebu', 'Manila', 'Davao', 'Iloilo'],
        answer: 'Manila' },
    
      { question: 'Who wrote the novel "Noli Me Tangere", which exposed the abuses of Spanish rule in the Philippines?',
        options: ['Graciano López Jaena', 'Marcelo H. del Pilar', 'Andres Bonifacio', 'Jose Rizal'],
        answer: 'Jose Rizal' },
    
      { question: 'Which Filipino general was known as the "Boy General" for his bravery during the Philippine Revolution?',
        options: ['Antonio Luna', 'Macario Sakay', 'Gregorio del Pilar', 'Miguel Malvar'],
        answer: 'Gregorio del Pilar' },
    
      { question: 'What was the code name for the Japanese invasion of the Philippines during World War II?',
        options: ['Operation Downfall', 'Operation Z', 'Operation Typhoon', 'Operation Enduring Freedom'],
        answer: 'Operation Z' },
    
      { question: 'Which Filipino diplomat played a key role in drafting the Universal Declaration of Human Rights in 1948?',
        options: ['Carlos P. Romulo', 'Jose Abad Santos', 'Claro M. Recto', 'Diosdado Macapagal'],
        answer: 'Carlos P. Romulo' },
    ],
    
  
    Science: [
      { question: 'What is the chemical symbol for water?',
        options: ['H2O', 'O2', 'CO2', 'NaCl'],
        answer: 'H2O' },
    
      { question: 'What planet is known as the Red Planet?',
        options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
        answer: 'Mars' },
    
      { question: 'What is the largest organ in the human body?',
        options: ['Heart', 'Liver', 'Skin', 'Brain'],
        answer: 'Skin' },
    
      { question: 'What is the main source of energy for the Earth?',
        options: ['Moon', 'Sun', 'Wind', 'Water'],
        answer: 'Sun' },
    
      { question: 'What gas do plants absorb from the atmosphere to make food?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
        answer: 'Carbon Dioxide' },
    
      { question: 'What is the hardest natural substance on Earth?',
        options: ['Gold', 'Iron', 'Diamond', 'Platinum'],
        answer: 'Diamond' },
    
      { question: 'Which part of the plant conducts photosynthesis?',
        options: ['Roots', 'Stem', 'Leaves', 'Flowers'],
        answer: 'Leaves' },
    
      { question: 'Which planet is closest to the Sun?',
        options: ['Earth', 'Venus', 'Mercury', 'Mars'],
        answer: 'Mercury' },
    
      { question: 'What is the boiling point of water at sea level?',
        options: ['50°C', '75°C', '100°C', '150°C'],
        answer: '100°C' },
    
      { question: 'What do you call a scientist who studies plants?',
        options: ['Zoologist', 'Geologist', 'Botanist', 'Astronomer'],
        answer: 'Botanist' },
    
      { question: 'What force keeps planets in orbit around the Sun?',
        options: ['Magnetism', 'Gravity', 'Friction', 'Electromagnetism'],
        answer: 'Gravity' },
    
      { question: 'Which vitamin is primarily produced when the skin is exposed to sunlight?',
        options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
        answer: 'Vitamin D' },
    
      { question: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Golgi apparatus'],
        answer: 'Mitochondrion' },
    
      { question: 'What is the most abundant gas in Earth’s atmosphere?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
        answer: 'Nitrogen' },
    
      { question: 'Which blood type is known as the universal donor?',
        options: ['A', 'B', 'AB', 'O'],
        answer: 'O' },
    
      { question: 'What type of energy is stored in a stretched rubber band?',
        options: ['Kinetic Energy', 'Thermal Energy', 'Chemical Energy', 'Elastic Potential Energy'],
        answer: 'Elastic Potential Energy' },
    
      { question: 'Which part of the human brain is responsible for reasoning and decision-making?',
        options: ['Cerebellum', 'Brainstem', 'Cerebrum', 'Hypothalamus'],
        answer: 'Cerebrum' },
    
      { question: 'Which planet has the most extensive ring system in the Solar System?',
        options: ['Jupiter', 'Uranus', 'Neptune', 'Saturn'],
        answer: 'Saturn' },
    
      { question: 'What is the process by which plants lose water vapor through small pores in their leaves?',
        options: ['Photosynthesis', 'Respiration', 'Transpiration', 'Osmosis'],
        answer: 'Transpiration' },
    
      { question: 'What type of rock is formed from cooled magma or lava?',
        options: ['Metamorphic', 'Sedimentary', 'Igneous', 'Fossilized'],
        answer: 'Igneous' },
    ],
  };

  ngOnInit() {
    // Attempt to retrieve the leaderboard data from localStorage
    const storedLeaderboard = localStorage.getItem('leaderboard');
    
    // If there is leaderboard data saved in localStorage, parse it and assign it to the leaderboard
    if (storedLeaderboard) {
      this.leaderboard = JSON.parse(storedLeaderboard);
      
      // Sort leaderboard by score (descending)
      this.leaderboard.sort((a, b) => b.score - a.score);
    }
  }
  
// Show category selection using AlertController
async showCategorySelection() {

  const alert = await this.alertController.create({
    header: 'Enter your name',
      inputs: [
        {
          name: 'userName',
          type: 'text',
          placeholder: 'Your name',
        },
      ],
    buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Name entry canceled.');
            },
          },
      {
        text: 'OK',
        handler: async (data) => { // Mark the handler as async

          const enteredName = data.userName.trim();
          if (!enteredName) {
            alert.message = 'Name is required. Please enter your name.';
            return false; // Keep the alert open
          }

            this.userName = enteredName;

          // Create and present a loading spinner
          const loading = await this.loadingController.create({
            message: 'Please wait...',
            spinner: 'crescent', // Use your preferred spinner style
            duration: 2000,
          });

          await loading.present();
          // Show categories after the loading spinner is dismissed
          await loading.onDidDismiss();
          
          this.isQuizStarted = true;
          this.showCategories = true;

          return true; // Close the alert
        },
      },
    ],
  });

  await alert.present();
}

  // Start quiz for selected category
  startQuiz(category: string) {
    
    this.currentCategory = category;
    const shuffleQuestions = this.shuffleArray(this.questions[category]);
    this.currentQuestions = shuffleQuestions.slice(0, 15); // Get 5 random questions

    // this.currentQuestions = this.shuffleArray(this.questions[category]); // Shuffle questions

    if (this.currentQuestions.length === 0) {
      alert('No questions available for this category.');
      return;
    }
    
    this.isQuizStarted = true;
    this.showCategories = false; // Hide category selection
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.timer = 30; // Reset timer
   
    this.startTimer();
  }

  // Shuffle array of questions
  shuffleArray(array: Question[]): Question[] {

    for (let k = array.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [array[k], array[j]] = [array[j], array[k]];
    }
    return array;
  }

  // Handle answer selection
  answerQuestion(selectedAnswer: string) {
    
    const currentQuestion = this.currentQuestions[this.currentQuestionIndex];
    if (!currentQuestion) return;

    if (selectedAnswer === currentQuestion.answer) {
      this.score++;
    }
      // Move to the next question
      this.currentQuestionIndex++;

      // Reset timer to 15 seconds for the next question
        this.timer = 30;

    // Check if all questions have been answered
    if (this.currentQuestionIndex >= this.currentQuestions.length) {
      this.endQuiz();
    }
  }

  startTimer() {

    clearInterval(this.interval); // Clear any previous timer
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--; // Decrease the timer by 1 second
      } else {
        // When timer hits 0, move to the next question
        this.timer = 30; // Reset timer to 15 seconds for the next question
        this.currentQuestionIndex++; // Move to the next question
  
        // Check if all questions have been answered
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
          clearInterval(this.interval); // Stop the timer
          this.endQuiz(); // End the quiz if no more questions
        } 
      }
    }, 1000);
  }
  

  async endQuiz() {

    this.isQuizStarted = false; 
    clearInterval(this.interval);
   
    // Add the user to the leaderboard with the final score
    if (this.userName) {
      this.leaderboard.push({ name: this.userName, score: this.score });
    }
  
     // Save the leaderboard to localStorage
     localStorage.setItem('leaderboard', JSON.stringify(this.leaderboard));

     // Sort leaderboard by score (descending)
     this.leaderboard.sort((a, b) => b.score - a.score);
    
     const alert = await this.alertController.create({
      header: 'Quiz Ended!',
      message: `Your score is: ${this.score} / ${this.currentQuestions.length}`,
      buttons: ['OK'],
    });
  
    await alert.present();
  }
}

