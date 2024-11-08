import Bool "mo:base/Bool";

import Timer "mo:base/Timer";
import Random "mo:base/Random";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Text "mo:base/Text";

actor {
  // Stable variables for persistence
  stable var highScore : Nat = 0;
  stable var currentScore : Nat = 0;
  stable var isGameActive : Bool = false;
  stable var currentTimerId : Nat = 0;

  // Game settings
  let difficulties = [1000000000, 2000000000, 3000000000]; // 1, 2, 3 seconds in nanoseconds
  
  // Generate random time between 1-5 seconds
  public func generateRandomTime() : async Nat {
    let seed = await Random.blob();
    let random = Random.Finite(seed);
    
    let randomValue = switch (random.byte()) {
      case null { 1 };
      case (?val) {
        // Ensure the value is between 1 and 5
        let scaled = (Nat8.toNat(val) % 5) + 1;
        scaled
      };
    };
    
    randomValue
  };

  // Start a new game with selected difficulty
  public func startGame(difficulty : Nat) : async Text {
    if (isGameActive) {
      Timer.cancelTimer(currentTimerId);
    };

    currentScore := 0;
    isGameActive := true;

    let randomTime = await generateRandomTime();
    let timeWindow = difficulties[difficulty];
    
    currentTimerId := Timer.setTimer(#nanoseconds(timeWindow), func() : async () {
      if (isGameActive) {
        isGameActive := false;
      };
    });

    return "Game started! You have " # Nat.toText(randomTime) # " seconds.";
  };

  // Player reaction
  public func playerReaction() : async Text {
    if (not isGameActive) {
      return "Game over! Your final score: " # Nat.toText(currentScore);
    };

    currentScore += 1;
    if (currentScore > highScore) {
      highScore := currentScore;
    };

    Timer.cancelTimer(currentTimerId);
    return "Success! Score: " # Nat.toText(currentScore);
  };

  // Get current game state
  public query func getGameState() : async {
    isActive : Bool;
    currentScore : Nat;
    highScore : Nat;
  } {
    return {
      isActive = isGameActive;
      currentScore = currentScore;
      highScore = highScore;
    };
  };
}
