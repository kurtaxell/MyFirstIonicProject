import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {

  constructor() { }

  isQuizStarted = false;

  leaderboard: { name: string; score: number }[] = []; // Leaderboard array


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

}
