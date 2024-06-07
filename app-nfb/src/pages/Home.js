import React, { useState, useEffect } from "react";
import { NavInstructions } from "../components/NavInstructions";
import { notion, useNotion } from "../services/notion";
import "./Home.css";

// HOME
export function Home() {

  const { user } = useNotion();
  const [calm, setCalm] = useState(0);

  useEffect(() => {
    if (!user) {
      return;
    }

    const subscription = notion.calm().subscribe((calm) => {
      const calmScore = Math.trunc(calm.probability * 100);
      setCalm(calmScore);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
      <>

      <h1>Home</h1>
      <h2> Every thought, feeling, and movement starts in your brain. </h2>
      <h3> Welcome to the home page  </h3>
        <p> You can access this page at any time you want from both, the instructions and the experiment page.</p>
        <p> From here, you will be able to check your calm score, which consists on the probability of the calm level based on the passive cognitive state</p>
        <p> Enjoy! </p>

      <main className="main-container-home">
       {<NavInstructions/>}

        <div className="calm-score-home">
        &nbsp;{calm}% <div className="calm-word">Calm</div>
        </div>
      </main>

      </>
  )
}

