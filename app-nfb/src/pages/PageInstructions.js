import React, { useState } from "react";
import { NavBw } from "../components/NavBw";
import Meditation from './Meditation.png';
import Accordion from 'react-bootstrap/Accordion';
import "./PageInstructions.css";

// HOME
export function PageInstructions() {

  const [expandedSections, setExpandedSections] = useState({
    part1: false,
    part2: false,
    part3: false
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  return (
    <>
      <h1> Instructions </h1>
      <div className="content-container">

        <div className="image-container">
          <img src={Meditation} alt="Meditation" />
        </div>

        <div className="text-container">

          <Accordion defaultActiveKey="0">

            <Accordion.Item className="card-accordionbtn1" eventKey="1">
                <Accordion.Header onClick={() => toggleSection("part1") }> Part 1: Calibration </Accordion.Header>
                    {expandedSections.part1 && (
                     <Accordion.Body > 
                        <p> Prior to the recording of the experiment, the signal of the resting state of the participant will be normalised and registered for 1 minute.</p>
                        <p> This step is essential because the pattern of alpha activity for each person may vary due to different factors. </p>
                     </Accordion.Body>
                    )}
              </Accordion.Item>

            <Accordion.Item className="card-accordionbtn2" eventKey="1">
                <Accordion.Header onClick={() => toggleSection("part2")}> Part 2: Condition without neurofeedback </Accordion.Header>
                {expandedSections.part2 && (
                     <Accordion.Body>
                      <p>In the second part of the experiment, a static colour image will be set on the interface of the web application without any modification for 3 minutes.</p>
                      <p>At the same time, the average PSD alpha power measured in the two occipital channels (PO3 and PO4) will be displayed. This value will be treated by the calibration process, and a previous normalisation, without modifying the interface image.</p>
                    </Accordion.Body>
                )}
            </Accordion.Item>

            <Accordion.Item className="card-accordionbtn3" eventKey="3">
                <Accordion.Header onClick={() => toggleSection("part3")} className="card-header"> Part 3: Condition with neurofeedback </Accordion.Header>
                {expandedSections.part3 && (
                     <Accordion.Body>
                      <p>Finally, in the third part of the experiment, the same image will be also displayed for 3 minutes in the interface of the web application with the peculiarity that it will blur according to the mean alpha power previously measured in the two occipital channels.</p>
                      <p>However, if the normalised alpha power results to be too large due to systematic errors in the device, the image will remain unmodified</p>
                    </Accordion.Body>
                )}
            </Accordion.Item>

            </Accordion>

        </div>
        </div>
      
      
      <div className="button-instr">
        <NavBw />
      </div>

    </>
  );
}
