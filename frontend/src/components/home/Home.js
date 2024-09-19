import React from "react";

import Hero from "./Hero";
import Services from "./Service";
import Rooms from "./Rooms";
import Slides from "./Slides"


export default function Home() {
  return (
    
    <div style={{marginBottom:'20px'}}>
      < Hero/>
      <Rooms />
      <Services />
      <Slides />
      </div>
    
  );
}
